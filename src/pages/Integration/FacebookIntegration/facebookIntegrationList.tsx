/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { getFacebookIntegrations } from "../../../api/services/integrationServices";

interface FacebookIntegration {
  id: string;
  botId: string;
  botName: string;
  accessToken: string;
  secretToken: string;
  webhookUrl?: string;
  commentEngagementEnable: boolean;
  commentEngagementMode: string;
  commentAutoReplyMessage: string;
  dmEngagementEnable: boolean;
  dmEngagementMode: string;
  dmAutoReplyMessage: string;
  isWebhookActive: boolean;
  isActive: boolean;
  createdAt: string;
}

export default function FacebookIntegrationList() {
  const [integrations, setIntegrations] = useState<FacebookIntegration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFacebookIntegrations = async () => {
      try {
        const response = await getFacebookIntegrations();
        console.log("API Response:", response.data);
        if (response.data) {
          setIntegrations(
            response.data.map((integration: any) => ({
              id: integration._id,
              botId: integration.botId,
              botName: integration.facebookPageName || "Unnamed Page",
              accessToken: integration.accessToken,
              secretToken: integration.webhookSecretToken,
              webhookUrl: integration.isWebhookActive
                ? "Webhook Active"
                : "Not Set",
              commentEngagementEnable: integration.isCommentEngagementEnabled,
              commentEngagementMode: integration.commentEngagementMode,
              commentAutoReplyMessage: integration.commentAutoReplyMessage,
              dmEngagementEnable: integration.isDmEngagementEnabled,
              dmEngagementMode: integration.dmEngagementMode,
              dmAutoReplyMessage: integration.dmAutoReplyMessage,
              isWebhookActive: integration.isWebhookActive,
              isActive: integration.isActive ?? false,
              createdAt: new Date(integration.createdAt).toLocaleString(),
            }))
          );
        } else {
          setIntegrations([]);
        }
      } catch {
        setError("Failed to load Facebook integrations.");
      } finally {
        setLoading(false);
      }
    };

    fetchFacebookIntegrations();
  }, []);

  const handleEdit = (integration: FacebookIntegration) => {
    navigate(`/editFacebookIntegration`, { state: { integration } });
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Facebook Integrations
          </h2>
          <button
            className="bg-[#65558F] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#65558F]/90 transition-colors flex items-center gap-2"
            onClick={() => navigate("/createFacebookIntegration")}
          >
            <AddIcon /> Add Integration
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading integrations...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : integrations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrations.map((integration) => (
              <div
                key={integration.id}
                className="bg-white shadow-md rounded-lg p-6 border border-gray-200 w-full max-w-[400px] mx-auto"
              >
                <h3 className="text-xl font-semibold text-gray-800">
                  {integration.botName}
                </h3>

                <div className="mt-4 space-y-2">
                  <p>
                    <span className="font-medium text-gray-700">Bot ID:</span>{" "}
                    {integration.botId}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">
                      Access Token:
                    </span>{" "}
                    <span
                      className="truncate block w-64"
                      title={integration.accessToken}
                    >
                      {integration.accessToken}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">
                      Secret Token:
                    </span>{" "}
                    <span
                      className="truncate block w-64"
                      title={integration.secretToken}
                    >
                      {integration.secretToken}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">Webhook:</span>{" "}
                    {integration.webhookUrl}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">
                      Webhook Active:
                    </span>{" "}
                    {integration.isWebhookActive ? "Yes" : "No"}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">
                      Account Active:
                    </span>{" "}
                    {integration.isActive ? "Yes" : "No"}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">
                      Comments Enabled:
                    </span>{" "}
                    {integration.commentEngagementEnable ? "Yes" : "No"}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">
                      Comment Mode:
                    </span>{" "}
                    {integration.commentEngagementMode}
                  </p>
                  {integration.commentAutoReplyMessage && (
                    <p>
                      <span className="font-medium text-gray-700">
                        Comment Auto-Reply:
                      </span>{" "}
                      {integration.commentAutoReplyMessage}
                    </p>
                  )}
                  <p>
                    <span className="font-medium text-gray-700">
                      DMs Enabled:
                    </span>{" "}
                    {integration.dmEngagementEnable ? "Yes" : "No"}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">DM Mode:</span>{" "}
                    {integration.dmEngagementMode}
                  </p>
                  {integration.dmAutoReplyMessage && (
                    <p>
                      <span className="font-medium text-gray-700">
                        DM Auto-Reply:
                      </span>{" "}
                      {integration.dmAutoReplyMessage}
                    </p>
                  )}
                  <p className="text-sm text-gray-500">
                    Created At: {integration.createdAt}
                  </p>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleEdit(integration)}
                    className="text-gray-100 bg-[#65558F] rounded-3xl px-4 py-2 flex items-center gap-2 hover:bg-[#65558F]/90 transition-colors"
                  >
                    <EditIcon /> Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">
            No Facebook integrations found.
          </p>
        )}
      </div>
    </div>
  );
}
