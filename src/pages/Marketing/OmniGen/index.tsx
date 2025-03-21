 
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useEffect, useState } from "react";
// import {
//   fetchAllTextToVideosService,
//   generateTextToVideoService,
//   enhancePromptService,
//   deleteVideoService,
//   deleteImageService,
//   fetchAllTextToImagesService,
//   generateTextToImageService,
// } from "../../../api/services/videoGenerateServices";
// import DeleteIcon from "@mui/icons-material/Delete";

// const OmnigenUI = () => {
//   const [prompt, setPrompt] = useState("");
//   const [mode, setMode] = useState<"text" | "image" | "video">("text");
//   const [uploadedImage, setUploadedImage] = useState<File | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [videoUrl, setVideoUrl] = useState<string | null>(null);
//   const [imageUrl, setImageUrl] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [duration, setDuration] = useState(5);
//   const [allVideos, setAllVideos] = useState<any[]>([]);
//   const [allImages, setAllImages] = useState<any[]>([]);
//   const [displayCount, setDisplayCount] = useState(6);
//   const [aspectRatio, setAspectRatio] = useState("1:1");
//   const [numberOfImages, setNumberOfImages] = useState(1);

//   const [expandedPrompts, setExpandedPrompts] = useState<
//     Record<number, boolean>
//   >({});

//   useEffect(() => {
//     const loadContent = async () => {
//       try {
//         setLoading(true);
//         if (mode === "text") {
//           const fetched = await fetchAllTextToVideosService();
//           setAllVideos(fetched.data);
//         } else if (mode === "image") {
//           const fetched = await fetchAllTextToImagesService();
//           setAllImages(fetched.data);
//         }
//       } catch (error) {
//         console.error(
//           `Error loading ${mode === "text" ? "videos" : "images"}:`,
//           error
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (mode === "text" || mode === "image") loadContent();
//   }, [mode]);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setUploadedImage(file);
//       setPreviewUrl(URL.createObjectURL(file));
//     }
//   };

//   const handleEnhancePrompt = async () => {
//     let requestType = "";
//     if (mode === "text") {
//       requestType = "ttv";
//     } else if (mode === "image") {
//       requestType = "tti";
//     } else {
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
//     if ((mode === "text" || mode === "image") && prompt.trim() === "") {
//       alert("Please enter a text prompt.");
//       return;
//     }
//     if (mode === "video" && !uploadedImage) {
//       alert("Please upload an image.");
//       return;
//     }

//     console.log("video", videoUrl);
//     console.log("image", imageUrl);

//     setLoading(true);
//     setVideoUrl(null);
//     setImageUrl(null);

//     try {
//       if (mode === "text") {
//         const response = await generateTextToVideoService({ prompt, duration });
//         setVideoUrl(response.videoUrl);
//         const fetchedVideos = await fetchAllTextToVideosService();
//         setAllVideos(fetchedVideos.data);
//       } else if (mode === "image") {
//         const response = await generateTextToImageService({
//           prompt,
//           aspect_ratio: aspectRatio,
//           number_of_images: numberOfImages,
//         });
//         setImageUrl(response.imageUrl);
//         const fetchedImages = await fetchAllTextToImagesService();
//         setAllImages(fetchedImages.data);
//       }
//       // Note: Video mode implementation remains the same
//     } catch {
//       alert("Error generating content. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteContent = async (id: string) => {
//     try {
//       if (mode === "text") {
//         // For videos, use requestId
//         await deleteVideoService(id);
//         setAllVideos((prev) => prev.filter((video) => video.requestId === id));
//       } else if (mode === "image") {
//         // For images, use _id
//         await deleteImageService(id);
//         setAllImages((prev) => prev.filter((image) => image._id === id));
//       }
//     } catch (error) {
//       console.error(
//         `Error deleting ${mode === "text" ? "video" : "image"}:`,
//         error
//       );
//     }
//   };

//   const togglePromptExpansion = (index: number) => {
//     setExpandedPrompts((prev) => ({ ...prev, [index]: !prev[index] }));
//   };

