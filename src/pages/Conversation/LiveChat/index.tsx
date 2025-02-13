import { SmartToy, Person, Image, AttachFile, Send } from "@mui/icons-material";
import Switch from "@mui/material/Switch";
import React, { useState } from "react";

const LiveChat: React.FC = (): React.ReactElement => {
  const [isAIEnabled, setIsAIEnabled] = useState(false);

  const handleToggle = (event) => {
    setIsAIEnabled(event.target.checked);
  };

  return (
    <div className="flex flex-col min-h-screen p-4">
      {/* Live Chat Heading */}
      <div className="mb-4">
        <h1 className="text-xl font-semibold">Live Chat</h1>
        <p className="text-gray-600 text-sm">Guide Your Customers to Success</p>
      </div>

      {/* Queue Stats Section - Header */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-[#65558F] bg-opacity-[0.08] rounded-lg p-4 shadow">
          <div className="text-gray-500">Ques Stats</div>
          <div className="text-base text-[#2E2F5F] font-bold">350</div>
        </div>
        <div className="bg-[#65558F] bg-opacity-[0.08] rounded-lg p-4 shadow">
          <div className="text-gray-500">Live to AI</div>
          <div className="text-base font-bold text-[#2E2F5F]">
            {isAIEnabled ? "AI Enabled" : "Switch with AI"}
          </div>
          <Switch checked={isAIEnabled} onChange={handleToggle} color="primary" />
        </div>
        <div className="bg-[#65558F] bg-opacity-[0.08] rounded-lg p-4 shadow">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-gray-500">Alert the team</div>
              <div className="text-base font-bold text-[#2E2F5F]">
                Emergency
              </div>
            </div>
            <div className="text-xl font-bold">7</div>
          </div>
        </div>
        <div className="bg-[#65558F] bg-opacity-[0.08] rounded-lg p-4 shadow">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-gray-500">Transfer</div>
              <div className="text-base font-bold text-[#2E2F5F]">
                Transfer/Escalate
              </div>
            </div>
            <div className="text-xl font-bold">8</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Section  */}
        <div className=" space-y-4">
          {/* Customer Details Section */}
          <div className="bg-[#65558F] bg-opacity-[0.08] rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-purple-600">A</span>
                </div>
                <span className="font-medium">Customer Detail</span>
              </div>
              <button className="text-gray-600">⋮</button>
            </div>

            <div className="mb-4">
              <h2 className="text-lg font-medium">Nitya Prakhar</h2>
              <p className="text-gray-600 text-sm">nitya@gmail.com</p>
              <p className="text-[#65558F] text-md mt-1">View Tickets : 3</p>
              <button className="mt-2 text-[#65558F] font-semibold px-4 py-2 rounded-full border border-black w-full">
                View History
              </button>
            </div>

            <div className="space-y-3">
              <div className="border-solid border-[#DCDCDC] border"></div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Name</span>
                <span>Nitya Prakhar</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Last Contact</span>
                <span>2 days ago</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Email</span>
                <span>nitya@gmail.com</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Number</span>
                <span>+1 12344567808</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Channel</span>
                <span>Email</span>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button className="mt-2 text-[#65558F] font-semibold px-4 py-2 rounded-full border border-black w-full">
                Send Email
              </button>
              <button className="mt-2 whitespace-nowrap text-[#65558F] font-semibold px-4 py-2 rounded-full border border-black w-full">
                Send Whatsapp message
              </button>
            </div>
          </div>

          {/* Ticket Details Section */}
          <div className="bg-[#65558F] bg-opacity-[0.08] rounded-lg shadow-md p-6">
            <h3 className="text-center mb-4">Ticket Details</h3>
            <div className="text-center mb-4">
              <span className="text-6xl font-medium">33%</span>
              <p className="text-gray-500 text-sm">Satisfaction</p>
            </div>
            <div className="flex justify-between text-sm border-t border-[#DCDCDC] pt-4">
              <div>
                <p className="text-gray-500">Status</p>
                <p>Open/closed</p>
              </div>
              <div className="text-right">
                <p className="text-gray-500">Date and time</p>
                <p>01/05/2023</p>
                <p>2:23:09</p>
              </div>
            </div>
            <div className=" mt-5 border-dashed w-full border-[#DCDCDC] border-2"></div>
            <div className=" mt-4 text-center ">
              <h3>Details of Consumers</h3>
            </div>
            <div className="flex  mt-6 justify-between text-xs">
              <div>
                <p className="text-red-500 font-semibold">Complaint</p>
                <p className="text-gray-600 mt-2">Order misplaced</p>
              </div>
              <div>
                <p className="text-gray-700 font-semibold">Issue Raised by</p>
                <p className="text-sm font-medium mt-2">SJ</p>
              </div>
              <div>
                <p className="text-gray-700 font-semibold">Platform</p>
                <p className="text-sm font-medium mt-2">Whatsapp</p>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column - Chat */}
        <div className="col-span-1">
          <div className="bg-[#65558F] bg-opacity-[0.08] rounded-lg shadow-md p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-md font-semibold">Nitya Prakhar</h2>
                <p className="text-md text-gray-500">nitya@gmail.com</p>
              </div>
              <button className="px-4 py-1.5 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1">
                Close Chat
              </button>
            </div>

            {/* Chat Messages */}
            <div className="min-h-[450px]">
              {/* Bot Message */}
              <div className="flex gap-2 mt-10 mb-4">
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
            <div className="flex justify-between items-start mt-10 mb-2 gap-6">
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

        {/* Right Section  */}
        <div className="space-y-4">
          {/* Add to workflow section */}
          <div className="bg-[#65558F] bg-opacity-[0.08] rounded-lg shadow-md p-6">
            <div className="grid grid-cols-2 gap-6 items-start">
              {/* Add to Workflow Section */}
              <div>
                <h2 className="font-medium">Add to workflow</h2>
                <p className="text-base text-gray-500">
                  Integrate this customer interaction into your workflow for
                  seamless tracking and management.
                </p>
                <button className="mt-2 text-[#65558F] font-semibold px-4 py-2 rounded-full border border-black w-full">
                  Add to workflow
                </button>
              </div>

              {/* Summary and Next Steps */}
              <div>
                <h3 className="font-medium">Summary and Next Steps</h3>
                <div className="space-y-1 mt-2">
                  <div className="flex justify-between ">
                    <span className="text-gray-600 text-base">
                      Resolution Likelihood
                    </span>
                    <span className="font-medium">High</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-base">
                      Retention <br /> Probability
                    </span>
                    <span className="font-medium">95%</span>
                  </div>
                </div>
                <button className="mt-5 text-[#65558F] font-semibold px-4 py-2 rounded-full border border-black w-full">
                  View Detailed Steps
                </button>
              </div>
            </div>
          </div>

          {/* Vulnerability Analysis section */}
          <div className="bg-[#65558F] bg-opacity-[0.08] rounded-lg shadow p-4">
            <h2 className="font-medium">
              Vulnerability Analysis and Sales Intelligence
            </h2>
            <div className="space-y-1 mt-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Potential Risk</span>
                <span>Low</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sales Opportunity</span>
                <span>High</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Upcoming Trends</span>
                <span>Increased AI Adoption</span>
              </div>
            </div>
            <button className="mt-5 text-[#65558F] font-semibold px-4 py-2 rounded-full border border-black w-full">
              Explore Insights
            </button>
          </div>

          {/* CSAT section */}
          <div className="bg-[#65558F] bg-opacity-[0.08] rounded-lg shadow p-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-red-500 font-medium">20%</span>
              <span>Customer Satisfaction (CSAT)</span>
            </div>
            <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
              <div className="h-full w-1/5 bg-gradient-to-r from-green-400 via-yellow-400 to-red-400"></div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <div>
                  <span className="text-gray-600 text-sm">Chat Cue</span>
                  <p>Customer is anxious</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Reason</span>
                  <p>Order mix up</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Next Step</span>
                  <p>Confirm order details</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Predictive AI</span>
                  <p>High likelihood of resolution</p>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-gray-600 text-sm">Emotion</span>
                  <p>Neutral</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Intent</span>
                  <p>Inquiry</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Sentiment</span>
                  <p>Positive</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="flex-1  text-[#65558F] font-semibold px-4 py-2 rounded-full border border-black w-full">
                Schedule Follow up
              </button>
              <button className="flex-1 bg-[#65558F] text-white px-4 py-2 rounded-full">
                Escalate to Manager
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveChat;
