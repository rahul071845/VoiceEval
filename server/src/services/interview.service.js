const InterviewSession = require("../models/InterviewSession");
const { getQuestions } = require("../utils/questions");
const { evaluateInterviewAnswer } = require("./ai.service");

const startInterview = async (userId, role, difficulty) => {
    if (!userId || !role || !difficulty) throw new Error("Missing required fields");
    const questions = getQuestions(difficulty);
    if (!questions || questions.length === 0) {
        throw new Error("No questions found");
    }
    const interview = await InterviewSession.create({
        user: userId,
        role,
        difficulty,
        status: "in_progress",
        questions: questions.map((q) => ({ question: q }))
    });
    return {
        sessionId: interview._id,
        role: interview.role,
        difficulty: interview.difficulty,
        currentQuestion: interview.questions[0].question
    };
};

const submitAnswer = async (sessionId, answer, userId) => {
    if (!sessionId || !answer || !userId) throw new Error("Missing required fields");
    const interview = await InterviewSession.findById(sessionId);
    if (!interview) throw new Error("Session not found");
    if (interview.user.toString() !== userId.toString()) throw new Error("Unauthorized user.");
    if (interview.status === "completed") throw new Error("Interview already completed");
    const question = interview.questions[0];
    if (question.answer) {
        throw new Error("Answer already submitted");
    }
    question.answer = answer;
    const aiEvaluation = await evaluateInterviewAnswer(question.question, answer, interview.role, interview.difficulty)
    question.feedback = aiEvaluation.feedback;
    question.score = aiEvaluation.score;
    question.strengths = aiEvaluation.strengths;
    question.weaknesses = aiEvaluation.weaknesses;
    question.improvementSuggestions = aiEvaluation.improvementSuggestions;
    interview.score = aiEvaluation.score;
    interview.status = "completed";
    await interview.save();
    return {
        score: aiEvaluation.score,
        feedback: aiEvaluation.feedback,
        strengths: aiEvaluation.strengths,
        weaknesses: aiEvaluation.weaknesses,
        improvementSuggestions: aiEvaluation.improvementSuggestions
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

module.exports = { startInterview, submitAnswer, getInterviewHistory };