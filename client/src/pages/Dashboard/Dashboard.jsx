import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getAnalytics, getHistory, startInterview } from "../../services/interviewService";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import "./Dashboard.css";

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [role, setRole] = useState("Backend Engineer");
    const [difficulty, setDifficulty] = useState("medium");

    const {
        data: historyData,
        isLoading: isLoadingHistory,
        isError: isErrorHistory
    } = useQuery({
        queryKey: ["history"],
        queryFn: getHistory
    });

    const {
        data: analyticsData,
        isLoading: isLoadingAnalytics,
        isError: isErrorAnalytics
    } = useQuery({
        queryKey: ["analytics"],
        queryFn: getAnalytics
    });

    const startInterviewMutation = useMutation({
        mutationFn: startInterview,
        onSuccess: (response) => {
            if (response.success && response.data) {
                navigate(`/interview/${response.data.sessionId}`);
            }
        }
    });

    const handleStartNew = (e) => {
        e.preventDefault();
        if (!role.trim()) return;
        startInterviewMutation.mutate({ role, difficulty });
    };

    const handleViewResults = (sessionId) => {
        navigate(`/results/${sessionId}`);
    };

    const isLoading = isLoadingAnalytics || isLoadingHistory;
    const isError = isErrorAnalytics || isErrorHistory;

    if (isLoading) {
        return (
            <div className="db-state-screen">
                <div className="db-spinner" />
                <p className="db-state-text">Loading your profile…</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="db-state-screen">
                <p className="db-state-title">Failed to load dashboard</p>
                <p className="db-state-text">Check your server connection and try again.</p>
                <button onClick={() => window.location.reload()} className="db-retry-btn">
                    Reload
                </button>
            </div>
        );
    }

    const stats = analyticsData?.data || {
        totalInterviews: 0,
        averageScore: 0,
        bestScore: 0,
        worstScore: 0,
        completedInterviews: 0
    };
    const history = historyData?.data || [];

    const difficultyLabel = { easy: "Easy", medium: "Medium", hard: "Hard" };

    return (
        <>
            <Navbar />
            <div className="db-container">

                {/* ── Page Header ───────────────────────────────── */}
                <header className="db-header">
                    <div>
                        <h1 className="db-title">Good to see you, {user?.name?.split(" ")[0] || "Candidate"}</h1>
                        <p className="db-subtitle">Track your progress and keep sharpening your skills.</p>
                    </div>
                </header>

                {/* ── Stats Row ──────────────────────────────────── */}
                <section className="db-stats-row" aria-label="Performance overview">
                    <div className="db-stat-card">
                        <span className="db-stat-label">Total Sessions</span>
                        <span className="db-stat-value">{stats.totalInterviews}</span>
                    </div>
                    <div className="db-stat-card">
                        <span className="db-stat-label">Avg Score</span>
                        <span className="db-stat-value">
                            {stats.completedInterviews > 0
                                ? `${stats.averageScore.toFixed(1)}`
                                : "—"}
                        </span>
                        {stats.completedInterviews > 0 && (
                            <span className="db-stat-unit">/ 10</span>
                        )}
                    </div>
                    <div className="db-stat-card">
                        <span className="db-stat-label">Best Score</span>
                        <span className="db-stat-value">
                            {stats.completedInterviews > 0
                                ? `${stats.bestScore.toFixed(1)}`
                                : "—"}
                        </span>
                        {stats.completedInterviews > 0 && (
                            <span className="db-stat-unit">/ 10</span>
                        )}
                    </div>
                    <div className="db-stat-card">
                        <span className="db-stat-label">Completed</span>
                        <span className="db-stat-value">{stats.completedInterviews}</span>
                    </div>
                </section>

                {/* ── Start New Interview ────────────────────────── */}
                <section className="db-new-session" aria-label="Start a new interview">
                    <div className="db-new-card">
                        <div className="db-new-card-header">
                            <h2 className="db-new-title">Start a mock interview</h2>
                            <p className="db-new-desc">
                                Choose your target role and difficulty. The AI will generate adaptive questions and evaluate your answers in real time.
                            </p>
                        </div>
                        <form onSubmit={handleStartNew} className="db-new-form">
                            <div className="db-new-fields">
                                <div className="db-field">
                                    <label htmlFor="role" className="db-field-label">Job Role</label>
                                    <input
                                        type="text"
                                        id="role"
                                        className="db-input"
                                        placeholder="e.g. Backend Developer"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        required
                                        disabled={startInterviewMutation.isPending}
                                    />
                                </div>
                                <div className="db-field">
                                    <label htmlFor="difficulty" className="db-field-label">Difficulty</label>
                                    <select
                                        id="difficulty"
                                        className="db-select"
                                        value={difficulty}
                                        onChange={(e) => setDifficulty(e.target.value)}
                                        disabled={startInterviewMutation.isPending}
                                    >
                                        <option value="easy">Easy</option>
                                        <option value="medium">Medium</option>
                                        <option value="hard">Hard</option>
                                    </select>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="db-start-btn"
                                disabled={startInterviewMutation.isPending || !role.trim()}
                            >
                                {startInterviewMutation.isPending ? "Initializing AI…" : "Start Interview"}
                            </button>
                        </form>
                    </div>
                </section>

                {/* ── History ────────────────────────────────────── */}
                <section className="db-history" aria-label="Interview history">
                    <h2 className="db-history-title">Recent Sessions</h2>

                    {history.length === 0 ? (
                        <div className="db-empty">
                            <p>No sessions yet — start one above to see your history here.</p>
                        </div>
                    ) : (
                        <div className="db-table-wrap">
                            <table className="db-table">
                                <thead>
                                    <tr>
                                        <th>Role</th>
                                        <th>Difficulty</th>
                                        <th>Score</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map((session) => (
                                        <tr key={session.sessionId}>
                                            <td className="db-td-primary">{session.role}</td>
                                            <td>
                                                <span className={`db-badge db-diff-${session.difficulty}`}>
                                                    {difficultyLabel[session.difficulty] || session.difficulty}
                                                </span>
                                            </td>
                                            <td className="db-td-score">
                                                {session.status === "completed"
                                                    ? `${session.score.toFixed(1)} / 10`
                                                    : "—"}
                                            </td>
                                            <td>
                                                <span className={`db-badge db-status-${session.status}`}>
                                                    {session.status.replace("_", " ")}
                                                </span>
                                            </td>
                                            <td className="db-td-date">
                                                {new Date(session.createdAt).toLocaleDateString("en-IN", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric"
                                                })}
                                            </td>
                                            <td>
                                                {session.status === "completed" && (
                                                    <button
                                                        onClick={() => handleViewResults(session.sessionId)}
                                                        className="db-view-btn"
                                                    >
                                                        View
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

            </div>
        </>
    );
};

export default Dashboard;