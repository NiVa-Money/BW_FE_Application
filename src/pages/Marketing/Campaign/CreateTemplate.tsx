// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useEffect, useState } from "react";
// import { uploadWhatsAppMediaService } from "../../../api/services/whatsappCampaignService";
// import {
//   fetchAllTextToImagesService,
//   fetchAllTextToVideosService,
// } from "../../../api/services/videoGenerateServices";

// interface TemplateButton {
//   type: "quick_reply" | "call_to_action";
//   text: string;
//   ctaType?: "url" | "phone";
//   url?: string;
//   phoneNumber?: string;
// }

// interface CreateTemplateModalProps {
//   onClose: () => void;
//   onDone: (data: {
//     name: string;
//     header?: {
//       type: string;
//       content: string;
//     };
//     body: {
//       text: string;
//       parameters?: {
//         type: "positional";
//         example: {
//           positional: string[];
//         };
//       };
//     };
//     footer?: {
//       text: string;
//     };
//     buttons: TemplateButton[];
//   }) => void;
//   secretToken: string;
// }

// const CreateTemplateModal: React.FC<CreateTemplateModalProps> = ({
//   onClose,
//   onDone,
//   secretToken,
// }) => {
//   // Field states
//   const [name, setName] = useState("");
//   const [headerType, setHeaderType] = useState("none");
//   const [headerText, setHeaderText] = useState("");
//   const [fileHandle, setFileHandle] = useState<string>("");
//   const [bodyText, setBodyText] = useState("");
//   const [variables, setVariables] = useState<{ id: number; example: string }[]>(
//     []
//   );
//   const [footerText, setFooterText] = useState("");
//   const [buttons, setButtons] = useState<TemplateButton[]>([]);
//   const [mediaSource, setMediaSource] = useState<"upload" | "existing">(
//     "upload"
//   );
//   const [existingMedias, setExistingMedias] = useState<
//     { id: string; url: string; name: string }[]
//   >([]);
//   const [selectedMediaUrl, setSelectedMediaUrl] = useState("");
//   const [mediaUrl, setMediaUrl] = useState<string>("");

//   // Error states (for inline error messages)
//   const [templateNameError, setTemplateNameError] = useState("");
//   const [headerError, setHeaderError] = useState("");
//   const [buttonErrors, setButtonErrors] = useState<{ [key: number]: string }>(
//     {}
//   );

//   const addVariable = () => {
//     const nextId = variables.length + 1;
//     setBodyText((prev) => prev + ` {{${nextId}}}`);
//     setVariables((prev) => [...prev, { id: nextId, example: "" }]);
//   };

//   const deleteVariable = (id: number) => {
//     setVariables((prev) => prev.filter((v) => v.id !== id));
//     setBodyText((prev) =>
//       prev.replace(new RegExp(`\\{\\{${id}\\}\\}`, "g"), "")
//     );
//   };

//   const updateVariableExample = (id: number, newExample: string) => {
//     setVariables((prev) =>
//       prev.map((v) => (v.id === id ? { ...v, example: newExample } : v))
//     );
//   };

//   useEffect(() => {
//     const fetchMedia = async () => {
//       try {
//         let response: { data: any[] };
//         if (headerType === "image") {
//           response = await fetchAllTextToImagesService();
//           const mediaItems = response.data.flatMap((item: any) =>
//             item.images.map((img: string, index: number) => ({
//               id: `${item._id}-${index}`,
//               url: img,
//               name: `${item.prompt} (${index + 1})`,
//             }))
//           );
//           setExistingMedias(mediaItems);
//         } else if (headerType === "video") {
//           response = await fetchAllTextToVideosService();
//           const mediaItems = response.data.map((item: any) => ({
//             id: item._id,
//             url: item.videoUrl,
//             name: item.prompt,
//           }));
//           setExistingMedias(mediaItems);
//         }
//       } catch {
//         setHeaderError(`Failed to fetch ${headerType}s`);
//       }
//     };

//     if (["image", "video"].includes(headerType) && mediaSource === "existing") {
//       fetchMedia();
//     }
//   }, [mediaSource, headerType, secretToken]);

//   const handleHeaderFileChange = async (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     setHeaderError("");
//     if (!secretToken) {
//       setHeaderError("Missing secret token. Cannot upload file.");
//       return;
//     }

