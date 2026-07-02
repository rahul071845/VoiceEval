import React from "react";
import "./ProgressBar.css";

const ProgressBar = ({ currentQuestionIndex, maxQuestions }) => {
    const progressPercent = (currentQuestionIndex / maxQuestions) * 100;

    return (
        <div className="progress-container">
            <div className="progress-label">
                <span>Progress</span>
                <span>Question {currentQuestionIndex + 1} of {maxQuestions}</span>
            </div>
            <div className="progress-bar-bg">
                <div
                    className="progress-bar-fill"
                    style={{ width: `${progressPercent}%` }}
                ></div>
            </div>
        </div>
    );
};

export default ProgressBar;
