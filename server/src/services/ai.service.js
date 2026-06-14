const { GoogleGenerativeAI } = require("@google/generative-ai");
const { extractJson } = require("../utils/extractJson");

const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);

const testGeminiConnection = async () => {
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash"
    });
    const result = await model.generateContent(
        "Reply with exactly: Gemini Connected"
    );
    const response = await result.response;
    return response.text();
};

const evaluateInterviewAnswer = async (ques, ans, role, difficulty) => {
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash"
    });
    const prompt = `
        You are a Senior Software Engineer conducting a technical interview.
        Evaluate the candidate answer.
        Question: ${ques}
        Answer: ${ans}
        Role: ${role}
        Difficulty: ${difficulty}
        Return ONLY valid JSON.
        {
        "score": number,
        "feedback": string,
        "strengths": [string],
        "weaknesses": [string],
        "improvementSuggestions": [string]
        }
        `;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text();
    const parsed = extractJson(rawText);
    return parsed;
};

module.exports = { testGeminiConnection, evaluateInterviewAnswer };