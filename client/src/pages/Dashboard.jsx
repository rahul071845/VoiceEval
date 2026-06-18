import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getAnalytics, getHistory, startInterview } from "../services/interviewService";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
    const { user, logout } = useAuth();
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
            console.log(response.data);
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
            <div className="dashboard-loading">
                <div className="spinner"></div>
                <p>Loading your profile metrics...</p>
            </div>
        );
    }
    if (isError) {
        return (
            <div className="dashboard-error">
                <h3>Failed to load dashboard data</h3>
                <p>Please check your server connection and try again.</p>
                <button onClick={() => window.location.reload()} className="retry-btn">
                    Reload Page
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
    console.log("stats: ", stats);
    console.log("history: ", history);
    return (
        <div className="dashboard-container">
            {/* Header */}
            <header className="dashboard-header">
                <div className="welcome-section">
                    <h1>Welcome, {user?.name || "Candidate"}</h1>
                    <p>Track your interview progress and hone your technical skills</p>
                </div>
                <button onClick={logout} className="logout-btn">
                    Log Out
                </button>
            </header>
            {/* Metrics Cards Grid */}
            <section className="metrics-grid">
                <div className="metric-card">
                    <span className="metric-label">Total Interviews</span>
                    <span className="metric-value">{stats.totalInterviews}</span>
                </div>
                <div className="metric-card">
                    <span className="metric-label">Average Score</span>
                    <span className="metric-value">
                        {stats.averageScore ? `${stats.averageScore.toFixed(1)}/10` : "N/A"}
                    </span>
                </div>
                <div className="metric-card">
                    <span className="metric-label">Best Score</span>
                    <span className="metric-value">
                        {stats.bestScore ? `${stats.bestScore.toFixed(1)}/10` : "N/A"}
                    </span>
                </div>
                <div className="metric-card">
                    <span className="metric-label">Completed Sessions</span>
                    <span className="metric-value">{stats.completedInterviews}</span>
                </div>
            </section>
            {/* Core Action Call */}
            <section className="cta-section">
                <div className="cta-card">
                    <h2>Ready to practice?</h2>
                    <p>Start a dynamic, multi-turn technical interview session tailored to your job role and target difficulty.</p>

                    <form onSubmit={handleStartNew} className="cta-form">
                        <div className="cta-form-grid">
                            <div className="cta-field">
                                <label htmlFor="role">Job Role</label>
                                <input
                                    type="text"
                                    id="role"
                                    placeholder="e.g. Backend Developer"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    required
                                    disabled={startInterviewMutation.isPending}
                                />
                            </div>
                            <div className="cta-field">
                                <label htmlFor="difficulty">Difficulty</label>
                                <select
                                    id="difficulty"
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
                            className="start-btn"
                            disabled={startInterviewMutation.isPending || !role.trim()}
                        >
                            {startInterviewMutation.isPending ? "Initializing AI..." : "Start Mock Interview"}
                        </button>
                    </form>
                </div>
            </section>
            {/* History Table */}
            <section className="history-section">
                <h2>Recent Interview Sessions</h2>
                {history.length === 0 ? (
                    <div className="no-history-card">
                        <p>No interview sessions recorded yet. Start one above!</p>
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table className="history-table">
                            <thead>
                                <tr>
                                    <th>Job Role</th>
                                    <th>Difficulty</th>
                                    <th>Score</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((session) => (
                                    <tr key={session.sessionId}>
                                        <td><strong>{session.role}</strong></td>
                                        <td>
                                            <span className={`badge diff-${session.difficulty}`}>
                                                {session.difficulty}
                                            </span>
                                        </td>
                                        <td>
                                            {session.status === "completed"
                                                ? `${session.score.toFixed(1)}/10`
                                                : "—"}
                                        </td>
                                        <td>
                                            <span className={`badge status-${session.status}`}>
                                                {session.status.replace("_", " ")}
                                            </span>
                                        </td>
                                        <td>{new Date(session.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            {session.status === "completed" && (
                                                <button
                                                    onClick={() => handleViewResults(session.sessionId)}
                                                    className="view-btn"
                                                >
                                                    View Details
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
    );
};

export default Dashboard;