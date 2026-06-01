const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/auth.routes");
const interviewRoutes = require("./routes/interview.routes");

const app = express();

const corsOptions = {
    origin: "*",
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

module.exports = app;