/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState } from "react";

// const OmnigenUI = () => {
//   const [prompt, setPrompt] = useState("");
//   const [mode, setMode] = useState<"text" | "image" | "video">("text");
//   const [uploadedImage, setUploadedImage] = useState<File | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);

//   // --- New states for Sora-like parameters ---
//   const [aspectRatio, setAspectRatio] = useState("16:9");
//   const [resolution, setResolution] = useState("480p");
//   const [duration, setDuration] = useState("5s");
//   const [speed, setSpeed] = useState("1x");

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setUploadedImage(file);
//       setPreviewUrl(URL.createObjectURL(file));
//     }
//   };

//   // Example function to handle generation
//   const handleGenerate = () => {
//     // Here you’d call your video generation API or function,
//     // passing along all the relevant parameters:
//     // - prompt (if text-to-video)
//     // - uploadedImage (if image-to-video)
//     // - aspectRatio, resolution, duration, speed
//     console.log("Generating with parameters:", {
//       mode,
//       prompt,
//       uploadedImage,
//       aspectRatio,
//       resolution,
//       duration,
//       speed,
//     });
//     alert("Check the console for the parameters being used!");
//   };

//   return (
//     <div className="p-6 min-h-screen bg-white text-black">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex justify-between items-center mb-8">
//           <h2 className="text-3xl font-bold text-gray-900">
//             Omnigen Content Studio
//           </h2>
//           <button className="bg-[#65558F] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#65558F]/90 transition-colors flex items-center gap-2">
//             Upgrade Plan
//           </button>
//         </div>

//         <nav className="flex space-x-6 border-b pb-2 mb-6">
//           <button
//             className={`text-lg font-medium ${
//               mode === "text"
//                 ? "text-[#65558F] border-b-2 border-[#65558F]"
//                 : "text-gray-500"
//             }`}
//             onClick={() => setMode("text")}
//           >
//             Text to Video
//           </button>
//           <button
//             className={`text-lg font-medium ${
//               mode === "image"
//                 ? "text-[#65558F] border-b-2 border-[#65558F]"
//                 : "text-gray-500"
//             }`}
//             onClick={() => setMode("image")}
//           >
//             Text to Image
//           </button>
//           <button
//             className={`text-lg font-medium ${
//               mode === "video"
//                 ? "text-[#65558F] border-b-2 border-[#65558F]"
//                 : "text-gray-500"
//             }`}
//             onClick={() => setMode("video")}
//           >
//             Image to Video
//           </button>
//         </nav>

//         <main className="grid gap-8">
//           <section className="p-8 rounded-2xl shadow-md border border-gray-300 bg-[#65558F] bg-opacity-[0.08]">
//             <h2 className="text-gray-900 mb-4 text-2xl font-semibold flex items-center gap-2">
//               <span>💡</span> {mode === "video" ? "Image Input" : "Prompt"}
//             </h2>

//             {/* If mode === 'video' => Image to Video; show file upload */}
//             {mode === "video" ? (
//               <div className="mb-6">
//                 <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-400 border-dashed rounded-lg cursor-pointer bg-white hover:border-[#A5FFD6] transition-colors">
//                   <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                     <svg
//                       className="w-8 h-8 mb-4 text-gray-500"
//                       aria-hidden="true"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 20 16"
//                     >
//                       <path
//                         stroke="currentColor"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
//                       />
//                     </svg>
//                     <p className="mb-2 text-sm text-gray-500">
//                       <span className="font-semibold">Click to upload</span> or
//                       drag and drop
//                     </p>
//                     <p className="text-xs text-gray-500">
//                       PNG, JPG, or WEBP (MAX. 5MB)
//                     </p>
//                   </div>
//                   <input
//                     type="file"
//                     className="hidden"
//                     accept="image/*"
//                     onChange={handleFileChange}
//                   />
//                 </label>
//                 {previewUrl && (
//                   <div className="mt-4">
//                     <img
//                       src={previewUrl}
//                       alt="Upload preview"
//                       className="max-h-48 rounded-lg mx-auto"
//                     />
//                   </div>
//                 )}
//               </div>
//             ) : (
//               /* Otherwise (text -> video or text -> image) => text prompt */
//               <textarea
//                 className="w-full p-4 border-2 border-gray-400 rounded-lg min-h-[120px] mb-6 resize-y bg-white text-black focus:outline-none focus:border-[#A5FFD6]"
//                 placeholder={
//                   mode === "text"
//                     ? "Please describe your creative ideas for the video..."
//                     : "Describe the image you want to generate..."
//                 }
//                 value={prompt}
//                 onChange={(e) => setPrompt(e.target.value)}
//               />
//             )}

