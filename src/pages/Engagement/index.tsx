/* eslint-disable @typescript-eslint/no-explicit-any */

// -----------------------------
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import {
  Instagram,
  Facebook,
  LinkedIn,
  Twitter,
  WhatsApp,
  AttachFile,
  Send,
  Image,
  SmartToy,
  Person,
  ChevronRight,
  Favorite,
  FavoriteBorder,
  Comment,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  MoreVert,
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
  TextField,
} from "@mui/material";

const EngagementTab = () => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [platform, setPlatform] = useState<
    "instagram" | "facebook" | "all-platforms"
  >("all-platforms");
  const [inputText, setInputText] = useState("");
  const [commentText, setCommentText] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<any>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [filterType, setFilterType] = useState<"conversations" | "comments">(
    "conversations"
  );
  const open = Boolean(anchorEl);
  const socketRef = useRef<Socket | null>(null);
  const orgId = localStorage.getItem("orgId");

  useEffect(() => {
    if (!orgId) {
      console.warn("No orgId available, cannot establish socket connection");
      return;
    }

    const socket = io(`${import.meta.env.VITE_FIREBASE_BASE_URL}/engagement`, {
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      transports: ["websocket"],
    });
    socketRef.current = socket;

    const setupListeners = () => {
      console.log("Setting up socket listeners");

      socket.on("connect", () => {
        console.log("Socket connected", socket.id);
        if (platform === "all-platforms") {
          socket.emit("fbFetchInitialData", orgId);
          socket.emit("igFetchInitialData", orgId);
        } else {
          const event =
            platform === "facebook"
              ? "fbFetchInitialData"
              : "igFetchInitialData";
          socket.emit(event, orgId);
        }
      });

      socket.on("connect_error", (err) =>
        console.error("Socket connection error", err)
      );
      socket.on("reconnect_attempt", () =>
        console.log("Socket reconnecting...")
      );
      socket.on("disconnect", (reason) =>
        console.warn("Socket disconnected", reason)
      );

      // Instagram Events
      socket.on("igInitialData", (data) => {
        console.log("igInitialData received", data);
        if (platform === "all-platforms" || platform === "instagram") {
          const processedConversations = data.data.flatMap((item: any) =>
            item.conversations.map((conv: any) => ({
              ...conv,
              CHANNEL: "Instagram",
              userId: conv.userId,
              username: conv.username || conv.name || "Unknown",
              messages: conv.messages.map((msg: any) => ({
                ...msg,
                CHANNEL: "Instagram",
                messageId: msg.messageId,
                message: {
                  text: msg.message.text || "",
                  type: msg.message.type,
                  senderType: msg.senderType,
                },
                timestamp: msg.timestamp,
                status: msg.status,
              })),
              messageCount: conv.messageCount,
            }))
          );

          const processedPosts = data.data.flatMap((item: any) =>
            item.posts.map((post: any) => ({
              ...post,
              CHANNEL: "Instagram",
              postId:
                post.postId ||
                post._id ||
                `post_${Math.random().toString(36).substr(2, 9)}`,
              caption: post.caption,
              mediaType: post.mediaType,
              likeCount: post.likeCount,
              timestamp: post.timestamp,
              createdAt: post.createdAt,
              updatedAt: post.updatedAt,
              carouselMedia: post.carouselMedia || [],
              comments: post.comments || [],
              mediaUrl:
                post.mediaUrl ||
                (post.carouselMedia?.length ? post.carouselMedia[0].url : ""),
            }))
          );

          setConversations((prev) => [
            ...prev.filter((c) => c.CHANNEL !== "Instagram"),
            ...processedConversations,
          ]);
          setPosts((prev) => [
            ...prev.filter((p) => p.CHANNEL !== "Instagram"),
            ...processedPosts,
          ]);
        }
      });

      socket.on("igManualAdminMessage", (data) => {
        console.log("igManualAdminMessage received", data);
        if (platform === "all-platforms" || platform === "instagram")
          updateConversation(data, "Instagram");
      });

      socket.on("igBotReplyComment", (data) => {
        console.log("igBotReplyComment received", data);
        if (platform === "all-platforms" || platform === "instagram") {
          updatePostComment(data, "Instagram");
          updateConversation(data, "Instagram");
        }
      });

      socket.on("igNewPost", (data) => {
        console.log("igNewPost received", data);
        if (platform === "all-platforms" || platform === "instagram")
          setPosts((prev) => [{ ...data, CHANNEL: "Instagram" }, ...prev]);
      });

      socket.on("igIncomingUserComment", (data) => {
        console.log("igIncomingUserComment received", data);
        if (platform === "all-platforms" || platform === "instagram")
          updatePostComment(data, "Instagram");
      });

      socket.on("igBotReplyMessage", (data) => {
        console.log("igBotReplyMessage received", data);
        if (platform === "all-platforms" || platform === "instagram")
          updateConversation(data, "Instagram");
      });

      socket.on("igIncomingUserMessage", (data) => {
        console.log("igIncomingUserMessage received", data);
        if (platform === "all-platforms" || platform === "instagram")
          updateConversation(data, "Instagram");
      });

      socket.on("igCommentSendError", (e) =>
        console.error("igCommentSendError", e)
      );
      socket.on("igBroadcastOutgoingComment", (data) => {
        console.log("igBroadcastOutgoingComment received", data);
        if (platform === "all-platforms" || platform === "instagram") {
          updatePostComment(data, "Instagram");
          updateConversation(data, "Instagram");
        }
      });

      socket.on("igCommentSendSuccess", (data) => {
        console.log("igCommentSendSuccess received", data);
        if (platform === "all-platforms" || platform === "instagram") {
          updatePostComment(data, "Instagram");
          updateConversation(data, "Instagram");
        }
      });

      socket.on("igMessageSendError", (e) =>
        console.error("igMessageSendError", e)
      );
      socket.on("igBroadcastOutgoingMessage", (data) => {
        console.log("igBroadcastOutgoingMessage received", data);
        if (platform === "all-platforms" || platform === "instagram")
          updateConversation(data, "Instagram");
      });

      socket.on("igMessageSendSuccess", (data) => {
        console.log("igMessageSendSuccess received", data);
        if (platform === "all-platforms" || platform === "instagram")
          updateConversation(data, "Instagram");
      });

      // Facebook Events
      socket.on("fbInitialData", (data) => {
        console.log("fbInitialData received", data);
        if (platform === "all-platforms" || platform === "facebook") {
          const processedConversations = data.data.flatMap((item: any) =>
            item.conversations.map((conv: any) => ({
              ...conv,
              CHANNEL: "Facebook",
              userId: conv.userId,
              messages: conv.messages.map((msg: any) => ({
                ...msg,
                CHANNEL: "Facebook",
                messageId: msg.messageId,
                message: {
                  text: msg.message.text,
                  type: msg.message.type,
                  senderType: msg.senderType,
                },
                timestamp: msg.timestamp,
                status: msg.status,
              })),
              username: conv.username,
              messageCount: conv.messageCount,
            }))
          );

          const processedPosts = data.data.flatMap((item: any) =>
            item.posts.map((post: any) => ({
              ...post,
              CHANNEL: "Facebook",
              postId:
                post._id || `post_${Math.random().toString(36).substr(2, 9)}`,
            }))
          );

          setConversations((prev) => [
            ...prev.filter((c) => c.CHANNEL !== "Facebook"),
            ...processedConversations,
          ]);
          setPosts((prev) => [
            ...prev.filter((p) => p.CHANNEL !== "Facebook"),
            ...processedPosts,
          ]);
        }
      });

      socket.on("fbManualAdminMessage", (data) => {
        console.log("fbManualAdminMessage received", data);
        if (platform === "all-platforms" || platform === "facebook")
          updateConversation(data, "Facebook");
      });

      socket.on("fbBotReplyComment", (data) => {
        console.log("fbBotReplyComment received", data);
        if (platform === "all-platforms" || platform === "facebook") {
          updatePostComment(data, "Facebook");
          updateConversation(data, "Facebook");
        }
      });

      socket.on("fbNewPost", (data) => {
        console.log("fbNewPost received", data);
        if (platform === "all-platforms" || platform === "facebook")
          setPosts((prev) => [{ ...data, CHANNEL: "Facebook" }, ...prev]);
      });

      socket.on("fbIncomingUserComment", (data) => {
        console.log("fbIncomingUserComment received", data);
        if (platform === "all-platforms" || platform === "facebook")
          updatePostComment(data, "Facebook");
      });

      socket.on("fbBotReplyMessage", (data) => {
        console.log("fbBotReplyMessage received", data);
        if (platform === "all-platforms" || platform === "facebook")
          updateConversation(data, "Facebook");
      });

      socket.on("fbIncomingUserMessage", (data) => {
        console.log("fbIncomingUserMessage received", data);
        if (platform === "all-platforms" || platform === "facebook")
          updateConversation(data, "Facebook");
      });

      socket.on("fbMessageSendSuccess", (data) => {
        console.log("fbMessageSendSuccess received", data);
        if (platform === "all-platforms" || platform === "facebook")
          updateConversation(data, "Facebook");
      });

      socket.on("fbBroadcastOutgoingMessage", (data) => {
        console.log("fbBroadcastOutgoingMessage received", data);
        if (platform === "all-platforms" || platform === "facebook")
          updateConversation(data, "Facebook");
      });

      socket.on("fbMessageSendError", (e) =>
        console.error("fbMessageSendError", e)
      );
      socket.on("fbCommentSendError", (e) =>
        console.error("fbCommentSendError", e)
      );
      socket.on("fbBroadcastOutgoingComment", (data) => {
        console.log("fbBroadcastOutgoingComment received", data);
        if (platform === "all-platforms" || platform === "facebook") {
          updatePostComment(data, "Facebook");
          updateConversation(data, "Facebook");
        }
      });

      socket.on("fbCommentSendSuccess", (data) => {
        console.log("fbCommentSendSuccess received", data);
        if (platform === "all-platforms" || platform === "facebook") {
          updatePostComment(data, "Facebook");
          updateConversation(data, "Facebook");
        }
      });

      socket.on("error", (e) => console.error("Socket error", e));
    };

    const updateConversation = (data: any, channel: string) => {
      setConversations((prev) =>
        prev.map((c) =>
          c.messageId === data.messageId && c.CHANNEL === channel
            ? {
                ...c,
                messages: [
                  ...(c.messages || []),
                  { ...data, CHANNEL: channel },
                ],
              }
            : c
        )
      );
    };

    const updatePostComment = (data: any, channel: string) => {
      setPosts((prev) =>
        prev.map((p) =>
          p.postId === data.postId && p.CHANNEL === channel
            ? {
                ...p,
                comments: [
                  ...(p.comments || []),
                  {
                    commentId: data.commentId,
                    username:
                      data.recipientUsername || data.username || "Agent",
                    text: data.message.text,
                    timestamp: data.timestamp,
                    CHANNEL: channel,
                  },
                ],
              }
            : p
        )
      );
      if (
        currentPost &&
        currentPost.postId === data.postId &&
        currentPost.CHANNEL === channel
      ) {
        setCurrentPost((prev: any) => ({
          ...prev,
          comments: [
            ...(prev.comments || []),
            {
              commentId: data.commentId,
              username: data.recipientUsername || data.username || "Agent",
              text: data.message.text,
              timestamp: data.timestamp,
              CHANNEL: channel,
            },
          ],
        }));
      }
    };

    setupListeners();

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    };
  }, [platform, currentPost, orgId]);

  useEffect(() => {
    if (orgId && socketRef.current) {
      if (platform === "all-platforms") {
        socketRef.current.emit("fbFetchInitialData", orgId);
        socketRef.current.emit("igFetchInitialData", orgId);
      } else {
        const event =
          platform === "facebook" ? "fbFetchInitialData" : "igFetchInitialData";
        socketRef.current.emit(event, orgId);
      }
    } else {
      console.warn("Cannot fetch initial data: orgId or socket not ready", {
        orgId,
        socket: socketRef.current,
      });
    }
  }, [orgId, platform]);

  const sendMessage = () => {
    console.log("sendMessage called", {
      inputText,
      selectedConversationId,
      orgId,
    });
    if (!inputText || !selectedConversationId || !orgId) return;

    const conv = conversations.find((c) => c.userId === selectedConversationId);
    if (!conv) {
      console.warn(
        "Conversation not found for userId:",
        selectedConversationId
      );
      return;
    }

    const event =
      conv.CHANNEL === "Facebook"
        ? "fbSendMessageRequest"
        : "igSendMessageRequest";
    socketRef.current!.emit(event, {
      orgId,
      recipientId: conv.recipientId,
      recipientUsername: conv.username,
      recipientName: conv.recipientName || conv.username,
      message: inputText,
    });
    console.log(`Emitted ${event}`, {
      orgId,
      recipientId: conv.recipientId,
      recipientUsername: conv.username,
      recipientName: conv.recipientName || conv.username,
      message: inputText,
    });
    setInputText("");
  };

  const sendComment = () => {
    console.log("sendComment called", { commentText, currentPost, orgId });
    if (!commentText || !currentPost || !orgId) return;

    const event =
      currentPost.CHANNEL === "Facebook"
        ? "fbSendCommentReplyRequest"
        : "igSendCommentReplyRequest";
    socketRef.current!.emit(event, {
      orgId,
      parentId: null,
      text: commentText,
      postId: currentPost.postId,
    });
    console.log(`Emitted ${event}`, {
      orgId,
      parentId: null,
      text: commentText,
      postId: currentPost.postId,
    });
    setCommentText("");
  };

  const likePost = () => {
    console.log("likePost called", {
      currentPost,
      orgId,
      alreadyLiked: likedPosts.has(currentPost.postId),
    });
    if (!currentPost || !orgId || likedPosts.has(currentPost.postId)) return;

    const event =
      currentPost.CHANNEL === "Facebook"
        ? "fbLikePostRequest"
        : "igLikePostRequest";
    socketRef.current!.emit(event, { orgId, postId: currentPost.postId });
    console.log(`Emitted ${event}`, { orgId, postId: currentPost.postId });
    setLikedPosts((prev) => new Set(prev).add(currentPost.postId));
  };

  const handleClick = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const openPostModal = (post: any) => {
    setCurrentPost(post);
    setCarouselIndex(0);
    setCommentText("");
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);
  const handleNext = () =>
    currentPost &&
    setCarouselIndex((i) =>
      Math.min(i + 1, currentPost.carouselMedia.length - 1)
    );
  const handlePrev = () => setCarouselIndex((i) => Math.max(i - 1, 0));

  const displayedItems =
    filterType === "conversations"
      ? conversations.filter(
          (c) =>
            platform === "all-platforms" ||
            c.CHANNEL === platform.charAt(0).toUpperCase() + platform.slice(1)
        )
      : posts
          .filter(
            (p) =>
              platform === "all-platforms" ||
              p.CHANNEL === platform.charAt(0).toUpperCase() + platform.slice(1)
          )
          .flatMap(
            (p) =>
              p.comments?.map((c: any) => ({
                ...c,
                postId: p.postId,
                postCaption: p.caption,
                CHANNEL: p.CHANNEL,
              })) || []
          );

  const selectedConversation = conversations.find(
    (c) => c.userId === selectedConversationId
  );
  const selectedCommentPost =
    filterType === "comments" && currentPost ? currentPost : null;
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

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-semibold mb-1">Engagement</h1>
      <p className="text-gray-600 text-sm mb-6">
        Sentiment across all active channels
      </p>

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

      <div className="mb-6 flex gap-4">
        <FormControl className="w-1/2">
          <InputLabel>Select Platform</InputLabel>
          <Select
            value={platform}
            label="Select Platform"
            onChange={(e) => setPlatform(e.target.value as any)}
          >
            <MenuItem value="all-platforms">All Platforms</MenuItem>
            <MenuItem value="instagram">Instagram</MenuItem>
            <MenuItem value="facebook">Facebook</MenuItem>
          </Select>
        </FormControl>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="flex flex-col space-y-4 col-span-2">
          <h2 className="text-lg font-semibold mb-2">Recent Posts</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {posts.filter(
              (p) =>
                platform === "all-platforms" ||
                p.CHANNEL ===
                  platform.charAt(0).toUpperCase() + platform.slice(1)
            ).length > 0 ? (
              posts
                .filter(
                  (p) =>
                    platform === "all-platforms" ||
                    p.CHANNEL ===
                      platform.charAt(0).toUpperCase() + platform.slice(1)
                )
                .map((post) => (
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
                        {post.CHANNEL === "Instagram" ? (
                          <Instagram fontSize="small" />
                        ) : (
                          <Facebook fontSize="small" />
                        )}
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

      <div className="grid grid-cols-12 gap-4 h-[400px]">
        <div className="col-span-3">
          <FormControl className="w-full">
            <InputLabel>Filter</InputLabel>
            <Select
              value={filterType}
              label="Filter"
              onChange={(e) => setFilterType(e.target.value as any)}
            >
              <MenuItem value="conversations">Conversations</MenuItem>
              <MenuItem value="comments">Comments</MenuItem>
            </Select>
          </FormControl>
          <div className="bg-[#65558F] bg-opacity-[0.08] mt-4 rounded-lg">
            {displayedItems.map((item) => (
              <div
                key={
                  filterType === "conversations" ? item.userId : item.commentId
                }
                className={`p-3 border-b border-gray-100 flex items-center gap-2 cursor-pointer ${
                  (filterType === "conversations" &&
                    selectedConversationId === item.userId) ||
                  (filterType === "comments" &&
                    currentPost &&
                    currentPost.postId === item.postId)
                    ? "bg-gray-200"
                    : ""
                }`}
                onClick={() => {
                  if (filterType === "conversations") {
                    setSelectedConversationId(item.userId);
                    setCurrentPost(null);
                  } else {
                    setSelectedConversationId(null);
                    const post = posts.find((p) => p.postId === item.postId);
                    setCurrentPost(post || null);
                  }
                }}
              >
                <span className="w-8 h-8">
                  {filterType === "conversations" ? (
                    item.CHANNEL === "Instagram" ? (
                      <Instagram />
                    ) : (
                      <Facebook />
                    )
                  ) : (
                    <Comment />
                  )}
                </span>
                <div>
                  {filterType === "conversations" ? (
                    <p className="text-base">{item?.username || "Unknown"}</p>
                  ) : (
                    <p className="text-base">
                      {item.username} commented: {item.text} (
                      {new Date(item.timestamp).toLocaleTimeString()})
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-5">
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
            ) : selectedCommentPost && filterType === "comments" ? (
              <>
                {/* Post Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-md font-semibold">
                      Post by {selectedCommentPost.username || "botwot.io"}
                    </h2>
                  </div>
                </div>

                {/* Post Content (Media and Caption) */}
                <div className="mb-4">
                  <div className="relative mb-2">
                    {currentPost.mediaType === "VIDEO" ? (
                      <video
                        src={currentPost.mediaUrl}
                        controls
                        className="w-full h-52 object-cover rounded-md"
                      />
                    ) : currentPost.mediaType === "IMAGE" ? (
                      <img
                        src={currentPost.mediaUrl}
                        alt="Post not available"
                        className="w-full h-100 object-cover rounded-md"
                      />
                    ) : currentPost.mediaType === "CAROUSEL_ALBUM" &&
                      currentPost.carouselMedia?.length > 0 ? (
                      <Box position="relative" width="100%">
                        <img
                          src={currentPost.carouselMedia[carouselIndex].url}
                          alt={`Carousel item ${carouselIndex + 1}`}
                          className="w-full h-100 object-fit rounded-md"
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
                              mt={2}
                              gap={1}
                            >
                              {currentPost.carouselMedia.map(
                                (_: any, index: number) => (
                                  <Box
                                    key={index}
                                    width={8}
                                    height={8}
                                    borderRadius="50%"
                                    bgcolor={
                                      index === carouselIndex
                                        ? "#65558F"
                                        : "grey.400"
                                    }
                                    sx={{ cursor: "pointer" }}
                                    onClick={() => setCarouselIndex(index)}
                                  />
                                )
                              )}
                            </Box>
                          </>
                        )}
                      </Box>
                    ) : (
                      <div className="w-full h-48 bg-gray-200 rounded-md flex items-center justify-center">
                        <span className="text-gray-500">No media</span>
                      </div>
                    )}
                    <span className="absolute top-2 left-2 bg-white rounded-full p-1">
                      {currentPost.CHANNEL === "Instagram" ? (
                        <Instagram fontSize="small" />
                      ) : (
                        <Facebook fontSize="small" />
                      )}
                    </span>
                  </div>
                  <p className="text-sm mb-2">
                    {currentPost.caption || "No caption available"}
                  </p>
                </div>

                {/* Comments Section */}
                <div className="h-[200px] overflow-y-auto mb-4">
                  <div className="flex flex-col gap-4">
                    {currentPost.comments?.map(
                      (comment: any, index: number) => (
                        <div key={index} className="flex gap-2 mb-4">
                          <div className="w-8 h-8 rounded-full bg-[#2E2F5F] flex items-center justify-center">
                            <Person className="text-white w-6 h-6" />
                          </div>
                          <div className="bg-white p-3 rounded-lg max-w-[70%]">
                            <p className="text-sm">{comment.text}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {new Date(comment.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      )
                    ) || <p>No comments available</p>}
                  </div>
                </div>

                {/* Quick Reply Buttons and Post Engagement */}
                <div className="flex justify-between items-start mt-4 gap-6">
                  <div className="flex flex-col mt-10 gap-2">
                    {[
                      "Nice post!",
                      "Interesting!",
                      "Thanks for sharing",
                      "More details?",
                    ].map((text, index) => (
                      <button
                        key={index}
                        className="px-4 py-1.5 text-sm bg-purple-50 text-[#65558F] border border-purple-100 rounded-full hover:bg-purple-100"
                        onClick={() => {
                          setCommentText(text);
                          sendComment();
                        }}
                      >
                        {text}
                      </button>
                    ))}
                  </div>
                  <div className="p-4 bg-[#65558F] mb-4 bg-opacity-[0.08] text-black rounded-lg w-[250px]">
                    <div className="flex items-center mb-2">
                      <p className="text-red-400 font-bold text-sm">
                        Post Engagement
                      </p>
                    </div>
                    <div className="w-full h-2 bg-gray-500 rounded-full overflow-hidden mb-4">
                      <div className="h-full bg-green-500 w-[40%]" />
                      <div className="h-full bg-yellow-500 w-[30%]" />
                      <div className="h-full bg-red-500 w-[30%]" />
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-black">Likes</span>
                        <span>{currentPost.likeCount || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-black">Comments</span>
                        <span>{currentPost.comments?.length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-black">Shares</span>
                        <span>{currentPost.sharesCount || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comment Input */}
                <div className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg bg-gray-50">
                  <button className="p-1.5 hover:bg-gray-200 rounded-full">
                    <Image className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-1.5 hover:bg-gray-200 rounded-full">
                    <AttachFile className="w-5 h-5 text-gray-600" />
                  </button>
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    className="flex-1 bg-transparent outline-none text-sm"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendComment()}
                  />
                  <button
                    className="p-1.5 hover:bg-gray-200 rounded-full"
                    onClick={sendComment}
                  >
                    <Send className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500 mt-10">
                Select a conversation or post to start
              </div>
            )}
          </div>
        </div>

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

      {currentPost && (
        <Dialog open={isModalOpen} onClose={closeModal} maxWidth="lg" fullWidth>
          <DialogTitle>
            Post by {currentPost.username || "botwot.io"}
          </DialogTitle>
          <DialogContent dividers>
            <div className="grid grid-cols-2 gap-6">
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
                            "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
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
                            "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
                          }}
                        >
                          <ChevronRightIcon />
                        </IconButton>
                        <Box
                          display="flex"
                          justifyContent="center"
                          mt={2}
                          gap={1}
                        >
                          {currentPost.carouselMedia.map(
                            (_: any, index: number) => (
                              <Box
                                key={index}
                                width={8}
                                height={8}
                                borderRadius="50%"
                                bgcolor={
                                  index === carouselIndex
                                    ? "#65558F"
                                    : "grey.400"
                                }
                                sx={{ cursor: "pointer" }}
                                onClick={() => setCarouselIndex(index)}
                              />
                            )
                          )}
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

              <div className="flex flex-col h-full">
                <div className="flex items-center mb-4">
                  {currentPost.CHANNEL === "Instagram" ? (
                    <Instagram
                      fontSize="large"
                      className="text-pink-500 mr-2"
                    />
                  ) : (
                    <Facebook fontSize="large" className="text-blue-600 mr-2" />
                  )}
                  <Typography variant="h6">{currentPost.CHANNEL}</Typography>
                </div>
                <div className="flex items-center justify-around text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <IconButton
                      onClick={likePost}
                      disabled={likedPosts.has(currentPost.postId)}
                      sx={{ padding: 0 }}
                    >
                      {likedPosts.has(currentPost.postId) ? (
                        <Favorite fontSize="small" color="error" />
                      ) : (
                        <FavoriteBorder fontSize="small" />
                      )}
                    </IconButton>
                    <span>{currentPost.likeCount || 0} Likes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Comment fontSize="small" />
                    <span>{currentPost.comments?.length || 0} Comments</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Send fontSize="small" />
                    <span>{currentPost.sharesCount || 0} Shares</span>
                  </div>
                </div>
                <Divider />
                <Typography variant="subtitle1" className="mt-4 mb-2">
                  Add a comment
                </Typography>
                <Box display="flex" alignItems="center" mb={2}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendComment()}
                    size="small"
                  />
                  <Button
                    onClick={sendComment}
                    variant="contained"
                    sx={{
                      ml: 1,
                      backgroundColor: "#65558F",
                      "&:hover": { backgroundColor: "#56497A" },
                    }}
                    disabled={!commentText.trim()}
                  >
                    Post
                  </Button>
                </Box>
                <Typography variant="subtitle1" className="mb-2">
                  Trending comments
                </Typography>
                <div className="overflow-y-auto max-h-[350px]">
                  {currentPost.comments?.map((c: any) => (
                    <div
                      key={c.commentId}
                      className="flex items-start mb-3 p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <Avatar sx={{ width: 24, height: 24 }} className="mr-2">
                        {c.username[0]}
                      </Avatar>
                      <div className="flex-1">
                        <Typography variant="subtitle2">
                          {c.username}
                        </Typography>
                        <Typography variant="body2" className="break-words">
                          {c.text}
                        </Typography>
                        <div className="flex items-center gap-2">
                          <Typography
                            variant="caption"
                            className="text-gray-400"
                          >
                            {new Date(c.timestamp).toLocaleTimeString()}
                          </Typography>
                          <div className="flex items-center gap-1">
                            <FavoriteBorder fontSize="small" />
                            <Typography
                              variant="caption"
                              className="text-gray-600"
                            >
                              {c.likeCount || 0} Likes
                            </Typography>
                          </div>
                        </div>
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
                "&:hover": { backgroundColor: "#56497A" },
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
