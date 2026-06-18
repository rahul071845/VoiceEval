const InterviewSession = require("../models/InterviewSession");
const { evaluateInterviewAnswer, generateFirstQuestion, generateNextQuestion, generateInterviewSummary } = require("./ai.service");

const startInterview = async (userId, role, difficulty) => {
    if (!userId || !role || !difficulty) throw new Error("Missing required fields");
    const firstQues = await generateFirstQuestion(role, difficulty);
    if (!firstQues) throw new Error("No questions found");
    const interview = await InterviewSession.create({
        user: userId,
        role,
        difficulty,
        status: "in_progress",
        questions: [{ question: firstQues }]
    });
    return {
        sessionId: interview._id,
        role: interview.role,
        difficulty: interview.difficulty,
        currentQuesIndex: 0,
        currentQuestion: firstQues
    };
};

const submitAnswer = async (sessionId, answer, userId) => {
    if (!sessionId || !answer || !userId) throw new Error("Missing required fields");
    const interview = await InterviewSession.findById(sessionId);
    if (!interview) throw new Error("Session not found");
    if (interview.user.toString() !== userId.toString()) throw new Error("Unauthorized user.");
    if (interview.status === "completed") throw new Error("Interview already completed");
    const quesIdx = interview.questions.length - 1;
    const question = interview.questions[quesIdx];
    if (question.answer) throw new Error("Answer already submitted");
    question.answer = answer;
    const aiEvaluation = await evaluateInterviewAnswer(
        question.question,
        answer,
        interview.role,
        interview.difficulty
    )
    question.feedback = aiEvaluation.feedback;
    question.score = aiEvaluation.score;
    question.strengths = aiEvaluation.strengths;
    question.weaknesses = aiEvaluation.weaknesses;
    question.improvementSuggestions = aiEvaluation.improvementSuggestions;
    if(interview.questions.length < interview.maxQuestions){
        const nextQues = await generateNextQuestion(
            interview.role,
            interview.difficulty,
            question.question,
            answer,
            aiEvaluation.score,
            aiEvaluation.weaknesses
        );
        interview.questions.push({ question: nextQues });
        await interview.save();
        return {
            status: "in_progress",
            evaluation: aiEvaluation,
            nextQuestion: nextQues,
            currentQuestionIndex: interview.questions.length - 1
        };
    } else{
        const totalScore = interview.questions.reduce((sum, q) => sum + q.score, 0);
        interview.score = parseFloat((totalScore / interview.questions.length).toFixed(1));
        const summary = await generateInterviewSummary(interview.questions);
        interview.summary = summary;
        interview.status = "completed";
        await interview.save();
        return {
            status: "completed",
            evaluation: aiEvaluation,
            finalScore: interview.score,
            summary
        };
    }
};

const getInterviewById = async (sessionId, userId) => {
    if (!sessionId || !userId) throw new Error("Missing required fields");
    const interview = await InterviewSession.findById(sessionId);
    if (!interview) throw new Error("Session not found");
    if (interview.user.toString() !== userId.toString()) throw new Error("Unauthorized user.");
    const currentQuestion = interview.questions[interview.questions.length - 1];
    return {
        sessionId: interview._id,
        role: interview.role,
        difficulty: interview.difficulty,
        status: interview.status,
        maxQuestions: interview.maxQuestions,
        score: interview.score,
        summary: interview.summary,
        questions: interview.questions,
        currentQuestionIndex: interview.questions.length - 1,
        currentQuestion: currentQuestion ? currentQuestion.question : null
    };
};

const getInterviewHistory = async (userId) => {
    if (!userId) throw new Error("User ID is required");
    const interviews = await InterviewSession.find({ user: userId }).sort({ createdAt: -1 });
    return interviews.map((interview) => ({
        sessionId: interview._id,
        role: interview.role,
        difficulty: interview.difficulty,
        score: interview.score,
        status: interview.status,
        createdAt: interview.createdAt,
    }));
};

const getAnalytics = async (userId) => {
    const allInterviews = await InterviewSession.find({ user: userId });
    const completedInterviews = allInterviews.filter(interview => interview.status === "completed");
    if (completedInterviews.length === 0) {
        return {
            totalInterviews: allInterviews.length,
            completedInterviews: 0,
            averageScore: 0,
            bestScore: 0,
            worstScore: 0
        };
    }
    const averageScore = completedInterviews.reduce((acc, interview) => acc + interview.score, 0) / completedInterviews.length;
    const bestScore = Math.max(...completedInterviews.map(i => i.score));
    const worstScore = Math.min(...completedInterviews.map(i => i.score));
    return {
        totalInterviews: allInterviews.length,
        averageScore,
        bestScore,
        worstScore,
        completedInterviews: completedInterviews.length
    };
};

module.exports = { startInterview, submitAnswer, getInterviewById, getInterviewHistory, getAnalytics };