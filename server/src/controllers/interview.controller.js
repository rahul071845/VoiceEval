const { startInterview } = require("../services/interview.service");

const start = async (req, res) => {
    try {
        const { role, difficulty } = req.body;
        const userId = req.user.id;
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

module.exports = { start };