/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWhatsAppTemplatesAction,
  // createWhatsAppTemplateAction,
} from "../store/actions/whatsappCampaignActions";
import { RootState } from "../store";
import { campaignImageService } from "../api/services/whatsappCampaignService";

type CampaignTemplateProps = {
  onClose: () => void;
  onSelectTemplate: (template: any) => void;
};

const CampaignTemplate: React.FC<CampaignTemplateProps> = ({
  onClose,
  onSelectTemplate,
}) => {
  const [customizeScreen, setCustomizeScreen] = useState(false);
  // const [text, setText] = useState("");
  // const [_image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const dispatch = useDispatch();

  const integrationId = useSelector(
    (state: RootState) =>
      state?.crudIntegration?.crudIntegration?.data?.secretToken
  );
  console.log("Secret Token:", integrationId);

  const templates = useSelector(
    (state: any) => state.whatsappTemplates?.templates?.data || []
  );
  console.log("Templates data:", templates);

  // const loading = useSelector((state: any) => state.whatsappTemplates?.loading);

  useEffect(() => {
    if (integrationId) {
      console.log("Fetching templates for integrationId: ", integrationId);
      dispatch(fetchWhatsAppTemplatesAction(integrationId));
    } else {
      console.log("IntegrationId not found in Redux store");
    }
  }, [dispatch, integrationId]);

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

    console.log("Final Selected Template:", finalTemplate);
    onSelectTemplate(finalTemplate);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
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

        {customizeScreen ? (
          <div className="rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full h-32 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
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
                    className="flex items-center px-4 py-2 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100"
                  >
                    Upload
                  </button>
                  {fileName && (
                    <span className="text-gray-700 text-sm ml-2">
                      {fileName}
                    </span>
                  )}
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
                onClick={handleCreateCampaign}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignTemplate;
