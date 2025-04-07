/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWhatsAppTemplatesAction } from "../store/actions/whatsappCampaignActions";
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
  const [fileName, setFileName] = useState("");
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const dispatch = useDispatch();

  // Get integrations from Redux and ensure it's an array.
  const crudIntegrationData = useSelector(
    (state: RootState) => state?.crudIntegration?.crudIntegration?.data
  );
  const integrationsArray = Array.isArray(crudIntegrationData)
    ? crudIntegrationData
    : [crudIntegrationData];

  // Find the integration matching the selectedPhoneNumberId.
  const chosenIntegration = integrationsArray.find(
    (record: any) => record.phoneNumberId.toString() === selectedPhoneNumberId
  );
  const integrationId = chosenIntegration?.secretToken;
  console.log("integrationId:", integrationId);

  // Fetch templates using the integration's secretToken.
  const templates = useSelector(
    (state: any) => state.whatsappTemplates?.templates?.data || []
  );
  console.log("templates", templates);

  useEffect(() => {
    if (integrationId) {
      console.log("integration id", integrationId);
      dispatch(fetchWhatsAppTemplatesAction(integrationId));
    }
  }, [integrationId, dispatch]);

  // Allow the user to upload media (image or video) to override the header
  const handleMediaUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      const formData = new FormData();
      formData.append("media", file);

      try {
        const data = await campaignImageService(formData);
        setMediaUrl(data.imageUrl); // Expected response: { imageUrl: 'url' }
        setFileName(file.name);
      } catch (error) {
        console.error("Error uploading media:", error);
      }
    }
  };

  // When a template is selected, map its data for customization.
  const handleTemplateSelect = (template: any) => {
    console.log("Selected template:", template);
    // Use the header's s3Url if available.
    const headerUrl = template.header?.s3Url || "";
    const headerType = template.header?.type || "IMAGE"; // Make sure this comes from API

    const mappedTemplate = {
      template: {
        name: template.templateName,
        body: template.body?.text || "",
        header: mediaUrl || headerUrl,
        headerType: headerType, // can be "IMAGE", "VIDEO", or "DOCUMENT"
        footer: template.footer?.text || "",
        buttons: template.buttons || [],
      },
    };
    setSelectedTemplate(mappedTemplate);
    setCustomizeScreen(true);
  };

  // Finalize the template and pass it to the parent.
  const handleCreateCampaign = () => {
    if (!selectedTemplate) {
      alert("Please select a template first!");
      return;
    }
    // Preserve the original header if no override was provided.
    const finalTemplate = {
      ...selectedTemplate.template,
      header: mediaUrl || selectedTemplate.template.header,
    };
    onSelectTemplate(finalTemplate);
    onClose();
  };

  // Helper function to render header media based on type
  const renderHeaderMedia = (template: any) => {
    if (!template.header?.s3Url) return null;

    const headerType = template.header?.type || "IMAGE";

    if (headerType === "VIDEO") {
      return (
        <video
          src={template.header.s3Url}
          controls
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      );
    } else if (headerType === "IMAGE") {
      return (
        <img
          src={template.header.s3Url}
          alt={`Template ${template.templateName} Header`}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      );
    } else if (headerType === "DOCUMENT") {
      return (
        <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-lg mb-4">
          <div className="text-center">
            <div className="text-gray-500 text-xl mb-2">📄</div>
            <div className="text-sm text-gray-700">Document</div>
          </div>
        </div>
      );
    }

    return null;
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
              <div>
                <label className="block text-xl font-medium text-gray-700 mb-4">
                  {selectedTemplate?.template?.headerType === "VIDEO"
                    ? "Video"
                    : "Image"}
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
                    onChange={handleMediaUpload}
                    accept={
                      selectedTemplate?.template?.headerType === "VIDEO"
                        ? "video/*"
                        : "image/*"
                    }
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
                <h3 className="font-medium text-center text-lg mb-2">
                  {template.templateName}
                </h3>

                {/* Display header media based on type */}
                {renderHeaderMedia(template)}

                {/* Display body text */}
                {template.body && (
                  <p className="text-base text-gray-600 mb-4">
                    {template.body.text}
                  </p>
                )}

                {/* Display buttons if available */}
                {template.buttons && template.buttons.length > 0 && (
                  <div className="space-x-3 mt-5">
                    {template.buttons.map((button: any, btnIndex: number) => (
                      <a
                        key={btnIndex}
                        href={button.url}
                        className="block w-full px-4 py-2 text-sm text-center font-medium text-purple-600 bg-white border border-purple-200 rounded-md hover:bg-purple-50"
                      >
                        {button.text}
                      </a>
                    ))}
                  </div>
                )}
                <div className="flex justify-end space-x-3 mt-6">
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
