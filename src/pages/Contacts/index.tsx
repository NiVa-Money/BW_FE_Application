// // import { useState, useEffect } from "react";
// // import {
// //   Add,
// //   Search,
// //   Person,
// //   Chat,
// //   Timeline,
// //   Insights,
// //   Psychology,
// //   Api,
// //   Circle,
// //   FiberManualRecord,
// // } from "@mui/icons-material";
// // import {
// //   LineChart,
// //   Line,
// //   XAxis,
// //   YAxis,
// //   CartesianGrid,
// //   Tooltip,
// //   ResponsiveContainer,
// //   BarChart,
// //   Bar,
// //   PieChart,
// //   Pie,
// //   Cell,
// // } from "recharts";
// // import { format } from "date-fns";

// // interface Contact {
// //   id: string;
// //   name: string;
// //   email: string;
// //   phone: string;
// //   company: string;
// //   position: string;
// //   notes: string;
// //   lastContact: string;
// //   status: "active" | "inactive" | "lead";
// //   interactionHistory: ChatInteraction[];
// //   botUsageHistory: { date: string; usage: number }[];
// //   sentiment: "positive" | "neutral" | "negative";
// //   integrationStatus: "connected" | "disconnected";
// //   integrationHistory: { date: string; calls: number }[];
// // }

// // interface ChatInteraction {
// //   date: string;
// //   botVersion: string;
// //   duration: number;
// //   transcript: string;
// //   satisfactionScore?: number;
// // }

// // const COLORS = ["#4F46E5", "#EF4444", "#10B981", "#F59E0B"];

// // export default function CRMDashboard() {
// //   const [contacts, setContacts] = useState<Contact[]>([]);
// //   const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
// //   const [activeTab, setActiveTab] = useState<
// //     "overview" | "interactions" | "analytics" | "integrations"
// //   >("overview");
// //   const [interactionFilter, setInteractionFilter] = useState("");

// //   // Dummy data for Sales Pipeline
// //   const pipelineData = [
// //     { stage: "Open", value: 45 },
// //     { stage: "Won", value: 25 },
// //     { stage: "Lost", value: 10 },
// //   ];

// //   // Dummy data for sentiment over time (for the analytics tab)
// //   const sentimentTrendData = [
// //     { date: "2024-03-01", positive: 60, neutral: 30, negative: 10 },
// //     { date: "2024-03-08", positive: 65, neutral: 25, negative: 10 },
// //     { date: "2024-03-15", positive: 70, neutral: 20, negative: 10 },
// //   ];

// //   useEffect(() => {
// //     // Demo contact data. You can extend this or fetch from your API.
// //     setContacts([
// //       {
// //         id: "1",
// //         name: "Mohanraj Tamilarasu ",
// //         email: "mohan@nivamoney.com",
// //         phone: "+1 234 567 890",
// //         company: "PurpleAnt Tech.",
// //         position: "CTO",
// //         notes:
// //           "Interested in new AI solutions. Follow-up meeting scheduled for next week to discuss product roadmap and integration options.",
// //         lastContact: "2024-03-15",
// //         status: "lead",
// //         interactionHistory: [
// //           {
// //             date: "2024-03-15T14:30:00",
// //             botVersion: "v2.1.5",
// //             duration: 8.2,
// //             transcript:
// //               "User inquired about NLP capabilities and potential integrations with existing platforms.",
// //             satisfactionScore: 4,
// //           },
// //           {
// //             date: "2024-02-28T10:15:00",
// //             botVersion: "v2.0.0",
// //             duration: 6.5,
// //             transcript:
// //               "Initial setup and introduction to our CRM system features.",
// //             satisfactionScore: 5,
// //           },
// //           {
// //             date: "2024-03-10T16:00:00",
// //             botVersion: "v2.1.2",
// //             duration: 7.0,
// //             transcript:
// //               "Discussed potential for upselling the premium package.",
// //             satisfactionScore: 4,
// //           },
// //         ],
// //         botUsageHistory: [
// //           { date: "2024-03-01", usage: 2 },
// //           { date: "2024-03-08", usage: 5 },
// //           { date: "2024-03-15", usage: 12 },
// //         ],
// //         sentiment: "positive",
// //         integrationStatus: "connected",
// //         integrationHistory: [
// //           { date: "2024-03-01", calls: 3 },
// //           { date: "2024-03-08", calls: 6 },
// //           { date: "2024-03-15", calls: 9 },
// //         ],
// //       },
// //     ]);
// //   }, []);

// //   // Basic sentiment summary for pie chart
// //   const sentimentData = [
// //     { name: "Positive", value: 75 },
// //     { name: "Neutral", value: 20 },
// //     { name: "Negative", value: 5 },
// //   ];

// //   const tabs = [
// //     "overview",
// //     "interactions",
// //     "analytics",
// //     "integrations",
// //   ] as const;

// //   // Filter interactions by transcript text
// //   const filteredInteractions =
// //     selectedContact?.interactionHistory.filter((interaction) =>
// //       interaction.transcript
// //         .toLowerCase()
// //         .includes(interactionFilter.toLowerCase())
// //     ) || [];