//   return (
//     <div className="p-6 min-h-screen bg-white text-black font-sans">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex justify-between items-center mb-8">
//           <h2 className="text-3xl font-bold text-gray-900 tracking-tighter bg-gradient-to-r from-[#65558F] to-[#4D3C77] bg-clip-text text-transparent">
//             Omnigen Content Studio
//           </h2>
//           <button className="bg-gradient-to-r from-[#65558F] to-[#4D3C77] text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity shadow-lg active:scale-95">
//             Upgrade Plan
//           </button>
//         </div>

//         <nav className="flex space-x-6 border-b pb-2 mb-6">
//           {["text", "image", "video"].map((m) => (
//             <button
//               key={m}
//               className={`text-lg font-medium pb-2 transition-all ${
//                 mode === m
//                   ? "text-[#65558F] border-b-4 border-[#65558F]"
//                   : "text-gray-500 hover:text-[#65558F]/80"
//               }`}
//               onClick={() => setMode(m as any)}
//             >
//               {m === "video"
//                 ? "Image to Video"
//                 : m === "image"
//                 ? "Text to Image"
//                 : "Text to Video"}
//             </button>
//           ))}
//         </nav>

//         <main className="grid gap-8">
//           <section className="p-8 rounded-3xl shadow-xl border border-gray-200 bg-gradient-to-br from-white to-[#f8f7ff]">
//             <h2 className="text-gray-900 mb-4 text-2xl font-semibold flex items-center gap-2">
//               <span className="bg-gradient-to-r from-[#65558F] to-[#4D3C77] bg-clip-text text-transparent">
//                 {mode === "video" ? "📸 Image Input" : "💡 Creative Prompt"}
//               </span>
//             </h2>

//             {mode === "video" ? (
//               <div className="mb-6">
//                 <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-white hover:border-[#65558F] transition-colors group">
//                   <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                     <div className="w-12 h-12 mb-4 bg-[#65558F]/10 group-hover:bg-[#65558F]/20 rounded-full flex items-center justify-center transition-colors">
//                       <svg
//                         className="w-6 h-6 text-[#65558F]"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth="2"
//                           d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
//                         />
//                       </svg>
//                     </div>
//                     <p className="mb-2 text-sm text-gray-600">
//                       <span className="font-semibold text-[#65558F]">
//                         Click to upload
//                       </span>{" "}
//                       or drag and drop
//                     </p>
//                     <p className="text-xs text-gray-400">
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
//                       className="max-h-48 rounded-xl mx-auto shadow-md"
//                     />
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <div className="relative mb-6">
//                 <textarea
//                   className="w-full p-4 bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#A5FFD6] rounded-2xl min-h-[120px] pr-[100px] border-2 border-gray-200 transition-all"
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
//                       className="bg-gradient-to-r from-[#65558F] to-[#4D3C77] text-white px-4 py-2 rounded-xl font-medium
//                       hover:scale-105 transition-transform active:scale-95 disabled:opacity-50
//                       flex items-center gap-2 text-sm shadow-lg"
//                       onClick={handleEnhancePrompt}
//                       disabled={loading}
//                     >
//                       {loading ? "✨ Enhancing..." : "✨ Enhance Prompt"}
//                     </button>
//                   </div>
//                 )}
//               </div>
//             )}

//             {(mode === "text" || mode === "video") && (
//               <div className="space-y-6 mb-8">
//                 <h3 className="text-xl font-semibold text-gray-800">
//                   Video Parameters
//                 </h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//                   <div className="space-y-2">
//                     <label className="block text-sm font-medium text-gray-600">
//                       Duration
//                     </label>
//                     <select
//                       value={duration}
//                       onChange={(e) => setDuration(Number(e.target.value))}
//                       className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-white focus:border-[#A5FFD6] focus:ring-1 focus:ring-[#A5FFD6] transition-colors"
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

