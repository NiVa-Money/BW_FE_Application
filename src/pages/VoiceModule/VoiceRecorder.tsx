/* eslint-disable @typescript-eslint/no-explicit-any */
// Voice Recorder Modal Component
import React, { useState, useEffect, useRef } from "react";

interface VoiceRecorderModalProps {
  onClose: () => void;
  onSave: (recordedBlob: Blob) => void;
}

const VoiceRecorderModal: React.FC<VoiceRecorderModalProps> = ({
  onClose,
  onSave,
}) => {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState("");
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize SpeechRecognition if available
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      recognition.onresult = (event: any) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        setTranscript((prev) => prev + " " + finalTranscript);
      };
      recognitionRef.current = recognition;
    }
  }, []);

  const startRecording = async () => {
    setError("");
    setRecordedBlob(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      mediaRecorder.start();
      setRecording(true);
      setTimer(0);
      // Start timer
      intervalRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
      // Start speech recognition if available
      recognitionRef.current?.start();
    } catch (err) {
      console.error("Error starting recording:", err);
      setError("Could not access microphone.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setRecording(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
      recognitionRef.current?.stop();
      if (timer < 10) {
        setError("Recording must be at least 10 seconds long.");
      } else {
        const blob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        setRecordedBlob(blob);
      }
    }
  };

  const resetRecording = () => {
    setTranscript("");
    setTimer(0);
    setError("");
    setRecordedBlob(null);
    audioChunksRef.current = [];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full relative">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Record Your Voice
        </h2>
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {recording
              ? "Recording..."
              : "Click the button below to start recording. Minimum 10 seconds required."}
          </p>
          <p className="text-sm text-gray-500 mt-1">Timer: {timer}s</p>
          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        </div>
        <div className="flex justify-between items-center space-x-2">
          {!recording && (
            <button
              onClick={startRecording}
              className="px-4 py-2 rounded-xl bg-gradient-to-br from-green-500 to-blue-500 text-white hover:scale-105 transition-transform"
            >
              Start Recording
            </button>
          )}
          {recording && (
            <button
              onClick={stopRecording}
              className="px-4 py-2 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 text-white hover:scale-105 transition-transform"
            >
              Stop Recording
            </button>
          )}
          <button
            onClick={() => {
              resetRecording();
              onClose();
            }}
            className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
        </div>
        {recordedBlob && (
          <div className="mt-4">
            <button
              onClick={() => {
                onSave(recordedBlob);
                onClose();
              }}
              className="w-full px-4 py-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white hover:scale-105 transition-transform"
            >
              Use Recording as Voice Profile
            </button>
          </div>
        )}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Transcript
          </label>
          <textarea
            value={transcript}
            readOnly
            className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/30 transition-all"
            rows={4}
          />
        </div>
      </div>
    </div>
  );
};

export default VoiceRecorderModal;
