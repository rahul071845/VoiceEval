const InterviewSession = require("../models/InterviewSession");
const { getQuestions } = require("../utils/questions");

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

module.exports = { startInterview };