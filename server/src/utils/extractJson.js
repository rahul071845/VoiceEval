const extractJson = (text) => {
    if (!text) {
        throw new Error("Empty AI response");
    }

    const startIndex = text.indexOf("{");
    const endIndex = text.lastIndexOf("}");

    if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
        throw new Error("No JSON object found in AI response: " + text);
    }

    const jsonString = text.substring(startIndex, endIndex + 1);
    return JSON.parse(jsonString);
};

module.exports = { extractJson };