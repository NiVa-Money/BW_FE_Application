// /* eslint-disable @typescript-eslint/no-explicit-any */
// // Voice Recorder Modal Component
// import React, { useState, useEffect, useRef } from "react";

// interface VoiceRecorderModalProps {
//   onClose: () => void;
//   onSave: (recordedBlob: Blob) => void;
// }

// const VoiceRecorderModal: React.FC<VoiceRecorderModalProps> = ({
//   onClose,
//   onSave,
// }) => {
//   const [recording, setRecording] = useState(false);
//   const [transcript, setTranscript] = useState("");
//   const [timer, setTimer] = useState(0);
//   const [error, setError] = useState("");
//   const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const audioChunksRef = useRef<Blob[]>([]);
//   const intervalRef = useRef<NodeJS.Timeout | null>(null);
//   const recognitionRef = useRef<any>(null);

//   // Initialize SpeechRecognition if available
//   useEffect(() => {
//     const SpeechRecognition =
//       (window as any).SpeechRecognition ||
//       (window as any).webkitSpeechRecognition;
//     if (SpeechRecognition) {
//       const recognition = new SpeechRecognition();
//       recognition.continuous = true;
//       recognition.interimResults = true;
//       recognition.lang = "en-US";
//       recognition.onresult = (event: any) => {
//         let finalTranscript = "";
//         for (let i = event.resultIndex; i < event.results.length; i++) {
//           if (event.results[i].isFinal) {
//             finalTranscript += event.results[i][0].transcript;
//           }
//         }
//         setTranscript((prev) => prev + " " + finalTranscript);
//       };
//       recognitionRef.current = recognition;
//     }
//   }, []);

//   const startRecording = async () => {
//     setError("");
//     setRecordedBlob(null);
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const mediaRecorder = new MediaRecorder(stream);
//       mediaRecorderRef.current = mediaRecorder;
//       audioChunksRef.current = [];
//       mediaRecorder.ondataavailable = (event) => {
//         if (event.data.size > 0) {
//           audioChunksRef.current.push(event.data);
//         }
//       };
//       mediaRecorder.start();
//       setRecording(true);
//       setTimer(0);
//       // Start timer
//       intervalRef.current = setInterval(() => {
//         setTimer((prev) => prev + 1);
//       }, 1000);
//       // Start speech recognition if available
//       recognitionRef.current?.start();
//     } catch (err) {
//       console.error("Error starting recording:", err);
//       setError("Could not access microphone.");
//     }
//   };

//   const stopRecording = () => {
//     if (mediaRecorderRef.current && recording) {
//       mediaRecorderRef.current.stop();
//       mediaRecorderRef.current.stream
//         .getTracks()
//         .forEach((track) => track.stop());
//       setRecording(false);
//       if (intervalRef.current) clearInterval(intervalRef.current);
//       recognitionRef.current?.stop();
//       if (timer < 10) {
//         setError("Recording must be at least 10 seconds long.");
//       } else {
//         const blob = new Blob(audioChunksRef.current, { type: "audio/wav" });
//         setRecordedBlob(blob);
//       }
//     }
//   };

// //   const resetRecording = () => {
// //     setTranscript("");
// //     setTimer(0);
// //     setError("");
// //     setRecordedBlob(null);
// //     audioChunksRef.current = [];
// //   };

