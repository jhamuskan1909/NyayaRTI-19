"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  // "en-IN" for English, "hi-IN" for Hindi. Web Speech API does not support
  // mixed Hinglish recognition — pick the closer of the two based on a toggle.
  lang?: "en-IN" | "hi-IN";
}

export default function VoiceInput({ onTranscript, lang = "en-IN" }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const finalTranscriptRef = useRef<string>("");

  // Keep the latest callback in a ref so the recognition object below
  // doesn't get torn down and rebuilt every time the parent re-renders
  // (which happens on every word, since typing updates parent state).
  const onTranscriptRef = useRef(onTranscript);
  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang;

    recognition.onresult = (event: any) => {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscriptRef.current += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }
      onTranscriptRef.current(finalTranscriptRef.current + interimTranscript);
    };

    recognition.onerror = (event: any) => {
      if (event.error === "no-speech") {
        setError("No speech detected. Try again.");
      } else if (event.error === "not-allowed") {
        setError("Microphone permission denied.");
      } else {
        setError("Voice input failed. Please type instead.");
      }
      setIsListening(false);
    };

    // Chrome auto-stops recognition after a period of silence or a fixed
    // max duration even with continuous=true. If the user hasn't manually
    // stopped, restart automatically so it feels like one continuous session.
    let manuallyStopped = false;

    recognition.onend = () => {
      if (!manuallyStopped) {
        try {
          recognition.start();
          return;
        } catch (e) {
          // ignore — will fall through to setIsListening(false)
        }
      }
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    (recognition as any)._setManuallyStopped = (val: boolean) => {
      manuallyStopped = val;
    };

    return () => {
      manuallyStopped = true;
      recognition.stop();
    };
    // Only rebuild recognition when the language changes — never on
    // onTranscript identity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    setError(null);

    if (isListening) {
      recognitionRef.current._setManuallyStopped?.(true);
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        finalTranscriptRef.current = "";
        recognitionRef.current._setManuallyStopped?.(false);
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        setError("Could not start microphone.");
      }
    }
  };

  if (!isSupported) {
    return (
      <p className="text-sm text-gray-400">
        Voice input isn't supported in this browser. Please use Chrome or Edge, or type your grievance below.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={toggleListening}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
          isListening
            ? "bg-red-600 hover:bg-red-700 text-white"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {isListening ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Listening... (tap to stop)
          </>
        ) : (
          <>
            <Mic className="w-4 h-4" />
            Speak your grievance
          </>
        )}
      </button>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}