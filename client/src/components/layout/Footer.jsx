import React from "react";
import "./Footer.css";

const Footer = () => {
    return (
        <footer className="app-footer">
            <p>© {new Date().getFullYear()} VoiceEval. Built for engineers who take preparation seriously.</p>
        </footer>
    );
};

export default Footer;