// //   return (
// //     <div className="flex h-screen bg-gray-50">
// //       {/* Sidebar */}
// //       <div className="w-96 bg-white border-r border-gray-200 flex flex-col shadow-md">
// //         <div className="p-6 border-b border-gray-100">
// //           <div className="flex justify-between items-center mb-6">
// //             <h1 className="text-2xl font-bold text-gray-900">All Contacts</h1>
// //             <button className="p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors">
// //               <Add className="w-5 h-5" />
// //             </button>
// //           </div>
// //           <div className="relative mb-6">
// //             <input
// //               type="text"
// //               placeholder="Search contacts..."
// //               className="w-full pl-4 pr-10 py-3 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
// //             />
// //             <Search className="h-5 w-5 text-gray-400 absolute right-3 top-3.5" />
// //           </div>
// //         </div>
// //         <div className="flex-1 overflow-y-auto px-4 space-y-2">
// //           {contacts.map((contact) => (
// //             <div
// //               key={contact.id}
// //               className="p-4 bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow cursor-pointer border border-transparent hover:border-indigo-200"
// //               onClick={() => setSelectedContact(contact)}
// //             >
// //               <div className="flex items-center">
// //                 <div className="relative">
// //                   <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
// //                     <Person className="w-6 h-6 text-indigo-500" />
// //                   </div>
// //                   <FiberManualRecord
// //                     className={`w-3 h-3 absolute -right-0.5 -bottom-0.5 ${
// //                       contact.integrationStatus === "connected"
// //                         ? "text-green-500"
// //                         : "text-gray-400"
// //                     }`}
// //                   />
// //                 </div>
// //                 <div className="ml-4">
// //                   <h3 className="font-semibold text-gray-900">
// //                     {contact.name}
// //                   </h3>
// //                   <p className="text-sm text-gray-500">{contact.position}</p>
// //                   <div className="flex items-center mt-1">
// //                     <Circle className="w-2 h-2 text-gray-400 mr-2" />
// //                     <span className="text-xs text-gray-500">
// //                       {contact.company}
// //                     </span>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       </div>

// //       {/* Main Content */}
// //       <div className="flex-1 flex flex-col p-8 overflow-hidden">
// //         {selectedContact ? (
// //           <>
// //             <div className="flex justify-between items-start mb-8">
// //               <div className="flex items-center">
// //                 <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center mr-4">
// //                   <Person className="w-8 h-8 text-indigo-500" />
// //                 </div>
// //                 <div>
// //                   <h1 className="text-2xl font-bold text-gray-900">
// //                     {selectedContact.name}
// //                   </h1>
// //                   <p className="text-gray-500">{selectedContact.position}</p>
// //                   <div className="flex items-center mt-2">
// //                     <span
// //                       className={`px-2 py-1 rounded-full text-sm ${
// //                         selectedContact.integrationStatus === "connected"
// //                           ? "bg-green-100 text-green-800"
// //                           : "bg-gray-100 text-gray-800"
// //                       }`}
// //                     >
// //                       {selectedContact.integrationStatus}
// //                     </span>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Tabs */}
// //             <div className="flex border-b border-gray-200 mb-8 space-x-4">
// //               {tabs.map((tab) => (
// //                 <button
// //                   key={tab}
// //                   onClick={() => setActiveTab(tab)}
// //                   className={`px-6 py-3 font-medium flex items-center transition-colors border-b-2 ${
// //                     activeTab === tab
// //                       ? "text-indigo-500 border-indigo-500"
// //                       : "text-gray-500 hover:text-gray-700 border-transparent"
// //                   }`}
// //                 >
// //                   {tab === "overview" && <Insights className="mr-2" />}
// //                   {tab === "interactions" && <Chat className="mr-2" />}
// //                   {tab === "analytics" && <Timeline className="mr-2" />}
// //                   {tab === "integrations" && <Api className="mr-2" />}
// //                   {tab.charAt(0).toUpperCase() + tab.slice(1)}
// //                 </button>
// //               ))}
// //             </div>

// //             {/* Tab Content */}
// //             {activeTab === "overview" && (
// //               <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
// //                 {/* Interaction Overview */}
// //                 <div className="bg-white p-6 rounded-xl shadow-lg">
// //                   <h3 className="text-lg font-semibold mb-4 flex items-center">
// //                     <Psychology className="w-5 h-5 mr-2 text-indigo-500" />
// //                     Interaction Overview
// //                   </h3>
// //                   <div className="grid grid-cols-2 gap-4 mb-6">
// //                     <div className="p-4 bg-indigo-50 rounded-lg">
// //                       <p className="text-sm text-gray-500 mb-1">
// //                         Avg. Session Duration
// //                       </p>
// //                       <p className="text-2xl font-bold">8.2m</p>
// //                     </div>
// //                     <div className="p-4 bg-indigo-50 rounded-lg">
// //                       <p className="text-sm text-gray-500 mb-1">
// //                         Satisfaction Score
// //                       </p>
// //                       <p className="text-2xl font-bold">4.5/5</p>
// //                     </div>
// //                   </div>
// //                   <div className="h-64">
// //                     <ResponsiveContainer width="100%" height="100%">
// //                       <LineChart data={selectedContact.botUsageHistory}>
// //                         <CartesianGrid strokeDasharray="3 3" />
// //                         <XAxis
// //                           dataKey="date"
// //                           tickFormatter={(date) =>
// //                             format(new Date(date), "MMM d")
// //                           }
// //                         />
// //                         <YAxis />
// //                         <Tooltip />
// //                         <Line
// //                           type="monotone"
// //                           dataKey="usage"
// //                           stroke="#4F46E5"
// //                           strokeWidth={2}
// //                         />
// //                       </LineChart>
// //                     </ResponsiveContainer>
// //                   </div>
// //                 </div>

// //                 {/* Sales Pipeline */}
// //                 <div className="bg-white p-6 rounded-xl shadow-lg">
// //                   <h3 className="text-lg font-semibold mb-4 flex items-center">
// //                     <Timeline className="w-5 h-5 mr-2 text-indigo-500" />
// //                     Sales Pipeline
// //                   </h3>
// //                   <div className="h-64">
// //                     <ResponsiveContainer width="100%" height="100%">
// //                       <PieChart>
// //                         <Pie
// //                           data={pipelineData}
// //                           cx="50%"
// //                           cy="50%"
// //                           outerRadius={80}
// //                           dataKey="value"
// //                           label
// //                         >
// //                           {pipelineData.map((entry, index) => (
// //                             <Cell
// //                               key={`cell-${index}`}
// //                               fill={COLORS[index % COLORS.length]}
// //                             />
// //                           ))}
// //                         </Pie>
// //                         <Tooltip />
// //                       </PieChart>
// //                     </ResponsiveContainer>
// //                   </div>
// //                 </div>

