// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useEffect, useState } from "react";
// import {
//   fetchAllTextToVideosService,
//   generateTextToVideoService,
//   enhancePromptService,
//   deleteVideoService,
// } from "../../../api/services/videoGenerateServices";
// import DeleteIcon from "@mui/icons-material/Delete";

// const OmnigenUI = () => {
//   const [prompt, setPrompt] = useState("");
//   // mode "text" = Text to Video
//   // mode "image" = Text to Image
//   // mode "video" = Image to Video
//   const [mode, setMode] = useState<"text" | "image" | "video">("text");

//   const [uploadedImage, setUploadedImage] = useState<File | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [videoUrl, setVideoUrl] = useState<string | null>(null);

//   // Global loading state while generating/fetching
//   const [loading, setLoading] = useState(false);

//   const [duration, setDuration] = useState(5);

//   // Will hold all videos, each with a status, e.g.:
//   // { videoUrl: string, prompt: string, status: 'pending' | 'inprogress' | 'completed' | 'failed', requestId: string }
//   const [allVideos, setAllVideos] = useState<any[]>([]);

//   useEffect(() => {
//     const loadAllVideos = async () => {
//       try {
//         setLoading(true);
//         const fetched = await fetchAllTextToVideosService();
//         console.log("Fetched videos:", fetched);
//         setAllVideos(fetched.data);
//       } catch (error) {
//         console.error("Error loading videos:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     // Load existing videos only if we are in text mode (optional).
//     // If you want to fetch them anyway, remove the condition:
//     if (mode === "text") {
//       loadAllVideos();
//     }
//   }, [mode]);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setUploadedImage(file);
//       setPreviewUrl(URL.createObjectURL(file));
//     }
//   };

