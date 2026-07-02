import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/layout/Navbar";
import "./Landing.css";

const Landing = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="landing-container">
            <Navbar />

            <header className="landing-hero">
                <p className="hero-eyebrow">AI-Powered Interview Preparation</p>
                <h1 className="hero-title">
                    Master Your Technical<br />
                    Interviews with{" "}
                    <span className="hero-accent">VoiceEval</span>
                </h1>
                <p className="hero-subtitle">
                    Simulate realistic, adaptive technical mock interviews powered by Gemini AI.
                    Speak your answers, receive instant structured feedback, and track your growth.
                </p>
                <div className="hero-cta">
                    {isAuthenticated ? (
                        <Link to="/dashboard" className="btn-green-pill">
                            Go to Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link to="/register" className="btn-green-pill">
                                Start for Free
                            </Link>
                            <Link to="/login" className="btn-outline-pill">
                                Log In
                            </Link>
                        </>
                    )}
                </div>
            </header>
        </div>
    );
};

export default Landing;
