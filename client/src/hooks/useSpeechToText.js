import { useState, useEffect, useRef } from "react";

export const useSpeechToText = (onTranscript) => {
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);
    const callbackRef = useRef(onTranscript);

    useEffect(() => {
        callbackRef.current = onTranscript;
    }, [onTranscript]);

    useEffect(() => {
        // 1. Resolve browser compatibility
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            console.warn("Speech recognition is not supported in this browser.");
            return;
        }

        // 2. Initialize recognition settings
        const recognition = new SpeechRecognition();
        recognition.continuous = true;      // Keep listening even if the user pauses
        recognition.interimResults = false;  // Only return final, completed phrases
        recognition.lang = "en-US";          // Target language

        // 3. Define event handlers
        recognition.onstart = () => setIsListening(true);
        
        recognition.onend = () => setIsListening(false);
        
        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            setIsListening(false);
        };

        recognition.onresult = (event) => {
            // Get the transcript of the last spoken phrase
            const currentResultIndex = event.resultIndex;
            const transcript = event.results[currentResultIndex][0].transcript;
            
            // Pass the spoken text back to the component
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

    // 4. Toggle Listening
    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert("Speech recognition is not supported in your current browser. Please try Chrome or Safari.");
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
        }
    };

    return { isListening, toggleListening, isSupported: !!(window.SpeechRecognition || window.webkitSpeechRecognition) };
};