// import { useState } from "react";

// type KnowledgeBaseConfigProps = {
//   config: {
//     source: string;
//     documents: string[];
//     urls: string[];
//     externalId: string;
//     description: string;
//   };
//   updateConfig: (data: Partial<KnowledgeBaseConfigProps["config"]>) => void;
// };

// const KnowledgeBaseConfig = ({
//   config,
//   updateConfig,
// }: KnowledgeBaseConfigProps) => {
//   const [newUrl, setNewUrl] = useState("");
//   const [isDragging, setIsDragging] = useState(false);

//   const handleAddUrl = () => {
//     if (newUrl.trim() && !config.urls.includes(newUrl)) {
//       updateConfig({ urls: [...config.urls, newUrl] });
//       setNewUrl("");
//     }
//   };

//   const handleRemoveUrl = (url: string) => {
//     updateConfig({ urls: config.urls.filter((u) => u !== url) });
//   };

//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (files) {
//       const validFiles = Array.from(files).filter((file) =>
//         [
//           "application/pdf",
//           "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//         ].includes(file.type)
//       );
//       const newFileNames = validFiles
//         .map((file) => file.name)
//         .filter((name) => !config.documents.includes(name));
//       updateConfig({ documents: [...config.documents, ...newFileNames] });
//     }
//   };

//   const handleDragOver = (e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(true);
//   };

//   const handleDragLeave = (e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(false);
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(false);
//     const files = e.dataTransfer.files;
//     if (files) {
//       const validFiles = Array.from(files).filter((file) =>
//         [
//           "application/pdf",
//           "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//         ].includes(file.type)
//       );
//       const newFileNames = validFiles
//         .map((file) => file.name)
//         .filter((name) => !config.documents.includes(name));
//       updateConfig({ documents: [...config.documents, ...newFileNames] });
//     }
//   };

//   const handleRemoveDocument = (docName: string) => {
//     updateConfig({ documents: config.documents.filter((d) => d !== docName) });
//   };

//   return (
//     <div className="space-y-6">
//       <div>
//         <h2 className="text-2xl font-bold text-gray-800">Knowledge Base</h2>
//         <p className="text-gray-500 mt-1">
//           Configure your agent's knowledge sources
//         </p>
//       </div>

//       <div className="space-y-4">
//         <div className="space-y-4">
//           <div className="flex flex-col gap-4">
//             <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border border-gray-200 hover:border-blue-800 transition-colors">
//               <input
//                 type="radio"
//                 value="none"
//                 checked={config.source === "none"}
//                 onChange={(e) => updateConfig({ source: e.target.value })}
//                 className="w-5 h-5 text-blue-800 border-gray-300 focus:ring-blue-700"
//               />
//               <span className="text-gray-700 font-medium">
//                 No Knowledge Base
//               </span>
//             </label>

//             <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl border border-gray-200 hover:border-blue-800 transition-colors">
//               <input
//                 type="radio"
//                 value="documents"
//                 checked={config.source === "documents"}
//                 onChange={(e) => updateConfig({ source: e.target.value })}
//                 className="w-5 h-5 text-blue-800 border-gray-300 focus:ring-blue-700 mt-1"
//               />
//               <div className="flex-1">
//                 <div className="text-gray-700 font-medium">
//                   Upload Documents
//                 </div>
//                 {config.source === "documents" && (
//                   <>
//                     <div
//                       className={`mt-4 p-6 rounded-lg bg-gray-50 border border-dashed ${
//                         isDragging
//                           ? "border-blue-800 bg-blue-50"
//                           : "border-gray-300"
//                       } text-center`}
//                       onDragOver={handleDragOver}
//                       onDragLeave={handleDragLeave}
//                       onDrop={handleDrop}
//                     >
//                       <div className="text-gray-500 mb-3">
//                         Drag and drop files or
//                       </div>
//                       <input
//                         type="file"
//                         accept=".pdf,.docx"
//                         multiple
//                         onChange={handleFileUpload}
//                         className="hidden"
//                         id="file-upload"
//                       />
//                       <button
//                         type="button"
//                         onClick={() =>
//                           document.getElementById("file-upload")?.click()
//                         }
//                         className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:border-blue-800 hover:text-blue-800 transition-colors"
//                       >
//                         Browse Files
//                       </button>
//                       <div className="mt-3 text-sm text-gray-400">
//                         PDF, DOCX (max 50MB)
//                       </div>
//                     </div>
//                     {config.documents.length > 0 && (
//                       <div className="mt-4">
//                         <div className="text-sm text-gray-600 mb-2">
//                           Selected files:
//                         </div>
//                         <div className="flex flex-wrap gap-2">
//                           {config.documents.map((doc, index) => (
//                             <div
//                               key={index}
//                               className="pl-3 pr-2 py-1 bg-white border border-gray-200 rounded-full flex items-center gap-2"
//                             >
//                               <span className="text-sm text-gray-600">
//                                 {doc}
//                               </span>
//                               <button
//                                 onClick={() => handleRemoveDocument(doc)}
//                                 className="w-6 h-6 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
//                               >
//                                 ×
//                               </button>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </>
//                 )}
//               </div>
//             </label>

