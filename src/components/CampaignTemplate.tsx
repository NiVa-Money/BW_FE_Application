/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWhatsAppTemplatesAction,
  createWhatsAppTemplateAction,
} from "../store/actions/whatsappCampaignActions";
import { RootState } from "../store";

type CampaignTemplateProps = {
  onClose: () => void;
};

const CampaignTemplate: React.FC<CampaignTemplateProps> = ({ onClose }) => {
  const [customizeScreen, setCustomizeScreen] = useState(false);
  const [text, setText] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const dispatch = useDispatch();

  const secretToken = useSelector(
    (state: RootState) =>
      state?.crudIntegration?.crudIntegration?.data?.secretToken
  );
  console.log("Secret Token:", secretToken);

  const templates = useSelector(
    (state: any) => state.whatsappTemplates?.templates || []
  );
  const loading = useSelector((state: any) => state.whatsappTemplates?.loading);

  useEffect(() => {
    if (secretToken) {
      console.log("Fetching templates for integrationId: ", secretToken);
      dispatch(fetchWhatsAppTemplatesAction({ secretToken }));
    } else {
      console.log("IntegrationId not found in Redux store");
    }
  }, [dispatch, secretToken]);

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
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <div className="bg-white rounded-lg shadow-lg w-[1000px] sm:w-[1000px] p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-xl"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full h-32 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                onClick={handleCreateTemplate}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <p className="text-sm text-gray-600 mb-2">
                    Text for Plan: {template.plan}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    Call-to-Action: {template.cta}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    {template.confirmation}
                  </p>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignTemplate;
