import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { RootState } from "../../../store";
import { useNavigate } from "react-router-dom";
import { fetchCampaignsAction } from "../../../store/actions/whatsappCampaignActions";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import {
  pauseWhatsAppCampaignService,
  resumeWhatsAppCampaignService,
} from "../../../api/services/whatsappCampaignService";

interface Campaign {
  campaignId: string;
  campaignName: string;
  status: string;
  channel: string;
  startDate: string;
  endDate: string;
  integrationId: string;
  templateId: string;
  template: {
    templateName: string;
    language: string;
    header?: {
      type: string;
      content?: string;
      s3Url?: string;
    };
    body?: {
      text: string;
      parameters?: {
        type: string;
        example: {
          positional: string[];
        };
      };
    };
    buttons?: {
      type: string;
      text: string;
    }[];
    footer?: {
      text: string;
    };
  };
}

export default function CampaignManager() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const campaignData = useSelector(
    (state: RootState) => state?.whatsappCampaign?.campaigns?.data
  );

  console.log("campaign list", campaignData);

  // useEffect(() => {
  //   if (campaignData && Array.isArray(campaignData)) {
  //     campaignData.forEach((campaign) => {
  //       console.log('camoa')
  //       dispatch(fetchCampaignsAction({ payload: { campaignId: campaign.campaignId } }));
  //     });
  //   }
  // }, [dispatch, campaignData]);

  useEffect(() => {
    console.log("api call happening");
    dispatch(fetchCampaignsAction({ payload: {} })); // Provide an empty payload object
  }, [dispatch]);

  const campaignArray = campaignData
    ? Array.isArray(campaignData)
      ? campaignData
      : [campaignData]
    : [];

  const handlePauseResume = async (campaign: Campaign) => {
    try {
      setLoadingId(campaign.campaignId); // Show loading indicator

      if (campaign.status === "active") {
        await pauseWhatsAppCampaignService(campaign.campaignId);
        campaign.status = "inactive"; // Update local UI state
      } else {
        await resumeWhatsAppCampaignService(campaign.campaignId);
        campaign.status = "active"; // Update local UI state
      }

      setLoadingId(null);
    } catch (error) {
      console.error("Failed to update campaign status:", error);
      setLoadingId(null);
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Active Campaigns</h2>
          <button
            className="bg-[#65558F] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#65558F]/90 transition-colors flex items-center gap-2"
            onClick={() => navigate("/marketing/createcampaign")}
          >
            <AddIcon /> Add Campaign
          </button>
        </div>

        {campaignArray.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaignArray.map((campaign: Campaign) => (
              <div
                key={campaign.campaignId}
                className="bg-white shadow-md rounded-lg p-6 border border-gray-200 w-full max-w-[400px] mx-auto"
              >
                <h3 className="text-xl font-semibold text-gray-800">
                  {campaign.campaignName}
                </h3>
                {campaign.template?.header?.s3Url && (
                  <div className="mt-2">
                    <img
                      src={campaign.template.header.s3Url}
                      alt="Template Header"
                      className="w-full h-40 object-cover rounded-md"
                    />
                  </div>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  Message:{" "}
                  <span className="font-medium">
                    {campaign.template?.body?.text || "No message"}
                  </span>
                </p>
                {campaign.template?.buttons &&
                  campaign.template.buttons.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">
                        Buttons used in template:
                      </p>
                      <div className="flex gap-2 mt-1">
                        {campaign.template.buttons.map((button, index) => (
                          <button
                            key={index}
                            className="p-2 bg-[#005C4B] text-white rounded-lg"
                          >
                            {button.text}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                {campaign.template?.footer && (
                  <p className="text-sm text-gray-500 mt-2">
                    Footer:{" "}
                    <span className="font-medium">
                      {campaign.template.footer.text}
                    </span>
                  </p>
                )}

                <p className="text-sm text-gray-500">
                  Status: <span className="font-medium">{campaign.status}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Scheduled:{" "}
                  <span className="font-medium">
                    {new Date(campaign.startDate).toLocaleString()}
                  </span>{" "}
                  -{" "}
                  <span className="font-medium">
                    {new Date(campaign.endDate).toLocaleString()}
                  </span>
                </p>

                <div className="mt-4 flex gap-4 justify-end">
                  <button
                    className="text-gray-100 bg-[#65558F] rounded-3xl px-4 py-2 flex items-center gap-2 hover:bg-purple-400 transition-colors"
                    onClick={() => handlePauseResume(campaign)}
                    disabled={loadingId === campaign.campaignId}
                  >
                    {loadingId === campaign.campaignId ? (
                      "Processing..."
                    ) : campaign.status === "active" ? (
                      <>
                        <PauseIcon /> Pause
                      </>
                    ) : (
                      <>
                        <PlayArrowIcon /> Resume
                      </>
                    )}
                  </button>
                  <button className="text-gray-100 bg-[#65558F] rounded-3xl px-4 py-2 flex items-center gap-2 hover:bg-purple-400 transition-colors">
                    <EditIcon /> Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No Campaigns found.</p>
        )}
      </div>
    </div>
  );
}
