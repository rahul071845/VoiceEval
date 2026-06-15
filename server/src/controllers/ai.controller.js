const { testGeminiConnection, evaluateInterviewAnswer, generateFirstQuestion, generateNextQuestion, generateInterviewSummary } = require("../services/ai.service");

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

const testFirstQues = async (req, res) => {
    try {
        const result = await generateFirstQuestion("Backend Developer", "medium");
        res.json({
            success: true,
            result
        });
    } catch (err) {
        console.error("Gemini First Ques Generation Error:", err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    };
};

const testNextQues = async (req, res) => {
    try {
        const result = await generateNextQuestion("Backend Developer", "hard", [], [], 4, ["Missing Architectural Details", "Database Specifics"]);
        res.json({
            success: true,
            result
        });
    } catch (err) {
        console.error("Gemini Next Ques Generation Error:", err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    };
}

const testSummary = async (req, res) => {
    try {
        const result = await generateInterviewSummary([{
            "question": "Design URL Shortener",
            "answer": "A URL Shortener converts long URLs into unique short codes. Store mappings in a database using a key-value schema (shortCode → longURL). Generate codes via Base62 encoding or hashing. On access, redirect users to the original URL. Use caching, rate limiting, analytics, and database sharding for scalability.",
            "score": 7,
            "feedback": "The candidate provides a good high-level overview of a URL shortener's core components and essential scalability considerations. They correctly identify the need for a database, key-value mapping, and different code generation strategies, as well as crucial scaling mechanisms like caching and sharding. However, for a 'hard' difficulty question aimed at a Senior Backend Developer, the answer lacks significant depth and architectural detail in several key areas. It's a solid start but requires more elaboration on the 'how' and 'why' for various components to meet senior-level expectations."
        }]);
        res.json({
            success: true,
            result
        });
    } catch (err) {
        console.error("Gemini Summary Generation Error:", err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    };
}

module.exports = { testGemini, testGeminiEvaluate, testFirstQues, testNextQues, testSummary };