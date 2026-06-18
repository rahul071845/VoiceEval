import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { getInterviewSession } from "../services/interviewService";
import "./Results.css";

const Results = () => {
    const { sessionId } = useParams();
    const {
        data: interviewData,
        isLoading: isLoadingInterview,
        isError: isErrorInterview
    } = useQuery({
        queryKey: ["interview", sessionId],
        queryFn: () => getInterviewSession(sessionId)
    });

    if (isLoadingInterview) {
        return (
            <div className="results-container" style={{ textAlign: "center", paddingTop: "80px" }}>
                <div className="loading-spinner">Loading interview evaluation...</div>
            </div>
        );
    }

    if (isErrorInterview || !interviewData?.data) {
        return (
            <div className="results-container no-data-msg">
                <h2>Evaluation Not Found</h2>
                <p>We couldn't retrieve the results for this interview session.</p>
                <Link to="/dashboard" className="back-btn">
                    <svg className="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    const session = interviewData.data;
    const questions = session.questions || [];
    const overallScore = session.score || 0;
    const scorePercent = overallScore * 10;

    const getScoreClass = (score) => {
        if (score >= 8) return "high";
        if (score >= 5) return "avg";
        return "low";
    };

    const renderList = (items, className) => {
        if (!items || items.length === 0) return <p style={{ fontStyle: "italic", color: "var(--text)", margin: 0 }}>None identified.</p>;
        const itemsArray = Array.isArray(items) ? items : [items];
        return (
            <ul className={`bullets-list ${className}`}>
                {itemsArray.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        );
    };

    return (
        <div className="results-container">
            <Link to="/dashboard" className="back-btn">
                <svg className="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Back to Dashboard
            </Link>

            <header className="results-header">
                <div className="header-left">
                    <h1>Interview Feedback</h1>
                    <p>
                        Role: <strong>{session.role}</strong>
                        <span className={`difficulty-badge ${session.difficulty}`}>
                            {session.difficulty}
                        </span>
                    </p>
                </div>
            </header>

            <div className="score-card">
                <div className="score-circle" style={{ "--score-percent": scorePercent }}>
                    <span className="score-value">{overallScore.toFixed(1)}</span>
                </div>
                <div className="score-text">
                    <h3 className="score-title">Overall Score</h3>
                    <p className="score-desc">
                        Based on the detailed analysis of your answers for the {questions.length} questions asked during the session.
                    </p>
                </div>
            </div>

            {session.summary && (
                <section className="summary-section">
                    <h2>
                        <svg className="icon-svg purple" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                        </svg>
                        Performance Summary
                    </h2>
                    <div className="summary-content">
                        {session.summary}
                    </div>
                </section>
            )}

            <section className="questions-section">
                <h2>Question Breakdown</h2>
                {questions.map((q, idx) => (
                    <div key={q._id || idx} className="question-card">
                        <div className="question-header">
                            <div>
                                <span className="question-num">Question {idx + 1}</span>
                                <h3 className="question-title">{q.question}</h3>
                            </div>
                            <span className={`question-score ${getScoreClass(q.score)}`}>
                                Score: {q.score}/10
                            </span>
                        </div>
                        <div className="question-body">
                            {q.answer && (
                                <div className="section-block">
                                    <h4>Your Answer</h4>
                                    <div className="answer-container">
                                        {q.answer}
                                    </div>
                                </div>
                            )}

                            {q.feedback && (
                                <div className="section-block">
                                    <h4>Feedback & Evaluation</h4>
                                    <div className="feedback-container">
                                        {q.feedback}
                                    </div>
                                </div>
                            )}

                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px", marginTop: "20px" }}>
                                <div className="section-block">
                                    <h4 style={{ color: "#10b981" }}>
                                        <svg className="icon-svg green" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "6px" }}>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                        Strengths
                                    </h4>
                                    {renderList(q.strengths, "strengths-list")}
                                </div>

                                <div className="section-block">
                                    <h4 style={{ color: "#ef4444" }}>
                                        <svg className="icon-svg red" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "6px" }}>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                                        </svg>
                                        Weaknesses
                                    </h4>
                                    {renderList(q.weaknesses, "weaknesses-list")}
                                </div>

                                <div className="section-block" style={{ gridColumn: "1 / -1" }}>
                                    <h4 style={{ color: "#3b82f6" }}>
                                        <svg className="icon-svg blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "6px" }}>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                        </svg>
                                        Improvement Suggestions
                                    </h4>
                                    {renderList(q.improvementSuggestions, "improvements-list")}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default Results;