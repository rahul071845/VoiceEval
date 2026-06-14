const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);

const testGeminiConnection = async() => {
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash"
    });
    const result = await model.generateContent(
        "Reply with exactly: Gemini Connected"
    );
    const response = await result.response;
    return response.text();
}

module.exports = { testGeminiConnection };