// //                 {/* Recent Activity Feed */}
// //                 <div className="bg-white p-6 rounded-xl shadow-lg">
// //                   <h3 className="text-lg font-semibold mb-4">
// //                     Recent Activity
// //                   </h3>
// //                   <div className="space-y-4">
// //                     {selectedContact.interactionHistory.map(
// //                       (interaction, idx) => (
// //                         <div
// //                           key={idx}
// //                           className="border-b border-gray-200 pb-2"
// //                         >
// //                           <p className="text-sm text-gray-500">
// //                             {format(
// //                               new Date(interaction.date),
// //                               "MMM d, yyyy h:mm a"
// //                             )}
// //                           </p>
// //                           <p className="text-gray-700 truncate">
// //                             {interaction.transcript}
// //                           </p>
// //                         </div>
// //                       )
// //                     )}
// //                   </div>
// //                 </div>
// //               </div>
// //             )}

// //             {activeTab === "interactions" && (
// //               <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
// //                 <div className="flex justify-between items-center mb-4">
// //                   <h3 className="text-lg font-semibold flex items-center">
// //                     <Chat className="w-5 h-5 mr-2 text-indigo-500" />
// //                     Chat Interactions
// //                   </h3>
// //                   <input
// //                     type="text"
// //                     placeholder="Filter interactions..."
// //                     value={interactionFilter}
// //                     onChange={(e) => setInteractionFilter(e.target.value)}
// //                     className="pl-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
// //                   />
// //                 </div>
// //                 {filteredInteractions.length > 0 ? (
// //                   filteredInteractions.map((interaction, idx) => (
// //                     <div
// //                       key={idx}
// //                       className="border rounded-lg p-4 hover:shadow-md transition-shadow"
// //                     >
// //                       <div className="flex justify-between items-center mb-2">
// //                         <p className="text-sm text-gray-500">
// //                           {format(
// //                             new Date(interaction.date),
// //                             "MMM d, yyyy h:mm a"
// //                           )}
// //                         </p>
// //                         {interaction.satisfactionScore && (
// //                           <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded">
// //                             Score: {interaction.satisfactionScore}/5
// //                           </span>
// //                         )}
// //                       </div>
// //                       <p className="text-gray-700">{interaction.transcript}</p>
// //                       <p className="text-xs text-gray-500 mt-1">
// //                         Duration: {interaction.duration}m | Bot Version:{" "}
// //                         {interaction.botVersion}
// //                       </p>
// //                     </div>
// //                   ))
// //                 ) : (
// //                   <p className="text-gray-500">
// //                     No interactions match your filter.
// //                   </p>
// //                 )}
// //               </div>
// //             )}

// //             {activeTab === "analytics" && (
// //               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// //                 <div className="bg-white p-6 rounded-xl shadow-lg">
// //                   <h3 className="text-lg font-semibold mb-4">
// //                     Sentiment Analysis
// //                   </h3>
// //                   <div className="h-64">
// //                     <ResponsiveContainer width="100%" height="100%">
// //                       <PieChart>
// //                         <Pie
// //                           data={sentimentData}
// //                           cx="50%"
// //                           cy="50%"
// //                           innerRadius={60}
// //                           outerRadius={80}
// //                           paddingAngle={5}
// //                           dataKey="value"
// //                           label
// //                         >
// //                           {sentimentData.map((entry, index) => (
// //                             <Cell
// //                               key={`cell-${index}`}
// //                               fill={COLORS[index % COLORS.length]}
// //                             />
// //                           ))}
// //                         </Pie>
// //                         <Tooltip />
// //                       </PieChart>
// //                     </ResponsiveContainer>
// //                   </div>
// //                 </div>
// //                 <div className="bg-white p-6 rounded-xl shadow-lg">
// //                   <h3 className="text-lg font-semibold mb-4">
// //                     User Sentiment Over Time
// //                   </h3>
// //                   <div className="h-64">
// //                     <ResponsiveContainer width="100%" height="100%">
// //                       <LineChart data={sentimentTrendData}>
// //                         <CartesianGrid strokeDasharray="3 3" />
// //                         <XAxis
// //                           dataKey="date"
// //                           tickFormatter={(date) =>
// //                             format(new Date(date), "MMM d")
// //                           }
// //                         />
// //                         <YAxis />
// //                         <Tooltip />
// //                         <Line
// //                           type="monotone"
// //                           dataKey="positive"
// //                           stroke="#10B981"
// //                           name="Positive"
// //                         />
// //                         <Line
// //                           type="monotone"
// //                           dataKey="neutral"
// //                           stroke="#F59E0B"
// //                           name="Neutral"
// //                         />
// //                         <Line
// //                           type="monotone"
// //                           dataKey="negative"
// //                           stroke="#EF4444"
// //                           name="Negative"
// //                         />
// //                       </LineChart>
// //                     </ResponsiveContainer>
// //                   </div>
// //                 </div>
// //               </div>
// //             )}