//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       setMediaUrl(URL.createObjectURL(file));
//       const MAX_FILE_SIZE = 2 * 1024 * 1024;
//       if (file.size > MAX_FILE_SIZE) {
//         setHeaderError(
//           "File size exceeds 2 MB limit. Please upload a smaller file."
//         );
//         return;
//       }

//       if (["image", "video", "document"].includes(headerType)) {
//         try {
//           const formData = new FormData();
//           formData.append("file", file);
//           const response = await uploadWhatsAppMediaService({
//             file: file,
//             integrationId: secretToken,
//           });
//           if (response?.fileHandle) {
//             setFileHandle(response.fileHandle);
//             console.log("File uploaded, got handle:", response.fileHandle);
//           } else {
//             throw new Error("File handle missing in response");
//           }
//         } catch (error) {
//           console.error("Header upload failed:", error);
//           setHeaderError("Failed to upload header media.");
//         }
//       }
//     }
//   };

//   const handleExistingMediaSelection = async (mediaUrl: string) => {
//     setSelectedMediaUrl(mediaUrl);
//     setMediaUrl(mediaUrl);
//     setHeaderError("");
//     if (!secretToken) {
//       setHeaderError("Missing secret token. Cannot upload file.");
//       return;
//     }

//     try {
//       const response = await uploadWhatsAppMediaService({
//         mediaUrl,
//         integrationId: secretToken,
//       });
//       if (response?.fileHandle) {
//         setFileHandle(response.fileHandle);
//         setMediaUrl(URL.createObjectURL(file));
//         console.log(
//           "Existing media uploaded, got handle:",
//           response.fileHandle
//         );
//       } else {
//         throw new Error("File handle missing in response");
//       }
//     } catch (error) {
//       console.error("Header upload failed:", error);
//       setHeaderError("Failed to upload header media.");
//     }
//   };

//   const handleHeaderTypeChange = (newType: string) => {
//     setHeaderType(newType);
//     setMediaSource("upload");
//     setSelectedMediaUrl("");
//     setFileHandle("");
//     setMediaUrl("");
//     setHeaderError("");
//   };

//   const handleAddButton = () => {
//     setButtons((prev) => [...prev, { type: "quick_reply", text: "" }]);
//   };

//   const updateButton = (
//     index: number,
//     updatedFields: Partial<TemplateButton>
//   ) => {
//     setButtons((prev) =>
//       prev.map((btn, i) => (i === index ? { ...btn, ...updatedFields } : btn))
//     );
//     // Clear error for this button field on change
//     setButtonErrors((prev) => ({ ...prev, [index]: "" }));
//   };

//   const handleRemoveButton = (index: number) => {
//     setButtons((prev) => prev.filter((_, i) => i !== index));
//     // Remove any errors associated with this button
//     setButtonErrors((prev) => {
//       const copy = { ...prev };
//       delete copy[index];
//       return copy;
//     });
//   };

//   const handleDone = () => {
//     let hasError = false;
//     // Clear previous errors
//     setTemplateNameError("");
//     setButtonErrors({});

//     // Validate template name
//     const templateNameRegex = /^[a-z0-9_]+$/;
//     if (!templateNameRegex.test(name)) {
//       setTemplateNameError(
//         "Template name must contain only lowercase letters, numbers, and underscores."
//       );
//       hasError = true;
//     }

//     // Validate call-to-action buttons with phone numbers
//     const newButtonErrors: { [key: number]: string } = {};
//     buttons.forEach((btn, i) => {
//       if (btn.type === "call_to_action" && btn.ctaType === "phone") {
//         if (!btn.phoneNumber) {
//           newButtonErrors[i] = "Phone number is required.";
//           hasError = true;
//         } else {
//           const phoneRegex = /^\+\d+$/;
//           if (!phoneRegex.test(btn.phoneNumber)) {
//             newButtonErrors[i] =
//               "Invalid phone number. Include country code (e.g., +123456789).";
//             hasError = true;
//           }
//         }
//       }
//     });
//     setButtonErrors(newButtonErrors);

//     if (hasError) return;

//     let header: { type: string; content: string } | undefined;
//     if (headerType !== "none") {
//       header =
//         headerType === "text"
//           ? { type: "TEXT", content: headerText }
//           : { type: headerType.toUpperCase(), content: fileHandle };
//     }

