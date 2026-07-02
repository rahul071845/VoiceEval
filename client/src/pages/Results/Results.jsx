import { useQuery } from "@tanstack/react-query";
import { useParams, Link, Navigate } from "react-router-dom";
import { getInterviewSession } from "../../services/interviewService";
import Navbar from "../../components/layout/Navbar";
import "./Results.css";

const Results = () => {
    const { sessionId } = useParams();

    const { data: interviewData, isLoading, isError } = useQuery({
        queryKey: ["interview", sessionId],
        queryFn: () => getInterviewSession(sessionId)
    });

    if (isLoading) {
        return (
            <div className="rs-state-screen">
                <div className="rs-spinner" />
                <p className="rs-state-text">Loading evaluation…</p>
            </div>
        );
    }

    if (isError || !interviewData?.data) {
        return (
            <div className="rs-state-screen">
                <p className="rs-state-title">Evaluation not found</p>
                <p className="rs-state-text">We couldn't retrieve results for this session.</p>
                <Link to="/dashboard" className="rs-pill-btn">Back to Dashboard</Link>
            </div>
        );
    }

    const session = interviewData.data;

    if (session.status !== "completed") {
        return <Navigate to={`/interview/${sessionId}`} replace />;
    }

    const questions    = session.questions || [];
    const overallScore = session.score || 0;
    const scorePercent = overallScore * 10;

    const getScoreClass = (score) => {
        if (score >= 8) return "high";
        if (score >= 5) return "avg";
        return "low";
    };

    const renderList = (items, cls) => {
        if (!items || items.length === 0) {
            return <p className="rs-list-empty">None identified.</p>;
        }
        const arr = Array.isArray(items) ? items : [items];
        return (
            <ul className={`rs-list ${cls}`}>
                {arr.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
        );
    };

    return (
        <>
            <Navbar />
            <div className="rs-container">

                {/* Back */}
                <Link to="/dashboard" className="rs-back-btn">
                    ← Back to Dashboard
                </Link>

                {/* Header */}
                <header className="rs-header">
                    <div>
                        <h1 className="rs-title">Interview Feedback</h1>
                        <p className="rs-meta">
                            {session.role}
                            <span className={`rs-diff-badge rs-diff-${session.difficulty}`}>
                                {session.difficulty}
                            </span>
                        </p>
                    </div>
                </header>

                {/* Score Card */}
                <div className="rs-score-card">
                    <div
                        className="rs-score-circle"
                        style={{ "--score-pct": scorePercent }}
                        aria-label={`Score: ${overallScore.toFixed(1)} out of 10`}
                    >
                        <span className="rs-score-num">{overallScore.toFixed(1)}</span>
                    </div>
                    <div className="rs-score-info">
                        <h2 className="rs-score-label">Overall Score</h2>
                        <p className="rs-score-desc">
                            Based on {questions.length} question{questions.length !== 1 ? "s" : ""} across this session.
                            Each answer was evaluated on clarity, correctness, and depth.
                        </p>
                    </div>
                </div>

                {/* Summary */}
                {session.summary && (
                    <section className="rs-summary">
                        <h2 className="rs-section-heading">Performance Summary</h2>
                        <p className="rs-summary-body">{session.summary}</p>
                    </section>
                )}

                {/* Question Breakdown */}
                <section className="rs-breakdown">
                    <h2 className="rs-section-heading">Question Breakdown</h2>

                    {questions.map((q, idx) => (
                        <div key={q._id || idx} className="rs-q-card">

                            {/* Q header */}
                            <div className="rs-q-header">
                                <div className="rs-q-meta">
                                    <span className="rs-q-num">Question {idx + 1}</span>
                                    <p className="rs-q-text">{q.question}</p>
                                </div>
                                <span className={`rs-q-score rs-score-${getScoreClass(q.score)}`}>
                                    {q.score}<span className="rs-q-score-denom">/10</span>
                                </span>
                            </div>

                            {/* Q body */}
                            <div className="rs-q-body">
                                {q.answer && (
                                    <div className="rs-block">
                                        <h3 className="rs-block-label">Your Answer</h3>
                                        <div className="rs-answer-box">{q.answer}</div>
                                    </div>
                                )}

                                {q.feedback && (
                                    <div className="rs-block">
                                        <h3 className="rs-block-label">Feedback</h3>
                                        <p className="rs-feedback-text">{q.feedback}</p>
                                    </div>
                                )}

                                <div className="rs-sw-grid">
                                    <div className="rs-block">
                                        <h3 className="rs-block-label rs-label-green">Strengths</h3>
                                        {renderList(q.strengths, "rs-strengths")}
                                    </div>
                                    <div className="rs-block">
                                        <h3 className="rs-block-label rs-label-red">Weaknesses</h3>
                                        {renderList(q.weaknesses, "rs-weaknesses")}
                                    </div>
                                    <div className="rs-block rs-full-col">
                                        <h3 className="rs-block-label rs-label-blue">Improvement Suggestions</h3>
                                        {renderList(q.improvementSuggestions, "rs-improvements")}
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))}
                </section>

            </div>
        </>
    );
};

export default Results;