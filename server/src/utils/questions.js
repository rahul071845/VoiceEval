const questions = {
    easy: [
        "What is REST API?",
        "What is JWT?",
        "Difference between var, let and const?"
    ],
    medium: [
        "Explain event loop in Node.js",
        "Explain MongoDB indexing"
    ],
    hard: [
        "Design URL Shortener",
        "Explain distributed caching"
    ]
};

const getQuestions = (difficulty) => {
    if (!questions[difficulty]) throw new Error("Invalid difficulty level");
    const pool = questions[difficulty];
    const selectedQuestion = pool[Math.floor(Math.random() * pool.length)];
    return [selectedQuestion];
};

module.exports = { getQuestions };