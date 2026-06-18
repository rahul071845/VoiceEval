import api from "../api/axios";

export const startInterview = async (interviewData) => {
    const response = await api.post("/interviews/start", interviewData);
    return response.data;
};

export const getInterviewSession = async (sessionId) => {
    const response = await api.get(`/interviews/${sessionId}`);
    // console.log(response.data);
    return response.data;
};

export const getHistory = async () => {
    const response = await api.get("/interviews/history");
    return response.data;
};

export const getAnalytics = async () => {
    const response = await api.get("/interviews/analytics");
    return response.data;
};

export const submitAnswer = async ({ sessionId, answer }) => {
    const response = await api.post(`/interviews/${sessionId}/submit`, { answer });
    return response.data;
};