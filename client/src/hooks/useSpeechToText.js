import { useState, useEffect, useRef } from "react";

export const useSpeechToText = (onTranscript) => {
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);
    const callbackRef = useRef(onTranscript);

    useEffect(() => {
        callbackRef.current = onTranscript;
    }, [onTranscript]);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            console.warn("Speech recognition is not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            setIsListening(false);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[event.resultIndex][0].transcript;
            if (callbackRef.current) {
                callbackRef.current(transcript);
            }
        };

        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.abort();
            }
        };
    }, []);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert("Speech recognition is not supported in your browser. Please try Chrome or Safari.");
            return;
        }
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
        }
    };

    return {
        isListening,
        toggleListening,
        isSupported: !!(window.SpeechRecognition || window.webkitSpeechRecognition)
    };
};