import React, { useState, useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getInterviewSession, submitAnswer } from "../../services/interviewService";
import { useSpeechToText } from "../../hooks/useSpeechToText";
import ProgressBar from "../../components/interview/ProgressBar";
import QuestionCard from "../../components/interview/QuestionCard";
import VoiceWaveform from "../../components/interview/VoiceWaveform";
import Navbar from "../../components/layout/Navbar";
import "./Interview.css";

const Interview = () => {
    const { sessionId } = useParams();
    const [answer, setAnswer] = useState(() => {
        if (sessionId) {
            return localStorage.getItem(`voiceeval_draft_${sessionId}`) || "";
        }
        return "";
    });
    const [timeLeft, setTimeLeft] = useState(180);
    const [timerStatus, setTimerStatus] = useState("idle");
    const navigate     = useNavigate();
    const queryClient  = useQueryClient();

    useEffect(() => {
        if (!sessionId) return;
        if (answer) {
            localStorage.setItem(`voiceeval_draft_${sessionId}`, answer);
        } else {
            localStorage.removeItem(`voiceeval_draft_${sessionId}`);
        }
    }, [answer, sessionId]);

    const { data: interviewData, isLoading, isError } = useQuery({
        queryKey: ["interview", sessionId],
        queryFn: () => getInterviewSession(sessionId)
    });

    const { isListening, toggleListening, isSupported } = useSpeechToText((transcript) => {
        setAnswer((prev) => (prev ? prev + " " + transcript : transcript));
    });

    const submitAnswerMutation = useMutation({
        mutationFn: submitAnswer,
        onSuccess: (response) => {
            if (response.success && response.data) {
                localStorage.removeItem(`voiceeval_draft_${sessionId}`);
                localStorage.removeItem(`voiceeval_timer_${sessionId}_time`);
                localStorage.removeItem(`voiceeval_timer_${sessionId}_status`);
                localStorage.removeItem(`voiceeval_timer_${sessionId}_qidx`);

                if (response.data.status === "completed") {
                    queryClient.setQueryData(["interview", sessionId], (old) => {
                        if (!old) return old;
                        return {
                            ...old,
                            data: {
                                ...old.data,
                                status: "completed"
                            }
                        };
                    });
                    queryClient.invalidateQueries({ queryKey: ["interview", sessionId] });
                    queryClient.invalidateQueries({ queryKey: ["history"] });
                    queryClient.invalidateQueries({ queryKey: ["analytics"] });
                    navigate(`/results/${sessionId}`);
                    return;
                }
                setAnswer("");
                queryClient.invalidateQueries({ queryKey: ["interview", sessionId] });
            }
        }
    });

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        if (answer.trim().length < 20) return;
        submitAnswerMutation.mutate({ sessionId, answer });
    };

    const session      = interviewData?.data;
    const currentQIdx  = session?.currentQuestionIndex ?? 0;
    const totalQ       = session?.maxQuestions ?? 3;

    useEffect(() => {
        if (!session) return;
        const storedQIdx = localStorage.getItem(`voiceeval_timer_${sessionId}_qidx`);
        const parsedQIdx = storedQIdx ? parseInt(storedQIdx, 10) : -1;

        if (parsedQIdx === currentQIdx) {
            const storedTime = localStorage.getItem(`voiceeval_timer_${sessionId}_time`);
            const storedStatus = localStorage.getItem(`voiceeval_timer_${sessionId}_status`);
            setTimeLeft(storedTime ? parseInt(storedTime, 10) : 180);
            setTimerStatus(storedStatus || "idle");
        } else {
            setTimeLeft(180);
            setTimerStatus("idle");
            localStorage.setItem(`voiceeval_timer_${sessionId}_qidx`, currentQIdx.toString());
            localStorage.setItem(`voiceeval_timer_${sessionId}_time`, "180");
            localStorage.setItem(`voiceeval_timer_${sessionId}_status`, "idle");
        }
    }, [session?.currentQuestion, currentQIdx, sessionId]);

    useEffect(() => {
        if (!sessionId || !session) return;
        const storedQIdx = localStorage.getItem(`voiceeval_timer_${sessionId}_qidx`);
        const parsedQIdx = storedQIdx ? parseInt(storedQIdx, 10) : -1;
        if (parsedQIdx !== currentQIdx) return;

        localStorage.setItem(`voiceeval_timer_${sessionId}_time`, timeLeft.toString());
        localStorage.setItem(`voiceeval_timer_${sessionId}_status`, timerStatus);
    }, [timeLeft, timerStatus, sessionId, currentQIdx, session]);

    useEffect(() => {
        if (isLoading || isError || submitAnswerMutation.isPending || !session || timerStatus !== "running") return;

        if (timeLeft <= 0) {
            setTimerStatus("expired");
            if (isListening) {
                toggleListening();
            }
            return;
        }

        const interval = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft, isLoading, isError, submitAnswerMutation.isPending, session, timerStatus, isListening, toggleListening]);

    if (isLoading) {
        return (
            <div className="iv-state-screen">
                <div className="iv-spinner" />
                <p className="iv-state-text">Loading session…</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="iv-state-screen">
                <p className="iv-state-title">Session not found</p>
                <p className="iv-state-text">Could not retrieve this interview. Please return to the dashboard.</p>
                <button onClick={() => navigate("/dashboard")} className="iv-pill-btn">
                    Go to Dashboard
                </button>
            </div>
        );
    }

    if (submitAnswerMutation.isPending) {
        return (
            <div className="iv-state-screen">
                <div className="iv-eval-pulse" />
                <p className="iv-state-title">Evaluating your response…</p>
                <p className="iv-state-text">Gemini is assessing your answer and preparing the next question.</p>
            </div>
        );
    }

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const handleStartTimer = () => {
        setTimerStatus("running");
        localStorage.setItem(`voiceeval_timer_${sessionId}_status`, "running");
        localStorage.setItem(`voiceeval_timer_${sessionId}_qidx`, currentQIdx.toString());
    };

    return (
        <>
            <Navbar />
            <div className="iv-container">
                <header className="iv-header">
                    <div className="iv-header-info">
                        <h1 className="iv-title">Technical Interview</h1>
                        <p className="iv-role">{session.role}</p>
                    </div>
                    <div className="iv-header-meta">
                        {timerStatus === "idle" ? (
                            <button
                                type="button"
                                onClick={handleStartTimer}
                                className="iv-timer-btn"
                            >
                                Start Timer
                            </button>
                        ) : (
                            <span className={`iv-timer ${timeLeft < 30 ? "iv-timer-warning" : ""}`}>
                                {formatTime(timeLeft)}
                            </span>
                        )}
                        <span className={`iv-diff-badge iv-diff-${session.difficulty}`}>
                            {session.difficulty}
                        </span>
                    </div>
                </header>

                <ProgressBar currentQuestionIndex={currentQIdx} maxQuestions={totalQ} />

                <QuestionCard question={session.currentQuestion} />

                <form onSubmit={handleSubmit} className="iv-answer-form">
                    <label htmlFor="answer-input" className="iv-answer-label">
                        Your Answer
                    </label>

                    <textarea
                        id="answer-input"
                        className="iv-textarea"
                        placeholder={
                            timerStatus === "idle"
                                ? "Click 'Start Timer' in the header to begin writing your response..."
                                : timerStatus === "expired"
                                ? "Time has expired. You can no longer edit your response. Please submit it below."
                                : "Provide a comprehensive explanation — minimum 20 characters…"
                        }
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        required
                        disabled={timerStatus !== "running"}
                    />

                    {isSupported && (
                        <button
                            type="button"
                            onClick={toggleListening}
                            className={`iv-mic-btn ${isListening ? "iv-mic-active" : ""}`}
                            disabled={submitAnswerMutation.isPending || timerStatus !== "running"}
                        >
                            {isListening ? (
                                <>
                                    <span className="iv-mic-dot" />
                                    Stop Speaking
                                    <VoiceWaveform />
                                </>
                            ) : (
                                "Answer with Voice"
                            )}
                        </button>
                    )}

                    <div className="iv-form-footer">
                        <span className={`iv-char-count ${answer.length < 20 ? "iv-char-error" : ""}`}>
                            {answer.length} characters {answer.length < 20 && "(min 20)"}
                        </span>
                        <button
                            type="submit"
                            className="iv-submit-btn"
                            disabled={answer.trim().length < 20 || timerStatus === "idle" || submitAnswerMutation.isPending}
                        >
                            Submit Answer
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Interview;