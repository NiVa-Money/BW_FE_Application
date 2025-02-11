import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { RootState } from "../../../store";
import { useNavigate } from "react-router-dom";
import { fetchCampaignsAction } from "../../../store/actions/whatsappCampaignActions";

interface Campaign {
  campaignId: string;
  campaignName: string;
  userId: string;
  status: string;
  channelName: string;
  scheduleAt: string;
  scheduleEndAt: string;
  phoneNumberId: number;
  messageType: string;
  messageContent: {
    template: {
      name: string;
      language: string;
      header?: {
        image?: string;
      };
      body?: {
        text?: string[];
      };
    };
  };
  contactsUrl: string;
}

export default function CampaignManager() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const campaignData = useSelector(
    (state: RootState) =>
      state?.whatsappCampaign?.campaigns?.data?.campaigns?.whatsapp
  );

  useEffect(() => {
    dispatch(fetchCampaignsAction({ payload: {} }));
  }, [dispatch]);

  const campaignArray = campaignData
    ? Array.isArray(campaignData)
      ? campaignData
      : [campaignData]
    : [];

  return (
    <div className="p-8 mt-10 min-h-screen">
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
                {/* <h3 className="text-xl font-semibold text-gray-800">
                  {campaign.messageContent.template.name}
                </h3> */}
                <h3 className="text-xl font-semibold text-gray-800">
                  {campaign.campaignName}
                </h3>
                <p className="text-sm text-gray-500">
                  Status: <span className="font-medium">{campaign.status}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Scheduled:{" "}
                  <span className="font-medium">
                    {new Date(campaign.scheduleAt).toLocaleString()}
                  </span>{" "}
                  -{" "}
                  <span className="font-medium">
                    {new Date(campaign.scheduleEndAt).toLocaleString()}
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  Channel:{" "}
                  <span className="font-medium">{campaign.channelName}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Message Type:{" "}
                  <span className="font-medium">{campaign.messageType}</span>
                </p>

                {campaign.messageContent.template.header?.image && (
                  <div className="mt-2">
                    <img
                      src={campaign.messageContent.template.header.image}
                      alt="Template Header"
                      className="w-full h-40 object-cover rounded-md"
                    />
                  </div>
                )}

                <p className="text-sm text-gray-500 mt-2">
                  Message:{" "}
                  <span className="font-medium">
                    {campaign.messageContent.template.body?.text?.join(" ") ||
                      "No message"}
                  </span>
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Contacts URL:{" "}
                  <a
                    href={campaign.contactsUrl}
                    className="text-blue-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Contacts
                  </a>
                </p>

                <div className="mt-4 flex justify-end">
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
