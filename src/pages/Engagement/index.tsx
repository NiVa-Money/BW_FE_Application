// import React from "react";
// import { BarChart, Chat, SentimentSatisfied } from "@mui/icons-material";

// interface Complaint {
//   id: number;
//   platform: string;
//   issue: string;
//   status: "Open" | "Closed";
//   raisedBy: string;
// }

// const complaints: Complaint[] = [
//   {
//     id: 1,
//     platform: "Instagram",
//     issue: "Order mix up",
//     status: "Open",
//     raisedBy: "Jessica@maker",
//   },
//   {
//     id: 2,
//     platform: "Facebook",
//     issue: "Refund request",
//     status: "Closed",
//     raisedBy: "Jessica@gmail.com",
//   },
//   {
//     id: 3,
//     platform: "LinkedIn",
//     issue: "Product defect",
//     status: "Open",
//     raisedBy: "JohnDoe@maker",
//   },
// ];

// const customerEmotion = "Anxious";
// const nextStep = "Confirm order details";
// const resolutionLikelihood = "High likelihood of resolution";
// const csatScore = 20;
// const totalChats = 36;
// const averageReviews = 4.5;

// const EngagementTab: React.FC = () => (
//   <div className="p-6 bg-white text-black rounded-lg shadow-lg">
//     <h1 className="text-3xl font-bold mb-6">Engagement Tab</h1>

//     {/* Top Section */}
//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
//       <div className="bg-white text-black p-4 rounded-lg shadow-md">
//         <h2 className="text-lg font-semibold mb-4">Sentiment Analysis</h2>
//         <div className="flex items-center space-x-4">
//           <div className="flex items-center">
//             <SentimentSatisfied className="text-green-400 mr-2" />
//             <p>Instagram: 60% Positive</p>
//           </div>
//           <div className="flex items-center">
//             <SentimentSatisfied className="text-green-400 mr-2" />
//             <p>Facebook: 50% Positive</p>
//           </div>
//           <div className="flex items-center">
//             <SentimentSatisfied className="text-green-400 mr-2" />
//             <p>LinkedIn: 60% Positive</p>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white text-black p-4 rounded-lg shadow-md">
//         <h2 className="text-lg font-semibold mb-4">Complaints Overview</h2>
//         {complaints.map((complaint) => (
//           <div key={complaint.id} className="flex items-center mb-2">
//             <Chat
//               className={`mr-2 text-lg ${
//                 complaint.status === "Open" ? "text-red-400" : "text-green-400"
//               }`}
//             />
//             <p>
//               {`${complaint.platform}: ${complaint.issue} - ${complaint.status} (Raised by ${complaint.raisedBy})`}
//             </p>
//           </div>
//         ))}
//       </div>

//       <div className="bg-white text-black p-4 rounded-lg shadow-md">
//         <h2 className="text-lg font-semibold mb-4">
//           Customer Interaction Summary
//         </h2>
//         <div className="space-y-2">
//           <p>No. of chats: {totalChats}</p>
//           <p>Average Reviews: {averageReviews}</p>
//         </div>
//       </div>
//     </div>

//     {/* Middle Section */}
//     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//       <div className="bg-white text-black p-4 rounded-lg shadow-md">
//         <h2 className="text-lg font-semibold mb-4">Predictive Insights</h2>
//         <div className="space-y-2">
//           <p>Customer Emotion: {customerEmotion}</p>
//           <p>Next Step: {nextStep}</p>
//           <p>Resolution Likelihood: {resolutionLikelihood}</p>
//           <p>CSAT Score: {csatScore}%</p>
//         </div>
//       </div>

//       <div className="bg-white text-black p-4 rounded-lg shadow-md">
//         <h2 className="text-lg font-semibold mb-4">Engagement Graphs</h2>
//         <div className="flex justify-center items-center h-48 bg-white rounded-lg">
//           <BarChart className="text-gray-400 text-6xl" />
//         </div>
//       </div>
//     </div>

//     {/* Bottom Section */}
//     <div className="bg-white text-black] p-4 rounded-lg shadow-md">
//       <h2 className="text-lg font-semibold mb-4">
//         AI Recommendation and Actions
//       </h2>
//       <p>Action: Sell the product</p>
//       <p>AI Recommendation: High likelihood of success</p>
//     </div>
//   </div>
// );

// export default EngagementTab;


import React from "react";
import { SentimentSatisfied, Facebook, Instagram, LinkedIn } from "@mui/icons-material";

const EngagementTab: React.FC = () => {
  const platforms = [
    { name: "Instagram", sentiment: "60% Positive", icon: <Instagram className="text-pink-600" /> },
    { name: "Facebook", sentiment: "60% Positive", icon: <Facebook className="text-blue-600" /> },
    { name: "LinkedIn", sentiment: "60% Positive", icon: <LinkedIn className="text-blue-800" /> },
  ];

  return (
    <div className="flex flex-col w-full p-6 bg-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-sm text-gray-500">Pages / Engagement Tab</p>
          <h1 className="text-3xl font-bold text-gray-800">Engagement Tab</h1>
        </div>
        {/* Search and Icons */}
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search"
            className="px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex items-center space-x-2">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/281f589b23965a894daf141decf87a1e4bc7c06b60bfa65fb5e5696a684c4ed7?placeholderIfAbsent=true&apiKey=555c811dd3f44fc79b6b2689129389e8"
              alt="icon"
              className="w-6 h-6"
            />
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/dc55d3a4c64d74fb99d07a95881d62da04ecd7eae3e157f618e7b40c2cccd7c3?placeholderIfAbsent=true&apiKey=555c811dd3f44fc79b6b2689129389e8"
              alt="icon"
              className="w-6 h-6"
            />
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/bc5f4dc5d8d6de367820dc78ba2607111505cc0d4c6c32eccef605bd2dfe2de6?placeholderIfAbsent=true&apiKey=555c811dd3f44fc79b6b2689129389e8"
              alt="icon"
              className="w-6 h-6"
            />
          </div>
        </div>
      </div>

      {/* Sentiment Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {platforms.map((platform, index) => (
          <div
            key={index}
            className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <div className="mr-4">{platform.icon}</div>
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold text-gray-800">{platform.name}</h3>
              <p className="text-sm text-green-600">{platform.sentiment}</p>
              <div className="flex w-full mt-1">
                <div className="flex-1 bg-green-400 h-2 rounded-l-md"></div>
                <div className="flex-1 bg-yellow-400 h-2"></div>
                <div className="flex-1 bg-red-600 h-2 rounded-r-md"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Details */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Customer Details</h2>
          <p className="text-sm text-gray-700">Order Mix-up</p>
          <p className="text-sm text-gray-700">Request: Refund</p>
        </div>

        {/* Agent Details */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Agent Details</h2>
          <p className="text-sm text-gray-700">No. of Chats: 36</p>
          <p className="text-sm text-gray-700">Average Rating: 4.5</p>
        </div>
      </div>

      {/* Engagement Graph */}
      <div className="bg-white p-6 mt-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Engagement Graph</h2>
        <div className="h-48 flex justify-center items-center bg-gray-50">
          <SentimentSatisfied className="text-gray-300 text-6xl" />
        </div>
      </div>
    </div>
  );
};

export default EngagementTab;