// //             {activeTab === "integrations" && (
// //               <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
// //                 <h3 className="text-lg font-semibold mb-4 flex items-center">
// //                   <Api className="w-5 h-5 mr-2 text-indigo-500" />
// //                   Integration Details
// //                 </h3>
// //                 <div className="space-y-4">
// //                   <p className="text-gray-700">
// //                     <span className="font-medium">Status:</span>{" "}
// //                     {selectedContact.integrationStatus === "connected"
// //                       ? "All systems are integrated seamlessly."
// //                       : "Integration is currently disconnected. Please check your connection or contact support."}
// //                   </p>
// //                   <p className="text-gray-700">
// //                     <span className="font-medium">Last Contact:</span>{" "}
// //                     {format(
// //                       new Date(selectedContact.lastContact),
// //                       "MMM d, yyyy"
// //                     )}
// //                   </p>
// //                   <button className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors">
// //                     Manage Integrations
// //                   </button>
// //                 </div>
// //                 <div className="mt-6">
// //                   <h4 className="text-md font-semibold mb-2">
// //                     Integration Usage History
// //                   </h4>
// //                   <div className="h-64">
// //                     <ResponsiveContainer width="100%" height="100%">
// //                       <BarChart data={selectedContact.integrationHistory}>
// //                         <CartesianGrid strokeDasharray="3 3" />
// //                         <XAxis
// //                           dataKey="date"
// //                           tickFormatter={(date) =>
// //                             format(new Date(date), "MMM d")
// //                           }
// //                         />
// //                         <YAxis />
// //                         <Tooltip />
// //                         <Bar
// //                           dataKey="calls"
// //                           fill="#4F46E5"
// //                           radius={[4, 4, 0, 0]}
// //                         />
// //                       </BarChart>
// //                     </ResponsiveContainer>
// //                   </div>
// //                 </div>
// //               </div>
// //             )}
// //           </>
// //         ) : (
// //           <div className="flex-1 flex flex-col items-center justify-center">
// //             <Psychology className="w-24 h-24 mb-4 text-gray-400" />
// //             <h2 className="text-2xl font-semibold text-gray-500 mb-2">
// //               Select a Contact
// //             </h2>
// //             <p className="text-gray-400">
// //               or create a new contact to begin your analysis
// //             </p>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }



// import { useState, useEffect } from "react";
// import {
//   Add,
//   Search,
//   Person,
//   Chat,
//   Timeline,
//   Insights,
//   Psychology,
//   Api,
//   Circle,
//   FiberManualRecord,
// } from "@mui/icons-material";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts";
// import { format } from "date-fns";

// //
// // Data Interfaces
// //
// interface Contact {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   company: string;
//   position: string;
//   notes: string;
//   lastContact: string;
//   status: "active" | "inactive" | "lead";
//   interactionHistory: ChatInteraction[];
//   botUsageHistory: { date: string; usage: number }[];
//   sentiment: "positive" | "neutral" | "negative";
//   integrationStatus: "connected" | "disconnected";
//   integrationHistory: { date: string; calls: number }[];
// }

// interface ChatInteraction {
//   date: string;
//   botVersion: string;
//   duration: number;
//   transcript: string;
//   satisfactionScore?: number;
// }

// //
// // Sample Colors for Charts
// //
// const COLORS = ["#4F46E5", "#EF4444", "#10B981", "#F59E0B"];

// //
// // Main CRM Dashboard Component
// //
// export default function CRMDashboard() {
//   const [contacts, setContacts] = useState<Contact[]>([]);
//   const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
//   const [activeTab, setActiveTab] = useState<
//     "overview" | "interactions" | "analytics" | "integrations"
//   >("overview");
//   const [interactionFilter, setInteractionFilter] = useState("");

//   // Dummy sales pipeline data (customized for the BotWot-inspired design)
//   const pipelineData = [
//     { stage: "Open", value: 45 },
//     { stage: "Won", value: 25 },
//     { stage: "Lost", value: 10 },
//   ];

//   // Dummy sentiment trend data for analytics tab
//   const sentimentTrendData = [
//     { date: "2024-03-01", positive: 60, neutral: 30, negative: 10 },
//     { date: "2024-03-08", positive: 65, neutral: 25, negative: 10 },
//     { date: "2024-03-15", positive: 70, neutral: 20, negative: 10 },
//   ];

//   // Load sample contact data (this could be replaced with real API calls)
//   useEffect(() => {
//     setContacts([
//       {
//         id: "1",
//         name: "Sarah Johnson",
//         email: "sarah@techcorp.com",
//         phone: "+1 234 567 890",
//         company: "Tech Corp Inc.",
//         position: "CTO",
//         notes:
//           "Highly interested in new AI and automation solutions. Follow-up scheduled for product demo.",
//         lastContact: "2024-03-15",
//         status: "lead",
//         interactionHistory: [
//           {
//             date: "2024-03-15T14:30:00",
//             botVersion: "v2.1.5",
//             duration: 8.2,
//             transcript: "Discussed potential integrations and advanced AI features.",
//             satisfactionScore: 4,
//           },
//           {
//             date: "2024-02-28T10:15:00",
//             botVersion: "v2.0.0",
//             duration: 6.5,
//             transcript: "Overview of CRM benefits and introduction to our dashboard.",
//             satisfactionScore: 5,
//           },
//           {
//             date: "2024-03-10T16:00:00",
//             botVersion: "v2.1.2",
//             duration: 7.0,
//             transcript: "Talked about upselling premium plans and additional modules.",
//             satisfactionScore: 4,
//           },
//         ],
//         botUsageHistory: [
//           { date: "2024-03-01", usage: 2 },
//           { date: "2024-03-08", usage: 5 },
//           { date: "2024-03-15", usage: 12 },
//         ],
//         sentiment: "positive",
//         integrationStatus: "connected",
//         integrationHistory: [
//           { date: "2024-03-01", calls: 3 },
//           { date: "2024-03-08", calls: 6 },
//           { date: "2024-03-15", calls: 9 },
//         ],
//       },
//       // Add more contacts here...
//     ]);
//   }, []);

