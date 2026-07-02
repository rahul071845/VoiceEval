import React from "react";
import "./QuestionCard.css";

const QuestionCard = ({ question }) => {
    return (
        <div className="question-card">
            <h3>Current Question</h3>
            <p className="question-text">{question}</p>
        </div>
    );
};

export default QuestionCard;
