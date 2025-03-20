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
}

interface ChatInteraction {
  date: string;
  botVersion: string;
  duration: number;
  transcript: string;
  satisfactionScore?: number;
}

const COLORS = ["#4F46E5", "#EF4444", "#10B981"];

export default function CRMDashboard() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "interactions" | "analytics" | "integrations"
  >("overview");

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
          "Interested in new AI solutions. Follow-up meeting scheduled for next week to discuss product roadmap and integration options.",
        lastContact: "2024-03-15",
        status: "lead",
        interactionHistory: [
          {
            date: "2024-03-15T14:30:00",
            botVersion: "v2.1.5",
            duration: 8.2,
            transcript: "User inquired about NLP capabilities...",
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
      },
    ]);
  }, []);

  const sentimentData = [
    { name: "Positive", value: 75 },
    { name: "Neutral", value: 20 },
    { name: "Negative", value: 5 },
  ];

  const tabs = [
    "overview",
    "interactions",
    "analytics",
    "integrations",
  ] as const;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6">
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

        <div className="flex-1 overflow-y-auto px-4">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="p-4 mb-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
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
                  <h3 className="font-semibold text-gray-900">
                    {contact.name}
                  </h3>
                  <p className="text-sm text-gray-500">{contact.position}</p>
                  <div className="flex items-center mt-1">
                    <Circle className="w-2 h-2 text-gray-400 mr-2" />
                    <span className="text-xs text-gray-500">
                      {contact.company}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-8 overflow-hidden">
        {selectedContact ? (
          <>
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center mr-4">
                  <Person className="w-8 h-8 text-indigo-500" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {selectedContact.name}
                  </h1>
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

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-8">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 font-medium flex items-center ${
                    activeTab === tab
                      ? "text-indigo-500 border-b-2 border-indigo-500"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab === "overview" && <Insights className="mr-2" />}
                  {tab === "interactions" && <Chat className="mr-2" />}
                  {tab === "analytics" && <Timeline className="mr-2" />}
                  {tab === "integrations" && <Api className="mr-2" />}
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Interaction Overview */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Psychology className="w-5 h-5 mr-2 text-indigo-500" />
                    Interaction Overview
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-indigo-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">
                        Avg. Session Duration
                      </p>
                      <p className="text-2xl font-bold">8.2m</p>
                    </div>
                    <div className="p-4 bg-indigo-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">
                        Satisfaction Score
                      </p>
                      <p className="text-2xl font-bold">4.5/5</p>
                    </div>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={selectedContact.botUsageHistory}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="date"
                          tickFormatter={(date) =>
                            format(new Date(date), "MMM d")
                          }
                        />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="usage"
                          stroke="#4F46E5"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Timeline className="w-5 h-5 mr-2 text-indigo-500" />
                    Performance Metrics
                  </h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={selectedContact.botUsageHistory}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="date"
                          tickFormatter={(date) =>
                            format(new Date(date), "MMM d")
                          }
                        />
                        <YAxis />
                        <Tooltip />
                        <Bar
                          dataKey="usage"
                          fill="#4F46E5"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Notes & Details */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">
                    Notes & Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Notes:</p>
                      <p className="text-gray-900">{selectedContact.notes}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email:</p>
                      <p className="text-gray-900">{selectedContact.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone:</p>
                      <p className="text-gray-900">{selectedContact.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Company:</p>
                      <p className="text-gray-900">{selectedContact.company}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">
                    Sentiment Analysis
                  </h3>
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
                        >
                          {sentimentData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
            <Psychology className="w-24 h-24 mb-4 text-gray-400" />
            <h2 className="text-2xl font-semibold text-gray-500 mb-2">
              Select a Contact
            </h2>
            <p className="text-gray-400">
              or create new contact to begin analysis
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
