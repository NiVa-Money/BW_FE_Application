import {
  Instagram,
  Facebook,
  LinkedIn,
  Twitter,
  MoreVert,
  AttachFile,
  Send,
  Image,
  SmartToy,
  Person,
} from "@mui/icons-material";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { IconButton, Menu, MenuItem } from "@mui/material";
import { useState } from "react";

const EngagementTab = () => {
  const socialPlatforms = [
    { icon: <Instagram />, sentiment: 60 },
    { icon: <Facebook />, sentiment: 60 },
    { icon: <LinkedIn />, sentiment: 60 },
    { icon: <Twitter />, sentiment: 60 },
    { icon: <Twitter />, sentiment: 60 },
  ];

  const userProfiles = [
    { icon: <Facebook />, sentiment: 80 },
    { icon: <Twitter />, sentiment: 50 },
    { icon: <Instagram />, sentiment: 80 },
    { icon: <LinkedIn />, sentiment: 80 },
    { icon: <Instagram />, sentiment: 10 },
    { icon: <Twitter />, sentiment: 50 },
    { icon: <Facebook />, sentiment: 80 },
  ];

  const chartData = [
    { month: "Jan", value: 30 },
    { month: "Feb", value: 45 },
    { month: "Mar", value: 75 },
    { month: "Apr", value: 60 },
    { month: "May", value: 45 },
    { month: "Jun", value: 65 },
    { month: "Jul", value: 55 },
  ];

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-xl font-semibold mb-1">Engagement Tab</h1>
      <p className="text-gray-600 text-sm mb-6">
        Sentiment across all active channels
      </p>

      {/* Social Platform Metrics */}
      <div className="flex gap-8 mb-8">
        {socialPlatforms.map((platform, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="text-gray-700">{platform.icon}</span>
            <div className="w-24 h-1 bg-red-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${platform.sentiment}%` }}
              />
            </div>
            <span className="text-xs text-green-500">
              {platform.sentiment}% Positive
            </span>
          </div>
        ))}
      </div>
      {/* Ticket Section  */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="flex space-x-4 col-span-2">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="relative bg-gray-50 rounded-lg p-4 border border-gray-300 w-[400px] h-[130px] shadow-md overflow-hidden"
            >
              {/* Notches on sides */}
              <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full border border-gray-300"></div>
              <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full border border-gray-300"></div>

              {/* Ticket Content */}
              <div className="border-b border-dashed border-gray-300 pb-2 mb-2 flex justify-between text-xs">
                <div>
                  <p className="text-gray-700 font-semibold">Status</p>
                  <p className="text-sm font-medium">Open/closed</p>
                </div>
                <div>
                  <p className="text-gray-700 font-semibold">Date and Time</p>
                  <p className="text-sm font-medium">01/05/2023</p>
                </div>
              </div>
              <div className="flex justify-between text-xs">
                <div>
                  <p className="text-red-500 font-semibold">Complaint</p>
                  <p className="text-gray-600">Order misplaced</p>
                </div>
                <div>
                  <p className="text-gray-700 font-semibold">Issue Raised by</p>
                  <p className="text-sm font-medium">SJ</p>
                </div>
                <div>
                  <p className="text-gray-700 font-semibold">Platform</p>
                  <p className="text-sm font-medium">Instagram</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Agent Details */}
        <div className="bg-gray-50 ml-6 rounded-lg p-4 w-[300px] shadow-md">
          <h2 className="text-sm font-semibold mb-3">Agent Details</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">No. of chats</p>
              <p className="text-sm font-medium">36</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">Reviews</p>
              <p className="text-sm font-medium">4.5</p>
            </div>
          </div>
        </div>

        {/* Customer Details */}
        <div className="bg-gray-50 rounded-lg p-4 w-[300px] shadow-md">
          <h2 className="text-sm font-semibold mb-3">Customer Details</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">Issue</p>
              <p className="text-sm font-medium text-blue-600">Order mix up</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-600">Want</p>
              <p className="text-sm font-medium">Refund</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Left Column - User Profiles */}
        <div className="col-span-3">
          <div className="bg-[#65558F] bg-opacity-[0.08]  rounded-lg">
            {userProfiles.map((profile, index) => (
              <div
                key={index}
                className="p-3 border-b border-gray-100 flex items-center gap-2"
              >
                <span className="w-8 h-8">{profile.icon}</span>
                <div>
                  <p className="text-base">Jessica@maker</p>
                  <p className="text-base text-gray-500">hello , how are you</p>
                  <p
                    className={`text-base ${
                      profile.sentiment >= 50
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {profile.sentiment}% Positive comment
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Middle Column - Chat */}
        <div className="col-span-5">
          <div className="bg-[#65558F] bg-opacity-[0.08] rounded-lg shadow-lg p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-md font-semibold">Jessica@maker</h2>
                <p className="text-md text-gray-500">Jessica@email.com</p>
              </div>
              {/* <button className="px-4 py-1.5 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1">
                Close Chat
              </button> */}
            </div>

            {/* Chat Messages */}
            <div className="min-h-[200px] mb-4">
              {/* Bot Message */}
              <div className="flex gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#2E2F5F] flex items-center justify-center">
                  <SmartToy className="text-white w-6 h-6" />
                </div>
                <div className="bg-white p-3 rounded-lg max-w-[70%]">
                  <p className="text-sm ">
                    Hi I'm BotWot,
                    <br />
                    How can I assist you today?
                  </p>
                  <p className="text-xs text-gray-500 mt-1">7:30 pm</p>
                </div>
              </div>

              {/* User Message */}
              <div className="flex justify-end mb-4">
                <div className="bg-[#2E2F5F] text-white p-3 rounded-lg max-w-[70%]">
                  <p className="text-sm">I need to book an appointment</p>
                  <p className="text-xs opacity-70 mt-1">7:31 pm</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#2E2F5F] ml-4 flex items-center justify-center">
                  <Person className="text-white w-6 h-6" />
                </div>
              </div>

              {/* Bot Message */}
              <div className="flex gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#2E2F5F] flex items-center justify-center">
                  <SmartToy className="text-white w-6 h-6" />
                </div>
                <div className="bg-white p-3 rounded-lg max-w-[70%]">
                  <p className="text-sm">
                    Sure, when do you want to book this appointment?
                  </p>
                  <p className="text-xs text-gray-500 mt-1">7:32 pm</p>
                </div>
              </div>
            </div>

            {/* Quick Replies */}
            <div className="flex justify-between items-start mt-24 gap-6">
              {/* Quick Replies on the Left */}
              <div className="flex flex-col mt-10 gap-2">
                {["Okay", "Fine", "That works.", "Tell me more."].map(
                  (text, index) => (
                    <button
                      key={index}
                      className="px-4 py-1.5 text-sm bg-purple-50 text-[#65558F] border border-purple-100 rounded-full hover:bg-purple-100"
                    >
                      {text}
                    </button>
                  )
                )}
              </div>

              {/* CSAT Section on the Right */}
              <div className="p-4 bg-[#65558F] mb-4 bg-opacity-[0.08] text-black rounded-lg w-[250px]">
                <div className="flex items-center mb-2">
                  <p className="text-red-400 font-bold text-sm">20% (CSAT)</p>
                </div>
                <div className="w-full h-2 bg-gray-500 rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-green-500 w-[20%]" />
                  <div className="h-full bg-yellow-500 w-[40%]" />
                  <div className="h-full bg-red-500 w-[40%]" />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-black">Chat Cue</span>
                    <span>Customer is anxious</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black">Reason</span>
                    <span>Order mix up</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black">Next Step</span>
                    <span>Confirm order details</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black">Predictive AI</span>
                    <span>High resolution</span>
                  </div>
                </div>
                <hr className="my-2 border-gray-400" />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-black">Emotion</span>
                    <span>Neutral</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black">Intent</span>
                    <span>Inquiry</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black">Sentiment</span>
                    <span>Positive</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Input Area */}
            <div className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg bg-gray-50">
              <button className="p-1.5 hover:bg-gray-200 rounded-full">
                <Image className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-1.5 hover:bg-gray-200 rounded-full">
                <AttachFile className="w-5 h-5 text-gray-600" />
              </button>
              <input
                type="text"
                placeholder="Message"
                className="flex-1 bg-transparent outline-none text-sm"
              />
              <button className="p-1.5 hover:bg-gray-200 rounded-full">
                <Send className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="col-span-4 space-y-4">
          {/* Platform Health */}
          <div className="bg-[#65558F] bg-opacity-[0.08] rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-semibold">
                Platforms Health Details
              </h2>
              <div className="flex gap-2">
                <button className="px-4 py-1.5 text-sm border border-purple-100 text-[#65558F] rounded-lg hover:bg-purple-50">
                  Date Range
                </button>
                <button className="px-4 py-1.5 text-sm bg-[#65558F]  text-white rounded-lg">
                  Platform
                </button>
                <IconButton onClick={handleClick}>
                  <MoreVert />
                </IconButton>
                <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                  <MenuItem onClick={handleClose}>Engagement Graph</MenuItem>
                  <MenuItem onClick={handleClose}>Sentiment Graph</MenuItem>
                  <MenuItem onClick={handleClose}>Interaction Graph</MenuItem>
                  <MenuItem onClick={handleClose}>Chats Graph</MenuItem>
                </Menu>
              </div>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="value"
                    fill="#673ab7"
                    barSize={40}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Recommendation */}
          <div className="bg-[#65558F] bg-opacity-[0.08]  rounded-lg p-4">
            <h2 className="text-sm font-semibold mb-3">
              AI Recommendation and Actions
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="text-sm">Action</p>
                <p className="text-sm">Sell the product</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm">AI Recommendation</p>
                <p className="text-sm">Sell the product</p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-[#65558F] bg-opacity-[0.08]  rounded-lg p-4">
            <h2 className="text-sm font-semibold mb-3">Summary</h2>
            <div className="space-y-2">
              {[
                { label: "Potential Risk", value: "Low" },
                { label: "Sales Opportunity", value: "High" },
                { label: "Upcoming Trends", value: "AI-driven automation is gaining traction" },
                { label: "Resolution Likelihood", value: "High" },
                { label: "Retention Probability", value: "95%" },
              ].map((item, index) => (
                <div key={index} className="flex justify-between">
                  <p className="text-sm">{item.label}</p>
                  <p className="text-sm">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngagementTab;
