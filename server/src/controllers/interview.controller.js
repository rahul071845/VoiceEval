const { startInterview, submitAnswer, getInterviewHistory, getAnalytics, getInterviewById } = require("../services/interview.service");

const mapErrorToResponse = (err, res, defaultMessage) => {
    const msg = err.message || "";
    let status = 500;
    if (
        msg.includes("Missing required fields") ||
        msg.includes("already completed") ||
        msg.includes("already submitted") ||
        msg.includes("No questions found") ||
        msg.includes("is required")
    ) {
        status = 400;
    } else if (msg.includes("Unauthorized")) {
        status = 403;
    } else if (msg.includes("Session not found")) {
        status = 404;
    }
    return res.status(status).json({
        success: false,
        message: defaultMessage,
        error: msg
    });
};

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
        mapErrorToResponse(err, res, "Failed to start interview");
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
        mapErrorToResponse(err, res, "Failed to submit answer");
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
        mapErrorToResponse(err, res, "Failed to fetch the interview.");
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
        mapErrorToResponse(err, res, "Failed to fetch history.");
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
        mapErrorToResponse(err, res, "Failed to fetch analytics.");
    }
};

module.exports = { start, submit, interviewById, history, analytics };