//   return (
//     // <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//     //   <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full relative">
//     //     <h2 className="text-2xl font-bold mb-4 text-gray-800">
//     //       Record Your Voice
//     //     </h2>
//     //     <div className="mb-4">
//     //       <p className="text-sm text-gray-600">
//     //         {recording
//     //           ? "Recording..."
//     //           : "Click the button below to start recording. Minimum 10 seconds required."}
//     //       </p>
//     //       <p className="text-sm text-gray-500 mt-1">Timer: {timer}s</p>
//     //       {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
//     //     </div>
//     //     <div className="flex justify-between items-center space-x-2">
//     //       {!recording && (
//     //         <button
//     //           onClick={startRecording}
//     //           className="px-4 py-2 rounded-xl bg-gradient-to-br from-green-500 to-blue-500 text-white hover:scale-105 transition-transform"
//     //         >
//     //           Start Recording
//     //         </button>
//     //       )}
//     //       {recording && (
//     //         <button
//     //           onClick={stopRecording}
//     //           className="px-4 py-2 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 text-white hover:scale-105 transition-transform"
//     //         >
//     //           Stop Recording
//     //         </button>
//     //       )}
//     //       <button
//     //         onClick={() => {
//     //           resetRecording();
//     //           onClose();
//     //         }}
//     //         className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
//     //       >
//     //         Close
//     //       </button>
//     //     </div>
//     //     {recordedBlob && (
//     //       <div className="mt-4">
//     //         <button
//     //           onClick={() => {
//     //             onSave(recordedBlob);
//     //             onClose();
//     //           }}
//     //           className="w-full px-4 py-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white hover:scale-105 transition-transform"
//     //         >
//     //           Use Recording as Voice Profile
//     //         </button>
//     //       </div>
//     //     )}
//     //     <div className="mt-4">
//     //       <label className="block text-sm font-medium text-gray-700">
//     //         Transcript
//     //       </label>
//     //       <textarea
//     //         value={transcript}
//     //         readOnly
//     //         className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/30 transition-all"
//     //         rows={4}
//     //       />
//     //     </div>
//     //   </div>
//     // </div>
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
//       <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full relative border border-gray-100">
//         <h2 className="text-3xl font-extrabold mb-6 text-gray-900 flex items-center gap-2">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-8 w-8 text-indigo-600"
//             viewBox="0 0 24 24"
//             fill="currentColor"
//           >
//             <path d="M12 15c-1.657 0-3 1.343-3 3v1c0 1.657 1.343 3 3 3s3-1.343 3-3v-1c0-1.657-1.343-3-3-3z" />
//             <path d="M18 11h-1.101a6 6 0 0 1-5.101-5.909V4a1 1 0 1 0-2 0v1.092A6 6 0 0 1 7.1 11H6a6 6 0 0 0-6 6v3h24v-3a6 6 0 0 0-6-6z" />
//           </svg>
//           Voice Profile Setup
//         </h2>

//         <div className="mb-6 space-y-3">
//           <p className="text-sm text-gray-500 font-medium">
//             {recording
//               ? `Recording... (${timer}s)`
//               : "Hold to record minimum 10 seconds"}
//           </p>

//           <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
//             <div
//               className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
//               style={{ width: `${Math.min((timer / 10) * 100, 100)}%` }}
//             />
//           </div>

//           {error && (
//             <div className="flex items-center gap-2 text-red-500 text-sm font-medium">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-4 w-4"
//                 viewBox="0 0 20 20"
//                 fill="currentColor"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//               {error}
//             </div>
//           )}
//         </div>

//         <div className="flex flex-col gap-4">
//           <div className="flex justify-center gap-3">
//             <button
//               onClick={recording ? stopRecording : startRecording}
//               className={`p-4 rounded-full shadow-lg transform transition-all duration-200 ${
//                 recording
//                   ? "bg-red-500 hover:bg-red-600 scale-110"
//                   : "bg-indigo-500 hover:bg-indigo-600 hover:scale-105"
//               }`}
//             >
//               <svg
//                 className="w-6 h-6 text-white"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 {recording ? (
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                   />
//                 ) : (
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
//                   />
//                 )}
//               </svg>
//             </button>
//           </div>

//           {recordedBlob && (
//             <button
//               onClick={() => {
//                 onSave(recordedBlob);
//                 onClose();
//               }}
//               className="w-full py-3 px-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg transition-shadow"
//             >
//               Save Voice Profile →
//             </button>
//           )}

//           <div className="mt-4 space-y-2">
//             <div className="flex items-center gap-2 text-gray-700 font-medium">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-5 w-5 text-gray-400"
//                 viewBox="0 0 20 20"
//                 fill="currentColor"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M7 2a2 2 0 012-2h2a2 2 0 012 2v12a2 2 0 01-2 2H9a2 2 0 01-2-2V2zm3 0a1 1 0 00-1 1v12a1 1 0 001 1h2a1 1 0 001-1V3a1 1 0 00-1-1h-2z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//               Transcription
//             </div>
//             <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-600 min-h-[100px]">
//               {transcript || "Speech transcription will appear here..."}
//             </div>
//           </div>

//           <button
//             onClick={onClose}
//             // onClick={() => {
//             //               resetRecording();
//             //               onClose();
//             //             }}

