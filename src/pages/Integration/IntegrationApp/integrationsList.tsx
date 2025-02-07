import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { getWhatsappRequest } from "../../../store/actions/integrationActions";
import { RootState } from "../../../store";
import { useNavigate } from "react-router-dom";

interface Integration {
  id: number;
  provider: string;
  bot: string;
  mobileNumber: string;
  mobileNumberId: string;
  status: string;
  appId: string;
  businessAccountId: string;
}

const IntegrationCard = ({ integration }: { integration: Integration }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white p-6 rounded-lg mb-4 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
            alt="WhatsApp Icon"
            className="w-16 h-16"
          />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {Object.entries(integration).map(
              ([key, value]) =>
                key !== "id" &&
                key !== "status" && (
                  <div
                    key={key}
                    className="flex justify-center flex-col whitespace-nowrap"
                  >
                    <p className="text-sm font-medium text-gray-500">
                      {key.replace(/([A-Z])/g, " $1").toUpperCase()}
                    </p>
                    <p className="text-base font-semibold text-gray-800">
                      {value}
                    </p>
                  </div>
                )
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              // Navigate to /editintegration with the integration id
              navigate(`/editintegration/${integration.id}`);
            }}
            className="text-green-500 hover:text-green-700 flex items-center gap-2"
          >
            <EditIcon /> Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default function IntegrationList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const crudIntegrationData = useSelector(
    (state: RootState) => state?.crudIntegration?.crudIntegration?.data
  );

  useEffect(() => {
    // Dispatch the action without sending botId
    dispatch(getWhatsappRequest("")); // Empty string or null for botId
  }, [dispatch]);

  const handleAddIntegration = () => {
    navigate("/createintegration"); // Navigate to /createintegration
  };

  return (
    <div className="p-8 mt-10 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Active Integrations
          </h2>
          <button
            className="bg-[#65558F] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#65558F]/90 transition-colors flex items-center gap-2"
            onClick={handleAddIntegration} // Show WhatsAppIntegration component when clicked
          >
            <AddIcon /> Add Integration
          </button>
        </div>

        <div>
          {crudIntegrationData && crudIntegrationData.length > 0 ? (
            crudIntegrationData.map((integration: Integration) => (
              <IntegrationCard key={integration.id} integration={integration} />
            ))
          ) : (
            <p className="text-gray-500">No integrations found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
