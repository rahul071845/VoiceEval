const { testGeminiConnection, evaluateInterviewAnswer } = require("../services/ai.service");

const testGemini = async (req, res) => {
    try {
        const result = await testGeminiConnection();
        res.status(200).json({
            success: true,
            result
        });
    } catch (err) {
        console.error("Gemini Error:", err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const testGeminiEvaluate = async (req, res) => {
    try {
        const result = await evaluateInterviewAnswer(
            "What is REST API?",
            "REST API is an architectural style for communication between systems using HTTP methods.",
            "Backend Developer",
            "easy"
        );
        res.json({
            success: true,
            result
        });
    } catch (err) {
        console.error("Gemini Evaluate Error:", err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = { testGemini, testGeminiEvaluate };