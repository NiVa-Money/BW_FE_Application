/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWhatsAppTemplatesAction } from "../store/actions/whatsappCampaignActions";
import { RootState } from "../store";

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
  const dispatch = useDispatch();

  const crudIntegrationData = useSelector(
    (state: RootState) => state?.crudIntegration?.crudIntegration?.data
  );
  const integrationsArray = Array.isArray(crudIntegrationData)
    ? crudIntegrationData
    : [crudIntegrationData];

  const chosenIntegration = integrationsArray.find(
    (record: any) => record.phoneNumberId.toString() === selectedPhoneNumberId
  );
  const integrationId = chosenIntegration?.secretToken;

  const templates = useSelector(
    (state: any) => state.whatsappTemplates?.templates?.data || []
  );

  useEffect(() => {
    if (integrationId) {
      dispatch(fetchWhatsAppTemplatesAction(integrationId));
    }
  }, [integrationId, dispatch]);

  const handleTemplateSelect = (template: any) => {
    const mappedTemplate = {
      name: template.templateName,
      body: template.body?.text || "",
      header: template.header?.s3Url || "",
      headerType: template.header?.type,
      footer: template.footer?.text || "",
      buttons: template.buttons || [],
      id: template._id,
    };

    console.log("Mapped template data:", mappedTemplate);

    onSelectTemplate(mappedTemplate);
    onClose();
  };

  const renderHeaderMedia = (template: any) => {
    if (!template.header?.s3Url) return null;

    const headerType = template.header?.type || "IMAGE";

    if (headerType === "VIDEO") {
      return (
        <video
          src={template.header.s3Url}
          controls
          playsInline
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
          ×
        </button>

        <h1 className="text-2xl font-bold text-navy-900 mb-6">
          Campaign Template
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {templates.map((template: any) => (
            <div
              key={template._id}
              className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-lg shadow-sm"
            >
              {/* Template Name and Status */}
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-lg">{template.templateName}</h3>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    template.status === "APPROVED"
                      ? "bg-green-100 text-green-800"
                      : template.status === "REJECTED"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {template.status}
                </span>
              </div>

              {renderHeaderMedia(template)}

              {template.body && (
                <p className="text-base text-gray-600 mb-4">
                  {template.body.text}
                </p>
              )}

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
      </div>
    </div>
  );
};

export default CampaignTemplate;