//     const bodyPayload: any = { text: bodyText };
//     const regex = /\{\{\s*(\d+)\s*\}\}/g;
//     const matches = Array.from(bodyText.matchAll(regex));
//     if (matches.length > 0) {
//       const positionalExamples = matches.map((match) => {
//         const id = parseInt(match[1]);
//         const variable = variables.find((v) => v.id === id);
//         return variable ? variable.example : "";
//       });
//       bodyPayload.parameters = {
//         type: "positional",
//         example: {
//           positional: positionalExamples,
//         },
//       };
//     }

//     const formattedButtons = buttons.map((btn) => ({
//       ...btn,
//       type: btn.type,
//     }));

//     onDone({
//       name,
//       header:
//         headerType === "text"
//           ? { type: "TEXT", content: headerText }
//           : { type: headerType.toUpperCase(), content: fileHandle },
//       body: bodyPayload,
//       footer: footerText ? { text: footerText } : undefined,
//       buttons: formattedButtons,
//     });
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center z-50">
//       {/* Modal Backdrop */}
//       <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} />
//       {/* Modal Container */}
//       <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 z-10 max-h-[80vh] overflow-y-auto">
//         <h2 className="text-2xl font-semibold text-gray-800 mb-4">
//           Create WhatsApp Template
//         </h2>

//         {/* Template Name */}
//         <div className="space-y-4">
//           <div>
//             <label className="block text-gray-700 font-medium mb-1">
//               Template Name
//             </label>
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               placeholder="Enter your template name"
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//             />
//             {templateNameError && (
//               <div className="mt-1 text-xs text-red-600">
//                 {templateNameError}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Header Section */}
//         <div className="mt-6">
//           <label className="block text-gray-700 font-medium mb-1">
//             Header (Optional)
//           </label>
//           <select
//             value={headerType}
//             onChange={(e) => handleHeaderTypeChange(e.target.value)}
//             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//           >
//             <option value="none">None</option>
//             <option value="text">Text</option>
//             <option value="image">Image</option>
//             <option value="video">Video</option>
//             <option value="document">Document</option>
//           </select>

//           {headerType === "text" && (
//             <div className="mt-2">
//               <input
//                 type="text"
//                 value={headerText}
//                 onChange={(e) => setHeaderText(e.target.value)}
//                 placeholder="Enter header text"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//               />
//             </div>
//           )}

//           {["image", "video", "document"].includes(headerType) && (
//             <div className="mt-2">
//               <div className="flex gap-4 mb-4">
//                 <label className="flex items-center gap-2">
//                   <input
//                     type="radio"
//                     value="upload"
//                     checked={mediaSource === "upload"}
//                     onChange={() => setMediaSource("upload")}
//                   />
//                   Upload New
//                 </label>
//                 {headerType !== "document" && (
//                   <label className="flex items-center gap-2">
//                     <input
//                       type="radio"
//                       value="existing"
//                       checked={mediaSource === "existing"}
//                       onChange={() => setMediaSource("existing")}
//                     />
//                     Select from Omnigen Studio
//                   </label>
//                 )}
//               </div>

//               {mediaSource === "upload" ? (
//                 <>
//                   <input
//                     type="file"
//                     accept={headerType === "image" ? "image/*" : "video/*"}
//                     onChange={handleHeaderFileChange}
//                     className="..."
//                   />
//                   {headerError && (
//                     <div className="mt-1 text-xs text-red-600">
//                       {headerError}
//                     </div>
//                   )}
//                 </>
//               ) : (
//                 <div className="grid grid-cols-3 gap-4">
//                   {existingMedias.map((media) => (
//                     <div
//                       key={media.id}
//                       onClick={() => {
//                         setSelectedMediaUrl(media.url);
//                         handleExistingMediaSelection(media.url);
//                       }}
//                       className={`cursor-pointer border-2 rounded-lg p-2 ${
//                         selectedMediaUrl === media.url
//                           ? "border-purple-500 bg-purple-50"
//                           : "border-gray-200"
//                       }`}
//                     >
//                       {headerType === "image" ? (
//                         <img
//                           src={media.url}
//                           alt={media.name}
//                           className="w-full h-32 object-cover rounded-md"
//                         />
//                       ) : (
//                         <div className="relative h-32 bg-gray-100 rounded-md flex items-center justify-center">
//                           <video className="absolute inset-0 w-full h-32 object-cover rounded-md">
//                             <source src={media.url} type="video/mp4" />
//                           </video>
//                           <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-md">
//                             <svg
//                               className="w-12 h-12 text-white"
//                               fill="none"
//                               stroke="currentColor"
//                               viewBox="0 0 24 24"
//                             >
//                               <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={2}
//                                 d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
//                               />
//                             </svg>
//                           </div>
//                         </div>
//                       )}
//                       <p className="mt-2 text-sm text-gray-700 truncate">
//                         {media.name}
//                       </p>
//                     </div>
//                   ))}
//                   {existingMedias.length === 0 && (
//                     <div className="text-gray-500 text-sm col-span-3 py-4 text-center">
//                       No {headerType}s found
//                     </div>
//                   )}
//                 </div>
//               )}

