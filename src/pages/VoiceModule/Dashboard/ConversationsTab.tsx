import React from "react";
import { Link } from "react-router-dom";
import { Phone, PhoneMissed } from "@mui/icons-material";
import { Card, CardContent } from "@mui/material";

interface Conversation {
  id: number;
  name: string;
  company: string;
  date: string;
  time: string;
  duration: string;
  type: "inbound" | "outbound";
  status: string;
  summary: string;
}

const recentConversations: Conversation[] = [
  {
    id: 1,
    name: "John Smith",
    company: "Acme Corp",
    date: "April 10, 2025",
    time: "11:30 AM",
    duration: "4:32",
    type: "inbound",
    status: "completed",
    summary:
      "Discussion about new product features and timeline for implementation.",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    company: "XYZ Industries",
    date: "April 9, 2025",
    time: "9:15 AM",
    duration: "3:15",
    type: "outbound",
    status: "completed",
    summary:
      "Follow-up on the proposal sent last week. Client requested additional information.",
  },
  {
    id: 3,
    name: "Michael Brown",
    company: "Tech Solutions Inc.",
    date: "April 9, 2025",
    time: "2:45 PM",
    duration: "5:20",
    type: "inbound",
    status: "completed",
    summary:
      "Technical support call regarding integration issues. Problem resolved during call.",
  },
];

const ConversationsTab = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Recent Conversations</h2>
        <Link
          to="/voice/conversations"
          className="text-sm text-[#9b87f5] hover:underline"
        >
          View All
        </Link>
      </div>

      {recentConversations.map((conversation) => (
        <ConversationCard key={conversation.id} conversation={conversation} />
      ))}
    </div>
  );
};

const ConversationCard: React.FC<{ conversation: Conversation }> = ({
  conversation,
}) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardContent className="p-0">
      <div className="flex flex-col md:flex-row md:items-center gap-4 p-4">
        <div className="flex-shrink-0">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              conversation.type === "inbound"
                ? "bg-green-100 text-green-600"
                : conversation.status === "missed"
                ? "bg-red-100 text-red-600"
                : "bg-blue-100 text-blue-600"
            }`}
          >
            {conversation.type === "inbound" ? (
              <Phone className="h-5 w-5" />
            ) : conversation.status === "missed" ? (
              <PhoneMissed className="h-5 w-5" />
            ) : (
              <Phone className="h-5 w-5" />
            )}
          </div>
        </div>

        <div className="flex-grow md:flex md:items-center md:justify-between">
          <div className="mb-2 md:mb-0">
            <h3 className="font-semibold text-gray-800">{conversation.name}</h3>
            <p className="text-sm text-gray-500">{conversation.company}</p>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div>
              {conversation.date} {conversation.time}
            </div>
            <div>{conversation.duration}</div>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4 pt-0 border-t border-gray-100">
        <p className="text-sm text-gray-600">{conversation.summary}</p>
      </div>
    </CardContent>
  </Card>
);

export default ConversationsTab;
