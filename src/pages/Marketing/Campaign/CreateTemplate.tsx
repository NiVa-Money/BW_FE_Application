// import React, { useState } from "react";

// interface TemplateButton {
//   // "quick_reply" or "call_to_action"
//   type: string;
//   text: string;
//   // For call-to-action: can be "url" or "phone"
//   ctaType?: string;
//   url?: string;
//   phoneNumber?: string;
// }

// interface CreateTemplateModalProps {
//   onClose: () => void;
//   onDone: (data: {
//     name: string;

//     headerType: string;
//     headerText?: string;
//     headerFile?: File | null;
//     bodyText: string;
//     footerText?: string;
//     buttons: TemplateButton[];
//   }) => void;
// }

// const CreateTemplateModal: React.FC<CreateTemplateModalProps> = ({
//   onClose,
//   onDone,
// }) => {
//   const [name, setName] = useState("");

//   // Header
//   const [headerType, setHeaderType] = useState("none");
//   const [headerText, setHeaderText] = useState("");
//   const [headerFile, setHeaderFile] = useState<File | null>(null);

//   // Body
//   const [bodyText, setBodyText] = useState("");

//   // Footer
//   const [footerText, setFooterText] = useState("");

//   // Buttons
//   const [buttons, setButtons] = useState<TemplateButton[]>([]);

//   // Handle header file upload
//   const handleHeaderFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setHeaderFile(e.target.files[0]);
//     }
//   };

//   // Add a new button
//   const handleAddButton = () => {
//     // Default to a quick-reply button with empty text
//     setButtons((prev) => [...prev, { type: "quick_reply", text: "" }]);
//   };

//   // Update a button
//   const updateButton = (
//     index: number,
//     updatedFields: Partial<TemplateButton>
//   ) => {
//     setButtons((prev) =>
//       prev.map((btn, i) => (i === index ? { ...btn, ...updatedFields } : btn))
//     );
//   };

//   // Remove a button
//   const handleRemoveButton = (index: number) => {
//     setButtons((prev) => prev.filter((_, i) => i !== index));
//   };

//   // When user clicks "Done"
//   const handleDone = () => {
//     onDone({
//       name,
//       headerType,
//       headerText: headerType === "text" ? headerText : undefined,
//       headerFile: ["image", "video", "document"].includes(headerType)
//         ? headerFile
//         : null,
//       bodyText,
//       footerText,
//       buttons,
//     });
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center z-50">
//       {/* Modal Backdrop */}
//       <div
//         className="absolute inset-0 bg-black opacity-50"
//         onClick={onClose}
//       ></div>

//       {/* Modal Container */}
//       <div
//         className="
//     relative bg-white rounded-lg shadow-xl 
//     max-w-2xl w-full p-6 z-10
//     max-h-[80vh] overflow-y-auto
//   "
//       >
//         <h2 className="text-2xl font-semibold text-gray-800 mb-4">
//           Create WhatsApp Template
//         </h2>

//         {/* Template Name and Language */}
//         <div className="space-y-4">
//           <div>
//             <label className="block text-gray-700 font-medium mb-1">
//               Template Name
//             </label>
//             <span className="text-zinc-400 ml-2 whitespace-nowrap">
//               It must contain only lowercase letters, numbers, and underscores
//             </span>
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               placeholder="Enter your template name"
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//             />
//           </div>
//         </div>

//         {/* Header Section */}
//         <div className="mt-6">
//           <label className="block text-gray-700 font-medium mb-1">
//             Header (Optional)
//           </label>
//           <select
//             value={headerType}
//             onChange={(e) => {
//               setHeaderType(e.target.value);
//               // Reset relevant states
//               setHeaderText("");
//               setHeaderFile(null);
//             }}
//             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//           >
//             <option value="none">None</option>
//             <option value="text">Text</option>
//             <option value="image">Image</option>
//             <option value="video">Video</option>
//             <option value="document">Document</option>
//             {/* <option value="location">Location</option> */}
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

//           {/* For image/video/document, show file upload */}
//           {["image", "video", "document"].includes(headerType) && (
//             <div className="mt-2">
//               <input
//                 type="file"
//                 accept={
//                   headerType === "image"
//                     ? "image/*"
//                     : headerType === "video"
//                     ? "video/*"
//                     : headerType === "document"
//                     ? ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
//                     : undefined
//                 }
//                 onChange={handleHeaderFileChange}
//                 className="block w-full text-sm text-gray-700
//                   file:mr-4 file:py-2 file:px-4
//                   file:rounded-full file:border-0
//                   file:text-sm file:font-semibold
//                   file:bg-purple-50 file:text-purple-700
//                   hover:file:bg-purple-100"
//               />
//             </div>
//           )}

