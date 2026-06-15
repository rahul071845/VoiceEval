const mongoose = require("mongoose");

const interviewSessionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        role: {
            type: String,
            required: true
        },
        difficulty: {
            type: String,
            enum: ["easy", "medium", "hard"],
            required: true
        },
        status: {
            type: String,
            enum: [
                "in_progress",
                "completed"
            ],
            default: "in_progress"
        },
        maxQuestions: {
            type: Number,
            default: 3
        },
        score: {
            type: Number,
            default: 0
        },
        questions: [
            {
                question: {
                    type: String,
                    required: true
                },

                answer: {
                    type: String,
                    default: ""
                },

                score: {
                    type: Number,
                    default: 0
                },

                feedback: {
                    type: String,
                    default: ""
                },

                strengths: [{
                    type: String
                }],

                weaknesses: [{
                    type: String
                }],

                improvementSuggestions: [{
                    type: String
                }]
            }
        ],
        summary: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true,
    }
)

interviewSessionSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("InterviewSession", interviewSessionSchema);