//               {mediaSource === "upload" && fileHandle && (
//                 <p className="mt-2 text-sm text-green-600">
//                   File uploaded successfully!
//                 </p>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Body Section */}
//         <div className="mt-6">
//           <label className="block text-gray-700 font-medium mb-1">
//             Body Text
//           </label>
//           <textarea
//             value={bodyText}
//             onChange={(e) => setBodyText(e.target.value)}
//             placeholder="Enter the text content"
//             className="w-full h-32 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//           />

//           <button
//             onClick={addVariable}
//             className="mt-2 px-4 py-2 text-sm font-medium text-white bg-[#65558F] rounded-full hover:bg-purple-950"
//           >
//             + Add Variable
//           </button>

//           {variables.length > 0 && (
//             <div className="mt-4">
//               <h3 className="text-sm font-semibold text-gray-600">Variables</h3>
//               {variables.map((variable) => (
//                 <div key={variable.id} className="flex items-center gap-4 mt-2">
//                   <span className="text-gray-700 font-medium">{`{{${variable.id}}}`}</span>
//                   <input
//                     type="text"
//                     value={variable.example}
//                     onChange={(e) =>
//                       updateVariableExample(variable.id, e.target.value)
//                     }
//                     placeholder="Example value"
//                     className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
//                   />
//                   <button
//                     onClick={() => deleteVariable(variable.id)}
//                     className="text-red-500 hover:text-red-700"
//                   >
//                     🗑️
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Footer Section */}
//         <div className="mt-6">
//           <label className="block text-gray-700 font-medium mb-1">
//             Footer (Optional)
//           </label>
//           <input
//             type="text"
//             value={footerText}
//             onChange={(e) => setFooterText(e.target.value)}
//             placeholder="Enter footer text"
//             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//           />
//         </div>

//         {/* Buttons Section */}
//         <div className="mt-6">
//           <label className="block text-gray-700 font-medium mb-1">
//             Buttons (Optional)
//           </label>
//           {buttons.map((button, idx) => (
//             <div
//               key={idx}
//               className="p-4 mb-2 border border-gray-200 rounded-md"
//             >
//               <div className="flex justify-between items-center">
//                 <p className="font-medium text-gray-600">Button #{idx + 1}</p>
//                 <button
//                   onClick={() => handleRemoveButton(idx)}
//                   className="text-red-500 text-sm"
//                 >
//                   Remove
//                 </button>
//               </div>

//               <div className="mt-2">
//                 <label className="block text-gray-700 text-sm mb-1">
//                   Button Type
//                 </label>
//                 <select
//                   value={button.type}
//                   onChange={(e) =>
//                     updateButton(idx, {
//                       type: e.target.value as "quick_reply" | "call_to_action",
//                       ctaType: undefined,
//                     })
//                   }
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
//                 >
//                   <option value="quick_reply">Quick Reply</option>
//                   <option value="call_to_action">Call-to-Action</option>
//                 </select>
//               </div>

//               <div className="mt-2">
//                 <label className="block text-gray-700 text-sm mb-1">
//                   Button Text
//                 </label>
//                 <input
//                   type="text"
//                   value={button.text}
//                   onChange={(e) => updateButton(idx, { text: e.target.value })}
//                   placeholder="Enter button text"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
//                 />
//               </div>

//               {button.type === "call_to_action" && (
//                 <>
//                   <div className="mt-2">
//                     <label className="block text-gray-700 text-sm mb-1">
//                       Call-to-Action Type
//                     </label>
//                     <select
//                       value={button.ctaType || "url"}
//                       onChange={(e) =>
//                         updateButton(idx, {
//                           ctaType: e.target.value as "url" | "phone",
//                           url: "",
//                           phoneNumber: "",
//                         })
//                       }
//                       className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
//                     >
//                       <option value="url">Visit Website (URL)</option>
//                       <option value="phone">Call Phone Number</option>
//                     </select>
//                   </div>