//   // Basic sentiment summary for the analytics tab (pie chart)
//   const sentimentData = [
//     { name: "Positive", value: 75 },
//     { name: "Neutral", value: 20 },
//     { name: "Negative", value: 5 },
//   ];

//   const tabs = ["overview", "interactions", "analytics", "integrations"] as const;

//   // Filter the interactions list based on text input
//   const filteredInteractions =
//     selectedContact?.interactionHistory.filter((interaction) =>
//       interaction.transcript.toLowerCase().includes(interactionFilter.toLowerCase())
//     ) || [];

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* Sidebar with Contacts List */}
//       <div className="w-96 bg-white border-r border-gray-200 flex flex-col shadow-md">
//         <div className="p-6 border-b border-gray-100">
//           <div className="flex justify-between items-center mb-6">
//             <h1 className="text-2xl font-bold text-gray-900">All Contacts</h1>
//             <button className="p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors">
//               <Add className="w-5 h-5" />
//             </button>
//           </div>
//           <div className="relative mb-6">
//             <input
//               type="text"
//               placeholder="Search contacts..."
//               className="w-full pl-4 pr-10 py-3 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//             <Search className="h-5 w-5 text-gray-400 absolute right-3 top-3.5" />
//           </div>
//         </div>
//         <div className="flex-1 overflow-y-auto px-4 space-y-2">
//           {contacts.map((contact) => (
//             <div
//               key={contact.id}
//               className="p-4 bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow cursor-pointer border border-transparent hover:border-indigo-200"
//               onClick={() => setSelectedContact(contact)}
//             >
//               <div className="flex items-center">
//                 <div className="relative">
//                   <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
//                     <Person className="w-6 h-6 text-indigo-500" />
//                   </div>
//                   <FiberManualRecord
//                     className={`w-3 h-3 absolute -right-0.5 -bottom-0.5 ${
//                       contact.integrationStatus === "connected"
//                         ? "text-green-500"
//                         : "text-gray-400"
//                     }`}
//                   />
//                 </div>
//                 <div className="ml-4">
//                   <h3 className="font-semibold text-gray-900">{contact.name}</h3>
//                   <p className="text-sm text-gray-500">{contact.position}</p>
//                   <div className="flex items-center mt-1">
//                     <Circle className="w-2 h-2 text-gray-400 mr-2" />
//                     <span className="text-xs text-gray-500">{contact.company}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Main CRM Content Area */}
//       <div className="flex-1 flex flex-col p-8 overflow-hidden">
//         {selectedContact ? (
//           <>
//             {/* Contact Header */}
//             <div className="flex justify-between items-start mb-8">
//               <div className="flex items-center">
//                 <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center mr-4">
//                   <Person className="w-8 h-8 text-indigo-500" />
//                 </div>
//                 <div>
//                   <h1 className="text-2xl font-bold text-gray-900">{selectedContact.name}</h1>
//                   <p className="text-gray-500">{selectedContact.position}</p>
//                   <div className="flex items-center mt-2">
//                     <span
//                       className={`px-2 py-1 rounded-full text-sm ${
//                         selectedContact.integrationStatus === "connected"
//                           ? "bg-green-100 text-green-800"
//                           : "bg-gray-100 text-gray-800"
//                       }`}
//                     >
//                       {selectedContact.integrationStatus}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Tabs Navigation */}
//             <div className="flex border-b border-gray-200 mb-8 space-x-4">
//               {tabs.map((tab) => (
//                 <button
//                   key={tab}
//                   onClick={() => setActiveTab(tab)}
//                   className={`px-6 py-3 font-medium flex items-center transition-colors border-b-2 ${
//                     activeTab === tab
//                       ? "text-indigo-500 border-indigo-500"
//                       : "text-gray-500 hover:text-gray-700 border-transparent"
//                   }`}
//                 >
//                   {tab === "overview" && <Insights className="mr-2" />}
//                   {tab === "interactions" && <Chat className="mr-2" />}
//                   {tab === "analytics" && <Timeline className="mr-2" />}
//                   {tab === "integrations" && <Api className="mr-2" />}
//                   {tab.charAt(0).toUpperCase() + tab.slice(1)}
//                 </button>
//               ))}
//             </div>

//             {/* Tabs Content */}
//             {activeTab === "overview" && (
//               <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
//                 {/* Interaction Overview */}
//                 <div className="bg-white p-6 rounded-xl shadow-lg">
//                   <h3 className="text-lg font-semibold mb-4 flex items-center">
//                     <Psychology className="w-5 h-5 mr-2 text-indigo-500" />
//                     Interaction Overview
//                   </h3>
//                   <div className="grid grid-cols-2 gap-4 mb-6">
//                     <div className="p-4 bg-indigo-50 rounded-lg">
//                       <p className="text-sm text-gray-500 mb-1">Avg. Session Duration</p>
//                       <p className="text-2xl font-bold">8.2m</p>
//                     </div>
//                     <div className="p-4 bg-indigo-50 rounded-lg">
//                       <p className="text-sm text-gray-500 mb-1">Satisfaction Score</p>
//                       <p className="text-2xl font-bold">4.5/5</p>
//                     </div>
//                   </div>
//                   <div className="h-64">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <LineChart data={selectedContact.botUsageHistory}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="date" tickFormatter={(date) => format(new Date(date), "MMM d")} />
//                         <YAxis />
//                         <Tooltip />
//                         <Line type="monotone" dataKey="usage" stroke="#4F46E5" strokeWidth={2} />
//                       </LineChart>
//                     </ResponsiveContainer>
//                   </div>
//                 </div>

