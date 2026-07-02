import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
    return (
        <div className="nf-container">
            <div className="nf-card">
                {/* Dim giant number sits behind the title — editorial detail */}
                <span className="nf-code" aria-hidden="true">404</span>
                <h1 className="nf-title">Page not found</h1>
                <p className="nf-text">
                    The page you're looking for doesn't exist, has been moved, or is temporarily unavailable.
                </p>
                <Link to="/" className="nf-btn">
                    Return to Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
