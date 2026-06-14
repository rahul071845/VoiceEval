const { testGeminiConnection } = require("../services/ai.service");

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

module.exports = { testGemini };