//             className="mt-4 text-gray-500 hover:text-gray-700 font-medium flex items-center justify-center gap-1 transition-colors"
//           >
//             Close
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-4 w-4"
//               viewBox="0 0 20 20"
//               fill="currentColor"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
//                 clipRule="evenodd"
//               />
//             </svg>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VoiceRecorderModal;

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from "react";

interface VoiceRecorderModalProps {
  onClose: () => void;
  onSave: (recordedBlob: Blob) => void;
}

const sampleTexts =
  "On a misty morning, Felix the curious fox sat outside his favorite café, sipping a warm cup of coffee. As the aroma filled the air, he overheard a conversation about artificial intelligence shaping the future. Fascinated, he imagined a world where AI could predict the perfect coffee blend for every mood. What if machines could craft stories, compose music, or even chat like an old friend over a cup of espresso? With a spark of curiosity, Felix set off on a new adventure—exploring the endless possibilities of AI, one sip at a time.";

const languageNames: Record<string, string> = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  ja: "Japanese",
  hi: "Hindi",
  ko: "Korean",
};

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

  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [translatedText, setTranslatedText] = useState(sampleTexts);

  useEffect(() => {
    const translateText = async () => {
      try {
        const response = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
            sampleTexts
          )}&langpair=en|${selectedLanguage}`
        );
        const data = await response.json();
        setTranslatedText(data.responseData.translatedText);
      } catch (error) {
        console.error("Translation error:", error);
      }
    };

    if (selectedLanguage !== "en") {
      translateText();
    } else {
      setTranslatedText(sampleTexts);
    }
  }, [selectedLanguage]);

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
      intervalRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-4xl w-full relative border border-gray-100 max-h-[90vh] overflow-y-auto">
        <h2 className="text-3xl font-extrabold mb-6 text-gray-900 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-indigo-600"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M12 3v9m0 0l3-3m-3 3l-3-3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21 10v6a3 3 0 01-3 3h-3l-3 3-3-3H6a3 3 0 01-3-3v-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Voice Profile Setup
        </h2>

        <div className="mb-6 space-y-3">
          <p className="text-sm text-gray-500 font-medium">
            {recording
              ? `Recording... (${timer}s)`
              : "Hold to record minimum 10 seconds"}
          </p>

          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
              style={{ width: `${Math.min((timer / 10) * 100, 100)}%` }}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm font-medium">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 2a8 8 0 11-8 8 8 8 0 018-8zM9 7a1 1 0 112 0v3a1 1 0 11-2 0V7zm1 6a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
              {error}
            </div>
          )}
        </div>

        <div className="mb-6 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
          <div className="text-sm text-indigo-700 font-medium mb-2 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            Sample Reading Text
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700">
              Select Language:
            </label>
            <select
              className="w-full mt-2 p-2 border rounded-lg"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              {Object.entries(languageNames).map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
            <div className="text-sm text-indigo-700 font-medium mb-2">
              Translated Text
            </div>
            <div className="text-gray-600 text-sm">{translatedText}</div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex justify-center gap-3">
            <button
              onClick={recording ? stopRecording : startRecording}
              className={`p-4 rounded-full shadow-lg transform transition-all duration-200 ${
                recording
                  ? "bg-red-500 hover:bg-red-600 scale-110"
                  : "bg-indigo-500 hover:bg-indigo-600 hover:scale-105"
              }`}
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {recording ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                )}
              </svg>
            </button>
          </div>

          {recordedBlob && (
            <button
              onClick={() => {
                onSave(recordedBlob);
                onClose();
              }}
              className="w-full py-3 px-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg transition-shadow"
            >
              Save Voice Profile →
            </button>
          )}

          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-gray-700 font-medium">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M5 3h10a2 2 0 012 2v12l-7-3-7 3V5a2 2 0 012-2z" />
              </svg>
              Transcription
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-600 min-h-[100px]">
              {transcript || "Speech transcription will appear here..."}
            </div>
          </div>

          <button
            onClick={() => {
              resetRecording();
              onClose();
            }}
            className="mt-4 text-gray-500 hover:text-gray-700 font-medium flex items-center justify-center gap-1 transition-colors"
          >
            Close
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceRecorderModal;
