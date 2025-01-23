/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { WhatsApp } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import CampaignTemplate from "../../../components/CampaignTemplate";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { createWhatsAppCampaignAction } from "../../../store/actions/whatsappCampaignActions";


const WhatsappCampaign: React.FC = () => {
  const [whatsappNumber, setWhatsappNumber] = useState<string>("");
  const [mode, setMode] = useState<"Text" | "Image" | "Template">("Text");
  const [campaignName, setCampaignName] = useState<string>("");
  const [contactList, setContactList] = useState<File | null>(null);
  const [scheduleDate, setScheduleDate] = useState<Date | null>(null);
  const [showTemplate, setShowTemplate] = useState<boolean>(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useSelector((state: RootState) => state.whatsappCampaign);

  // Handlers for user inputs
  const handleWhatsappNumberChange = (value: string) => {
    setWhatsappNumber(value);
  };

  const handleCampaignNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCampaignName(event.target.value);
  };

  const handleContactListUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const file = event.target.files[0];
      const validFileTypes = ["application/pdf", "text/csv"]; // Valid MIME types for PDF and CSV files

      // Check if the file is a valid type
      if (validFileTypes.includes(file.type)) {
        setContactList(file);
      } else {
        alert("Please upload a valid CSV or PDF file.");
      }
    }
  };

  const handleModeChange = (selectedMode: "Text" | "Image" | "Template") => {
    setMode(selectedMode);
    setShowTemplate(selectedMode === "Template");
  };

  const { loading, success } = useSelector(
    (state: RootState) => state.whatsappCampaign
  );

  const handleSave = () => {
    const campaignPayload = {
      campaignName,
      channel: "whatsapp",
      phoneNumberId: whatsappNumber === "Number1" ? 1234567890 : 9876543210,
      schedule: scheduleDate ? scheduleDate.toISOString() : "",
      endDate: scheduleDate
        ? new Date(scheduleDate.getTime() + 24 * 60 * 60 * 1000).toISOString()
        : "",
      contactsUrl: contactList ? URL.createObjectURL(contactList) : "",
      messageType: mode.toLowerCase(),
      messageContent: {
        text: mode === "Text" ? "Campaign message here" : "",
        template: mode === "Template" ? {
          name: "order_notification",
          language: "en",
          header: { image: "https://example.com/image.png" },
          body: {
            text: ["Your order has been shipped!", "Your package is on its way!"],
          },
        } : null,
        image: mode === "Image" ? {
          url: "https://example.com/image.png",
          caption: "Image description",
        } : null,
      },
    };

    // Dispatch using your existing action creator
    dispatch(createWhatsAppCampaignAction(campaignPayload));
    alert('campaign is made')
    navigate("/marketing/dashboard");
  };

  React.useEffect(() => {
    if (success && !loading) {
      navigate("/marketing/dashboard");
    }
  }, [success, loading, navigate]);

  const handleGoWizard = () => {
    alert("AI Wizard feature is under development!");
  };

  return (
    <div className="flex flex-col max-w-full bg-white items-center justify-center">
      <div className="w-full max-w-[1400px] p-4">
        {/* Header Section */}
        <div className="flex flex-col justify-center w-full text-2xl text-slate-700 mb-4">
          <div className="flex items-center text-3xl font-semibold mb-4">
            <WhatsApp className="mr-2 text-green-500" sx={{ fontSize: 40 }} />
            WhatsApp
          </div>
          <div>
            Please choose the bot you wish to implement for the WhatsApp
            Integration.
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-10">
          {/* Left Section */}
          <div className="flex flex-col flex-1 shrink basis-0 min-w-[240px]">
            {/* WhatsApp Number */}
            <div className="flex flex-col w-full mb-4">
              <label className="leading-snug text-slate-700">
                Choose WhatsApp Number *
              </label>
              <select
                value={whatsappNumber}
                onChange={(e) => handleWhatsappNumberChange(e.target.value)}
                className="flex-1 px-4 py-3 bg-slate-500 bg-opacity-10 rounded-md text-slate-700"
              >
                <option value="">Select</option>
                <option value="Number1">+1234567890</option>
                <option value="Number2">+9876543210</option>
              </select>
            </div>

            {/* Mode Selection */}
            <div className="flex flex-col w-full mb-4">
              <label className="text-slate-700">Mode*</label>
              <p className=" text-zinc-500">Select Mode for marketing</p>
              <div className="flex gap-0 justify-center items-center w-full mt-4 text-sm font-medium text-center min-h-[48px]">
                {["Text", "Image", "Template"].map((m) => (
                  <div
                    key={m}
                    onClick={() =>
                      handleModeChange(m as "Text" | "Image" | "Template")
                    }
                    className={`flex flex-1 justify-center border rounded-full min-h-[48px] px-3 py-2.5 cursor-pointer ${
                      mode === m ? "bg-purple-200" : "bg-white"
                    }`}
                  >
                    {m}
                  </div>
                ))}
              </div>
            </div>

            {/* Mode-Specific Input */}
            <div className="flex flex-col w-full mb-4">
              {mode === "Text" && (
                <div className="flex flex-col w-full mb-4">
                  <label className="text-slate-700 ml-2 mb-2">
                    Message Content *
                  </label>
                  <textarea
                    placeholder="Enter your message content"
                    className="flex-1 px-4 py-3 bg-slate-500 bg-opacity-10 rounded-md"
                  />
                </div>
              )}
              {mode === "Image" && (
                <div>
                  <label className="text-slate-700 ml-2">Upload Image *</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="flex-1 px-4 py-3 bg-slate-500 bg-opacity-10 rounded-md"
                  />
                </div>
              )}
            </div>

            {/* Schedule Date */}
            <div className="flex flex-col w-full mb-4">
              <label className="text-slate-700">Schedule</label>
              <p className="mt-2 mb-2 text-zinc-500">
                When would you like to schedule your marketing campaign?
              </p>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={scheduleDate}
                  onChange={(newValue) => setScheduleDate(newValue)}
                  slotProps={{
                    textField: {
                      variant: "outlined",
                      fullWidth: true,
                    },
                  }}
                />
              </LocalizationProvider>
              <p className="mt-4 text-zinc-600 text-sm">
                <b>Note: </b> The campaign will remain active for one day, and
                user responses during this period will be captured.
              </p>
            </div>
          </div>

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
                Upload the contact list you wish to target with your messages or
                campaigns on WhatsApp, or choose from an existing contact list.{" "}
                <b>Only CSV files are allowed.</b>
              </div>
            </div>
            <div className="flex gap-2.5 items-start mt-2.5 w-full">
              <div className="flex flex-1 shrink justify-between items-center p-2.5 text-base leading-loose whitespace-nowrap rounded-xl basis-0 bg-slate-500 bg-opacity-10 min-w-[240px] text-zinc-400">
                <div className="flex flex-1 shrink gap-6 items-center self-stretch my-auto w-full basis-0">
                  <div className="flex-1 shrink self-stretch my-auto basis-0 rotate-[2.4492937051703357e-16rad]">
                    Select
                  </div>
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/d7a3b5dd0609c745ad372bdf306b2409d8dcd4192e8761806f32a2e0800a69f6?placeholderIfAbsent=true&apiKey=555c811dd3f44fc79b6b2689129389e8"
                    className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
                  />
                </div>
              </div>

              <div className="flex items-center p-3 border border-slate-500 rounded-3xl">
                <input
                  type="file"
                  onChange={handleContactListUpload}
                  className="hidden"
                  id="contact-upload"
                />
                <label
                  htmlFor="contact-upload"
                  className="flex gap-2 items-center cursor-pointer"
                >
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/99164b9ccb15cd85c49756bfef0c2886ede9266c6fb26304a973774410b942d4"
                    alt="Upload icon"
                    className="w-6 aspect-square"
                  />
                  <span className="ml-2 text-zinc-400">Upload</span>
                </label>
              </div>
            </div>

            <div className="flex flex-col w-full font-[number:var(--sds-typography-body-font-weight-regular)] text-[length:var(--sds-typography-body-size-medium)]">
              <div className="leading-snug mt-4 text-[color:var(--sds-color-text-default-default)]">
                Bot Configuration
              </div>
              <div className="mt-2 leading-6 text-zinc-500">
                Choose The Knowledge Base or Upload The Knowledge Base
              </div>
            </div>
            <div className="flex gap-2.5 items-start mt-2.5 w-full">
              <div className="flex flex-1 shrink justify-between items-center p-2.5 text-base leading-loose whitespace-nowrap rounded-xl basis-0 bg-slate-500 bg-opacity-10 min-w-[240px] text-zinc-400">
                <div className="flex flex-1 shrink gap-6 items-center self-stretch my-auto w-full basis-0">
                  <div className="flex-1 shrink self-stretch my-auto basis-0 rotate-[2.4492937051703357e-16rad]">
                    Select
                  </div>
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/d7a3b5dd0609c745ad372bdf306b2409d8dcd4192e8761806f32a2e0800a69f6?placeholderIfAbsent=true&apiKey=555c811dd3f44fc79b6b2689129389e8"
                    className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
                  />
                </div>
              </div>
              <div className="flex items-center p-3 border border-slate-500 rounded-3xl">
                <input
                  type="file"
                  onChange={handleContactListUpload}
                  className="hidden"
                  id="contact-upload"
                />
                <label
                  htmlFor="contact-upload"
                  className="flex gap-2 items-center cursor-pointer"
                >
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/99164b9ccb15cd85c49756bfef0c2886ede9266c6fb26304a973774410b942d4"
                    alt="Upload icon"
                    className="w-6 aspect-square"
                  />
                  <span className="ml-2 text-zinc-400">Upload</span>
                </label>
              </div>
            </div>

            {/* AI Wizard */}
            <div
              className="flex flex-col w-full mb-4 mt-5 rounded-3xl p-4 bg-white border-4"
              style={{
                borderStyle: "solid",
                borderImage:
                  "linear-gradient(to right, #E4E748 7%, #C0EE24 20%, #A5FFD6 23%, #27D692 36%, #4BA2A4 41%, #418DF9 45%, #A5FFD6 50%, #418DF9 53%, #00C2FF 56%, #A5FFD6 85%, #4BA2A4 91%) 1",
              }}
            >
              <label className="text-slate-700 font-medium text-lg">
                AI Wizard
              </label>
              <p className="mt-1 text-zinc-500">
                Allow our Wizard AI to assist you in creating the perfect
                template for your campaign.
              </p>

              <button
                onClick={handleGoWizard}
                className="flex w-[200px] whitespace-nowrap justify-center mt-2 py-2 text-lg font-medium text-gray-100 bg-[#65558F] rounded-3xl"
              >
                Go Wizard
              </button>
            </div>

            {/* Bottom Buttons */}
            <div className="flex justify-center mt-4 gap-4">
              <button
                onClick={handleSave}
                className="flex gap-2 w-[200px] whitespace-nowrap justify-center items-center text-xl font-medium text-gray-100 bg-[#65558F] rounded-3xl"
              >
                Save
              </button>
              <button className="flex gap-2 w-[200px] whitespace-nowrap border-black justify-center items-center py-2 text-xl font-medium text-black border bg-transparent rounded-3xl">
                Create New
              </button>
            </div>
          </div>
          {showTemplate && (
            <CampaignTemplate onClose={() => setShowTemplate(false)} />
          )}

          {/* WhatsApp Preview */}
          <div className="flex flex-col flex-1 shrink basis-0 min-w-[240px]">
            <img
              src="/assets/WhatsappCampaign.svg"
              alt="Whatsapp Campaign"
              className="w-full h-[700px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsappCampaign;