//                   {button.ctaType === "url" && (
//                     <div className="mt-2">
//                       <label className="block text-gray-700 text-sm mb-1">
//                         Button URL
//                       </label>
//                       <input
//                         type="text"
//                         value={button.url || ""}
//                         onChange={(e) =>
//                           updateButton(idx, { url: e.target.value })
//                         }
//                         placeholder="Enter button URL"
//                         className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
//                       />
//                     </div>
//                   )}

//                   {button.ctaType === "phone" && (
//                     <div className="mt-2">
//                       <label className="block text-gray-700 text-sm mb-1">
//                         Button Phone Number
//                       </label>
//                       <input
//                         type="text"
//                         value={button.phoneNumber || ""}
//                         onChange={(e) =>
//                           updateButton(idx, { phoneNumber: e.target.value })
//                         }
//                         placeholder="Enter phone number (include country code)"
//                         className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
//                       />
//                       {buttonErrors[idx] && (
//                         <div className="mt-1 text-xs text-red-600">
//                           {buttonErrors[idx]}
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>
//           ))}

//           <button
//             onClick={handleAddButton}
//             className="mt-2 px-4 py-2 text-base font-medium text-white bg-[#65558F] rounded-full hover:bg-purple-950"
//           >
//             + Add Button
//           </button>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex justify-end space-x-4 mt-6">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleDone}
//             className="px-4 py-2 text-base font-medium text-white bg-[#65558F] rounded-full hover:bg-purple-950"
//           >
//             Done
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateTemplateModal;


/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { uploadWhatsAppMediaService } from "../../../api/services/whatsappCampaignService";
import {
  fetchAllTextToImagesService,
  fetchAllTextToVideosService,
} from "../../../api/services/videoGenerateServices";

interface TemplateButton {
  type: "quick_reply" | "call_to_action";
  text: string;
  ctaType?: "url" | "phone";
  url?: string;
  phoneNumber?: string;
}

interface CreateTemplateModalProps {
  onClose: () => void;
  onDone: (data: {
    name: string;
    header?: {
      type: string;
      content: string;
    };
    body: {
      text: string;
      parameters?: {
        type: "positional";
        example: {
          positional: string[];
        };
      };
    };
    footer?: {
      text: string;
    };
    buttons: TemplateButton[];
  }) => void;
  secretToken: string;
}

