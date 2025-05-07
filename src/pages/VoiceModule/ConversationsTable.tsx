/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import {
  getAllVoiceCallsService,
  getVoiceCallByIdService,
} from "../../api/services/voiceModuleServices";

interface Conversation {
  conversation_id: string;
  agent_name: string;
  status: string;
  created_at: string; // ISO string
  duration_secs: number;
  retry_count: number;
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
    created_at?: string;
    duration_secs?: number;
    recording_url?: string;
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

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await getAllVoiceCallsService();
        // Map API response to Conversation interface
        const mappedConversations: Conversation[] = data.map((call: any) => ({
          conversation_id: call._id,
          agent_name: call.agentId || "Unknown Agent",
          status: call.status,
          created_at: call.createdAt,
          duration_secs: call.duration,
          retry_count: call.retryCount,
        }));
        setConversations(mappedConversations);
      } catch (err: any) {
        setError(err.message || "Failed to fetch conversations");
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  useEffect(() => {
    const fetchConversationDetails = async () => {
      if (!selectedConversationId) return;
      setModalError(null);
      setModalLoading(true);
      try {
        const data = await getVoiceCallByIdService(selectedConversationId);
        // Map API response to ConversationDetails interface
        const details: ConversationDetails = {
          conversation_id: data._id,
          agent_id: data.agentId,
          status: data.status,
          transcript: data.transcript
            ? parseTranscript(data.transcript) // Parse or mock transcript
            : [],
          metadata: {
            created_at: data.createdAt,
            duration_secs: data.duration,
            recording_url: data.recordingUrl,
          },
          analysis: data.insights
            ? {
                call_successful: data.insights.success ? "Yes" : "No",
                transcript_summary:
                  data.insights.summary || "No summary available",
              }
            : undefined,
        };
        setConversationDetails(details);
      } catch (err: any) {
        setModalError(err.message || "Failed to fetch conversation details");
      } finally {
        setModalLoading(false);
      }
    };
    fetchConversationDetails();
  }, [selectedConversationId]);

  // Helper to parse or mock transcript (since API provides empty string or unstructured data)
  const parseTranscript = (transcript: string): TranscriptItem[] => {
    if (!transcript) {
      // Mock transcript if empty
      return [
        {
          role: "agent",
          message: "Hello, how can I assist you?",
          time_in_call_secs: 0,
        },
        {
          role: "user",
          message: "I need help with my account.",
          time_in_call_secs: 5,
        },
      ];
    }
    try {
      // Attempt to parse if transcript is JSON
      const parsed = JSON.parse(transcript);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      // Fallback: treat as plain text
      return [{ role: "user", message: transcript, time_in_call_secs: 0 }];
    }
  };

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
                Retry Count
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
                  {conv.agent_name}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      conv.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {conv.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {conv.retry_count}
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {new Date(conv.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {new Date(conv.created_at).toLocaleTimeString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {conv.duration_secs}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
                        conversationDetails.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {conversationDetails.status}
                    </span>
                  </div>
                </header>

                {conversationDetails.transcript &&
                  conversationDetails.transcript.length > 0 && (
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
                          {conversationDetails.metadata.duration_secs ?? "N/A"}s
                        </div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <div className="text-slate-500">Created At</div>
                        <div className="font-medium text-slate-700">
                          {conversationDetails.metadata.created_at
                            ? new Date(
                                conversationDetails.metadata.created_at
                              ).toLocaleString()
                            : "N/A"}
                        </div>
                      </div>
                      {conversationDetails.metadata.recording_url && (
                        <div className="p-3 bg-slate-50 rounded-lg col-span-2">
                          <div className="text-slate-500">Recording</div>
                          <a
                            href={conversationDetails.metadata.recording_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Listen to Recording
                          </a>
                        </div>
                      )}
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