//             {mode === "image" && (
//               <div className="space-y-6 mb-8">
//                 <h3 className="text-xl font-semibold text-gray-800">
//                   Image Parameters
//                 </h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//                   <div className="space-y-2">
//                     <label className="block text-sm font-medium text-gray-600">
//                       Aspect Ratio
//                     </label>
//                     <select
//                       value={aspectRatio}
//                       onChange={(e) => setAspectRatio(e.target.value)}
//                       className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl"
//                     >
//                       <option value="1:1">Square (1:1)</option>
//                       {/* <option value="3:4">Vertical (3:4)</option>
//                       <option value="4:3">Standard (4:3)</option> */}
//                       <option value="16:9">Widescreen (16:9)</option>
//                       {/* <option value="9:16">Portrait (9:16)</option> */}
//                     </select>
//                   </div>
//                   <div className="space-y-2">
//                     <label className="block text-sm font-medium text-gray-600">
//                       Number of Images
//                     </label>
//                     <input
//                       type="number"
//                       min="1"
//                       max="4"
//                       value={numberOfImages}
//                       onChange={(e) =>
//                         setNumberOfImages(Number(e.target.value))
//                       }
//                       className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl"
//                     />
//                   </div>
//                 </div>
//               </div>
//             )}

//             <button
//               className="bg-gradient-to-r from-[#A5FFD6] to-[#7FE8C4] text-gray-900 px-8 py-4 rounded-xl font-semibold flex items-center gap-2
//               transition-transform hover:scale-105 shadow-lg shadow-green-500/30 disabled:opacity-50 group w-full justify-center"
//               onClick={handleGenerate}
//               disabled={loading}
//             >
//               <span className="group-hover:rotate-180 transition-transform">
//                 ✨
//               </span>
//               {loading ? (
//                 <span className="animate-pulse">Generating...</span>
//               ) : mode === "video" ? (
//                 "Render Video"
//               ) : (
//                 "Create Magic"
//               )}
//             </button>
//           </section>

//           {mode === "text" && (
//             <section className="p-6 border border-gray-200 rounded-2xl bg-white shadow-sm">
//               <h3 className="text-xl font-semibold mb-6 text-gray-800">
//                 Generated Content
//               </h3>

//               {loading ? (
//                 <div className="flex items-center justify-center h-48">
//                   <div className="animate-pulse text-gray-600">
//                     Loading creations...
//                   </div>
//                 </div>
//               ) : allVideos.length > 0 ? (
//                 <>
//                   <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
//                     {allVideos.slice(0, displayCount).map((video, index) => (
//                       <div
//                         key={index}
//                         className="relative bg-white rounded-xl shadow-lg p-4 text-black transition-all hover:shadow-xl hover:-translate-y-1"
//                       >
//                         {video.status === "completed" ? (
//                           <video
//                             src={video.videoUrl}
//                             controls
//                             className="w-full h-48 object-cover rounded-lg mb-4"
//                           />
//                         ) : (
//                           <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-lg mb-4">
//                             <div className="animate-pulse text-gray-500 text-sm">
//                               {video.status}...
//                             </div>
//                           </div>
//                         )}

//                         <div className="relative">
//                           <p className="text-base text-gray-700 mt-2 font-semibold pr-8">
//                             {expandedPrompts[index]
//                               ? video.prompt
//                               : `${video.prompt.substring(0, 100)}${
//                                   video.prompt.length > 100 ? "..." : ""
//                                 }`}
//                           </p>
//                           {video.prompt.length > 100 && (
//                             <button
//                               className="absolute top-0 right-0 text-[#65558F] hover:text-[#4D3C77] font-medium text-sm"
//                               onClick={() => togglePromptExpansion(index)}
//                             >
//                               {expandedPrompts[index]
//                                 ? "Show less"
//                                 : "Show more"}
//                             </button>
//                           )}
//                         </div>