const CreateTemplateModal: React.FC<CreateTemplateModalProps> = ({
  onClose,
  onDone,
  secretToken,
}) => {
  // Field states
  const [name, setName] = useState("");
  const [headerType, setHeaderType] = useState("none");
  const [headerText, setHeaderText] = useState("");
  const [fileHandle, setFileHandle] = useState<string>("");
  const [bodyText, setBodyText] = useState("");
  const [variables, setVariables] = useState<{ id: number; example: string }[]>(
    []
  );
  const [footerText, setFooterText] = useState("");
  const [buttons, setButtons] = useState<TemplateButton[]>([]);
  const [mediaSource, setMediaSource] = useState<"upload" | "existing">("upload");
  const [existingMedias, setExistingMedias] = useState<
    { id: string; url: string; name: string }[]
  >([]);
  const [selectedMediaUrl, setSelectedMediaUrl] = useState("");

  // Error states (for inline error messages)
  const [templateNameError, setTemplateNameError] = useState("");
  const [headerError, setHeaderError] = useState("");
  const [buttonErrors, setButtonErrors] = useState<{ [key: number]: string }>(
    {}
  );

  const addVariable = () => {
    const nextId = variables.length + 1;
    setBodyText((prev) => prev + ` {{${nextId}}}`);
    setVariables((prev) => [...prev, { id: nextId, example: "" }]);
  };

  const deleteVariable = (id: number) => {
    setVariables((prev) => prev.filter((v) => v.id !== id));
    setBodyText((prev) =>
      prev.replace(new RegExp(`\\{\\{${id}\\}\\}`, "g"), "")
    );
  };

  const updateVariableExample = (id: number, newExample: string) => {
    setVariables((prev) =>
      prev.map((v) => (v.id === id ? { ...v, example: newExample } : v))
    );
  };

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        let response: { data: any[] };
        if (headerType === "image") {
          response = await fetchAllTextToImagesService();
          const mediaItems = response.data.flatMap((item: any) =>
            item.images.map((img: string, index: number) => ({
              id: `${item._id}-${index}`,
              url: img,
              name: `${item.prompt} (${index + 1})`,
            }))
          );
          setExistingMedias(mediaItems);
        } else if (headerType === "video") {
          response = await fetchAllTextToVideosService();
          const mediaItems = response.data.map((item: any) => ({
            id: item._id,
            url: item.videoUrl,
            name: item.prompt,
          }));
          setExistingMedias(mediaItems);
        }
      } catch {
        setHeaderError(`Failed to fetch ${headerType}s`);
      }
    };

    if (["image", "video"].includes(headerType) && mediaSource === "existing") {
      fetchMedia();
    }
  }, [mediaSource, headerType, secretToken]);

  const handleHeaderFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setHeaderError("");
    if (!secretToken) {
      setHeaderError("Missing secret token. Cannot upload file.");
      return;
    }

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const MAX_FILE_SIZE = 2 * 1024 * 1024;
      if (file.size > MAX_FILE_SIZE) {
        setHeaderError(
          "File size exceeds 2 MB limit. Please upload a smaller file."
        );
        return;
      }

      if (["image", "video", "document"].includes(headerType)) {
        try {
          const formData = new FormData();
          formData.append("file", file);
          // API call returns a fileHandle which is expected to be a complete URL.
          const response = await uploadWhatsAppMediaService({
            file: file,
            integrationId: secretToken,
          });
          if (response?.fileHandle) {
            setFileHandle(response.fileHandle);
            console.log("File uploaded, got handle:", response.fileHandle);
          } else {
            throw new Error("File handle missing in response");
          }
        } catch (error) {
          console.error("Header upload failed:", error);
          setHeaderError("Failed to upload header media.");
        }
      }
    }
  };

  const handleExistingMediaSelection = async (mediaUrl: string) => {
    setHeaderError("");
    if (!secretToken) {
      setHeaderError("Missing secret token. Cannot upload file.");
      return;
    }

    try {
      const response = await uploadWhatsAppMediaService({
        mediaUrl,
        integrationId: secretToken,
      });
      if (response?.fileHandle) {
        setFileHandle(response.fileHandle);
        console.log("Existing media uploaded, got handle:", response.fileHandle);
      } else {
        throw new Error("File handle missing in response");
      }
    } catch (error) {
      console.error("Header upload failed:", error);
      setHeaderError("Failed to upload header media.");
    }
  };

  const handleHeaderTypeChange = (newType: string) => {
    setHeaderType(newType);
    setMediaSource("upload");
    setSelectedMediaUrl("");
    setFileHandle("");
    setHeaderError("");
  };

  const handleAddButton = () => {
    setButtons((prev) => [...prev, { type: "quick_reply", text: "" }]);
  };

  const updateButton = (
    index: number,
    updatedFields: Partial<TemplateButton>
  ) => {
    setButtons((prev) =>
      prev.map((btn, i) => (i === index ? { ...btn, ...updatedFields } : btn))
    );
    // Clear error for this button field on change
    setButtonErrors((prev) => ({ ...prev, [index]: "" }));
  };

  const handleRemoveButton = (index: number) => {
    setButtons((prev) => prev.filter((_, i) => i !== index));
    // Remove any errors associated with this button
    setButtonErrors((prev) => {
      const copy = { ...prev };
      delete copy[index];
      return copy;
    });
  };

  const handleDone = () => {
    let hasError = false;
    // Clear previous errors
    setTemplateNameError("");
    setButtonErrors({});

    // Validate template name
    const templateNameRegex = /^[a-z0-9_]+$/;
    if (!templateNameRegex.test(name)) {
      setTemplateNameError(
        "Template name must contain only lowercase letters, numbers, and underscores."
      );
      hasError = true;
    }

    // Validate call-to-action buttons with phone numbers
    const newButtonErrors: { [key: number]: string } = {};
    buttons.forEach((btn, i) => {
      if (btn.type === "call_to_action" && btn.ctaType === "phone") {
        if (!btn.phoneNumber) {
          newButtonErrors[i] = "Phone number is required.";
          hasError = true;
        } else {
          const phoneRegex = /^\+\d+$/;
          if (!phoneRegex.test(btn.phoneNumber)) {
            newButtonErrors[i] =
              "Invalid phone number. Include country code (e.g., +123456789).";
            hasError = true;
          }
        }
      }
    });
    setButtonErrors(newButtonErrors);

    if (hasError) return;

    let header: { type: string; content: string } | undefined;
    if (headerType !== "none") {
      header =
        headerType === "text"
          ? { type: "TEXT", content: headerText }
          : { type: headerType.toUpperCase(), content: fileHandle };
    }

    const bodyPayload: any = { text: bodyText };
    const regex = /\{\{\s*(\d+)\s*\}\}/g;
    const matches = Array.from(bodyText.matchAll(regex));
    if (matches.length > 0) {
      const positionalExamples = matches.map((match) => {
        const id = parseInt(match[1]);
        const variable = variables.find((v) => v.id === id);
        return variable ? variable.example : "";
      });
      bodyPayload.parameters = {
        type: "positional",
        example: {
          positional: positionalExamples,
        },
      };
    }

    const formattedButtons = buttons.map((btn) => ({
      ...btn,
      type: btn.type,
    }));

    onDone({
      name,
      header,
      body: bodyPayload,
      footer: footerText ? { text: footerText } : undefined,
      buttons: formattedButtons,
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Modal Backdrop */}
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} />
      {/* Modal Container */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 z-10 max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Create WhatsApp Template
        </h2>

        {/* Template Name */}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Template Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your template name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {templateNameError && (
              <div className="mt-1 text-xs text-red-600">
                {templateNameError}
              </div>
            )}
          </div>
        </div>

        {/* Header Section */}
        <div className="mt-6">
          <label className="block text-gray-700 font-medium mb-1">
            Header (Optional)
          </label>
          <select
            value={headerType}
            onChange={(e) => handleHeaderTypeChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="none">None</option>
            <option value="text">Text</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="document">Document</option>
          </select>

          {headerType === "text" && (
            <div className="mt-2">
              <input
                type="text"
                value={headerText}
                onChange={(e) => setHeaderText(e.target.value)}
                placeholder="Enter header text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          )}

          {["image", "video", "document"].includes(headerType) && (
            <div className="mt-2">
              <div className="flex gap-4 mb-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="upload"
                    checked={mediaSource === "upload"}
                    onChange={() => setMediaSource("upload")}
                  />
                  Upload New
                </label>
                {headerType !== "document" && (
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="existing"
                      checked={mediaSource === "existing"}
                      onChange={() => setMediaSource("existing")}
                    />
                    Select from Omnigen Studio
                  </label>
                )}
              </div>

              {mediaSource === "upload" ? (
                <>
                  <input
                    type="file"
                    accept={headerType === "image" ? "image/*" : "video/*"}
                    onChange={handleHeaderFileChange}
                    className="..."
                  />
                  {headerError && (
                    <div className="mt-1 text-xs text-red-600">
                      {headerError}
                    </div>
                  )}
                </>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {existingMedias.map((media) => (
                    <div
                      key={media.id}
                      onClick={() => {
                        setSelectedMediaUrl(media.url);
                        handleExistingMediaSelection(media.url);
                      }}
                      className={`cursor-pointer border-2 rounded-lg p-2 ${
                        selectedMediaUrl === media.url
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200"
                      }`}
                    >
                      {headerType === "image" ? (
                        <img
                          src={media.url}
                          alt={media.name}
                          className="w-full h-32 object-cover rounded-md"
                        />
                      ) : (
                        <div className="relative h-32 bg-gray-100 rounded-md flex items-center justify-center">
                          <video className="absolute inset-0 w-full h-32 object-cover rounded-md">
                            <source src={media.url} type="video/mp4" />
                          </video>
                          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-md">
                            <svg
                              className="w-12 h-12 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                              />
                            </svg>
                          </div>
                        </div>
                      )}
                      <p className="mt-2 text-sm text-gray-700 truncate">
                        {media.name}
                      </p>
                    </div>
                  ))}
                  {existingMedias.length === 0 && (
                    <div className="text-gray-500 text-sm col-span-3 py-4 text-center">
                      No {headerType}s found
                    </div>
                  )}
                </div>
              )}

              {mediaSource === "upload" && fileHandle && (
                <p className="mt-2 text-sm text-green-600">
                  File uploaded successfully!
                </p>
              )}
            </div>
          )}
        </div>

        {/* Body Section */}
        <div className="mt-6">
          <label className="block text-gray-700 font-medium mb-1">
            Body Text
          </label>
          <textarea
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
            placeholder="Enter the text content"
            className="w-full h-32 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <button
            onClick={addVariable}
            className="mt-2 px-4 py-2 text-sm font-medium text-white bg-[#65558F] rounded-full hover:bg-purple-950"
          >
            + Add Variable
          </button>

          {variables.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-600">Variables</h3>
              {variables.map((variable) => (
                <div key={variable.id} className="flex items-center gap-4 mt-2">
                  <span className="text-gray-700 font-medium">{`{{${variable.id}}}`}</span>
                  <input
                    type="text"
                    value={variable.example}
                    onChange={(e) =>
                      updateVariableExample(variable.id, e.target.value)
                    }
                    placeholder="Example value"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    onClick={() => deleteVariable(variable.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Section */}
        <div className="mt-6">
          <label className="block text-gray-700 font-medium mb-1">
            Footer (Optional)
          </label>
          <input
            type="text"
            value={footerText}
            onChange={(e) => setFooterText(e.target.value)}
            placeholder="Enter footer text"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Buttons Section */}
        <div className="mt-6">
          <label className="block text-gray-700 font-medium mb-1">
            Buttons (Optional)
          </label>
          {buttons.map((button, idx) => (
            <div key={idx} className="p-4 mb-2 border border-gray-200 rounded-md">
              <div className="flex justify-between items-center">
                <p className="font-medium text-gray-600">Button #{idx + 1}</p>
                <button
                  onClick={() => handleRemoveButton(idx)}
                  className="text-red-500 text-sm"
                >
                  Remove
                </button>
              </div>

              <div className="mt-2">
                <label className="block text-gray-700 text-sm mb-1">
                  Button Type
                </label>
                <select
                  value={button.type}
                  onChange={(e) =>
                    updateButton(idx, {
                      type: e.target.value as "quick_reply" | "call_to_action",
                      ctaType: undefined,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                >
                  <option value="quick_reply">Quick Reply</option>
                  <option value="call_to_action">Call-to-Action</option>
                </select>
              </div>

              <div className="mt-2">
                <label className="block text-gray-700 text-sm mb-1">
                  Button Text
                </label>
                <input
                  type="text"
                  value={button.text}
                  onChange={(e) => updateButton(idx, { text: e.target.value })}
                  placeholder="Enter button text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {button.type === "call_to_action" && (
                <>
                  <div className="mt-2">
                    <label className="block text-gray-700 text-sm mb-1">
                      Call-to-Action Type
                    </label>
                    <select
                      value={button.ctaType || "url"}
                      onChange={(e) =>
                        updateButton(idx, {
                          ctaType: e.target.value as "url" | "phone",
                          url: "",
                          phoneNumber: "",
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="url">Visit Website (URL)</option>
                      <option value="phone">Call Phone Number</option>
                    </select>
                  </div>

                  {button.ctaType === "url" && (
                    <div className="mt-2">
                      <label className="block text-gray-700 text-sm mb-1">
                        Button URL
                      </label>
                      <input
                        type="text"
                        value={button.url || ""}
                        onChange={(e) =>
                          updateButton(idx, { url: e.target.value })
                        }
                        placeholder="Enter button URL"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  )}

                  {button.ctaType === "phone" && (
                    <div className="mt-2">
                      <label className="block text-gray-700 text-sm mb-1">
                        Button Phone Number
                      </label>
                      <input
                        type="text"
                        value={button.phoneNumber || ""}
                        onChange={(e) =>
                          updateButton(idx, { phoneNumber: e.target.value })
                        }
                        placeholder="Enter phone number (include country code)"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                      />
                      {buttonErrors[idx] && (
                        <div className="mt-1 text-xs text-red-600">
                          {buttonErrors[idx]}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}

          <button
            onClick={handleAddButton}
            className="mt-2 px-4 py-2 text-base font-medium text-white bg-[#65558F] rounded-full hover:bg-purple-950"
          >
            + Add Button
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDone}
            className="px-4 py-2 text-base font-medium text-white bg-[#65558F] rounded-full hover:bg-purple-950"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTemplateModal;
