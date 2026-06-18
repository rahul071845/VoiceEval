const { startInterview, submitAnswer, getInterviewHistory, getAnalytics, getInterviewById } = require("../services/interview.service");

const start = async (req, res) => {
    try {
        const { role, difficulty } = req.body;
        const userId = req.user._id;
        const interview = await startInterview(userId, role, difficulty);
        res.status(201).json({
            success: true,
            data: interview,
        })
    } catch (err) {
        console.error("Error in starting interview: ", err);
        res.status(500).json({
            success: false,
            message: "Failed to start interview",
        })
    }
};

const submit = async (req, res) => {
    try{
        const userId = req.user._id;
        const sessionId = req.params.sessionId;
        const answer = req.body.answer;
        const result = await submitAnswer(sessionId, answer, userId);
        res.status(200).json({
            success: true,
            data: result,
        })
    } catch(err){
        console.error("Error in submitting answer: ", err);
        res.status(500).json({
            success: false,
            message: "Failed to submit answer",
        })
    }
};

const interviewById = async (req, res) => {
    try{
        const userId = req.user._id;
        const sessionId = req.params.sessionId;
        const interview = await getInterviewById(sessionId, userId);
        res.status(200).json({
            success: true,
            data: interview,
        })
    } catch(err){
        console.error("Error in fetching interview: ", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch the interview.",
        })
    }
}

const history = async (req, res) => {
    try{
        const userId = req.user._id;
        const history = await getInterviewHistory(userId);
        res.status(200).json({
            success: true,
            data: history,
        })
    } catch(err){
        console.error("Error in fetching history: ", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch history.",
        })
    }
};

const analytics = async (req, res) => {
    try{
        const userId = req.user._id;
        const analytics = await getAnalytics(userId);
        res.status(200).json({
            success: true,
            data: analytics,
        })
    } catch(err){
        console.error("Error in fetching analytics: ", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch analytics.",
        })
    }
};

module.exports = { start, submit, interviewById, history, analytics };