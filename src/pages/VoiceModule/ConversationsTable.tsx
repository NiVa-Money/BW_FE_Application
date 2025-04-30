/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";

interface Conversation {
  call_duration_secs: string;
  conversation_id: string;
  agent_name: string;
  status: string;
  start_time_unix_secs: number;
}

interface TranscriptItem {
  role: "agent" | "user";
  message: string;
  time_in_call_secs?: number;
}

interface ConversationDetails {
  conversation_id: string;
  agent_id?: string;
  status?: string;
  transcript?: TranscriptItem[];
  metadata?: {
    start_time_unix_secs?: number;
    call_duration_secs?: number;
    cost?: number;
  };
  analysis?: {
    call_successful?: string;
    transcript_summary?: string;
  };
}

const ConversationsTable: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [conversationDetails, setConversationDetails] =
    useState<ConversationDetails | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch(
          "https://api.elevenlabs.io/v1/convai/conversations",
          { headers: { "xi-api-key": apiKey } }
        );
        if (!response.ok) throw new Error("Failed to fetch conversations");
        const data = await response.json();
        setConversations(data.conversations || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, [apiKey]);

  useEffect(() => {
    const fetchConversationDetails = async () => {
      if (!selectedConversationId) return;
      setModalError(null);
      setModalLoading(true);
      try {
        const response = await fetch(
          `https://api.elevenlabs.io/v1/convai/conversations/${selectedConversationId}`,
          { headers: { "xi-api-key": apiKey } }
        );
        if (!response.ok)
          throw new Error("Failed to fetch conversation details");
        const data = await response.json();
        setConversationDetails(data);
      } catch (err: any) {
        setModalError(err.message);
      } finally {
        setModalLoading(false);
      }
    };
    fetchConversationDetails();
  }, [selectedConversationId, apiKey]);

  const handleConversationClick = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedConversationId(null);
    setConversationDetails(null);
    setModalError(null);
  };

  if (loading)
    return <div className="p-4 text-slate-500">Loading conversations...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6">
      {/* Center the table container */}
      <div className="max-w-7xl mx-auto overflow-x-auto">
        <table className="w-full border-collapse rounded-2xl overflow-hidden shadow-lg">
          <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <tr>
              <th className="px-6 py-4 text-left text-base font-semibold text-black">
                Conversation ID
              </th>
              <th className="px-6 py-4 text-left text-base font-semibold text-black">
                Agent
              </th>
              <th className="px-6 py-4 text-left text-base font-semibold text-black">
                Status
              </th>
              <th className="px-6 py-4 text-left text-base font-semibold text-black">
                Created
              </th>
              <th className="px-6 py-4 text-left text-base font-semibold text-black">
                Start Time
              </th>
              <th className="px-6 py-4 text-left text-base font-semibold text-black">
                Duration (s)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {conversations.map((conv) => (
              <tr
                key={conv.conversation_id}
                className="hover:bg-slate-50 transition-all duration-200 ease-out cursor-pointer active:scale-[0.99]"
                onClick={() => handleConversationClick(conv.conversation_id)}
              >
                <td className="px-6 py-4 text-sm font-medium text-blue-600 hover:text-blue-800">
                  <span className="inline-block transition-transform hover:translate-x-1">
                    #{conv.conversation_id}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {conv.agent_name || "N/A"}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      conv.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {conv.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {new Date(
                    conv.start_time_unix_secs * 1000
                  ).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {new Date(
                    conv.start_time_unix_secs * 1000
                  ).toLocaleTimeString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {conv.call_duration_secs}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-20 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-3xl relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 hover:bg-slate-50 rounded-full transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {modalLoading && (
              <div className="text-center p-8">
                <div className="animate-pulse text-slate-500">
                  Loading conversation details...
                </div>
              </div>
            )}

            {modalError && (
              <div className="p-4 bg-red-50 rounded-lg text-red-600">
                ⚠️ Error: {modalError}
              </div>
            )}

            {!modalLoading && !modalError && conversationDetails && (
              <div className="space-y-6">
                <header className="border-b border-slate-100 pb-4">
                  <h2 className="text-2xl font-semibold text-slate-800">
                    Conversation Details
                  </h2>
                  <div className="mt-2 flex items-center space-x-4 text-slate-500">
                    <span className="text-sm">
                      ID: {conversationDetails.conversation_id}
                    </span>
                    <span className="text-sm">•</span>
                    <span
                      className={`text-sm px-2 py-1 rounded ${
                        conversationDetails.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {conversationDetails.status}
                    </span>
                  </div>
                </header>

                {conversationDetails.transcript && (
                  <section>
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">
                      Transcript
                    </h3>
                    <div className="max-h-72 overflow-y-auto space-y-4 pr-2">
                      {conversationDetails.transcript.map((item, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg ${
                            item.role === "agent"
                              ? "bg-blue-50 border-l-4 border-blue-300"
                              : "bg-slate-50 border-l-4 border-slate-300"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-600">
                              {item.role === "agent" ? "🤖 Agent" : "👤 User"}
                            </span>
                            <span className="text-xs text-slate-400">
                              {item.time_in_call_secs}s
                            </span>
                          </div>
                          <p className="text-slate-700">{item.message}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {conversationDetails.metadata && (
                  <section>
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">
                      Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <div className="text-slate-500">Duration</div>
                        <div className="font-medium text-slate-700">
                          {conversationDetails.metadata.call_duration_secs ??
                            "N/A"}
                          s
                        </div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <div className="text-slate-500">Start Time</div>
                        <div className="font-medium text-slate-700">
                          {new Date(
                            conversationDetails.metadata.start_time_unix_secs *
                              1000
                          ).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </section>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationsTable;
