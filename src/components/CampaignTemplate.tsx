<<<<<<< HEAD
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState } from "react";
// import { ChangeEvent } from "react";

// type CampaignTemplateProps = {
//   onClose: () => void;
// };

// const CampaignTemplate: React.FC<CampaignTemplateProps> = ({ onClose }) => {
//   const [customizeScreen, setCustomizeScreen] = useState(false);
//   const [text, setText] = useState("");
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const [image, setImage] = useState<string | null>(null);

//   const templates = [
//     {
//       id: 1,
//       image: "/assets/WhatsappCampaign1.svg",
//       title: "Template 1",
//       plan: "✨ Get Unlimited Access to Our Premium Services!",
//       cta: "📱 Book Your Free Demo → Purchase Your Plan",
//       confirmation: "✅ Confirming Text with Icons:",
//       trust: "👍 Secure Transactions 💰 Top-rated Service",
//     },
//     {
//       id: 2,
//       image: "/assets/WhatsappCampaign1.svg",
//       title: "Template 2",
//       plan: "🔥 Limited Time Offer! Unlock All Features Now! 🔥",
//       cta: "📝 Schedule a Demo ➡️ Buy Now",
//       confirmation: "⭐ 5-Star Customer Reviews ✅",
//       trust: "100% Safe & Secure 🌍 Worldwide Recognition",
//     },
//   ];

//   const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
//     const files = event.target.files;
//     if (files && files[0]) {
//       const file = files[0];
//       setImage(URL.createObjectURL(file));
//     }
//   };

//   return (
//     <div className="fixed inset-0 flex  items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
//       <div className="bg-white rounded-lg shadow-lg w-[1000px] sm:w-[1000px] p-6">
//         <h1 className="text-2xl font-bold text-navy-900 mb-6">
//           Campaign Template
//         </h1>