//                 {/* Sales Pipeline Visualization */}
//                 <div className="bg-white p-6 rounded-xl shadow-lg">
//                   <h3 className="text-lg font-semibold mb-4 flex items-center">
//                     <Timeline className="w-5 h-5 mr-2 text-indigo-500" />
//                     Sales Pipeline
//                   </h3>
//                   <div className="h-64">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <PieChart>
//                         <Pie data={pipelineData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
//                           {pipelineData.map((entry, index) => (
//                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                           ))}
//                         </Pie>
//                         <Tooltip />
//                       </PieChart>
//                     </ResponsiveContainer>
//                   </div>
//                 </div>

//                 {/* Recent Activity Feed */}
//                 <div className="bg-white p-6 rounded-xl shadow-lg">
//                   <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
//                   <div className="space-y-4">
//                     {selectedContact.interactionHistory.map((interaction, idx) => (
//                       <div key={idx} className="border-b border-gray-200 pb-2">
//                         <p className="text-sm text-gray-500">
//                           {format(new Date(interaction.date), "MMM d, yyyy h:mm a")}
//                         </p>
//                         <p className="text-gray-700 truncate">{interaction.transcript}</p>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {activeTab === "interactions" && (
//               <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
//                 <div className="flex justify-between items-center mb-4">
//                   <h3 className="text-lg font-semibold flex items-center">
//                     <Chat className="w-5 h-5 mr-2 text-indigo-500" />
//                     Chat Interactions
//                   </h3>
//                   <input
//                     type="text"
//                     placeholder="Filter interactions..."
//                     value={interactionFilter}
//                     onChange={(e) => setInteractionFilter(e.target.value)}
//                     className="pl-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   />
//                 </div>
//                 {filteredInteractions.length > 0 ? (
//                   filteredInteractions.map((interaction, idx) => (
//                     <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
//                       <div className="flex justify-between items-center mb-2">
//                         <p className="text-sm text-gray-500">
//                           {format(new Date(interaction.date), "MMM d, yyyy h:mm a")}
//                         </p>
//                         {interaction.satisfactionScore && (
//                           <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded">
//                             Score: {interaction.satisfactionScore}/5
//                           </span>
//                         )}
//                       </div>
//                       <p className="text-gray-700">{interaction.transcript}</p>
//                       <p className="text-xs text-gray-500 mt-1">
//                         Duration: {interaction.duration}m | Bot Version: {interaction.botVersion}
//                       </p>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-gray-500">No interactions match your filter.</p>
//                 )}
//               </div>
//             )}

//             {activeTab === "analytics" && (
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 <div className="bg-white p-6 rounded-xl shadow-lg">
//                   <h3 className="text-lg font-semibold mb-4">Sentiment Analysis</h3>
//                   <div className="h-64">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <PieChart>
//                         <Pie
//                           data={sentimentData}
//                           cx="50%"
//                           cy="50%"
//                           innerRadius={60}
//                           outerRadius={80}
//                           paddingAngle={5}
//                           dataKey="value"
//                           label
//                         >
//                           {sentimentData.map((entry, index) => (
//                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                           ))}
//                         </Pie>
//                         <Tooltip />
//                       </PieChart>
//                     </ResponsiveContainer>
//                   </div>
//                 </div>
//                 <div className="bg-white p-6 rounded-xl shadow-lg">
//                   <h3 className="text-lg font-semibold mb-4">User Sentiment Over Time</h3>
//                   <div className="h-64">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <LineChart data={sentimentTrendData}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="date" tickFormatter={(date) => format(new Date(date), "MMM d")} />
//                         <YAxis />
//                         <Tooltip />
//                         <Line type="monotone" dataKey="positive" stroke="#10B981" name="Positive" />
//                         <Line type="monotone" dataKey="neutral" stroke="#F59E0B" name="Neutral" />
//                         <Line type="monotone" dataKey="negative" stroke="#EF4444" name="Negative" />
//                       </LineChart>
//                     </ResponsiveContainer>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {activeTab === "integrations" && (
//               <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
//                 <h3 className="text-lg font-semibold mb-4 flex items-center">
//                   <Api className="w-5 h-5 mr-2 text-indigo-500" />
//                   Integration Details
//                 </h3>
//                 <div className="space-y-4">
//                   <p className="text-gray-700">
//                     <span className="font-medium">Status:</span>{" "}
//                     {selectedContact.integrationStatus === "connected"
//                       ? "All systems are integrated seamlessly."
//                       : "Integration is currently disconnected. Please check your connection or contact support."}
//                   </p>
//                   <p className="text-gray-700">
//                     <span className="font-medium">Last Contact:</span>{" "}
//                     {format(new Date(selectedContact.lastContact), "MMM d, yyyy")}
//                   </p>
//                   <button className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors">
//                     Manage Integrations
//                   </button>
//                 </div>
//                 <div className="mt-6">
//                   <h4 className="text-md font-semibold mb-2">Integration Usage History</h4>
//                   <div className="h-64">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <BarChart data={selectedContact.integrationHistory}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="date" tickFormatter={(date) => format(new Date(date), "MMM d")} />
//                         <YAxis />
//                         <Tooltip />
//                         <Bar dataKey="calls" fill="#4F46E5" radius={[4, 4, 0, 0]} />
//                       </BarChart>
//                     </ResponsiveContainer>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </>
//         ) : (
//           <div className="flex-1 flex flex-col items-center justify-center">
//             <Psychology className="w-24 h-24 mb-4 text-gray-400" />
//             <h2 className="text-2xl font-semibold text-gray-500 mb-2">Select a Contact</h2>
//             <p className="text-gray-400">or create a new contact to begin your analysis</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import {
  Add,
  Search,
  Person,
  Chat,
  Timeline,
  Insights,
  Psychology,
  Api,
  Circle,
  FiberManualRecord,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { format } from "date-fns";