//             {/* --- Sora-like parameters row (only for video modes) --- */}
//             {(mode === "text" || mode === "video") && (
//               <div className="space-y-6 mb-8">
//                 <h3 className="text-xl font-semibold text-gray-900">
//                   Video Parameters
//                 </h3>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//                   {/* Aspect Ratio */}
//                   <div className="space-y-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                       Aspect Ratio
//                     </label>
//                     <select
//                       value={aspectRatio}
//                       onChange={(e) => setAspectRatio(e.target.value)}
//                       className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg bg-white
//             focus:border-[#A5FFD6] focus:ring-1 focus:ring-[#A5FFD6] transition-all"
//                     >
//                       {["16:9", "9:16", "4:3", "1:1"].map((ratio) => (
//                         <option key={ratio} value={ratio}>
//                           {ratio}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   {/* Resolution */}
//                   <div className="space-y-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                       Resolution
//                     </label>
//                     <select
//                       value={resolution}
//                       onChange={(e) => setResolution(e.target.value)}
//                       className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg bg-white
//             focus:border-[#A5FFD6] focus:ring-1 focus:ring-[#A5FFD6] transition-all"
//                     >
//                       {["480p", "720p", "1080p"].map((res) => (
//                         <option key={res} value={res}>
//                           {res}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   {/* Duration */}
//                   <div className="space-y-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                       Duration
//                     </label>
//                     <select
//                       value={duration}
//                       onChange={(e) => setDuration(e.target.value)}
//                       className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg bg-white
//             focus:border-[#A5FFD6] focus:ring-1 focus:ring-[#A5FFD6] transition-all"
//                     >
//                       {["5s", "10s", "15s", "30s"].map((dur) => (
//                         <option key={dur} value={dur}>
//                           {dur}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   {/* Speed */}
//                   <div className="space-y-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                       Speed
//                     </label>
//                     <select
//                       value={speed}
//                       onChange={(e) => setSpeed(e.target.value)}
//                       className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg bg-white
//             focus:border-[#A5FFD6] focus:ring-1 focus:ring-[#A5FFD6] transition-all"
//                     >
//                       {["1x", "1.5x", "2x"].map((spd) => (
//                         <option key={spd} value={spd}>
//                           {spd}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 {/* Advanced Controls */}
//                 <div className="flex items-center gap-4 border-t pt-6">
//                   <button
//                     className="flex items-center gap-2 text-[#65558F] hover:text-[#4d4370]
//           transition-colors group"
//                     onClick={() => alert("Show advanced parameters")}
//                   >
//                     <svg
//                       className="w-5 h-5 group-hover:rotate-90 transition-transform"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                       />
//                     </svg>
//                     <span className="text-sm font-medium">
//                       Advanced Parameters
//                     </span>
//                   </button>

//                   <button
//                     className="flex items-center gap-2 text-[#65558F] hover:text-[#4d4370]
//           transition-colors"
//                     onClick={() => alert("Open storyboard")}
//                   >
//                     <svg
//                       className="w-5 h-5"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
//                       />
//                     </svg>
//                     <span className="text-sm font-medium">Storyboard</span>
//                   </button>
//                 </div>
//               </div>
//             )}

//             <div className="flex gap-2 mb-4">
//               <button className="bg-gray-300 text-black px-4 py-2 rounded-lg text-sm">
//                 Realistic Cat
//               </button>
//               <button className="bg-gray-300 text-black px-4 py-2 rounded-lg text-sm">
//                 Ancient Style Man
//               </button>
//             </div>