//             <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl border border-gray-200 hover:border-blue-800 transition-colors">
//               <input
//                 type="radio"
//                 value="urls"
//                 checked={config.source === "urls"}
//                 onChange={(e) => updateConfig({ source: e.target.value })}
//                 className="w-5 h-5 text-blue-800 border-gray-300 focus:ring-blue-700 mt-1"
//               />
//               <div className="flex-1 space-y-4">
//                 <div className="text-gray-700 font-medium">
//                   Web Pages (URLs)
//                 </div>
//                 {config.source === "urls" && (
//                   <div className="space-y-4">
//                     <div className="flex gap-3">
//                       <input
//                         value={newUrl}
//                         onChange={(e) => setNewUrl(e.target.value)}
//                         placeholder="https://example.com/page"
//                         className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-800 focus:border-blue-600 outline-none transition-all"
//                       />
//                       {/* This button uses handleAddUrl */}
//                       <button
//                         onClick={handleAddUrl}
//                         className="px-4 py-2 bg-blue-800 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
//                       >
//                         Add
//                       </button>
//                     </div>
//                     <div className="flex flex-wrap gap-2">
//                       {config.urls.map((url, index) => (
//                         <div
//                           key={index}
//                           className="pl-3 pr-2 py-1 bg-white border border-gray-200 rounded-full flex items-center gap-2"
//                         >
//                           <span className="text-sm text-gray-600">{url}</span>
//                           <button
//                             onClick={() => handleRemoveUrl(url)}
//                             className="w-6 h-6 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
//                           >
//                             ×
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </label>

//             <label className="block">
//               <span className="text-gray-700 font-medium mb-2 block">
//                 Description
//               </span>
//               <span className="text-sm text-gray-400 mb-2 block">
//                 Guides your agent's behavior and responses
//               </span>
//               <textarea
//                 value={config.description}
//                 onChange={(e) => updateConfig({ description: e.target.value })}
//                 className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-1 focus:ring-blue-800 focus:border-blue-600 outline-none transition-all"
//                 rows={4}
//                 placeholder="Describe your agent's purpose..."
//               />
//             </label>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default KnowledgeBaseConfig;

import { useState } from "react";
import {
  uploadKBService,
  uploadUrlService,
} from "../../../api/services/voiceModuleServices";

type KnowledgeBaseConfigProps = {
  config: {
    source: string;
    documents: string[];
    urls: string[];
    externalId: string;
    description: string;
  };
  updateConfig: (data: Partial<KnowledgeBaseConfigProps["config"]>) => void;
};

const MAX_FILE_SIZE_MB = 50;