//   /**
//    * Enhance the user's prompt based on the mode:
//    * - "text" => text-to-video => type = "ttv"
//    * - "image" => text-to-image => type = "tti"
//    */
//   const handleEnhancePrompt = async () => {
//     let requestType = "";
//     if (mode === "text") {
//       requestType = "ttv"; // text to video
//     } else if (mode === "image") {
//       requestType = "tti"; // text to image
//     } else {
//       // No prompt enhancement for "video" mode (image to video),
//       // so just return.
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await enhancePromptService({
//         userPrompt: prompt,
//         type: requestType,
//       });

//       if (response.enhancedPrompt) {
//         setPrompt(response.enhancedPrompt);
//       }
//     } catch (error) {
//       console.error("Error enhancing prompt:", error);
//       alert("Error enhancing prompt. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGenerate = async () => {
//     if (mode === "text" && prompt.trim() === "") {
//       alert("Please enter a text prompt.");
//       return;
//     }
//     if (mode === "video" && !uploadedImage) {
//       alert("Please upload an image.");
//       return;
//     }

//     console.log("videourl", videoUrl);
//     setLoading(true);
//     setVideoUrl(null);

//     try {
//       if (mode === "text") {
//         // Text-to-Video
//         const response = await generateTextToVideoService({
//           prompt,
//           duration,
//         });
//         setVideoUrl(response.videoUrl);

//         // Re-fetch the list of videos after generation
//         const fetchedVideos = await fetchAllTextToVideosService();
//         setAllVideos(fetchedVideos.data);
//       }
//       // If you have text-to-image or image-to-video endpoints,
//       // handle them similarly here.
//     } catch {
//       alert("Error generating content. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteVideo = async (requestId: string) => {
//     try {
//       await deleteVideoService(requestId);
//       setAllVideos((prev) =>
//         prev.filter((video) => video.requestId !== requestId)
//       );
//     } catch (error) {
//       console.error("Error deleting video:", error);
//     }
//   };

//   return (
//     <div className="p-6 min-h-screen bg-white text-black">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex justify-between items-center mb-8">
//           <h2 className="text-3xl font-bold text-gray-900">
//             Omnigen Content Studio
//           </h2>
//           <button className="bg-[#65558F] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#65558F]/90 transition-colors">
//             Upgrade Plan
//           </button>
//         </div>

// <nav className="flex space-x-6 border-b pb-2 mb-6">
//   <button
//     className={`text-lg font-medium ${
//       mode === "text"
//         ? "text-[#65558F] border-b-2 border-[#65558F]"
//         : "text-gray-500"
//     }`}
//     onClick={() => setMode("text")}
//   >
//     Text to Video
//   </button>
//   <button
//     className={`text-lg font-medium ${
//       mode === "image"
//         ? "text-[#65558F] border-b-2 border-[#65558F]"
//         : "text-gray-500"
//     }`}
//     onClick={() => setMode("image")}
//   >
//     Text to Image
//   </button>
//   <button
//     className={`text-lg font-medium ${
//       mode === "video"
//         ? "text-[#65558F] border-b-2 border-[#65558F]"
//         : "text-gray-500"
//     }`}
//     onClick={() => setMode("video")}
//   >
//     Image to Video
//   </button>
// </nav>

//         <main className="grid gap-8">
//           <section className="p-8 rounded-2xl shadow-md border border-gray-300 bg-[#65558F] bg-opacity-[0.08]">
//             <h2 className="text-gray-900 mb-4 text-2xl font-semibold flex items-center gap-2">
//               <span>💡</span> {mode === "video" ? "Image Input" : "Prompt"}
//             </h2>

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
//               <div className="relative mb-6">
//                 <textarea
//                   className="w-full p-4 bg-white text-black focus:outline-none focus:border-[#A5FFD6] rounded-xl min-h-[120px] pr-[100px]"
//                   placeholder={
//                     mode === "text"
//                       ? "Describe your video idea..."
//                       : "Describe the image you want to generate..."
//                   }
//                   value={prompt}
//                   onChange={(e) => setPrompt(e.target.value)}
//                 />
//                 {(mode === "text" || mode === "image") && (
//                   <div className="absolute right-2 bottom-4">
//                     <button
//                       className="bg-[#65558F] text-white px-4 py-2 rounded-lg font-medium
//                       hover:scale-105 transition-transform active:scale-95 disabled:opacity-50 disabled:transform-none
//                       flex items-center gap-2 text-sm shadow-lg shadow-[#65558F]"
//                       onClick={handleEnhancePrompt}
//                       disabled={loading}
//                     >
//                       {loading ? "Enhancing..." : "✨ Prompt"}
//                     </button>
//                   </div>
//                 )}
//               </div>
//             )}

//             {(mode === "text" || mode === "video") && (
//               <div className="space-y-6 mb-8">
//                 <h3 className="text-xl font-semibold text-gray-900">
//                   Video Parameters
//                 </h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//                   <div className="space-y-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                       Duration
//                     </label>
//                     <select
//                       value={duration}
//                       onChange={(e) => setDuration(Number(e.target.value))}
//                       className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg bg-white focus:border-[#A5FFD6] focus:ring-1 focus:ring-[#A5FFD6]"
//                     >
//                       {[5, 10].map((dur) => (
//                         <option key={dur} value={dur}>
//                           {dur} seconds
//                         </option>
//                       ))}
//                     </select>
//                   </div>
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
//               className="bg-[#A5FFD6] text-black px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-transform hover:scale-105 shadow-lg shadow-green-500/50 disabled:opacity-50"
//               onClick={handleGenerate}
//               disabled={loading}
//             >
//               {loading ? (
//                 <>
//                   <span className="animate-spin">⏳</span>
//                   Generating...
//                 </>
//               ) : (
//                 <>
//                   <span>✨</span>
//                   {mode === "video" ? "Generate Video" : "Generate"}
//                 </>
//               )}
//             </button>
//           </section>

//           {/*
//             Only show the generated videos section if the current mode is "text".
//             This ensures it does NOT appear in the "image" or "video" tabs.
//           */}
//           {mode === "text" && (
//             <section className="p-6 border border-gray-300 rounded-xl bg-[#65558F] bg-opacity-[0.08] min-h-[400px]">
//               {/* Heading above the generated cards */}
//               <h3 className="text-xl font-semibold mb-4">Generated videos:</h3>

//               {loading ? (
//                 <div className="flex items-center justify-center w-full h-full">
//                   <div className="animate-pulse text-gray-600">
//                     Generating...
//                   </div>
//                 </div>
//               ) : allVideos.length > 0 ? (
//                 <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
//                   {allVideos.map((video, index) => (
//                     <div
//                       key={index}
//                       className="relative bg-white rounded-lg shadow p-4 text-black"
//                     >
//                       {/*
//                         Show a placeholder if the video is NOT "completed".
//                         For example, if your backend returns statuses like
//                         "pending", "inprogress", "completed", "failed".
//                       */}
//                       {video.status === "completed" ? (
//                         <video
//                           src={video.videoUrl}
//                           controls
//                           className="w-full h-auto rounded-lg"
//                         />
//                       ) : (
//                         <div className="w-full h-40 flex items-center justify-center bg-gray-100 rounded-lg">
//                           {video.status === "failed" ? (
//                             <p className="text-red-500">Generation failed</p>
//                           ) : (
//                             <p className="text-gray-500">
//                               Generating... ({video.status})
//                             </p>
//                           )}
//                         </div>
//                       )}
//                       <p className="mt-2 text-sm text-gray-700">
//                         {video.prompt || `Generated Video ${index + 1}`}
//                       </p>
//                       {/* Show the status below */}
//                       <p className="text-xs text-gray-500">
//                         Status: {video.status || "unknown"}
//                       </p>
//                       <button
//                         className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 w-6 h-6 flex items-center justify-center"
//                         onClick={() => handleDeleteVideo(video.requestId)}
//                       >
//                         <DeleteIcon fontSize="small" />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="flex items-center justify-center w-full h-full">
//                   <p className="text-gray-600">
//                     Your generated video will appear here
//                   </p>
//                 </div>
//               )}
//             </section>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default OmnigenUI;

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  fetchAllTextToVideosService,
  generateTextToVideoService,
  enhancePromptService,
  deleteVideoService,
} from "../../../api/services/videoGenerateServices";
import DeleteIcon from "@mui/icons-material/Delete";

const OmnigenUI = () => {
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState<"text" | "image" | "video">("text");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState(5);
  const [allVideos, setAllVideos] = useState<any[]>([]);
  const [displayCount, setDisplayCount] = useState(6);
  const [expandedPrompts, setExpandedPrompts] = useState<
    Record<number, boolean>
  >({});

  useEffect(() => {
    const loadAllVideos = async () => {
      try {
        setLoading(true);
        const fetched = await fetchAllTextToVideosService();
        setAllVideos(fetched.data);
      } catch (error) {
        console.error("Error loading videos:", error);
      } finally {
        setLoading(false);
      }
    };

    if (mode === "text") loadAllVideos();
  }, [mode]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleEnhancePrompt = async () => {
    let requestType = "";
    if (mode === "text") {
      requestType = "ttv";
    } else if (mode === "image") {
      requestType = "tti";
    } else {
      return;
    }

    try {
      setLoading(true);
      const response = await enhancePromptService({
        userPrompt: prompt,
        type: requestType,
      });

      if (response.enhancedPrompt) {
        setPrompt(response.enhancedPrompt);
      }
    } catch (error) {
      console.error("Error enhancing prompt:", error);
      alert("Error enhancing prompt. Please try again.");
    } finally {
      setLoading(false);
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
        const response = await generateTextToVideoService({ prompt, duration });
        setVideoUrl(response.videoUrl);
        const fetchedVideos = await fetchAllTextToVideosService();
        setAllVideos(fetchedVideos.data);
      }
    } catch {
      alert("Error generating content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVideo = async (requestId: string) => {
    try {
      await deleteVideoService(requestId);
      setAllVideos((prev) =>
        prev.filter((video) => video.requestId !== requestId)
      );
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  const togglePromptExpansion = (index: number) => {
    setExpandedPrompts((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="p-6 min-h-screen bg-white text-black font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tighter bg-gradient-to-r from-[#65558F] to-[#4D3C77] bg-clip-text text-transparent">
            Omnigen Content Studio
          </h2>
          <button className="bg-gradient-to-r from-[#65558F] to-[#4D3C77] text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity shadow-lg active:scale-95">
            Upgrade Plan
          </button>
        </div>

        <nav className="flex space-x-6 border-b pb-2 mb-6">
          {["text", "image", "video"].map((m) => (
            <button
              key={m}
              className={`text-lg font-medium pb-2 transition-all ${
                mode === m
                  ? "text-[#65558F] border-b-4 border-[#65558F]"
                  : "text-gray-500 hover:text-[#65558F]/80"
              }`}
              onClick={() => setMode(m as any)}
            >
              {m === "video"
                ? "Image to Video"
                : m === "image"
                ? "Text to Image"
                : "Text to Video"}
            </button>
          ))}
        </nav>

        <main className="grid gap-8">
          <section className="p-8 rounded-3xl shadow-xl border border-gray-200 bg-gradient-to-br from-white to-[#f8f7ff]">
            <h2 className="text-gray-900 mb-4 text-2xl font-semibold flex items-center gap-2">
              <span className="bg-gradient-to-r from-[#65558F] to-[#4D3C77] bg-clip-text text-transparent">
                {mode === "video" ? "📸 Image Input" : "💡 Creative Prompt"}
              </span>
            </h2>

            {mode === "video" ? (
              <div className="mb-6">
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-white hover:border-[#65558F] transition-colors group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <div className="w-12 h-12 mb-4 bg-[#65558F]/10 group-hover:bg-[#65558F]/20 rounded-full flex items-center justify-center transition-colors">
                      <svg
                        className="w-6 h-6 text-[#65558F]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <p className="mb-2 text-sm text-gray-600">
                      <span className="font-semibold text-[#65558F]">
                        Click to upload
                      </span>{" "}
                      or drag and drop
                    </p>
                    <p className="text-xs text-gray-400">
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
                      className="max-h-48 rounded-xl mx-auto shadow-md"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="relative mb-6">
                <textarea
                  className="w-full p-4 bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#A5FFD6] rounded-2xl min-h-[120px] pr-[100px] border-2 border-gray-200 transition-all"
                  placeholder={
                    mode === "text"
                      ? "Describe your video idea..."
                      : "Describe the image you want to generate..."
                  }
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                {(mode === "text" || mode === "image") && (
                  <div className="absolute right-2 bottom-4">
                    <button
                      className="bg-gradient-to-r from-[#65558F] to-[#4D3C77] text-white px-4 py-2 rounded-xl font-medium 
                      hover:scale-105 transition-transform active:scale-95 disabled:opacity-50
                      flex items-center gap-2 text-sm shadow-lg"
                      onClick={handleEnhancePrompt}
                      disabled={loading}
                    >
                      {loading ? "✨ Enhancing..." : "✨ Enhance Prompt"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {(mode === "text" || mode === "video") && (
              <div className="space-y-6 mb-8">
                <h3 className="text-xl font-semibold text-gray-800">
                  Video Parameters
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-600">
                      Duration
                    </label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-white focus:border-[#A5FFD6] focus:ring-1 focus:ring-[#A5FFD6] transition-colors"
                    >
                      {[5, 10].map((dur) => (
                        <option key={dur} value={dur}>
                          {dur} seconds
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            <button
              className="bg-gradient-to-r from-[#A5FFD6] to-[#7FE8C4] text-gray-900 px-8 py-4 rounded-xl font-semibold flex items-center gap-2 
              transition-transform hover:scale-105 shadow-lg shadow-green-500/30 disabled:opacity-50 group w-full justify-center"
              onClick={handleGenerate}
              disabled={loading}
            >
              <span className="group-hover:rotate-180 transition-transform">
                ✨
              </span>
              {loading ? (
                <span className="animate-pulse">Generating...</span>
              ) : mode === "video" ? (
                "Render Video"
              ) : (
                "Create Magic"
              )}
            </button>
          </section>

          {mode === "text" && (
            <section className="p-6 border border-gray-200 rounded-2xl bg-white shadow-sm">
              <h3 className="text-xl font-semibold mb-6 text-gray-800">
                Generated Content
              </h3>

              {loading ? (
                <div className="flex items-center justify-center h-48">
                  <div className="animate-pulse text-gray-600">
                    Loading creations...
                  </div>
                </div>
              ) : allVideos.length > 0 ? (
                <>
                  <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {allVideos.slice(0, displayCount).map((video, index) => (
                      <div
                        key={index}
                        className="relative bg-white rounded-xl shadow-lg p-4 text-black transition-all hover:shadow-xl hover:-translate-y-1"
                      >
                        {video.status === "completed" ? (
                          <video
                            src={video.videoUrl}
                            controls
                            className="w-full h-48 object-cover rounded-lg mb-4"
                          />
                        ) : (
                          <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-lg mb-4">
                            <div className="animate-pulse text-gray-500 text-sm">
                              {video.status}...
                            </div>
                          </div>
                        )}

                        <div className="relative">
                          <p className="text-sm text-gray-700 pr-8">
                            {expandedPrompts[index]
                              ? video.prompt
                              : `${video.prompt.substring(0, 100)}${
                                  video.prompt.length > 100 ? "..." : ""
                                }`}
                          </p>
                          {video.prompt.length > 100 && (
                            <button
                              className="absolute top-0 right-0 text-[#65558F] hover:text-[#4D3C77] font-medium text-sm"
                              onClick={() => togglePromptExpansion(index)}
                            >
                              {expandedPrompts[index]
                                ? "Show less"
                                : "Show more"}
                            </button>
                          )}
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#65558F]/10 text-[#65558F]">
                            {video.status}
                          </span>
                          <button
                            className="p-1.5 hover:bg-red-100 rounded-full transition-colors"
                            onClick={() => handleDeleteVideo(video.requestId)}
                          >
                            <DeleteIcon
                              className="text-red-500 hover:text-red-600"
                              fontSize="small"
                            />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {allVideos.length > displayCount && (
                    <div className="flex justify-center mt-8">
                      <button
                        onClick={() => setDisplayCount((prev) => prev + 6)}
                        className="bg-gradient-to-r from-[#65558F] to-[#4D3C77] text-white px-6 py-3 rounded-xl font-medium 
                        hover:opacity-90 transition-opacity active:scale-95"
                      >
                        Load More...
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-48">
                  <p className="text-gray-500">
                    Your creative visions will materialize here
                  </p>
                </div>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default OmnigenUI;