//           {/* For "location", you might add lat/long fields or address fields here */}
//           {headerType === "location" && (
//             <div className="mt-2 text-sm text-gray-500">
//               {/* In a real app, you’d have location fields, 
//                   or integrate a map picker, etc. */}
//               <p>Location header not yet implemented.</p>
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
//                         placeholder="Enter phone number"
//                         className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
//                       />
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


import React, { useState } from "react";
// Make sure you import your upload function from wherever it's defined:
import { uploadWhatsAppMediaService } from "../../../api/services/whatsappCampaignService";

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
    headerType: string;
    headerText?: string;
    fileHandle?: string; // We'll store the uploaded file handle here
    bodyText: string;
    footerText?: string;
    buttons: TemplateButton[];
  }) => void;
  // We need the secret token in order to call uploadWhatsAppMediaService
  secretToken: string;
}

const CreateTemplateModal: React.FC<CreateTemplateModalProps> = ({
  onClose,
  onDone,
  secretToken,
}) => {
  const [name, setName] = useState("");

  // Header
  const [headerType, setHeaderType] = useState("none");
  const [headerText, setHeaderText] = useState("");
  const [fileHandle, setFileHandle] = useState<string>(""); // store the API-uploaded file handle

  // Body
  const [bodyText, setBodyText] = useState("");

  // Footer
  const [footerText, setFooterText] = useState("");

  // Buttons
  const [buttons, setButtons] = useState<TemplateButton[]>([]);

  /**
   * Immediately upload the file if user chooses an image/video/document.
   * We'll store only the file handle in state.
   */
  const handleHeaderFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!secretToken) {
      alert("Missing secret token. Cannot upload file.");
      return;
    }

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Only upload if the headerType is image/video/document
      if (["image", "video", "document"].includes(headerType)) {
        try {
          const formData = new FormData();
          formData.append("file", file);

          const response = await uploadWhatsAppMediaService(file, secretToken);

          if (response?.fileHandle) {
            setFileHandle(response.fileHandle);
            console.log("File uploaded, got handle:", response.fileHandle);
          } else {
            throw new Error("File handle missing in response");
          }
        } catch (error) {
          console.error("Header upload failed:", error);
          alert("Failed to upload header media.");
        }
      }
    }
  };

  // If user changes header type from text to image (etc.), reset states
  const handleHeaderTypeChange = (newType: string) => {
    setHeaderType(newType);
    setHeaderText("");
    setFileHandle(""); // Clear out any old handle
  };

  // Add a new button
  const handleAddButton = () => {
    setButtons((prev) => [...prev, { type: "quick_reply", text: "" }]);
  };

  // Update a button
  const updateButton = (index: number, updatedFields: Partial<TemplateButton>) => {
    setButtons((prev) =>
      prev.map((btn, i) => (i === index ? { ...btn, ...updatedFields } : btn))
    );
  };

  // Remove a button
  const handleRemoveButton = (index: number) => {
    setButtons((prev) => prev.filter((_, i) => i !== index));
  };

  /**
   * Called when user clicks "Done."
   * We just pass the fileHandle (if any) up, no more upload calls here.
   */
  const handleDone = () => {
    onDone({
      name,
      headerType,
      headerText: headerType === "text" ? headerText : undefined,
      fileHandle: ["image", "video", "document"].includes(headerType)
        ? fileHandle
        : undefined,
      bodyText,
      footerText,
      buttons,
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Modal Backdrop */}
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} />

      {/* Modal Container */}
      <div
        className="
          relative bg-white rounded-lg shadow-xl 
          max-w-2xl w-full p-6 z-10
          max-h-[80vh] overflow-y-auto
        "
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Create WhatsApp Template
        </h2>

        {/* Template Name */}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Template Name
            </label>
            <span className="text-zinc-400 ml-2 whitespace-nowrap">
              It must contain only lowercase letters, numbers, and underscores
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your template name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
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

          {/* For image/video/document, show file upload */}
          {["image", "video", "document"].includes(headerType) && (
            <div className="mt-2">
              <input
                type="file"
                accept={
                  headerType === "image"
                    ? "image/*"
                    : headerType === "video"
                    ? "video/*"
                    : headerType === "document"
                    ? ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                    : undefined
                }
                onChange={handleHeaderFileChange}
                className="block w-full text-sm text-gray-700
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-purple-50 file:text-purple-700
                  hover:file:bg-purple-100"
              />
              {/* If we have a fileHandle, show a small success message */}
              {fileHandle && (
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
            <div
              key={idx}
              className="p-4 mb-2 border border-gray-200 rounded-md"
            >
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
                        placeholder="Enter phone number"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                      />
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