//                         <div className="mt-4 flex items-center justify-between">
//                           <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#65558F]/10 text-[#65558F]">
//                             {video.status}
//                           </span>
//                           <button
//                             className="p-1.5 hover:bg-red-100 rounded-full transition-colors"
//                             onClick={() => handleDeleteContent(video.requestId)}
//                           >
//                             <DeleteIcon
//                               className="text-red-500 hover:text-red-600"
//                               fontSize="small"
//                             />
//                           </button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   {allVideos.length > displayCount && (
//                     <div className="flex justify-center mt-8">
//                       <button
//                         onClick={() => setDisplayCount((prev) => prev + 6)}
//                         className="bg-gradient-to-r from-[#65558F] to-[#4D3C77] text-white px-6 py-3 rounded-xl font-medium
//                         hover:opacity-90 transition-opacity active:scale-95"
//                       >
//                         Load More...
//                       </button>
//                     </div>
//                   )}
//                 </>
//               ) : (
//                 <div className="flex items-center justify-center h-48">
//                   <p className="text-gray-500">
//                     Your creative visions will materialize here
//                   </p>
//                 </div>
//               )}
//             </section>
//           )}

//           {mode === "image" && (
//             <section className="p-6 border border-gray-200 rounded-2xl bg-white shadow-sm">
//               <h3 className="text-xl font-semibold mb-6 text-gray-800">
//                 Generated Images
//               </h3>

//               {loading ? (
//                 <div className="flex items-center justify-center h-48">
//                   <div className="animate-pulse text-gray-600">
//                     Loading creations...
//                   </div>
//                 </div>
//               ) : allImages.length > 0 ? (
//                 <>
//                   <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
//                     {allImages.slice(0, displayCount).map((image, index) => (
//                       <div
//                         key={index}
//                         className="relative bg-white rounded-xl shadow-lg p-4 text-black transition-all hover:shadow-xl hover:-translate-y-1"
//                       >
//                         {image.status === "completed" ? (
//                           <div className="grid grid-cols-1 gap-2">
//                             {image.images.map(
//                               (imgUrl: string, imgIndex: number) => (
//                                 <img
//                                   key={`${image._id}-${imgIndex}`}
//                                   src={imgUrl}
//                                   alt={`Generated image ${
//                                     imgIndex + 1
//                                   } for: ${image.prompt.substring(0, 30)}...`}
//                                   className="w-full h-48 object-cover rounded-lg"

//                                 />
//                               )
//                             )}
//                           </div>
//                         ) : (
//                           <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-lg mb-4">
//                             <div className="animate-pulse text-gray-500 text-sm">
//                               {image.status}...
//                             </div>
//                           </div>
//                         )}

//                         <div className="relative">
//                           <p className="text-base text-gray-700 mt-2 font-semibold pr-8">
//                             {expandedPrompts[index]
//                               ? image.prompt
//                               : `${image.prompt.substring(0, 100)}${
//                                   image.prompt.length > 100 ? "..." : ""
//                                 }`}
//                           </p>
//                           {image.prompt.length > 100 && (
//                             <button
//                               className="absolute top-0 right-0 text-[#65558F] hover:text-[#4D3C77] font-medium text-sm"
//                               onClick={() => togglePromptExpansion(index)}
//                             >
//                               {expandedPrompts[index]
//                                 ? "Show less"
//                                 : "Show more"}
//                             </button>
//                           )}
//                         </div>

//                         <div className="mt-4 flex items-center justify-between">
//                           <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#65558F]/10 text-[#65558F]">
//                             {image.status}
//                           </span>
//                           <button
//                             className="p-1.5 hover:bg-red-100 rounded-full transition-colors"
//                             onClick={() => handleDeleteContent(image._id)}
//                           >
//                             <DeleteIcon
//                               className="text-red-500 hover:text-red-600"
//                               fontSize="small"
//                             />
//                           </button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   {allImages.length > displayCount && (
//                     <div className="flex justify-center mt-8">
//                       <button
//                         onClick={() => setDisplayCount((prev) => prev + 6)}
//                         className="bg-gradient-to-r from-[#65558F] to-[#4D3C77] text-white px-6 py-3 rounded-xl font-medium
//                         hover:opacity-90 transition-opacity active:scale-95"
//                       >
//                         Load More...
//                       </button>
//                     </div>
//                   )}
//                 </>
//               ) : (
//                 <div className="flex items-center justify-center h-48">
//                   <p className="text-gray-500">
//                     Your creative visions will materialize here
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
  deleteImageService,
  fetchAllTextToImagesService,
  generateTextToImageService,
} from "../../../api/services/videoGenerateServices";
import DeleteIcon from "@mui/icons-material/Delete";