const KnowledgeBaseConfig = ({ config, updateConfig }: KnowledgeBaseConfigProps) => {
  const [newUrl, setNewUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [urlUploading, setUrlUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [urlError, setUrlError] = useState<string | null>(null);

  const handleRemoveUrl = (url: string) => {
    updateConfig({ urls: config.urls.filter((u) => u !== url) });
  };

  const validateFile = (file: File) => {
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const maxSize = MAX_FILE_SIZE_MB * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      return "Invalid file type. Only PDF and DOCX are allowed.";
    }

    if (file.size > maxSize) {
      return `File too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`;
    }

    return null;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !files.length) return;

    setUploading(true);
    setUploadError(null);

    try {
      const results = await Promise.all(
        Array.from(files).map(async (file) => {
          const validationError = validateFile(file);
          if (validationError) throw new Error(validationError);

          const response = await uploadKBService(file);
          return response.filename;
        })
      );

      updateConfig({
        documents: [...new Set([...config.documents, ...results])],
      });
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "Failed to upload files"
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (!files || !files.length) return;

    setUploading(true);
    setUploadError(null);

    try {
      const results = await Promise.all(
        Array.from(files).map(async (file) => {
          const validationError = validateFile(file);
          if (validationError) throw new Error(validationError);

          const response = await uploadKBService(file);
          return response.filename;
        })
      );

      updateConfig({
        documents: [...new Set([...config.documents, ...results])],
      });
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "Failed to upload files"
      );
    } finally {
      setUploading(false);
    }
  };

  const handleAddUrl = async () => {
    if (!newUrl.trim()) return;

    setUrlUploading(true);
    setUrlError(null);

    try {
      const response = await uploadUrlService(newUrl);
      updateConfig({
        urls: [...new Set([...config.urls, response.ULI])],
      });
      setNewUrl("");
    } catch (error) {
      setUrlError(error instanceof Error ? error.message : "Failed to add URL");
    } finally {
      setUrlUploading(false);
    }
  };

  const handleRemoveDocument = (docName: string) => {
    updateConfig({ documents: config.documents.filter((d) => d !== docName) });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Knowledge Base</h2>
        <p className="text-gray-500 mt-1">
          Configure your agent's knowledge sources
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-4">
          <div className="flex flex-col gap-4">
            {/* No Knowledge Base Option */}
            <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border border-gray-200 hover:border-blue-800 transition-colors">
              <input
                type="radio"
                value="none"
                checked={config.source === "none"}
                onChange={(e) => updateConfig({ source: e.target.value })}
                className="w-5 h-5 text-blue-800 border-gray-300 focus:ring-blue-700"
              />
              <span className="text-gray-700 font-medium">No Knowledge Base</span>
            </label>

            {/* Upload Documents Option */}
            <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl border border-gray-200 hover:border-blue-800 transition-colors">
              <input
                type="radio"
                value="documents"
                checked={config.source === "documents"}
                onChange={(e) => updateConfig({ source: e.target.value })}
                className="w-5 h-5 text-blue-800 border-gray-300 focus:ring-blue-700 mt-1"
              />
              <div className="flex-1">
                <div className="text-gray-700 font-medium">Upload Documents</div>
                {config.source === "documents" && (
                  <>
                    <div
                      className={`mt-4 p-6 rounded-lg bg-gray-50 border border-dashed ${
                        isDragging
                          ? "border-blue-800 bg-blue-50"
                          : "border-gray-300"
                      } text-center`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <div className="text-gray-500 mb-3">
                        Drag and drop files or
                      </div>
                      <input
                        id="file-upload"
                        type="file"
                        accept=".pdf,.docx"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                      <button
                        type="button"
                        onClick={() => document.getElementById("file-upload")?.click()}
                        className={`px-4 py-2 border rounded-lg font-medium transition-colors ${uploading
                          ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                          : "bg-white border-gray-300 text-gray-700 hover:border-blue-800 hover:text-blue-800"
                        }`}
                        disabled={uploading}
                      >
                        {uploading ? "Uploading..." : "Browse Files"}
                      </button>
                      <div className="mt-3 text-sm text-gray-400">
                        PDF, DOCX (max {MAX_FILE_SIZE_MB}MB)
                      </div>
                      {uploadError && <div className="mt-3 text-sm text-red-600">{uploadError}</div>}
                    </div>
                    {config.documents.length > 0 && (
                      <div className="mt-4">
                        <div className="text-sm text-gray-600 mb-2">Uploaded files:</div>
                        <div className="flex flex-wrap gap-2">
                          {config.documents.map((doc, idx) => (
                            <div
                              key={idx}
                              className="pl-3 pr-2 py-1 bg-white border border-gray-200 rounded-full flex items-center gap-2"
                            >
                              <span className="text-sm text-gray-600">{doc}</span>
                              <button
                                onClick={() => handleRemoveDocument(doc)}
                                className="w-6 h-6 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </label>

            {/* URLs Option */}
            <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl border border-gray-200 hover:border-blue-800 transition-colors">
              <input
                type="radio"
                value="urls"
                checked={config.source === "urls"}
                onChange={(e) => updateConfig({ source: e.target.value })}
                className="w-5 h-5 text-blue-800 border-gray-300 focus:ring-blue-700 mt-1"
              />
              <div className="flex-1 space-y-4">
                <div className="text-gray-700 font-medium">Web Pages (URLs)</div>
                {config.source === "urls" && (
                  <div className="space-y-4"> 
                    <div className="flex gap-3">
                      <input
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        placeholder="Enter URL"
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-800 focus:border-blue-600 outline-none transition-all"
                        disabled={urlUploading}
                      />
                      <button
                        onClick={handleAddUrl}
                        className={`px-4 py-2 bg-blue-800 text-white rounded-full font-medium transition-colors ${urlUploading
                          ? "bg-blue-600 opacity-75"
                          : "hover:bg-blue-700"
                        }`}
                        disabled={urlUploading}
                      >
                        {urlUploading ? "Adding..." : "Add"}
                      </button>
                    </div>
                    {urlError && <div className="text-sm text-red-600">{urlError}</div>}
                    <div className="flex flex-wrap gap-2">
                      {config.urls.map((url, idx) => (
                        <div
                          key={idx}
                          className="pl-3 pr-2 py-1 bg-white border border-gray-200 rounded-full flex items-center gap-2"
                        >
                          <span className="text-sm text-gray-600 truncate max-w-xs">{url}</span>
                          <button
                            onClick={() => handleRemoveUrl(url)}
                            className="w-6 h-6 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </label>

            {/* Description */}
            <label className="block">
              <span className="text-gray-700 font-medium mb-2 block">Description</span>
              <span className="text-sm text-gray-400 mb-2 block">Guides your agent's behavior and responses</span>
              <textarea
                value={config.description}
                onChange={(e) => updateConfig({ description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-1 focus:ring-blue-800 focus:border-blue-600 outline-none transition-all"
                rows={4}
                placeholder="Describe your agent's purpose..."
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBaseConfig;
