const extractJson = (text) => {
    if (!text) {
        throw new Error("Empty AI response");
    }

    const cleaned = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    return JSON.parse(cleaned);
};

module.exports = { extractJson };