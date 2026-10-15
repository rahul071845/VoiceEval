const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/auth.routes");
const interviewRoutes = require("./routes/interview.routes");
const aiRoutes = require("./routes/ai.routes");

const app = express();

const allowedOrigins = [
    ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",").map(u => u.trim().replace(/\/+$/, "")) : []),
    "http://localhost:5173",
    "http://localhost:5000",
    "http://localhost:5001"
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
            return callback(null, true);
        }
        return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
};

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: "Too many requests from this IP, please try again later."
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors(corsOptions));
app.use(limiter);
app.use(morgan("dev"));

app.get("/health", (req,res)=>{
    res.status(200).json({
        success:true,
        message:"VoiceEval API Running"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/ai", aiRoutes)

module.exports = app;