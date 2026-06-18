import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getInterviewSession, submitAnswer } from "../services/interviewService";
import "./Interview.css";

const Interview = () => {
    const { sessionId } = useParams();
    const [answer, setAnswer] = useState("");
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const {
        data: interviewData,
        isLoading: isLoadingInterview,
        isError: isErrorInterview
    } = useQuery({
        queryKey: ["interview", sessionId],
        queryFn: () => getInterviewSession(sessionId)
    });

    const submitAnswerMutation = useMutation({
        mutationFn: submitAnswer,
        onSuccess: (response) => {
            if (response.success && response.data) {
                if (response.data.status === "completed") {
                    navigate(`/results/${sessionId}`);
                    return;
                }
                setAnswer("");
                queryClient.invalidateQueries({
                    queryKey: ["interview", sessionId]
                });
            }
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (answer.trim().length < 20) return;
        submitAnswerMutation.mutate({ sessionId, answer });
    };

    if (isLoadingInterview) {
        return (
            <div className="interview-page-container">
                <div className="evaluating-container">
                    <div className="spinner"></div>
                    <h3>Loading mock session...</h3>
                    <p>Preparing your workspace environment.</p>
                </div>
            </div>
        );
    }

    if (isErrorInterview) {
        return (
            <div className="interview-page-container">
                <div className="evaluating-container">
                    <h3>Error loading session</h3>
                    <p>Could not retrieve the requested interview. Please return to the dashboard.</p>
                    <button onClick={() => navigate("/dashboard")} className="submit-btn">
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const session = interviewData?.data;
    const currentQIdx = session?.currentQuestionIndex ?? 0;
    const totalQ = session?.maxQuestions ?? 3;
    const progressPercent = ((currentQIdx) / totalQ) * 100;

    if (submitAnswerMutation.isPending) {
        return (
            <div className="interview-page-container">
                <div className="evaluating-container">
                    <div className="evaluating-pulse"></div>
                    <h3>Evaluating your response...</h3>
                    <p>Gemini is assessing your answer and preparing the next adaptive question.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="interview-page-container">
            {/* Header */}
            <header className="interview-header">
                <div>
                    <h1>Technical Interview</h1>
                    <p>{session.role}</p>
                </div>
                <span className={`badge diff-${session.difficulty}`}>
                    {session.difficulty}
                </span>
            </header>

            {/* Progress Bar */}
            <div className="progress-container">
                <div className="progress-label">
                    <span>Progress</span>
                    <span>Question {currentQIdx + 1} of {totalQ}</span>
                </div>
                <div className="progress-bar-bg">
                    <div 
                        className="progress-bar-fill" 
                        style={{ width: `${progressPercent}%` }}
                    ></div>
                </div>
            </div>

            {/* Question Card */}
            <div className="question-card">
                <h3>Current Question</h3>
                <p className="question-text">{session.currentQuestion}</p>
            </div>

            {/* Answer Input */}
            <form onSubmit={handleSubmit} className="answer-section">
                <label htmlFor="answer-input">Provide your technical explanation:</label>
                <textarea
                    id="answer-input"
                    className="answer-textarea"
                    placeholder="Provide a comprehensive explanation. Minimum 20 characters..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    required
                />
                
                <div className="footer-actions">
                    <span className={`char-counter ${answer.length < 20 ? "error" : ""}`}>
                        {answer.length} characters {answer.length < 20 && "(min 20)"}
                    </span>
                    
                    <button 
                        type="submit" 
                        className="submit-btn"
                        disabled={answer.trim().length < 20}
                    >
                        Submit Answer
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Interview;