//             <button
//               className="bg-[#A5FFD6] text-black px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-transform hover:scale-105 shadow-lg shadow-green-500/50"
//               onClick={handleGenerate}
//             >
//               <span>✨</span>
//               {mode === "video" ? "Generate Video from Image" : "Generate"}
//             </button>
//           </section>

//           <section className="p-6 border border-gray-300 rounded-xl bg-[#65558F] bg-opacity-[0.08] text-center">
//             <p className="text-gray-600">
//               {mode === "text" && "Your generated video will appear here"}
//               {mode === "image" && "Your generated image will appear here"}
//               {mode === "video" && "Your converted video will appear here"}
//             </p>
//           </section>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default OmnigenUI;

import { useEffect, useState } from "react";
import {
  fetchAllTextToVideosService,
  generateTextToVideoService,
} from "../../../api/services/videoGenerateServices";

const OmnigenUI = () => {
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState<"text" | "image" | "video">("text");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Video parameters
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [resolution, setResolution] = useState("480p");
  const [duration, setDuration] = useState(5);
  const [speed, setSpeed] = useState("1x");

  const [allVideos, setAllVideos] = useState<any[]>([]);

  useEffect(() => {
    const loadAllVideos = async () => {
      try {
        setLoading(true);
        const fetched = await fetchAllTextToVideosService();
        console.log("Fetched videos:", fetched);
        setAllVideos(fetched.data);
        console.log("Updated allVideos state:", fetched.data);
      } catch (error) {
        console.error("Error loading videos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAllVideos();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleGenerate = async () => {
    if (mode === "text" && prompt.trim() === "") {
      alert("Please enter a text prompt.");
      return;
    }
    if (mode === "video" && !uploadedImage) {
      alert("Please upload an image.");
      return;
    }

    setLoading(true);
    setVideoUrl(null);

    try {
      if (mode === "text") {
        // POST request
        const response = await generateTextToVideoService({
          prompt,
          duration,
          // aspectRatio,
          // resolution,
          // speed
        });

        setVideoUrl(response.videoUrl);

        // Refresh the list of videos
        const fetchedVideos = await fetchAllTextToVideosService();
        setAllVideos(fetchedVideos);
      }

      // Add handling for other modes here (if needed)
    } catch {
      alert("Error generating content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-white text-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Omnigen Content Studio
          </h2>
          <button className="bg-[#65558F] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#65558F]/90 transition-colors">
            Upgrade Plan
          </button>
        </div>

        <nav className="flex space-x-6 border-b pb-2 mb-6">
          <button
            className={`text-lg font-medium ${
              mode === "text"
                ? "text-[#65558F] border-b-2 border-[#65558F]"
                : "text-gray-500"
            }`}
            onClick={() => setMode("text")}
          >
            Text to Video
          </button>
          <button
            className={`text-lg font-medium ${
              mode === "image"
                ? "text-[#65558F] border-b-2 border-[#65558F]"
                : "text-gray-500"
            }`}
            onClick={() => setMode("image")}
          >
            Text to Image
          </button>
          <button
            className={`text-lg font-medium ${
              mode === "video"
                ? "text-[#65558F] border-b-2 border-[#65558F]"
                : "text-gray-500"
            }`}
            onClick={() => setMode("video")}
          >
            Image to Video
          </button>
        </nav>

        <main className="grid gap-8">
          <section className="p-8 rounded-2xl shadow-md border border-gray-300 bg-[#65558F] bg-opacity-[0.08]">
            <h2 className="text-gray-900 mb-4 text-2xl font-semibold flex items-center gap-2">
              <span>💡</span> {mode === "video" ? "Image Input" : "Prompt"}
            </h2>

            {mode === "video" ? (
              <div className="mb-6">
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-400 border-dashed rounded-lg cursor-pointer bg-white hover:border-[#A5FFD6] transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-4 text-gray-500"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, or WEBP (MAX. 5MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
                {previewUrl && (
                  <div className="mt-4">
                    <img
                      src={previewUrl}
                      alt="Upload preview"
                      className="max-h-48 rounded-lg mx-auto"
                    />
                  </div>
                )}
              </div>
            ) : (
              <textarea
                className="w-full p-4 border-2 border-gray-400 rounded-lg min-h-[120px] mb-6 resize-y bg-white text-black focus:outline-none focus:border-[#A5FFD6]"
                placeholder={
                  mode === "text"
                    ? "Describe your video idea..."
                    : "Describe the image you want to generate..."
                }
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            )}

            {(mode === "text" || mode === "video") && (
              <div className="space-y-6 mb-8">
                <h3 className="text-xl font-semibold text-gray-900">
                  Video Parameters
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Aspect Ratio
                    </label>
                    <select
                      value={aspectRatio}
                      onChange={(e) => setAspectRatio(e.target.value)}
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg bg-white focus:border-[#A5FFD6] focus:ring-1 focus:ring-[#A5FFD6]"
                    >
                      {["16:9", "9:16", "4:3", "1:1"].map((ratio) => (
                        <option key={ratio} value={ratio}>
                          {ratio}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Resolution
                    </label>
                    <select
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value)}
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg bg-white focus:border-[#A5FFD6] focus:ring-1 focus:ring-[#A5FFD6]"
                    >
                      {["480p", "720p", "1080p"].map((res) => (
                        <option key={res} value={res}>
                          {res}
                        </option>
                      ))}
                    </select>
                  </div> */}

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Duration
                    </label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg bg-white focus:border-[#A5FFD6] focus:ring-1 focus:ring-[#A5FFD6]"
                    >
                      {[5, 10].map((dur) => (
                        <option key={dur} value={dur}>
                          {dur} seconds
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Speed
                    </label>
                    <select
                      value={speed}
                      onChange={(e) => setSpeed(e.target.value)}
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg bg-white focus:border-[#A5FFD6] focus:ring-1 focus:ring-[#A5FFD6]"
                    >
                      {["1x", "1.5x", "2x"].map((spd) => (
                        <option key={spd} value={spd}>
                          {spd}
                        </option>
                      ))}
                    </select>
                  </div> */}
                </div>

                {/* <div className="flex items-center gap-4 border-t pt-6">
                  <button
                    className="flex items-center gap-2 text-[#65558F] hover:text-[#4d4370] transition-colors group"
                    onClick={() => alert("Advanced parameters")}
                  >
                    <svg
                      className="w-5 h-5 group-hover:rotate-90 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-sm font-medium">
                      Advanced Parameters
                    </span>
                  </button>

                  <button
                    className="flex items-center gap-2 text-[#65558F] hover:text-[#4d4370] transition-colors"
                    onClick={() => alert("Storyboard")}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                      />
                    </svg>
                    <span className="text-sm font-medium">Storyboard</span>
                  </button>
                </div> */}
              </div>
            )}

            <div className="flex gap-2 mb-4">
              <button className="bg-gray-300 text-black px-4 py-2 rounded-lg text-sm">
                Realistic Cat
              </button>
              <button className="bg-gray-300 text-black px-4 py-2 rounded-lg text-sm">
                Ancient Style Man
              </button>
            </div>

            <button
              className="bg-[#A5FFD6] text-black px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-transform hover:scale-105 shadow-lg shadow-green-500/50 disabled:opacity-50"
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Generating...
                </>
              ) : (
                <>
                  <span>✨</span>
                  {mode === "video" ? "Generate Video" : "Generate"}
                </>
              )}
            </button>
          </section>

          {/* CARDS LAYOUT for videos */}
          <section className="p-6 border border-gray-300 rounded-xl bg-[#65558F] bg-opacity-[0.08] min-h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center w-full h-full">
                <div className="animate-pulse text-gray-600">Generating...</div>
              </div>
            ) : allVideos.length > 0 ? (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {allVideos.map((video, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow p-4 text-black"
                  >
                    <video
                      src={video.videoUrl}
                      controls
                      className="w-full h-auto rounded-lg"
                    />
                    <p className="mt-2 text-sm text-gray-700">
                      {/* Example: show any meta info or fallback title */}
                      {video.prompt || `Generated Video ${index + 1}`}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <p className="text-gray-600">
                  {mode === "text" && "Your generated video will appear here"}
                  {mode === "image" && "Your generated image will appear here"}
                  {mode === "video" && "Your converted video will appear here"}
                </p>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default OmnigenUI;