//
// Data Interfaces
//
interface ChatInteraction {
  date: string;
  botVersion: string;
  duration: number;
  transcript: string;
  satisfactionScore?: number;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  notes: string;
  lastContact: string;
  status: "active" | "inactive" | "lead";
  interactionHistory: ChatInteraction[];
  botUsageHistory: { date: string; usage: number }[];
  sentiment: "positive" | "neutral" | "negative";
  integrationStatus: "connected" | "disconnected";
  integrationHistory: { date: string; calls: number }[];
}

interface TicketInteraction {
  date: string;
  message: string;
  sender: string; // For example: 'customer' or 'support'
}

interface Ticket {
  id: string;
  contactId: string; // Linked to a Contact
  subject: string;
  description: string;
  status: "open" | "in_progress" | "resolved";
  priority: "low" | "medium" | "high";
  createdDate: string;
  updatedDate: string;
  ticketInteractions: TicketInteraction[];
}

//
// Sample Colors for Charts
//
const COLORS = ["#4F46E5", "#EF4444", "#10B981", "#F59E0B"];

//
// Main CRM Dashboard Component
//
export default function CRMDashboard() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "interactions" | "analytics" | "integrations" | "tickets"
  >("overview");
  const [interactionFilter, setInteractionFilter] = useState("");
  const [tickets, setTickets] = useState<Ticket[]>([]);

  // Dummy sales pipeline data (customized for the BotWot-inspired design)
  const pipelineData = [
    { stage: "Open", value: 45 },
    { stage: "Won", value: 25 },
    { stage: "Lost", value: 10 },
  ];

  // Dummy sentiment trend data for analytics tab
  const sentimentTrendData = [
    { date: "2024-03-01", positive: 60, neutral: 30, negative: 10 },
    { date: "2024-03-08", positive: 65, neutral: 25, negative: 10 },
    { date: "2024-03-15", positive: 70, neutral: 20, negative: 10 },
  ];

  // Load sample contact and ticket data (this could be replaced with real API calls)
  useEffect(() => {
    setContacts([
      {
        id: "1",
        name: "Sarah Johnson",
        email: "sarah@techcorp.com",
        phone: "+1 234 567 890",
        company: "Tech Corp Inc.",
        position: "CTO",
        notes:
          "Highly interested in new AI and automation solutions. Follow-up scheduled for product demo.",
        lastContact: "2024-03-15",
        status: "lead",
        interactionHistory: [
          {
            date: "2024-03-15T14:30:00",
            botVersion: "v2.1.5",
            duration: 8.2,
            transcript: "Discussed potential integrations and advanced AI features.",
            satisfactionScore: 4,
          },
          {
            date: "2024-02-28T10:15:00",
            botVersion: "v2.0.0",
            duration: 6.5,
            transcript: "Overview of CRM benefits and introduction to our dashboard.",
            satisfactionScore: 5,
          },
          {
            date: "2024-03-10T16:00:00",
            botVersion: "v2.1.2",
            duration: 7.0,
            transcript: "Talked about upselling premium plans and additional modules.",
            satisfactionScore: 4,
          },
        ],
        botUsageHistory: [
          { date: "2024-03-01", usage: 2 },
          { date: "2024-03-08", usage: 5 },
          { date: "2024-03-15", usage: 12 },
        ],
        sentiment: "positive",
        integrationStatus: "connected",
        integrationHistory: [
          { date: "2024-03-01", calls: 3 },
          { date: "2024-03-08", calls: 6 },
          { date: "2024-03-15", calls: 9 },
        ],
      },
      // Add more contacts here...
    ]);

    // Dummy ticket data
    setTickets([
      {
        id: "t1",
        contactId: "1",
        subject: "Demo Request Follow-up",
        description:
          "Customer requested a product demonstration and needs to schedule a demo session.",
        status: "open",
        priority: "high",
        createdDate: "2024-03-16",
        updatedDate: "2024-03-16",
        ticketInteractions: [
          {
            date: "2024-03-16T10:00:00",
            message: "Ticket created regarding demo scheduling.",
            sender: "support",
          },
        ],
      },
      // More ticket entries can be added here...
    ]);
  }, []);

  // Basic sentiment summary for the analytics tab (pie chart)
  const sentimentData = [
    { name: "Positive", value: 75 },
    { name: "Neutral", value: 20 },
    { name: "Negative", value: 5 },
  ];

  // Updated tabs to include tickets
  const tabs = ["overview", "interactions", "analytics", "integrations", "tickets"] as const;

  // Filter the interactions list based on text input
  const filteredInteractions =
    selectedContact?.interactionHistory.filter((interaction) =>
      interaction.transcript.toLowerCase().includes(interactionFilter.toLowerCase())
    ) || [];

  // Filter tickets for the selected contact
  const ticketsForContact = tickets.filter(
    (ticket) => ticket.contactId === selectedContact?.id
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar with Contacts List */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col shadow-md">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">All Contacts</h1>
            <button className="p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors">
              <Add className="w-5 h-5" />
            </button>
          </div>
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search contacts..."
              className="w-full pl-4 pr-10 py-3 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="h-5 w-5 text-gray-400 absolute right-3 top-3.5" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 space-y-2">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="p-4 bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow cursor-pointer border border-transparent hover:border-indigo-200"
              onClick={() => setSelectedContact(contact)}
            >
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Person className="w-6 h-6 text-indigo-500" />
                  </div>
                  <FiberManualRecord
                    className={`w-3 h-3 absolute -right-0.5 -bottom-0.5 ${
                      contact.integrationStatus === "connected"
                        ? "text-green-500"
                        : "text-gray-400"
                    }`}
                  />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                  <p className="text-sm text-gray-500">{contact.position}</p>
                  <div className="flex items-center mt-1">
                    <Circle className="w-2 h-2 text-gray-400 mr-2" />
                    <span className="text-xs text-gray-500">{contact.company}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main CRM Content Area */}
      <div className="flex-1 flex flex-col p-8 overflow-hidden">
        {selectedContact ? (
          <>
            {/* Contact Header */}
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center mr-4">
                  <Person className="w-8 h-8 text-indigo-500" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{selectedContact.name}</h1>
                  <p className="text-gray-500">{selectedContact.position}</p>
                  <div className="flex items-center mt-2">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        selectedContact.integrationStatus === "connected"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {selectedContact.integrationStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex border-b border-gray-200 mb-8 space-x-4">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 font-medium flex items-center transition-colors border-b-2 ${
                    activeTab === tab
                      ? "text-indigo-500 border-indigo-500"
                      : "text-gray-500 hover:text-gray-700 border-transparent"
                  }`}
                >
                  {tab === "overview" && <Insights className="mr-2" />}
                  {tab === "interactions" && <Chat className="mr-2" />}
                  {tab === "analytics" && <Timeline className="mr-2" />}
                  {tab === "integrations" && <Api className="mr-2" />}
                  {tab === "tickets" && <Api className="mr-2" />}
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Tabs Content */}
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Interaction Overview */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Psychology className="w-5 h-5 mr-2 text-indigo-500" />
                    Interaction Overview
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-indigo-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Avg. Session Duration</p>
                      <p className="text-2xl font-bold">8.2m</p>
                    </div>
                    <div className="p-4 bg-indigo-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Satisfaction Score</p>
                      <p className="text-2xl font-bold">4.5/5</p>
                    </div>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={selectedContact.botUsageHistory}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tickFormatter={(date) => format(new Date(date), "MMM d")} />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="usage" stroke="#4F46E5" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Sales Pipeline Visualization */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Timeline className="w-5 h-5 mr-2 text-indigo-500" />
                    Sales Pipeline
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pipelineData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                          {pipelineData.map((_entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Recent Activity Feed */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {selectedContact.interactionHistory.map((interaction, idx) => (
                      <div key={idx} className="border-b border-gray-200 pb-2">
                        <p className="text-sm text-gray-500">
                          {format(new Date(interaction.date), "MMM d, yyyy h:mm a")}
                        </p>
                        <p className="text-gray-700 truncate">{interaction.transcript}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "interactions" && (
              <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Chat className="w-5 h-5 mr-2 text-indigo-500" />
                    Chat Interactions
                  </h3>
                  <input
                    type="text"
                    placeholder="Filter interactions..."
                    value={interactionFilter}
                    onChange={(e) => setInteractionFilter(e.target.value)}
                    className="pl-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                {filteredInteractions.length > 0 ? (
                  filteredInteractions.map((interaction, idx) => (
                    <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm text-gray-500">
                          {format(new Date(interaction.date), "MMM d, yyyy h:mm a")}
                        </p>
                        {interaction.satisfactionScore && (
                          <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded">
                            Score: {interaction.satisfactionScore}/5
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700">{interaction.transcript}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Duration: {interaction.duration}m | Bot Version: {interaction.botVersion}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No interactions match your filter.</p>
                )}
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h3 className="text-lg font-semibold mb-4">Sentiment Analysis</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={sentimentData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          label
                        >
                          {sentimentData.map((_entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h3 className="text-lg font-semibold mb-4">User Sentiment Over Time</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={sentimentTrendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tickFormatter={(date) => format(new Date(date), "MMM d")} />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="positive" stroke="#10B981" name="Positive" />
                        <Line type="monotone" dataKey="neutral" stroke="#F59E0B" name="Neutral" />
                        <Line type="monotone" dataKey="negative" stroke="#EF4444" name="Negative" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "integrations" && (
              <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Api className="w-5 h-5 mr-2 text-indigo-500" />
                  Integration Details
                </h3>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    <span className="font-medium">Status:</span>{" "}
                    {selectedContact.integrationStatus === "connected"
                      ? "All systems are integrated seamlessly."
                      : "Integration is currently disconnected. Please check your connection or contact support."}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Last Contact:</span>{" "}
                    {format(new Date(selectedContact.lastContact), "MMM d, yyyy")}
                  </p>
                  <button className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors">
                    Manage Integrations
                  </button>
                </div>
                <div className="mt-6">
                  <h4 className="text-md font-semibold mb-2">Integration Usage History</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={selectedContact.integrationHistory}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tickFormatter={(date) => format(new Date(date), "MMM d")} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="calls" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "tickets" && (
              <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Api className="w-5 h-5 mr-2 text-indigo-500" />
                  Ticketing System
                </h3>
                {ticketsForContact.length > 0 ? (
                  ticketsForContact.map((ticket) => (
                    <div key={ticket.id} className="border p-4 rounded-lg mb-4">
                      <h4 className="text-md font-semibold">{ticket.subject}</h4>
                      <p className="text-gray-700">{ticket.description}</p>
                      <div className="flex justify-between mt-2 text-sm text-gray-500">
                        <span>Status: {ticket.status}</span>
                        <span>Priority: {ticket.priority}</span>
                        <span>
                          Created: {format(new Date(ticket.createdDate), "MMM d, yyyy")}
                        </span>
                      </div>
                      <button className="mt-2 px-3 py-1 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600">
                        Manage Ticket
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No tickets available for this contact.</p>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
            <Psychology className="w-24 h-24 mb-4 text-gray-400" />
            <h2 className="text-2xl font-semibold text-gray-500 mb-2">Select a Contact</h2>
            <p className="text-gray-400">or create a new contact to begin your analysis</p>
          </div>
        )}
      </div>
    </div>
  );
}
