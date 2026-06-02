const evaluateAnswer = (answer) => {
    const len = answer.length;
    if (len < 20) return { score: 2, feedback: "Insufficient details" }
    else if (len < 100) return { score: 5, feedback: "Good" }
    else return { score: 8, feedback: "Excellent" };
}

module.exports = { evaluateAnswer };