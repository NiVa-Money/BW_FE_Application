/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { WhatsApp, Upload } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { convertCsvToJsonService, editWhatsAppCampaignService } from "../../../api/services/whatsappCampaignService";

const EditWhatsappCampaign: React.FC = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();
  
  // State management
  const [campaignName, setCampaignName] = useState<string>("");
  const [contactList, setContactList] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleCampaignNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCampaignName(e.target.value);
  };

  const handleContactListUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setContactList(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Create campaign data object
      const campaignData: any = {
        campaignName
      };
      
      // If a new contact list was uploaded, process it
      if (contactList) {
        const formData = new FormData();
        formData.append("file", contactList);
        
        // Convert CSV to JSON
        const contactsData = await convertCsvToJsonService(formData);
        campaignData.newContactsUrl = contactsData.fileUrl; // Assuming the API returns a fileUrl
      }
      
      // Call the edit campaign service
      await editWhatsAppCampaignService(campaignId!, campaignData);
      
      setSuccess(true);
      // Navigate back or show success message
      setTimeout(() => {
        navigate("/marketing/campaign");
      }, 2000);
      
    } catch (err) {
      console.error("Failed to update campaign:", err);
      setError("Failed to update campaign. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch existing campaign data on component mount
  useEffect(() => {
    const fetchCampaignData = async () => {
      // You would need to add a service function to fetch a single campaign's details
      // For now, this is left as a placeholder
      try {
        setIsLoading(true);
        // const response = await fetchCampaignByIdService(campaignId!);
        // setCampaignName(response.campaignName);
        
        // Placeholder for now - replace with actual API call
        setCampaignName("Campaign " + campaignId);
      } catch (err) {
        console.error("Failed to fetch campaign:", err);
        setError("Failed to load campaign data");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (campaignId) {
      fetchCampaignData();
    }
  }, [campaignId]);

  return (
    <div className="flex flex-col max-w-full bg-white items-center justify-center">
      <div className="w-full max-w-[1400px] p-4">
        {/* Header Section */}
        <div className="flex flex-col justify-center w-full text-2xl text-slate-700 mb-4">
          <div className="flex items-center text-3xl font-semibold mb-4">
            <WhatsApp className="mr-2 text-green-500" sx={{ fontSize: 40 }} />
            Edit WhatsApp Campaign
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Campaign updated successfully!
          </div>
        )}

        <div className="flex flex-wrap gap-4 mt-10">
          {/* Right Section */}
          <div className="flex flex-col ml-5 flex-1 shrink basis-0 min-w-[240px]">
            {/* Campaign Name */}
            <div className="flex flex-col w-full mb-4">
              <label className="text-slate-700">Campaign Name *</label>
              <input
                type="text"
                value={campaignName}
                onChange={handleCampaignNameChange}
                placeholder="Enter your Campaign Name"
                className="flex-1 px-4 py-3 bg-slate-500 bg-opacity-10 rounded-md"
              />
            </div>
            <div className="flex flex-col w-full font-[number:var(--sds-typography-body-font-weight-regular)] text-[length:var(--sds-typography-body-size-medium)]">
              <div className="leading-snug text-[color:var(--sds-color-text-default-default)]">
                Upload The Contact List *
              </div>
              <div className="mt-2 leading-6 text-zinc-500">
                Upload the contact list you wish to target with your campaigns
                on WhatsApp. The CSV file should only include the following
                columns: name, number, and country code. <br />
                <strong>Only CSV files are allowed.</strong>
              </div>
            </div>
            <div className="flex gap-2.5 items-start mt-2.5 w-full">
              {/* Upload CSV Button */}
              <div className="flex items-center p-3 border border-slate-500 rounded-3xl">
                <input
                  type="file"
                  onChange={handleContactListUpload}
                  className="hidden"
                  id="contact-upload"
                  accept=".csv"
                />
                <label
                  htmlFor="contact-upload"
                  className="flex gap-2 items-center cursor-pointer"
                >
                  <Upload sx={{ fontSize: 24 }} />
                  <span className="ml-2 text-zinc-400">
                    {contactList ? contactList.name : "Upload CSV"}
                  </span>
                </label>
              </div>
            </div>

            <div className="flex justify-center mt-4 gap-4">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className={`flex gap-2 w-full min-h-[50px] whitespace-nowrap justify-center items-center text-2xl font-medium text-gray-100 
                ${isLoading ? 'bg-gray-400' : 'bg-[#65558F]'} rounded-3xl`}
              >
                {isLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditWhatsappCampaign;