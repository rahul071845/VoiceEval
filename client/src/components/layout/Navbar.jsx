import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <header className="navbar-header">
            <div className="navbar-container">
                <Link to={isAuthenticated ? "/dashboard" : "/"} className="navbar-logo">
                    <span className="navbar-logo-icon">🎙️</span> VoiceEval
                </Link>
                <nav className="navbar-links">
                    {isAuthenticated ? (
                        <>
                            <Link to="/dashboard" className="navbar-link">Dashboard</Link>
                            <div className="navbar-user-section">
                                <span className="navbar-user-name">Hi, {user?.name || "Candidate"}</span>
                                <button onClick={handleLogout} className="navbar-logout-btn">
                                    Log Out
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="navbar-link">Log In</Link>
                            <Link to="/register" className="navbar-signup-btn">Sign Up</Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