const OmnigenUI = () => {
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState<"text" | "image" | "video">("text");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState(5);
  const [allVideos, setAllVideos] = useState<any[]>([]);
  const [allImages, setAllImages] = useState<any[]>([]);
  const [displayCount, setDisplayCount] = useState(6);
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [numberOfImages, setNumberOfImages] = useState(1);

  // State to control expanding/collapsing prompts
  const [expandedPrompts, setExpandedPrompts] = useState<
    Record<number, boolean>
  >({});

  // State to show a selected image in fullscreen
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        if (mode === "text") {
          const fetched = await fetchAllTextToVideosService();
          setAllVideos(fetched.data);
        } else if (mode === "image") {
          const fetched = await fetchAllTextToImagesService();
          setAllImages(fetched.data);
        }
      } catch (error) {
        console.error(
          `Error loading ${mode === "text" ? "videos" : "images"}:`,
          error
        );
      } finally {
        setLoading(false);
      }
    };

    if (mode === "text" || mode === "image") loadContent();
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
    if ((mode === "text" || mode === "image") && prompt.trim() === "") {
      alert("Please enter a text prompt.");
      return;
    }
    if (mode === "video" && !uploadedImage) {
      alert("Please upload an image.");
      return;
    }

    console.log('video' , videoUrl)
    console.log('image' , imageUrl)

    setLoading(true);
    setVideoUrl(null);
    setImageUrl(null);

    try {
      if (mode === "text") {
        const response = await generateTextToVideoService({ prompt, duration });
        setVideoUrl(response.videoUrl);
        const fetchedVideos = await fetchAllTextToVideosService();
        setAllVideos(fetchedVideos.data);
      } else if (mode === "image") {
        const response = await generateTextToImageService({
          prompt,
          aspect_ratio: aspectRatio,
          number_of_images: numberOfImages,
        });
        setImageUrl(response.imageUrl);
        const fetchedImages = await fetchAllTextToImagesService();
        setAllImages(fetchedImages.data);
      }
      // If there's a separate flow for "video" (Image-to-Video), handle it similarly here.
    } catch {
      alert("Error generating content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContent = async (id: string) => {
    try {
      if (mode === "text") {
        // For videos, use requestId
        await deleteVideoService(id);
        setAllVideos((prev) => prev.filter((video) => video.requestId === id));
      } else if (mode === "image") {
        // For images, use _id
        await deleteImageService(id);
        setAllImages((prev) => prev.filter((image) => image._id === id));
      }
    } catch (error) {
      console.error(
        `Error deleting ${mode === "text" ? "video" : "image"}:`,
        error
      );
    }
  };

  const togglePromptExpansion = (index: number) => {
    setExpandedPrompts((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // Handle opening the image in fullscreen
  const handleImageClick = (imgUrl: string) => {
    setSelectedImageUrl(imgUrl);
  };

  // Handle closing the fullscreen modal
  const handleCloseModal = () => {
    setSelectedImageUrl(null);
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
          {/* Prompt or Image Upload */}
          <section className="p-8 rounded-3xl shadow-xl border border-gray-200 bg-gradient-to-br from-white to-[#f8f7ff]">
            <h2 className="text-gray-900 mb-4 text-2xl font-semibold flex items-center gap-2">
              <span className="bg-gradient-to-r from-[#65558F] to-[#4D3C77] bg-clip-text text-transparent">
                {mode === "video" ? "📸 Image Input" : "💡 Creative Prompt"}
              </span>
            </h2>

            {/* For Image-to-Video */}
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
              /* For Text-to-Video or Text-to-Image */
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

            {/* Video Parameters */}
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

            {/* Image Parameters */}
            {mode === "image" && (
              <div className="space-y-6 mb-8">
                <h3 className="text-xl font-semibold text-gray-800">
                  Image Parameters
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-600">
                      Aspect Ratio
                    </label>
                    <select
                      value={aspectRatio}
                      onChange={(e) => setAspectRatio(e.target.value)}
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl"
                    >
                      <option value="1:1">Square (1:1)</option>
                      <option value="16:9">Widescreen (16:9)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-600">
                      Number of Images
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="4"
                      value={numberOfImages}
                      onChange={(e) =>
                        setNumberOfImages(Number(e.target.value))
                      }
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl"
                    />
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

          {/* Render Text-to-Video Results */}
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
                          <p className="text-base text-gray-700 mt-2 font-semibold pr-8">
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
                            onClick={() => handleDeleteContent(video.requestId)}
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

          {/* Render Text-to-Image Results */}
          {mode === "image" && (
            <section className="p-6 border border-gray-200 rounded-2xl bg-white shadow-sm">
              <h3 className="text-xl font-semibold mb-6 text-gray-800">
                Generated Images
              </h3>

              {loading ? (
                <div className="flex items-center justify-center h-48">
                  <div className="animate-pulse text-gray-600">
                    Loading creations...
                  </div>
                </div>
              ) : allImages.length > 0 ? (
                <>
                  <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {allImages.slice(0, displayCount).map((image, index) => (
                      <div
                        key={index}
                        className="relative bg-white rounded-xl shadow-lg p-4 text-black transition-all hover:shadow-xl hover:-translate-y-1"
                      >
                        {image.status === "completed" ? (
                          <div className="grid grid-cols-1 gap-2">
                            {image.images.map(
                              (imgUrl: string, imgIndex: number) => (
                                <img
                                  key={`${image._id}-${imgIndex}`}
                                  src={imgUrl}
                                  alt={`Generated image ${
                                    imgIndex + 1
                                  } for: ${image.prompt.substring(0, 30)}...`}
                                  className="w-full h-48 object-cover rounded-lg cursor-pointer"
                                  // When user clicks an image, open it in fullscreen
                                  onClick={() => handleImageClick(imgUrl)}
                                />
                              )
                            )}
                          </div>
                        ) : (
                          <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-lg mb-4">
                            <div className="animate-pulse text-gray-500 text-sm">
                              {image.status}...
                            </div>
                          </div>
                        )}

                        <div className="relative">
                          <p className="text-base text-gray-700 mt-2 font-semibold pr-8">
                            {expandedPrompts[index]
                              ? image.prompt
                              : `${image.prompt.substring(0, 100)}${
                                  image.prompt.length > 100 ? "..." : ""
                                }`}
                          </p>
                          {image.prompt.length > 100 && (
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
                            {image.status}
                          </span>
                          <button
                            className="p-1.5 hover:bg-red-100 rounded-full transition-colors"
                            onClick={() => handleDeleteContent(image._id)}
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

                  {allImages.length > displayCount && (
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

      {/* Fullscreen Image Modal */}
      {selectedImageUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
          onClick={handleCloseModal}
        >
          <div
            className="relative max-w-5xl max-h-[90%] overflow-auto"
            onClick={(e) => e.stopPropagation()} // Prevent background clicks from closing
          >
            {/* The image displayed in fullscreen */}
            <img
              src={selectedImageUrl}
              alt="Fullscreen"
              className="max-w-full max-h-full rounded-md"
            />

            {/* Close & Download buttons at the top-right */}
            <div className="absolute top-4 right-4 flex items-center space-x-2">
              <a
                href={selectedImageUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#65558F] text-white px-3 py-2 rounded hover:bg-green-700 transition"
              >
                Download
              </a>
              <button
                onClick={handleCloseModal}
                className="bg-gray-900 bg-opacity-50 text-white px-3 py-2 rounded hover:bg-opacity-70 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OmnigenUI;
