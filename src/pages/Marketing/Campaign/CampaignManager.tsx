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
  stopWhatsAppCampaignService,
} from "../../../api/services/whatsappCampaignService";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import StopIcon from "@mui/icons-material/Stop";
import { Menu, MenuItem, IconButton } from "@mui/material";

interface Campaign {
  campaignId: string;
  campaignName: string;
  status: string;
  isPaused: boolean;
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
  const [anchorEl, setAnchorEl] = useState<{
    [key: string]: null | HTMLElement;
  }>({});

  const campaignData = useSelector(
    (state: RootState) => state?.whatsappCampaign?.campaigns?.data
  );

  console.log("campaign list", campaignData);

  useEffect(() => {
    dispatch(fetchCampaignsAction({ payload: {} })); // Provide an empty payload object
  }, [dispatch]);

  const campaignArray = campaignData
    ? Array.isArray(campaignData)
      ? campaignData
      : [campaignData]
    : [];

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    campaignId: string
  ) => {
    setAnchorEl((prev) => ({ ...prev, [campaignId]: event.currentTarget }));
  };

  const handleMenuClose = (campaignId: string) => {
    setAnchorEl((prev) => ({ ...prev, [campaignId]: null }));
  };

  const handlePauseResume = async (campaign: Campaign) => {
    try {
      setLoadingId(campaign.campaignId); // Show loading indicator

      if (!campaign?.isPaused) {
        await pauseWhatsAppCampaignService(campaign.campaignId);
      } else if (campaign?.isPaused) {
        await resumeWhatsAppCampaignService(campaign.campaignId);
      }

      dispatch(fetchCampaignsAction({ payload: {} }));

      setLoadingId(null);
    } catch (error) {
      console.error("Failed to update campaign status:", error);
      setLoadingId(null);
    }
  };

  const stopCampaign = async (campaign: Campaign) => {
    try {
      setLoadingId(campaign?.campaignId); // Show loading indicator

      await stopWhatsAppCampaignService(campaign.campaignId);
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
            // onClick={() => navigate("/marketing/createcampaign" )}
            onClick={() => {
              console.log(
                "Add Campaign button clicked, navigating to /marketing/createcampaign"
              );
              navigate("/marketing/createcampaign", { replace: true });
            }}
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
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {campaign.campaignName}
                  </h3>
                  <IconButton
                    className="absolute top-1"
                    onClick={(e) => handleMenuOpen(e, campaign.campaignId)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </div>
                <Menu
                  anchorEl={anchorEl[campaign.campaignId]}
                  open={Boolean(anchorEl[campaign.campaignId])}
                  onClose={() => handleMenuClose(campaign.campaignId)}
                >
                  <MenuItem
                    onClick={() =>
                      navigate(`/marketing/editcampaign/${campaign.campaignId}`)
                    }
                  >
                    <EditIcon className="mr-2" /> Edit
                  </MenuItem>
                  <MenuItem
                    onClick={() => handlePauseResume(campaign)}
                    disabled={loadingId === campaign?.campaignId}
                  >
                    {loadingId === campaign.campaignId ? (
                      "Processing..."
                    ) : !campaign?.isPaused ? (
                      <>
                        <PauseIcon className="mr-2" /> Pause
                      </>
                    ) : (
                      <>
                        <PlayArrowIcon className="mr-2" /> Resume
                      </>
                    )}
                  </MenuItem>
                  <MenuItem
                    onClick={() =>
                      navigate(
                        `/marketing/clonecampaign/${campaign.campaignId}`
                      )
                    }
                  >
                    <FileCopyIcon className="mr-2" /> Clone
                  </MenuItem>
                  <MenuItem
                    onClick={() => stopCampaign(campaign)}
                    disabled={loadingId === campaign?.campaignId}
                  >
                    <StopIcon className="mr-2" /> Stop
                  </MenuItem>
                </Menu>
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
