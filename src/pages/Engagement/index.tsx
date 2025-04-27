/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import {
  Instagram,
  Facebook,
  LinkedIn,
  Twitter,
  MoreVert,
  WhatsApp,
  AttachFile,
  Send,
  Image,
  SmartToy,
  Person,
  ChevronRight,
  Favorite,
  Comment,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
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
import {
  IconButton,
  Menu,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
  Avatar,
  Box,
} from "@mui/material";
import { getInstagramData } from "../../api/services/integrationServices";

const EngagementTab = () => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [availableIntegrations, setAvailableIntegrations] = useState<any[]>([]);
  const [integrationId, setIntegrationId] = useState<string>("");
  const [inputText, setInputText] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<any>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const open = Boolean(anchorEl);

  // ref to hold socket instance
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        const resp = await getInstagramData();
        const ints = Array.isArray(resp.data) ? resp.data : [];
        setAvailableIntegrations(ints);
        if (ints.length > 0) {
          setIntegrationId(ints[0]._id); // Set the first integration's _id as default
        }
      } catch (err) {
        console.error("Error fetching integrations", err);
      }
    };
    fetchIntegrations();
  }, []);

  // Create socket once
  useEffect(() => {
    const socket = io(`${import.meta.env.VITE_FIREBASE_BASE_URL}/instagram`, {
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.on("connect", () => console.log("Socket connected", socket.id));
    socket.on("disconnect", (reason) =>
      console.warn("Socket disconnected", reason)
    );

    socket.on("initialData", (data) => {
      console.log("Conversation data received", data.conversations);
      console.log("Posts data received", data.posts);
      setConversations(data.conversations || []);
      setPosts(data.posts || []);
    });

    socket.on("igMessageSendSuccess", ({ data }) => {
      setConversations((prev) =>
        prev.map((c) =>
          c.messageId === data.messageId
            ? { ...c, messages: [...(c.messages || []), data] }
            : c
        )
      );
    });
    socket.on("igCommentSendSuccess", ({ data }) => {
      setConversations((prev) =>
        prev.map((c) =>
          c.messageId === data.messageId
            ? { ...c, messages: [...(c.messages || []), data] }
            : c
        )
      );
    });
    socket.on("igBroadcastOutgoingMessage", ({ data }) => {
      setConversations((prev) =>
        prev.map((c) =>
          c.messageId === data.messageId
            ? { ...c, messages: [...(c.messages || []), data] }
            : c
        )
      );
    });
    socket.on("igBroadcastOutgoingComment", ({ data }) => {
      setConversations((prev) =>
        prev.map((c) =>
          c.messageId === data.messageId
            ? { ...c, messages: [...(c.messages || []), data] }
            : c
        )
      );
    });

    socket.on("error", (e) => console.error("Socket error", e));
    socket.on("igMessageSendError", (e) => console.error("Msg send error", e));
    socket.on("igCommentSendError", (e) => console.error("Cmt send error", e));

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  // Emit fetch when integrationId changes
  useEffect(() => {
    if (integrationId && socketRef.current) {
      socketRef.current.emit("igFetchInitialData", integrationId);
    }
  }, [integrationId]);

  const sendMessage = () => {
    if (!inputText || !selectedConversationId || !integrationId) return;

    const conv = conversations.find((c) => c.userId === selectedConversationId);
    if (!conv) return;

    if (conv.type === "DM") {
      socketRef.current!.emit("igSendMessageRequest", {
        integrationId,
        recipientId: conv.recipientId,
        recipientUsername: conv.username,
        message: inputText,
      });
    } else {
      socketRef.current!.emit("igSendCommentReplyRequest", {
        integrationId,
        parentId: conv.parentCommentId || conv.replyToCommentId,
        text: inputText,
        postId: conv.postId,
      });
    }
    setInputText("");
  };

  // UI Handlers
  const handleClick = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const openPostModal = (post: any) => {
    setCurrentPost(post);
    setCarouselIndex(0); // Reset carousel index when opening a new post
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  // Carousel Navigation
  const handleNext = () => {
    if (currentPost && currentPost.carouselMedia) {
      setCarouselIndex((prev) =>
        prev < currentPost.carouselMedia.length - 1 ? prev + 1 : prev
      );
    }
  };
  const handlePrev = () => {
    setCarouselIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const displayedConversations = conversations;
  const selectedConversation = conversations.find(
    (c) => c.userId === selectedConversationId
  );

  const socialPlatforms = [
    { icon: <Instagram />, sentiment: 60 },
    { icon: <Facebook />, sentiment: 60 },
    { icon: <LinkedIn />, sentiment: 60 },
    { icon: <Twitter />, sentiment: 60 },
    { icon: <WhatsApp />, sentiment: 60 },
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

  // Extract Instagram posts from conversations
  const instagramPosts = posts;

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-semibold mb-1">Engagement</h1>
      <p className="text-gray-600 text-sm mb-6">
        Sentiment across all active channels
      </p>

      {/* Social Platform Metrics */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        {socialPlatforms.map((platform, index) => (
          <div
            key={index}
            className="bg-[#65558F] bg-opacity-[0.04] rounded-lg shadow-lg p-4 flex items-center gap-2"
          >
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

      {/* Selection Controls */}
      <div className="flex gap-4 mb-6">
        <FormControl className="w-1/2">
          <InputLabel>Select Integration</InputLabel>
          <Select
            value={integrationId}
            label="Select Integration"
            onChange={(e) => setIntegrationId(e.target.value)}
          >
            {availableIntegrations.map((intg) => (
              <MenuItem key={intg._id} value={intg._id}>
                {intg.instagramName} (@{intg.instagramUsername})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl className="w-1/2">
          <InputLabel>Select Platform</InputLabel>
          <Select
            value={"all-platforms"}
            label="Select Platform"
            onChange={() => {
              /* Add platform filter handler */
            }}
          >
            <MenuItem value="all-platforms">All Platforms</MenuItem>
            <MenuItem value="instagram">Instagram</MenuItem>
            <MenuItem value="facebook">Facebook</MenuItem>
            <MenuItem value="linkedin">LinkedIn</MenuItem>
            <MenuItem value="twitter">Twitter</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* Ticket Section */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        {/* Recent Posts Carousel */}
        <div className="flex flex-col space-y-4 col-span-2">
          <h2 className="text-lg font-semibold mb-2">Recent Posts</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {instagramPosts.length > 0 ? (
              instagramPosts.map((post) => (
                <div
                  key={post?.postId}
                  className="min-w-[200px] bg-gray-50 rounded-lg shadow p-4 cursor-pointer"
                  onClick={() => openPostModal(post)}
                >
                  <div className="relative mb-2">
                    {post.mediaType === "VIDEO" ? (
                      <video
                        src={post.mediaUrl}
                        className="w-full h-32 object-cover rounded-md"
                        muted
                        loop
                      />
                    ) : post.mediaType === "IMAGE" ? (
                      <img
                        src={post.mediaUrl}
                        alt="Post not available"
                        className="w-full h-32 object-cover rounded-md"
                      />
                    ) : post.mediaType === "CAROUSEL_ALBUM" &&
                      post.carouselMedia?.length > 0 ? (
                      <img
                        src={post.carouselMedia[0].url}
                        alt="Carousel post"
                        className="w-full h-32 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-full h-32 bg-gray-200 rounded-md flex items-center justify-center">
                        <span className="text-gray-500">No media</span>
                      </div>
                    )}
                    <span className="absolute top-2 left-2 bg-white rounded-full p-1">
                      <Instagram fontSize="small" />
                    </span>
                  </div>
                  <p className="text-sm mb-2 overflow-hidden overflow-ellipsis line-clamp-3">
                    {post?.caption}
                  </p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>
                      {new Date(post?.timestamp).toLocaleTimeString()}
                    </span>
                    <span>{post.comments?.length || 0} comments</span>
                  </div>
                </div>
              ))
            ) : (
              <p>No posts available</p>
            )}
            <button className="min-w-[220px] flex items-center justify-center bg-purple-100 rounded-lg">
              View More <ChevronRight className="ml-1" />
            </button>
          </div>
        </div>

        {/* Agent Details Card */}
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

        {/* Customer Details Card */}
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
        {/* Left Column - Conversations */}
        <div className="col-span-3">
          <div className="bg-[#65558F] bg-opacity-[0.08] rounded-lg">
            {displayedConversations.map((c) => (
              <div
                key={c.userId}
                className={`p-3 border-b border-gray-100 flex items-center gap-2 cursor-pointer ${
                  selectedConversationId === c.userId ? "bg-gray-200" : ""
                }`}
                onClick={() => {
                  setSelectedConversationId(c.userId);
                }}
              >
                <span className="w-8 h-8">
                  <Instagram />
                </span>
                <div>
                  <p className="text-base">{c?.username || "Unknown"}</p>
                  <p
                    className={`text-base ${
                      c?.sentiment >= 50 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {c?.sentiment}% Positive
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Middle Column - Chat */}
        <div key={selectedConversationId} className="col-span-5">
          <div className="bg-[#65558F] bg-opacity-[0.08] rounded-lg shadow-lg p-4">
            {selectedConversation ? (
              <>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-md font-semibold">
                      {selectedConversation.recipientUsername || "Unknown"}
                    </h2>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="h-[400px] overflow-y-auto mb-4">
                  {(selectedConversation.messages || []).map(
                    (message, index) => (
                      <div
                        key={index}
                        className={
                          message.senderType === "ADMIN"
                            ? "flex justify-end mb-4"
                            : "flex gap-2 mb-4"
                        }
                      >
                        {message.senderType !== "ADMIN" && (
                          <div className="w-8 h-8 rounded-full bg-[#2E2F5F] flex items-center justify-center">
                            <SmartToy className="text-white w-6 h-6" />
                          </div>
                        )}
                        <div
                          className={
                            message.senderType === "ADMIN"
                              ? "bg-[#2E2F5F] text-white p-3 rounded-lg max-w-[70%]"
                              : "bg-white p-3 rounded-lg max-w-[70%]"
                          }
                        >
                          <p className="text-sm">{message.message.text}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                        {message.senderType === "ADMIN" && (
                          <div className="w-8 h-8 rounded-full bg-[#2E2F5F] ml-4 flex items-center justify-center">
                            <Person className="text-white w-6 h-6" />
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>

                {/* Quick Replies and CSAT */}
                <div className="flex justify-between items-start mt-24 gap-6">
                  <div className="flex flex-col mt-10 gap-2">
                    {["Okay", "Fine", "That works.", "Tell me more."].map(
                      (text, index) => (
                        <button
                          key={index}
                          className="px-4 py-1.5 text-sm bg-purple-50 text-[#65558F] border border-purple-100 rounded-full hover:bg-purple-100"
                          onClick={() => {
                            setInputText(text);
                            sendMessage();
                          }}
                        >
                          {text}
                        </button>
                      )
                    )}
                  </div>
                  <div className="p-4 bg-[#65558F] mb-4 bg-opacity-[0.08] text-black rounded-lg w-[250px]">
                    <div className="flex items-center mb-2">
                      <p className="text-red-400 font-bold text-sm">
                        20% (CSAT)
                      </p>
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
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  />
                  <button
                    className="p-1.5 hover:bg-gray-200 rounded-full"
                    onClick={sendMessage}
                  >
                    <Send className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500 mt-10">
                Select a conversation to start chatting
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="col-span-4 space-y-4">
          <div className="bg-[#65558F] bg-opacity-[0.08] rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-semibold">
                Platforms Health Details
              </h2>
              <div className="flex gap-2">
                <button className="px-4 py-1.5 text-sm border border-purple-100 text-[#65558F] rounded-lg hover:bg-purple-50">
                  Date Range
                </button>
                <button className="px-4 py-1.5 text-sm bg-[#65558F] text-white rounded-lg">
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
          <div className="bg-[#65558F] bg-opacity-[0.08] rounded-lg p-4">
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
          <div className="bg-[#65558F] bg-opacity-[0.08] rounded-lg p-4">
            <h2 className="text-sm font-semibold mb-3">Summary</h2>
            <div className="space-y-2">
              {[
                { label: "Potential Risk", value: "Low" },
                { label: "Sales Opportunity", value: "High" },
                {
                  label: "Upcoming Trends",
                  value: "AI-driven automation is gaining traction",
                },
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

      {/* Modal for Post Details */}
      {currentPost && (
        <Dialog open={isModalOpen} onClose={closeModal} maxWidth="lg" fullWidth>
          <DialogTitle>
            Post by {currentPost.username || "botwot.io"}
          </DialogTitle>
          <DialogContent dividers>
            <div className="grid grid-cols-2 gap-6">
              {/* Left: Media */}
              <div className="flex items-center justify-center relative">
                {currentPost.mediaType === "VIDEO" ? (
                  <video
                    src={currentPost.mediaUrl}
                    controls
                    className="w-full h-auto max-h-[500px] rounded-lg shadow-md"
                  />
                ) : currentPost.mediaType === "IMAGE" ? (
                  <img
                    src={currentPost.mediaUrl}
                    alt="Post detail"
                    className="w-full h-auto max-h-[500px] object-contain rounded-lg shadow-md"
                  />
                ) : currentPost.mediaType === "CAROUSEL_ALBUM" &&
                  currentPost.carouselMedia?.length > 0 ? (
                  <Box position="relative" width="100%">
                    <img
                      src={currentPost.carouselMedia[carouselIndex].url}
                      alt={`Carousel item ${carouselIndex + 1}`}
                      className="w-full h-auto max-h-[500px] object-contain rounded-lg shadow-md"
                    />
                    {currentPost.carouselMedia.length > 1 && (
                      <>
                        <IconButton
                          onClick={handlePrev}
                          disabled={carouselIndex === 0}
                          sx={{
                            position: "absolute",
                            left: 10,
                            top: "50%",
                            transform: "translateY(-50%)",
                            backgroundColor: "rgba(0,0,0,0.5)",
                            color: "white",
                            "&:hover": {
                              backgroundColor: "rgba(0,0,0,0.7)",
                            },
                          }}
                        >
                          <ChevronLeft />
                        </IconButton>
                        <IconButton
                          onClick={handleNext}
                          disabled={
                            carouselIndex ===
                            currentPost.carouselMedia.length - 1
                          }
                          sx={{
                            position: "absolute",
                            right: 10,
                            top: "50%",
                            transform: "translateY(-50%)",
                            backgroundColor: "rgba(0,0,0,0.5)",
                            color: "white",
                            "&:hover": {
                              backgroundColor: "rgba(0,0,0,0.7)",
                            },
                          }}
                        >
                          <ChevronRightIcon />
                        </IconButton>
                        <Box
                          display="flex"
                          justifyContent="center"
                          mt= {2}
                          gap={1}
                        >
                          {currentPost.carouselMedia.map((_: any, index: number) => (
                            <Box
                              key={index}
                              width={8}
                              height={8}
                              borderRadius="50%"
                              bgcolor={
                                index === carouselIndex ? "#65558F" : "grey.400"
                              }
                              sx={{ cursor: "pointer" }}
                              onClick={() => setCarouselIndex(index)}
                            />
                          ))}
                        </Box>
                      </>
                    )}
                  </Box>
                ) : (
                  <div className="w-full h-[500px] bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">No media available</span>
                  </div>
                )}
              </div>

              {/* Right: Stats & Comments */}
              <div className="flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <Instagram fontSize="large" className="text-pink-500 mr-2" />
                  <Typography variant="h6">Instagram</Typography>
                </div>
                <div className="flex items-center justify-around text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Favorite fontSize="small" /> {currentPost.likesCount || 0}
                  </div>
                  <div className="flex items-center gap-1">
                    <Comment fontSize="small" />{" "}
                    {currentPost.comments?.length || 0}
                  </div>
                  <div className="flex items-center gap-1">
                    <Send fontSize="small" /> {currentPost.sharesCount || 0}
                  </div>
                </div>
                <Divider />
                <Typography variant="subtitle1" className="mt-4 mb-2">
                  Trending comments on your recent update
                </Typography>
                <div className="overflow-y-auto max-h-[400px]">
                  {currentPost.comments?.map((c: any) => (
                    <div
                      key={c.commentId}
                      className="flex items-start mb-3 p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <Avatar sx={{ width: 24, height: 24 }} className="mr-2">
                        {c.username[0]}
                      </Avatar>
                      <div>
                        <Typography variant="subtitle2">
                          {c.username}
                        </Typography>
                        <Typography variant="body2" className="break-words">
                          {c.text}
                        </Typography>
                        <Typography variant="caption" className="text-gray-400">
                          {new Date(c.timestamp).toLocaleTimeString()}
                        </Typography>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={closeModal}
              variant="outlined"
              color="primary"
              sx={{
                borderRadius: "12px",
                backgroundColor: "#65558F",
                color: "#fff",
                px: 3,
                py: 1,
                fontWeight: "500",
                "&:hover": {
                  backgroundColor: "#56497A",
                },
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

// Custom method to get relative time (polyfill if needed)
Date.prototype.toLocaleTimeString = function () {
  const now = new Date();
  const diffMs = now.getTime() - (this as Date).getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffDays > 0) return `${diffDays} day(s) ago`;
  if (diffHours > 0) return `${diffHours} hour(s) ago`;
  if (diffMinutes > 0) return `${diffMinutes} minute(s) ago`;
  return "just now";
};

export default EngagementTab;