//         {customizeScreen ? (
//           <div className="rounded-lg shadow-sm p-6">
//             <div className="space-y-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Text
//                 </label>
//                 <textarea
//                   value={text}
//                   onChange={(e) => setText(e.target.value)}
//                   className="w-full h-32 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Image
//                 </label>
//                 <div className="flex items-center space-x-2">
//                   <button
//                     onClick={() =>
//                       document.getElementById("file-upload")?.click()
//                     }
//                     className="flex items-center px-4 py-2 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100"
//                   >
//                     Upload
//                   </button>
//                   <input
//                     id="file-upload"
//                     type="file"
//                     className="hidden"
//                     onChange={handleImageUpload}
//                     accept="image/*"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="flex justify-end space-x-3 mt-6">
//               <button
//                 onClick={onClose}
//                 className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={onClose}
//                 className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
//               >
//                 Done
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {templates.map((template) => (
//               <div
//                 key={template.id}
//                 className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-lg shadow-sm"
//               >
//                 <img
//                   src={template.image}
//                   alt={template.title}
//                   className="w-full h-48 object-cover rounded-lg mb-4"
//                 />
//                 <h3 className="font-medium text-lg mb-2">{template.title}</h3>
//                 <p className="text-sm text-gray-600 mb-2">
//                   Text for Plan: {template.plan}
//                 </p>
//                 <p className="text-sm text-gray-600 mb-2">
//                   Call-to-Action: {template.cta}
//                 </p>
//                 <p className="text-sm text-gray-600 mb-2">
//                   {template.confirmation}
//                 </p>
//                 <p className="text-sm text-gray-600 mb-4">{template.trust}</p>

//                 <div className="flex space-x-3">
//                   <button className="flex-1 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700">
//                     Buy Now
//                   </button>
//                   <button
//                     onClick={() => setCustomizeScreen(true)}
//                     className="flex-1 px-4 py-2 text-sm font-medium text-purple-600 bg-white border border-purple-200 rounded-md hover:bg-purple-50"
//                   >
//                     Customize
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CampaignTemplate;

=======
 
/* eslint-disable @typescript-eslint/no-explicit-any */
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161

import { useState, useEffect } from "react";
import { ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
<<<<<<< HEAD
import { fetchWhatsAppTemplatesAction, createWhatsAppTemplateAction } from "../store/actions/whatsappCampaignActions";

type CampaignTemplateProps = {
  onClose: () => void;
};

const CampaignTemplate: React.FC<CampaignTemplateProps> = ({ onClose }) => {
  const [customizeScreen, setCustomizeScreen] = useState(false);
  const [text, setText] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const dispatch = useDispatch();
  
  // Get integrationId from Redux store
  const integrationId = useSelector((state: any) => state.integrationId);
  
  const templates = useSelector((state: any) => state.whatsappTemplates?.templates || []);
  const loading = useSelector((state: any) => state.whatsappTemplates?.loading);

  useEffect(() => {
    if (integrationId) {
      // Fetch templates using integrationId from Redux
      console.log("Fetching templates for integrationId: ", integrationId);
      dispatch(fetchWhatsAppTemplatesAction({ integrationId }));
    } else {
      console.log("IntegrationId not found in Redux store");
    }
  }, [dispatch, integrationId]);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      setImage(URL.createObjectURL(file));
    }
  };

  const handleCreateTemplate = () => {
    const templateData = {
      text,
      image,
    };
    dispatch(createWhatsAppTemplateAction(templateData));
    setCustomizeScreen(false);
=======
import {
  fetchWhatsAppTemplatesAction,
  // createWhatsAppTemplateAction,
} from "../store/actions/whatsappCampaignActions";
import { RootState } from "../store";
import { campaignImageService } from "../api/services/whatsappCampaignService";

type CampaignTemplateProps = {
  onClose: () => void;
  onSelectTemplate: (template: any) => void;
  selectedPhoneNumberId: string;
};

const CampaignTemplate: React.FC<CampaignTemplateProps> = ({
  onClose,
  onSelectTemplate,
  selectedPhoneNumberId,
}) => {
  const [customizeScreen, setCustomizeScreen] = useState(false);
  // const [text, setText] = useState("");
  // const [_image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const dispatch = useDispatch();

  // Grab the array of integrations from Redux
  const crudIntegrationData = useSelector(
    (state: RootState) => state?.crudIntegration?.crudIntegration?.data
  );

  // Make sure it's an array
  const integrationsArray = Array.isArray(crudIntegrationData)
    ? crudIntegrationData
    : [crudIntegrationData];

  // Find the record matching the user's selection
  const chosenIntegration = integrationsArray.find(
    (record: any) => record.phoneNumberId.toString() === selectedPhoneNumberId // or == if your data types vary
  );

  // Extract secretToken
  const integrationId = chosenIntegration?.secretToken;
  console.log("integrationId:", integrationId);

  const templates = useSelector(
    (state: any) => state.whatsappTemplates?.templates?.data || []
  );

  console.log("templates", templates);
  // const loading = useSelector((state: any) => state.whatsappTemplates?.loading);

  useEffect(() => {
    if (integrationId) {
      console.log("integration id ", integrationId);
      dispatch(fetchWhatsAppTemplatesAction(integrationId));
    }
  }, [integrationId, dispatch]);

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      const formData = new FormData();
      formData.append("image", file);

      try {
        const data = await campaignImageService(formData);
        setImageUrl(data.imageUrl); // Assuming your backend responds with { imageUrl: 'url' }
        setFileName(file.name);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  // const handleTemplateSelect = (template: any) => {
  //   console.log("Selected template:", template); // Log to inspect the structure

  //   // Ensure templateName exists
  //   const selectedTemplate = {
  //     ...template,
  //     name: template.templateName , // Assign a fallback name if templateName is missing
  //     body: template.components
  //       ?.filter((comp: any) => comp.type === "BODY")
  //       .map((body: any) => body.text)
  //       .join(" "),
  //     header: imageUrl ? imageUrl : "", // Pass the imageUrl here
  //   };

  //   console.log("Selected Template with Name:", selectedTemplate); // Verify if name is correctly passed

  //   setCustomizeScreen(true);
  // };

  const handleTemplateSelect = (template: any) => {
    console.log("Selected template:", template);

    const mappedTemplate = {
      name: template.templateName,
      body: template.components
        ?.filter((comp: any) => comp.type === "BODY")
        .map((body: any) => body.text)
        .join(" "),
    };

    setSelectedTemplate(mappedTemplate); // Store template in state
    setCustomizeScreen(true);
  };

  // const handleCreateCampaign = (template: any) => {
  //   // const templateData = {
  //   //   text,
  //   //   image,
  //   // };
  //   // dispatch(createWhatsAppTemplateAction(templateData));
  //   // setCustomizeScreen(false);
  //   if (imageUrl) {
  //     console.log("Selected Image URL:", imageUrl);
  //     const selectedTemplate = {
  //       ...template, // Reuse the template object that was selected
  //       name: template.templateName, // Assign a fallback name if templateName is missing
  //       body: template.components
  //         ?.filter((comp: any) => comp.type === "BODY")
  //         .map((body: any) => body.text)
  //         .join(" "),
  //       header: imageUrl, // Now set the uploaded image URL as the header
  //     };

  //     // Pass the finalized template to onSelectTemplate
  //     onSelectTemplate(selectedTemplate);
  //     console.log("Selected Templatessss with Name:", selectedTemplate); // Verify if name is correctly passed
  //   }
  //   onClose();
  // };

  const handleCreateCampaign = () => {
    if (!selectedTemplate) {
      alert("Please select a template first!");
      return;
    }

    const finalTemplate = {
      ...selectedTemplate,
      header: imageUrl || "", // Attach uploaded image if available
    };

    onSelectTemplate(finalTemplate);
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
<<<<<<< HEAD
      <div className="bg-white rounded-lg shadow-lg w-[1000px] sm:w-[1000px] p-6">
        <h1 className="text-2xl font-bold text-navy-900 mb-6">Campaign Template</h1>
=======
      <div className="bg-white rounded-lg shadow-lg w-[1000px] sm:w-[1000px] p-6 relative max-h-[80vh] overflow-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-xl z-10"
        >
          &times;
        </button>

        <h1 className="text-2xl font-bold text-navy-900 mb-6">
          Campaign Template
        </h1>
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161

        {customizeScreen ? (
          <div className="rounded-lg shadow-sm p-6">
            <div className="space-y-6">
<<<<<<< HEAD
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Text</label>
=======
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text
                </label>
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full h-32 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
<<<<<<< HEAD
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => document.getElementById("file-upload")?.click()}
=======
              </div> */}

              <div>
                <label className="block text-xl font-medium text-gray-700 mb-4">
                  Image
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      document.getElementById("file-upload")?.click()
                    }
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
                    className="flex items-center px-4 py-2 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100"
                  >
                    Upload
                  </button>
<<<<<<< HEAD
=======
                  {fileName && (
                    <span className="text-gray-70 0 text-sm ml-2">
                      {fileName}
                    </span>
                  )}
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleImageUpload}
                    accept="image/*"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
<<<<<<< HEAD
                onClick={handleCreateTemplate}
=======
                onClick={handleCreateCampaign}
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<<<<<<< HEAD
            {loading ? (
              <p>Loading templates...</p>
            ) : (
              templates.map((template: any) => (
                <div
                  key={template.id}
                  className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-lg shadow-sm"
                >
                  <img
                    src={template.image}
                    alt={template.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="font-medium text-lg mb-2">{template.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">Text for Plan: {template.plan}</p>
                  <p className="text-sm text-gray-600 mb-2">Call-to-Action: {template.cta}</p>
                  <p className="text-sm text-gray-600 mb-2">{template.confirmation}</p>
                  <p className="text-sm text-gray-600 mb-4">{template.trust}</p>

                  <div className="flex space-x-3">
                    <button className="flex-1 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700">
                      Buy Now
                    </button>
                    <button
                      onClick={() => setCustomizeScreen(true)}
                      className="flex-1 px-4 py-2 text-sm font-medium text-purple-600 bg-white border border-purple-200 rounded-md hover:bg-purple-50"
                    >
                      Customize
                    </button>
                  </div>
                </div>
              ))
            )}
=======
            {templates.map((template: any) => (
              <div
                key={template._id}
                className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-lg shadow-sm"
              >
                <h3 className="font-medium  text-center text-lg mb-2">
                  {template.templateName}
                </h3>

                {/* Displaying header image if available */}
                {template.components?.some(
                  (comp: any) => comp.type === "HEADER"
                ) &&
                  !template.components.some(
                    (comp: any) =>
                      comp.type === "HEADER" && comp.format !== "IMAGE"
                  ) &&
                  template.components
                    .filter(
                      (comp: any) =>
                        comp.type === "HEADER" && comp.format === "IMAGE"
                    )
                    .map((header: any, index: number) => (
                      <img
                        key={index}
                        src={header.example?.header_handle[0]}
                        alt={`Template ${template.templateName} Header`}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    ))}

                {/* Displaying body text */}
                {template.components
                  ?.filter((comp: any) => comp.type === "BODY")
                  .map((body: any, index: number) => (
                    <p key={index} className="text-base  text-gray-600 mb-4">
                      {body.text}
                    </p>
                  ))}

                {/* Displaying buttons if available */}
                {template.components
                  ?.filter((comp: any) => comp.type === "BUTTONS")
                  .map((buttons: any, index: number) => (
                    <div key={index} className="space-x-3 mt-5">
                      {buttons.buttons?.map((button: any, btnIndex: number) => (
                        <a
                          key={btnIndex}
                          href={button.url}
                          className=" block w-full px-4 py-2 text-sm text-center font-medium text-purple-600 bg-white border border-purple-200 rounded-md hover:bg-purple-50"
                        >
                          {button.text}
                        </a>
                      ))}
                    </div>
                  ))}

                <div className="flex justify-end space-x-3 mt-6">
                  {/* <button
                    onClick={() => setCustomizeScreen(true)}
                    className="flex-1 px-4 py-2 text-sm font-medium text-purple-600 bg-white border border-purple-200 rounded-md hover:bg-purple-50"
                  >
                    Customize
                  </button> */}
                  <button
                    onClick={() => handleTemplateSelect(template)}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
                  >
                    Select
                  </button>
                </div>
              </div>
            ))}
>>>>>>> 726e8dc3e5e6d23c51f3b00ededb66a296452161
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignTemplate;
