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
    const response = result.response;
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
        "score": number (0 to 10 representing the percentage score),
        "feedback": string,
        "strengths": [string],
        "weaknesses": [string],
        "improvementSuggestions": [string]
        }
        `;
    const result = await model.generateContent(prompt);
    const response = result.response;
    const rawText = response.text();
    const parsed = extractJson(rawText);
    return parsed;
};

const generateFirstQuestion = async (role, difficulty) => {
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash"
    });
    const prompt = `
        You are a senior technical interviewer.
        Generate ONE interview question.
        Role: ${role}
        Difficulty: ${difficulty}
        Requirements:
        - Ask only one question.
        - Return only the question text.
        - No numbering.
        - No explanation.
        `;
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text().replace(/^"|"$/g, "").trim();
};

const generateNextQuestion = async (role, difficulty, previousQuestion, previousAnswer, score, weaknesses ) => {
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash"
    });
    const prompt = `
        You are a senior technical interviewer.
        Role: ${role}
        Difficulty: ${difficulty}
        Previous Question: ${previousQuestion}
        Candidate Answer: ${previousAnswer}
        Score:${score}
        Weaknesses: ${weaknesses.join("\n")}
        Generate the next interview question.
        Requirements:
        - Ask only one question.
        - Do not repeat previous topics.
        - Focus on areas where the candidate is weak.
        - Increase difficulty if score > 8.
        - Reduce difficulty if score < 5.
        - Return only the question text.
        `;
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text().replace(/^"|"$/g, "").trim();
};

const generateInterviewSummary = async (questions) => {
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash"
    });
    const interviewData = questions.map((q, idx) => `
        Question ${idx + 1}: ${q.question}
        Answer: ${q.answer}
        Score: ${q.score}
        Feedback: ${q.feedback}
        `).join("\n\n");
    const prompt = `
        You are a senior technical interviewer.
        Based on the interview results, generate a concise final assessment.
        Interview Results: ${interviewData}
        Include:
        - Overall performance
        - Key strengths
        - Main weaknesses
        - Suggested focus areas
        Return only the summary text.
        `;
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text().replace(/^"|"$/g, "").trim();
};

module.exports = { testGeminiConnection, evaluateInterviewAnswer, generateFirstQuestion, generateNextQuestion, generateInterviewSummary };