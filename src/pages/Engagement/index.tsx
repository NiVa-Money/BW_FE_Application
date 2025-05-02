// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useEffect, useRef, useState, useCallback } from "react";
// import { io, Socket } from "socket.io-client";
// import {
//   Instagram,
//   Facebook,
//   LinkedIn,
//   Twitter,
//   WhatsApp,
//   AttachFile,
//   Send,
//   Image,
//   SmartToy,
//   Person,
//   ChevronRight,
//   Favorite,
//   FavoriteBorder,
//   Comment,
//   ChevronLeft,
//   ChevronRight as ChevronRightIcon,
//   MoreVert,
// } from "@mui/icons-material";
// import {
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   BarChart,
//   Bar,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import {
//   IconButton,
//   Menu,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Divider,
//   Typography,
//   Avatar,
//   Box,
//   TextField,
// } from "@mui/material";
// import { getInstagramData } from "../../api/services/integrationServices";
// import { getFacebookIntegrations } from "../../api/services/integrationServices";

// // Define sender types as constants
// const SenderType = {
//   USER: "USER", // Message sent by the user
//   ADMIN: "ADMIN", // Message sent by an admin
//   AI: "AI", // AI-generated message
//   CUSTOM_MESSAGE: "CUSTOM_MESSAGE",
// };

// const EngagementTab = () => {
//   const [conversations, setConversations] = useState<any[]>([]);
//   const [posts, setPosts] = useState<any[]>([]);
//   const [selectedConversationId, setSelectedConversationId] = useState<
//     string | null
//   >(null);
//   const [platform, setPlatform] = useState<
//     "instagram" | "facebook" | "all-platforms"
//   >("all-platforms");
//   const [inputText, setInputText] = useState("");
//   const [commentText, setCommentText] = useState("");
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [currentPost, setCurrentPost] = useState<any>(null);
//   const [carouselIndex, setCarouselIndex] = useState(0);
//   const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
//   const [filterType, setFilterType] = useState<"conversations" | "comments">(
//     "conversations"
//   );
//   const [error, setError] = useState<string | null>(null);
//   const [integrationId, setIntegrationId] = useState<string | null>(null); // Instagram integrationId
//   const [facebookIntegrationId, setFacebookIntegrationId] = useState<
//     string | null
//   >(null); // Facebook-specific integrationId
//   const [integrationFetchError, setIntegrationFetchError] = useState<
//     string | null
//   >(null);
//   const open = Boolean(anchorEl);
//   const socketRef = useRef<Socket | null>(null);
//   const orgId = localStorage.getItem("orgId");

//   // Fetch platform-specific integrationIds
//   useEffect(() => {
//     const fetchIntegrations = async () => {
//       try {
//         // Fetch Instagram integration
//         const igResponse = await getInstagramData();
//         const igIntegrations = Array.isArray(igResponse?.data)
//           ? igResponse.data
//           : [];
//         console.log("Instagram Integrations:", igIntegrations);
//         if (igIntegrations.length > 0) {
//           setIntegrationId(igIntegrations[0]._id);
//         } else {
//           setIntegrationId(null);
//         }

//         // Fetch Facebook integration
//         const fbResponse = await getFacebookIntegrations();
//         const fbIntegrations = Array.isArray(fbResponse?.data)
//           ? fbResponse.data
//           : [];
//         console.log("Facebook Integrations:", fbIntegrations);
//         if (fbIntegrations.length > 0) {
//           setFacebookIntegrationId(fbIntegrations[0]._id);
//         }
//         setIntegrationFetchError(null);
//       } catch (error) {
//         console.error("Error fetching integrations:", error);
//         setIntegrationFetchError(
//           "Failed to fetch integrations. Please try again later."
//         );
//         setIntegrationId(null);
//         setFacebookIntegrationId(null);
//       }
//     };

//     fetchIntegrations();
//   }, []);

//   const updateConversation = useCallback((data: any, channel: string) => {
//     setConversations((prev) => {
//       const existingConv = prev.find(
//         (c) => c.userId === data.userId && c.CHANNEL === channel
//       );
//       if (existingConv) {
//         return prev.map((c) =>
//           c.userId === data.userId && c.CHANNEL === channel
//             ? {
//                 ...c,
//                 messages: [
//                   ...(c.messages || []),
//                   {
//                     ...data,
//                     CHANNEL: channel,
//                     timestamp: data.timestamp || new Date().toISOString(),
//                   },
//                 ],
//                 messageCount: (c.messageCount || 0) + 1,
//               }
//             : c
//         );
//       } else {
//         return [
//           ...prev,
//           {
//             userId: data.userId,
//             username: data.recipientUsername || data.username || "Unknown",
//             CHANNEL: channel,
//             messages: [
//               {
//                 ...data,
//                 CHANNEL: channel,
//                 timestamp: data.timestamp || new Date().toISOString(),
//               },
//             ],
//             messageCount: 1,
//           },
//         ];
//       }
//     });
//   }, []);

//   const updatePostComment = useCallback(
//     (data: any, channel: string) => {
//       const newComment = {
//         commentId: data.commentId,
//         username: data.recipientUsername || data.username || "Agent",
//         text: data.message?.text || data.text || "",
//         timestamp: data.timestamp || new Date().toISOString(),
//         CHANNEL: channel,
//         likeCount: data.likeCount || 0,
//       };

//       setPosts((prev) =>
//         prev.map((p) =>
//           p.postId === data.postId && p.CHANNEL === channel
//             ? {
//                 ...p,
//                 comments: [...(p.comments || []), newComment],
//               }
//             : p
//         )
//       );

//       if (
//         currentPost &&
//         currentPost.postId === data.postId &&
//         currentPost.CHANNEL === channel
//       ) {
//         setCurrentPost((prev: any) => ({
//           ...prev,
//           comments: [...(prev.comments || []), newComment],
//         }));
//       }
//     },
//     [currentPost]
//   );

//   useEffect(() => {
//     if (!orgId) {
//       setError("No organization ID found. Please log in again.");
//       return;
//     }

//     const socket = io(`${import.meta.env.VITE_FIREBASE_BASE_URL}/engagement`, {
//       reconnection: true,
//       reconnectionAttempts: Infinity,
//       reconnectionDelay: 1000,
//       transports: ["websocket"],
//       query: { orgId },
//     });
//     socketRef.current = socket;

//     const setupListeners = () => {
//       socket.on("connect", () => {
//         console.log("Socket connected", socket.id);
//         fetchInitialData();
//       });

//       socket.on("connect_error", (err) => {
//         console.error("Socket connection error", err);
//         setError("Failed to connect to server. Retrying...");
//       });

//       socket.on("reconnect_attempt", () => {
//         console.log("Socket reconnecting...");
//       });

//       socket.on("disconnect", (reason) => {
//         console.warn("Socket disconnected", reason);
//         setError("Disconnected from server. Reconnecting...");
//       });

//       // Instagram Events
//       socket.on("igInitialData", (data) => {
//         if (platform === "all-platforms" || platform === "instagram") {
//           const processedConversations = data.data.flatMap((item: any) =>
//             item.conversations.map((conv: any) => ({
//               ...conv,
//               CHANNEL: "Instagram",
//               userId: conv.userId,
//               username: conv.username || conv.name || "Unknown",
//               messages: conv.messages.map((msg: any) => ({
//                 ...msg,
//                 CHANNEL: "Instagram",
//                 messageId: msg.messageId,
//                 message: {
//                   text: msg.message?.text || "",
//                   type: msg.message?.type || "TEXT",
//                   senderType: msg.senderType || SenderType.USER,
//                 },
//                 timestamp: msg.timestamp,
//                 status: msg.status,
//               })),
//               messageCount: conv.messageCount,
//             }))
//           );

//           const processedPosts = data.data.flatMap((item: any) =>
//             item.posts.map((post: any) => ({
//               ...post,
//               CHANNEL: "Instagram",
//               postId:
//                 post.postId ||
//                 post._id ||
//                 `post_${Math.random().toString(36).substr(2, 9)}`,
//               caption: post.caption || "",
//               mediaType: post.mediaType,
//               likeCount: post.likeCount || 0,
//               timestamp: post.timestamp,
//               createdAt: post.createdAt,
//               updatedAt: post.updatedAt,
//               carouselMedia: post.carouselMedia || [],
//               comments: (post.comments || []).map((comment: any) => ({
//                 ...comment,
//                 text: comment.text || "",
//                 username: comment.username || "Unknown",
//                 timestamp: comment.timestamp || new Date().toISOString(),
//                 likeCount: comment.likeCount || 0,
//               })),
//               mediaUrl:
//                 post.mediaUrl ||
//                 (post.carouselMedia?.length ? post.carouselMedia[0].url : ""),
//             }))
//           );

//           console.log("Processed conversations:", processedConversations);
//           console.log("Processed posts:", processedPosts);

//           setConversations((prev) => [
//             ...prev.filter((c) => c.CHANNEL !== "Instagram"),
//             ...processedConversations,
//           ]);
//           setPosts((prev) => [
//             ...prev.filter((p) => p.CHANNEL !== "Instagram"),
//             ...processedPosts,
//           ]);
//         }
//       });

//       socket.on("igManualAdminMessage", (data) => {
//         if (platform === "all-platforms" || platform === "instagram") {
//           updateConversation(data, "Instagram");
//         }
//       });

//       socket.on("igManualAdminComment", (data) => {
//         if (platform === "all-platforms" || platform === "instagram") {
//           updatePostComment(data, "Instagram");
//         }
//       });

//       socket.on("igBotReplyComment", (data) => {
//         if (platform === "all-platforms" || platform === "instagram") {
//           updatePostComment(data, "Instagram");
//           updateConversation(data, "Instagram");
//         }
//       });

//       socket.on("igNewPost", (data) => {
//         if (platform === "all-platforms" || platform === "instagram") {
//           setPosts((prev) => [
//             { ...data, CHANNEL: "Instagram" },
//             ...prev.filter((p) => p.postId !== data.postId),
//           ]);
//         }
//       });

//       socket.on("igIncomingUserComment", (data) => {
//         if (platform === "all-platforms" || platform === "instagram") {
//           updatePostComment(data, "Instagram");
//         }
//       });

//       socket.on("igBotReplyMessage", (data) => {
//         if (platform === "all-platforms" || platform === "instagram") {
//           updateConversation(data, "Instagram");
//         }
//       });

//       socket.on("igIncomingUserMessage", (data) => {
//         if (platform === "all-platforms" || platform === "instagram") {
//           updateConversation(data, "Instagram");
//         }
//       });

//       socket.on("igCommentSendError", (e) => {
//         console.error("igCommentSendError", e);
//         setError("Failed to send comment. Please try again.");
//       });

//       socket.on("igBroadcastOutgoingComment", (data) => {
//         if (platform === "all-platforms" || platform === "instagram") {
//           updatePostComment(data, "Instagram");
//           updateConversation(data, "Instagram");
//         }
//       });

//       socket.on("igCommentSendSuccess", (data) => {
//         if (platform === "all-platforms" || platform === "instagram") {
//           updatePostComment(data, "Instagram");
//           updateConversation(data, "Instagram");
//           setError(null);
//         }
//       });

//       socket.on("igMessageSendError", (e) => {
//         console.error("igMessageSendError", e);
//         setError("Failed to send message. Please try again.");
//       });

//       socket.on("igBroadcastOutgoingMessage", (data) => {
//         if (platform === "all-platforms" || platform === "instagram") {
//           updateConversation(data, "Instagram");
//         }
//       });

//       socket.on("igMessageSendSuccess", (data) => {
//         if (platform === "all-platforms" || platform === "instagram") {
//           updateConversation(data, "Instagram");
//           setError(null);
//         }
//       });

//       socket.on("igLikePostSuccess", (data) => {
//         if (platform === "all-platforms" || platform === "instagram") {
//           setPosts((prev) =>
//             prev.map((p) =>
//               p.postId === data.postId && p.CHANNEL === "Instagram"
//                 ? { ...p, likeCount: (p.likeCount || 0) + 1 }
//                 : p
//             )
//           );
//           if (currentPost?.postId === data.postId) {
//             setCurrentPost((prev: any) => ({
//               ...prev,
//               likeCount: (prev.likeCount || 0) + 1,
//             }));
//           }
//           setError(null);
//         }
//       });

//       socket.on("igLikePostError", (e) => {
//         console.error("igLikePostError", e);
//         setError("Failed to like post. Please try again.");
//         setLikedPosts((prev) => {
//           const newSet = new Set(prev);
//           newSet.delete(e.postId);
//           return newSet;
//         });
//       });

//       // Facebook Events
//       socket.on("fbInitialData", (data) => {
//         if (platform === "all-platforms" || platform === "facebook") {
//           const processedConversations = data.data.flatMap((item: any) =>
//             item.conversations.map((conv: any) => ({
//               ...conv,
//               CHANNEL: "Facebook",
//               userId: conv.userId,
//               username: conv.username || "Unknown",
//               messages: conv.messages.map((msg: any) => ({
//                 ...msg,
//                 CHANNEL: "Facebook",
//                 messageId: msg.messageId,
//                 message: {
//                   text: msg.message?.text || "",
//                   type: msg.message?.type || "TEXT",
//                   senderType: msg.senderType || SenderType.USER,
//                 },
//                 timestamp: msg.timestamp,
//                 status: msg.status,
//               })),
//               messageCount: conv.messageCount,
//             }))
//           );

//           const processedPosts = data.data.flatMap((item: any) =>
//             item.posts.map((post: any) => ({
//               ...post,
//               CHANNEL: "Facebook",
//               postId:
//                 post._id || `post_${Math.random().toString(36).substr(2, 9)}`,
//               caption: post.caption || "",
//               mediaType: post.mediaType,
//               likeCount: post.likeCount || 0,
//               timestamp: post.timestamp,
//               createdAt: post.createdAt,
//               updatedAt: post.updatedAt,
//               carouselMedia: post.carouselMedia || [],
//               comments: (post.comments || []).map((comment: any) => ({
//                 ...comment,
//                 text: comment.text || "",
//                 username: comment.username || "Unknown",
//                 timestamp: comment.timestamp || new Date().toISOString(),
//                 likeCount: comment.likeCount || 0,
//               })),
//               mediaUrl:
//                 post.mediaUrl ||
//                 (post.carouselMedia?.length ? post.carouselMedia[0].url : ""),
//             }))
//           );

//           setConversations((prev) => [
//             ...prev.filter((c) => c.CHANNEL !== "Facebook"),
//             ...processedConversations,
//           ]);
//           setPosts((prev) => [
//             ...prev.filter((p) => p.CHANNEL !== "Facebook"),
//             ...processedPosts,
//           ]);
//         }
//       });

//       socket.on("fbManualAdminMessage", (data) => {
//         if (platform === "all-platforms" || platform === "facebook") {
//           updateConversation(data, "Facebook");
//         }
//       });

//       socket.on("fbBotReplyComment", (data) => {
//         if (platform === "all-platforms" || platform === "facebook") {
//           updatePostComment(data, "Facebook");
//           updateConversation(data, "Facebook");
//         }
//       });

//       socket.on("fbNewPost", (data) => {
//         if (platform === "all-platforms" || platform === "facebook") {
//           setPosts((prev) => [
//             { ...data, CHANNEL: "Facebook" },
//             ...prev.filter((p) => p.postId !== data.postId),
//           ]);
//         }
//       });

//       socket.on("fbIncomingUserComment", (data) => {
//         if (platform === "all-platforms" || platform === "facebook") {
//           updatePostComment(data, "Facebook");
//         }
//       });

//       socket.on("fbBotReplyMessage", (data) => {
//         if (platform === "all-platforms" || platform === "facebook") {
//           updateConversation(data, "Facebook");
//         }
//       });

//       socket.on("fbIncomingUserMessage", (data) => {
//         if (platform === "all-platforms" || platform === "facebook") {
//           updateConversation(data, "Facebook");
//         }
//       });

//       socket.on("fbMessageSendSuccess", (data) => {
//         if (platform === "all-platforms" || platform === "facebook") {
//           updateConversation(data, "Facebook");
//           setError(null);
//         }
//       });

//       socket.on("fbBroadcastOutgoingMessage", (data) => {
//         if (platform === "all-platforms" || platform === "facebook") {
//           updateConversation(data, "Facebook");
//         }
//       });

//       socket.on("fbMessageSendError", (e) => {
//         console.error("fbMessageSendError", e);
//         setError("Failed to send message. Please try again.");
//       });

//       socket.on("fbCommentSendError", (e) => {
//         console.error("fbCommentSendError", e);
//         setError("Failed to send comment. Please try again.");
//       });

//       socket.on("fbBroadcastOutgoingComment", (data) => {
//         if (platform === "all-platforms" || platform === "facebook") {
//           updatePostComment(data, "Facebook");
//           updateConversation(data, "Facebook");
//         }
//       });

//       socket.on("fbCommentSendSuccess", (data) => {
//         if (platform === "all-platforms" || platform === "facebook") {
//           updatePostComment(data, "Facebook");
//           updateConversation(data, "Facebook");
//           setError(null);
//         }
//       });

//       socket.on("fbLikePostSuccess", (data) => {
//         if (platform === "all-platforms" || platform === "facebook") {
//           setPosts((prev) =>
//             prev.map((p) =>
//               p.postId === data.postId && p.CHANNEL === "Facebook"
//                 ? { ...p, likeCount: (p.likeCount || 0) + 1 }
//                 : p
//             )
//           );
//           if (currentPost?.postId === data.postId) {
//             setCurrentPost((prev: any) => ({
//               ...prev,
//               likeCount: (prev.likeCount || 0) + 1,
//             }));
//           }
//           setError(null);
//         }
//       });

//       socket.on("fbLikePostError", (e) => {
//         console.error("fbLikePostError", e);
//         setError("Failed to like post. Please try again.");
//         setLikedPosts((prev) => {
//           const newSet = new Set(prev);
//           newSet.delete(e.postId);
//           return newSet;
//         });
//       });

//       socket.on("error", (e) => {
//         console.error("Socket error", e);
//         setError(`Server error: ${e.message || "Unknown error"}`);
//       });
//     };

//     const fetchInitialData = () => {
//       if (platform === "all-platforms") {
//         socketRef.current!.emit("fbFetchInitialData", orgId);
//         socketRef.current!.emit("igFetchInitialData", orgId);
//       } else {
//         const event =
//           platform === "facebook" ? "fbFetchInitialData" : "igFetchInitialData";
//         socketRef.current!.emit(event, orgId);
//       }
//     };

//     setupListeners();

//     return () => {
//       socket.removeAllListeners();
//       socket.disconnect();
//       socketRef.current = null;
//     };
//   }, [
//     platform,
//     orgId,
//     updateConversation,
//     updatePostComment,
//     currentPost?.postId,
//   ]);

//   const sendMessage = useCallback(() => {
//     // Validate inputs
//     if (!inputText.trim()) {
//       setError("Message cannot be empty.");
//       return;
//     }
//     if (!selectedConversationId) {
//       setError("Please select a conversation.");
//       return;
//     }
//     if (!orgId) {
//       setError("Organization ID is missing. Please log in again.");
//       return;
//     }

//     const conv = conversations.find((c) => c.userId === selectedConversationId);
//     if (!conv || !conv.userId) {
//       setError("Selected conversation is invalid.");
//       return;
//     }

//     const event =
//       conv.CHANNEL === "Facebook"
//         ? "fbSendMessageRequest"
//         : "igSendMessageRequest";
//     const messageId = `msg_${Math.random().toString(36).substr(2, 9)}`;

//     // Prepare payload based on channel
//     let payload: {
//       integrationId: string | null;
//       recipientId: string;
//       recipientUsername: string;
//       recipientName?: string;
//       message: string;
//       orgId: string;
//     };
//     if (conv.CHANNEL === "Facebook") {
//       payload = {
//         integrationId: facebookIntegrationId,
//         recipientUsername: conv.username || "Unknown",
//         recipientId: conv.userId,
//         message: inputText.trim(),
//         orgId: orgId,
//       };
//     } else {
//       // Instagram
//       payload = {
//         integrationId: integrationId,
//         recipientId: conv.userId,
//         recipientUsername: conv.username || "string",
//         recipientName: conv.recipientName || conv.username || "string",
//         message: inputText.trim(),
//         orgId: orgId,
//       };
//     }

//     // Validate required fields
//     if (!payload.integrationId) {
//       setError(
//         `${conv.CHANNEL} integration ID is missing. Please set up an integration.`
//       );
//       return;
//     }
//     if (!payload.recipientId) {
//       setError("Recipient ID is missing.");
//       return;
//     }
//     if (!payload.message) {
//       setError("Message cannot be empty.");
//       return;
//     }
//     if (conv.CHANNEL === "Facebook" && !payload.recipientUsername) {
//       setError("Recipient username is required for Facebook.");
//       return;
//     }
//     if (conv.CHANNEL === "Instagram" && !payload.recipientUsername) {
//       setError("Recipient username is required for Instagram.");
//       return;
//     }
//     if (conv.CHANNEL === "Instagram" && !payload.recipientName) {
//       setError("Recipient name is required for Instagram.");
//       return;
//     }

//     // Log payload for debugging
//     console.log("Sending message payload:", payload);

//     // Emit socket event
//     socketRef.current!.emit(event, payload);

//     // Optimistic UI update
//     setConversations((prev) =>
//       prev.map((c) =>
//         c.userId === selectedConversationId && c.CHANNEL === conv.CHANNEL
//           ? {
//               ...c,
//               messages: [
//                 ...(c.messages || []),
//                 {
//                   messageId,
//                   message: {
//                     text: inputText.trim(),
//                     type: "TEXT",
//                     senderType: SenderType.ADMIN,
//                   },
//                   timestamp: new Date().toISOString(),
//                   status: "SENT",
//                   CHANNEL: conv.CHANNEL,
//                 },
//               ],
//               messageCount: (c.messageCount || 0) + 1,
//             }
//           : c
//       )
//     );

//     setInputText("");
//     setError(null);
//   }, [
//     inputText,
//     selectedConversationId,
//     orgId,
//     conversations,
//     integrationId,
//     facebookIntegrationId,
//   ]);

//   const sendComment = useCallback(() => {
//     if (!commentText.trim() || !currentPost || !orgId) {
//       setError(
//         "Please enter a comment, select a post, and ensure organization ID is set."
//       );
//       return;
//     }

//     const integrationID =
//       currentPost.CHANNEL === "Facebook"
//         ? facebookIntegrationId
//         : integrationId;

//     if (!integrationID) {
//       setError(
//         `${currentPost.CHANNEL} integration ID is missing. Please set up an integration.`
//       );
//       return;
//     }

//     const event =
//       currentPost.CHANNEL === "Facebook"
//         ? "fbSendCommentReplyRequest"
//         : "igSendCommentReplyRequest";
//     const commentId = `comment_${Math.random().toString(36).substr(2, 9)}`;
//     socketRef.current!.emit(event, {
//       integrationID,
//       parentID: null,
//       text: commentText,
//       postID: currentPost.postId,
//       orgID: orgId,
//     });

//     // Optimistic UI update
//     const newComment = {
//       commentId,
//       username: "Agent",
//       text: commentText,
//       timestamp: new Date().toISOString(),
//       CHANNEL: currentPost.CHANNEL,
//       likeCount: 0,
//     };

//     setPosts((prev) =>
//       prev.map((p) =>
//         p.postId === currentPost.postId && p.CHANNEL === currentPost.CHANNEL
//           ? { ...p, comments: [...(p.comments || []), newComment] }
//           : p
//       )
//     );

//     setCurrentPost((prev: any) => ({
//       ...prev,
//       comments: [...(prev.comments || []), newComment],
//     }));

//     setCommentText("");
//     setError(null);
//   }, [commentText, currentPost, orgId, integrationId, facebookIntegrationId]);

//   const likePost = useCallback(() => {
//     if (!currentPost || !orgId || likedPosts.has(currentPost.postId)) {
//       setError("Post already liked or invalid post.");
//       return;
//     }

//     const event =
//       currentPost.CHANNEL === "Facebook"
//         ? "fbLikePostRequest"
//         : "igLikePostRequest";
//     socketRef.current!.emit(event, { orgId, postId: currentPost.postId });

//     // Optimistic UI update
//     setLikedPosts((prev) => new Set(prev).add(currentPost.postId));
//     setPosts((prev) =>
//       prev.map((p) =>
//         p.postId === currentPost.postId && p.CHANNEL === currentPost.CHANNEL
//           ? { ...p, likeCount: (p.likeCount || 0) + 1 }
//           : p
//       )
//     );
//     setCurrentPost((prev: any) => ({
//       ...prev,
//       likeCount: (prev.likeCount || 0) + 1,
//     }));

//     setError(null);
//   }, [currentPost, orgId, likedPosts]);

//   const handleClick = (e: React.MouseEvent<HTMLElement>) =>
//     setAnchorEl(e.currentTarget);
//   const handleClose = () => setAnchorEl(null);
//   const openPostModal = (post: any) => {
//     setCurrentPost(post);
//     setCarouselIndex(0);
//     setCommentText("");
//     setIsModalOpen(true);
//   };
//   const closeModal = () => setIsModalOpen(false);
//   const handleNext = () =>
//     currentPost &&
//     setCarouselIndex((i) =>
//       Math.min(i + 1, currentPost.carouselMedia.length - 1)
//     );
//   const handlePrev = () => setCarouselIndex((i) => Math.max(i - 1, 0));

//   const displayedItems =
//     filterType === "conversations"
//       ? conversations.filter(
//           (c) =>
//             platform === "all-platforms" ||
//             c.CHANNEL === platform.charAt(0).toUpperCase() + platform.slice(1)
//         )
//       : posts
//           .filter(
//             (p) =>
//               platform === "all-platforms" ||
//               p.CHANNEL === platform.charAt(0).toUpperCase() + platform.slice(1)
//           )
//           .flatMap(
//             (p) =>
//               p.comments?.map((c: any) => ({
//                 ...c,
//                 postId: p.postId,
//                 postCaption: p.caption,
//                 CHANNEL: p.CHANNEL,
//               })) || []
//           );

//   const selectedConversation = conversations.find(
//     (c) => c.userId === selectedConversationId
//   );
//   const selectedCommentPost =
//     filterType === "comments" && currentPost ? currentPost : null;
//   const socialPlatforms = [
//     { icon: <Instagram />, sentiment: 60 },
//     { icon: <Facebook />, sentiment: 60 },
//     { icon: <LinkedIn />, sentiment: 60 },
//     { icon: <Twitter />, sentiment: 60 },
//     { icon: <WhatsApp />, sentiment: 60 },
//   ];
//   const chartData = [
//     { month: "Jan", value: 30 },
//     { month: "Feb", value: 45 },
//     { month: "Mar", value: 75 },
//     { month: "Apr", value: 60 },
//     { month: "May", value: 45 },
//     { month: "Jun", value: 65 },
//     { month: "Jul", value: 55 },
//   ];

//   // Determine if the send message button should be disabled
//   const isSendMessageDisabled =
//     !inputText.trim() ||
//     !selectedConversationId ||
//     !orgId ||
//     (selectedConversation?.CHANNEL === "Instagram" && !integrationId) ||
//     (selectedConversation?.CHANNEL === "Facebook" && !facebookIntegrationId);

//   return (
//     <div className="p-6 bg-white min-h-screen">
//       {error && (
//         <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
//           {error}
//         </div>
//       )}
//       {integrationFetchError && (
//         <div className="bg-yellow-100 text-yellow-700 p-4 rounded-lg mb-4">
//           {integrationFetchError}
//         </div>
//       )}
//       <h1 className="text-2xl font-semibold mb-1">Engagement</h1>
//       <p className="text-gray-600 text-sm mb-6">
//         Sentiment across all active channels
//       </p>

//       <div className="grid grid-cols-5 gap-4 mb-8">
//         {socialPlatforms.map((platform, index) => (
//           <div
//             key={index}
//             className="bg-[#65558F] bg-opacity-[0.04] rounded-lg shadow-lg p-4 flex items-center gap-2"
//           >
//             <span className="text-gray-700">{platform.icon}</span>
//             <div className="w-24 h-1 bg-red-100 rounded-full overflow-hidden">
//               <div
//                 className="h-full bg-green-500 rounded-full"
//                 style={{ width: `${platform.sentiment}%` }}
//               />
//             </div>
//             <span className="text-xs text-green-500">
//               {platform.sentiment}% Positive
//             </span>
//           </div>
//         ))}
//       </div>

//       <div className="mb-6 flex gap-4">
//         <FormControl className="w-1/2">
//           <InputLabel>Select Platform</InputLabel>
//           <Select
//             value={platform}
//             label="Select Platform"
//             onChange={(e) => setPlatform(e.target.value as any)}
//           >
//             <MenuItem value="all-platforms">All Platforms</MenuItem>
//             <MenuItem value="instagram">Instagram</MenuItem>
//             <MenuItem value="facebook">Facebook</MenuItem>
//           </Select>
//         </FormControl>
//       </div>

//       <div className="grid grid-cols-4 gap-4 mb-4">
//         <div className="flex flex-col space-y-4 col-span-2">
//           <h2 className="text-lg font-semibold mb-2">Recent Posts</h2>
//           <div className="flex gap-4 overflow-x-auto pb-2">
//             {posts.filter(
//               (p) =>
//                 platform === "all-platforms" ||
//                 p.CHANNEL ===
//                   platform.charAt(0).toUpperCase() + platform.slice(1)
//             ).length > 0 ? (
//               posts
//                 .filter(
//                   (p) =>
//                     platform === "all-platforms" ||
//                     p.CHANNEL ===
//                       platform.charAt(0).toUpperCase() + platform.slice(1)
//                 )
//                 .map((post) => (
//                   <div
//                     key={post?.postId}
//                     className="min-w-[200px] bg-gray-50 rounded-lg shadow p-4 cursor-pointer"
//                     onClick={() => openPostModal(post)}
//                   >
//                     <div className="relative mb-2">
//                       {post.mediaType === "VIDEO" ? (
//                         <video
//                           src={post.mediaUrl}
//                           className="w-full h-32 object-cover rounded-md"
//                           muted
//                           loop
//                         />
//                       ) : post.mediaType === "IMAGE" ? (
//                         <img
//                           src={post.mediaUrl}
//                           alt="Post not available"
//                           className="w-full h-32 object-cover rounded-md"
//                         />
//                       ) : post.mediaType === "CAROUSEL_ALBUM" &&
//                         post.carouselMedia?.length > 0 ? (
//                         <img
//                           src={post.carouselMedia[0].url}
//                           alt="Carousel post"
//                           className="w-full h-32 object-cover rounded-md"
//                         />
//                       ) : (
//                         <div className="w-full h-32 bg-gray-200 rounded-md flex items-center justify-center">
//                           <span className="text-gray-500">No media</span>
//                         </div>
//                       )}
//                       <span className="absolute top-2 left-2 bg-white rounded-full p-1">
//                         {post.CHANNEL === "Instagram" ? (
//                           <Instagram fontSize="small" />
//                         ) : (
//                           <Facebook fontSize="small" />
//                         )}
//                       </span>
//                     </div>
//                     <p className="text-sm mb-2 overflow-hidden overflow-ellipsis line-clamp-3">
//                       {post?.caption || "No caption"}
//                     </p>
//                     <div className="flex justify-between items-center text-xs text-gray-500">
//                       <span>
//                         {new Date(post?.timestamp).toLocaleTimeString()}
//                       </span>
//                       <span>{post.comments?.length || 0} comments</span>
//                     </div>
//                   </div>
//                 ))
//             ) : (
//               <p>No posts available</p>
//             )}
//             <button className="min-w-[220px] flex items-center justify-center bg-purple-100 rounded-lg">
//               View More <ChevronRight className="ml-1" />
//             </button>
//           </div>
//         </div>

//         <div className="bg-gray-50 ml-6 rounded-lg p-4 w-[300px] shadow-md">
//           <h2 className="text-sm font-semibold mb-3">Agent Details</h2>
//           <div className="space-y-2">
//             <div className="flex justify-between">
//               <p className="text-sm text-gray-600">No. of chats</p>
//               <p className="text-sm font-medium">36</p>
//             </div>
//             <div className="flex justify-between">
//               <p className="text-sm text-gray-600">Reviews</p>
//               <p className="text-sm font-medium">4.5</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-gray-50 rounded-lg p-4 w-[300px] shadow-md">
//           <h2 className="text-sm font-semibold mb-3">Customer Details</h2>
//           <div className="space-y-2">
//             <div className="flex justify-between">
//               <p className="text-sm text-gray-600">Issue</p>
//               <p className="text-sm font-medium text-blue-600">Order mix up</p>
//             </div>
//             <div className="flex justify-between">
//               <p className="text-sm text-gray-600">Want</p>
//               <p className="text-sm font-medium">Refund</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-12 gap-4 h-[400px]">
//         <div className="col-span-3 h-[calc(100vh-200px)] flex flex-col">
//           <FormControl className="w-full">
//             <InputLabel>Filter</InputLabel>
//             <Select
//               value={filterType}
//               label="Filter"
//               onChange={(e) => setFilterType(e.target.value as any)}
//             >
//               <MenuItem value="conversations">Conversations</MenuItem>
//               <MenuItem value="comments">Comments</MenuItem>
//             </Select>
//           </FormControl>
//           <div className="bg-[#65558F] bg-opacity-[0.08] mt-4 rounded-lg overflow-y-auto flex-1">
//             {displayedItems.map((item) => (
//               <div
//                 key={
//                   filterType === "conversations" ? item.userId : item.commentId
//                 }
//                 className={`p-3 border-b border-gray-100 flex items-center gap-2 cursor-pointer ${
//                   (filterType === "conversations" &&
//                     selectedConversationId === item.userId) ||
//                   (filterType === "comments" &&
//                     currentPost &&
//                     currentPost.postId === item.postId)
//                     ? "bg-gray-200"
//                     : ""
//                 }`}
//                 onClick={() => {
//                   if (filterType === "conversations") {
//                     setSelectedConversationId(item.userId);
//                     setCurrentPost(null);
//                   } else {
//                     setSelectedConversationId(null);
//                     const post = posts.find((p) => p.postId === item.postId);
//                     setCurrentPost(post || null);
//                   }
//                 }}
//               >
//                 <span className="w-8 h-8">
//                   {filterType === "conversations" ? (
//                     item.CHANNEL === "Instagram" ? (
//                       <Instagram />
//                     ) : (
//                       <Facebook />
//                     )
//                   ) : (
//                     <Comment />
//                   )}
//                 </span>
//                 <div>
//                   {filterType === "conversations" ? (
//                     <p className="text-base">{item?.username || "Unknown"}</p>
//                   ) : (
//                     <p className="text-base">
//                       {item.username || "Unknown"} commented:{" "}
//                       {item.text || "No text"} (
//                       {new Date(item.timestamp).toLocaleTimeString()})
//                     </p>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="col-span-5">
//           <div className="bg-[#65558F] bg-opacity-[0.08] rounded-lg shadow-lg p-4">
//             {selectedConversation ? (
//               <>
//                 <div className="flex justify-between items-start mb-4">
//                   <div>
//                     <h2 className="text-md font-semibold">
//                       {selectedConversation.username || "Unknown"}
//                     </h2>
//                   </div>
//                 </div>

//                 <div className="h-[400px] overflow-y-auto mb-4">
//                   {(selectedConversation.messages || []).map(
//                     (message, index) => (
//                       <div
//                         key={message.messageId || index}
//                         className={
//                           message.senderType === SenderType.USER
//                             ? "flex gap-2 mb-4"
//                             : "flex justify-end mb-4"
//                         }
//                       >
//                         {message.senderType === SenderType.USER && (
//                           <div className="w-8 h-8 rounded-full bg-[#2E2F5F] flex items-center justify-center">
//                             <SmartToy className="text-white w-6 h-6" />
//                           </div>
//                         )}
//                         <div
//                           className={
//                             message.senderType === SenderType.USER
//                               ? "bg-white p-3 rounded-lg max-w-[70%]"
//                               : "bg-[#2E2F5F] text-white p-3 rounded-lg max-w-[70%]"
//                           }
//                         >
//                           <p className="text-sm">
//                             {message.message.text || "No text"}
//                           </p>
//                           <p className="text-xs opacity-70 mt-1">
//                             {new Date(message.timestamp).toLocaleTimeString()}
//                           </p>
//                         </div>
//                         {(message.senderType === SenderType.ADMIN ||
//                           message.senderType === SenderType.AI ||
//                           message.senderType === SenderType.CUSTOM_MESSAGE) && (
//                           <div className="w-8 h-8 rounded-full bg-[#2E2F5F] ml-4 flex items-center justify-center">
//                             <Person className="text-white w-6 h-6" />
//                           </div>
//                         )}
//                       </div>
//                     )
//                   )}
//                 </div>

//                 <div className="flex justify-between items-start mt-24 gap-6">
//                   <div className="flex flex-col mt-10 gap-2">
//                     {["Okay", "Fine", "That works.", "Tell me more."].map(
//                       (text, index) => (
//                         <button
//                           key={index}
//                           className="px-4 py-1.5 text-sm bg-purple-50 text-[#65558F] border border-purple-100 rounded-full hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed"
//                           onClick={() => {
//                             setInputText(text);
//                             sendMessage();
//                           }}
//                           disabled={isSendMessageDisabled}
//                         >
//                           {text}
//                         </button>
//                       )
//                     )}
//                   </div>
//                   <div className="p-4 bg-[#65558F] mb-4 bg-opacity-[0.08] text-black rounded-lg w-[250px]">
//                     <div className="flex items-center mb-2">
//                       <p className="text-red-400 font-bold text-sm">
//                         20% (CSAT)
//                       </p>
//                     </div>
//                     <div className="w-full h-2 bg-gray-500 rounded-full overflow-hidden mb-4">
//                       <div className="h-full bg-green-500 w-[20%]" />
//                       <div className="h-full bg-yellow-500 w-[40%]" />
//                       <div className="h-full bg-red-500 w-[40%]" />
//                     </div>
//                     <div className="space-y-2 text-sm">
//                       <div className="flex justify-between">
//                         <span className="text-black">Chat Cue</span>
//                         <span>Customer is anxious</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-black">Reason</span>
//                         <span>Order mix up</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-black">Next Step</span>
//                         <span>Confirm order details</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-black">Predictive AI</span>
//                         <span>High resolution</span>
//                       </div>
//                     </div>
//                     <hr className="my-2 border-gray-400" />
//                     <div className="space-y-2 text-sm">
//                       <div className="flex justify-between">
//                         <span className="text-black">Emotion</span>
//                         <span>Neutral</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-black">Intent</span>
//                         <span>Inquiry</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-black">Sentiment</span>
//                         <span>Positive</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg bg-gray-50">
//                   <button className="p-1.5 hover:bg-gray-200 rounded-full">
//                     <Image className="w-5 h-5 text-gray-600" />
//                   </button>
//                   <button className="p-1.5 hover:bg-gray-200 rounded-full">
//                     <AttachFile className="w-5 h-5 text-gray-600" />
//                   </button>
//                   <input
//                     type="text"
//                     placeholder="Message"
//                     className="flex-1 bg-transparent outline-none text-sm"
//                     value={inputText}
//                     onChange={(e) => setInputText(e.target.value)}
//                     onKeyPress={(e) => e.key === "Enter" && sendMessage()}
//                     disabled={integrationFetchError !== null}
//                   />
//                   <button
//                     className="p-1.5 hover:bg-gray-200 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
//                     onClick={sendMessage}
//                     disabled={isSendMessageDisabled}
//                   >
//                     <Send className="w-5 h-5 text-gray-600" />
//                   </button>
//                 </div>
//               </>
//             ) : selectedCommentPost && filterType === "comments" ? (
//               <>
//                 <div className="flex justify-between items-start mb-4">
//                   <div>
//                     <h2 className="text-md font-semibold">
//                       Post by {selectedCommentPost.username || "botwot.io"}
//                     </h2>
//                   </div>
//                 </div>

//                 <div className="mb-4">
//                   <div className="relative mb-2">
//                     {currentPost.mediaType === "VIDEO" ? (
//                       <video
//                         src={currentPost.mediaUrl}
//                         controls
//                         className="w-full h-52 object-cover rounded-md"
//                       />
//                     ) : currentPost.mediaType === "IMAGE" ? (
//                       <img
//                         src={currentPost.mediaUrl}
//                         alt="Post not available"
//                         className="w-full h-100 object-cover rounded-md"
//                       />
//                     ) : currentPost.mediaType === "CAROUSEL_ALBUM" &&
//                       currentPost.carouselMedia?.length > 0 ? (
//                       <Box position="relative" width="100%">
//                         <img
//                           src={currentPost.carouselMedia[carouselIndex].url}
//                           alt={`Carousel item ${carouselIndex + 1}`}
//                           className="w-full h-100 object-fit rounded-md"
//                         />
//                         {currentPost.carouselMedia.length > 1 && (
//                           <>
//                             <IconButton
//                               onClick={handlePrev}
//                               disabled={carouselIndex === 0}
//                               sx={{
//                                 position: "absolute",
//                                 left: 10,
//                                 top: "50%",
//                                 transform: "translateY(-50%)",
//                                 backgroundColor: "rgba(0,0,0,0.5)",
//                                 color: "white",
//                                 "&:hover": {
//                                   backgroundColor: "rgba(0,0,0,0.7)",
//                                 },
//                               }}
//                             >
//                               <ChevronLeft />
//                             </IconButton>
//                             <IconButton
//                               onClick={handleNext}
//                               disabled={
//                                 carouselIndex ===
//                                 currentPost.carouselMedia.length - 1
//                               }
//                               sx={{
//                                 position: "absolute",
//                                 right: 10,
//                                 top: "50%",
//                                 transform: "translateY(-50%)",
//                                 backgroundColor: "rgba(0,0,0,0.5)",
//                                 color: "white",
//                                 "&:hover": {
//                                   backgroundColor: "rgba(0,0,0,0.7)",
//                                 },
//                               }}
//                             >
//                               <ChevronRightIcon />
//                             </IconButton>
//                             <Box
//                               display="flex"
//                               justifyContent="center"
//                               mt={2}
//                               gap={1}
//                             >
//                               {currentPost.carouselMedia.map(
//                                 (_: any, index: number) => (
//                                   <Box
//                                     key={index}
//                                     width={8}
//                                     height={8}
//                                     borderRadius="50%"
//                                     bgcolor={
//                                       index === carouselIndex
//                                         ? "#65558F"
//                                         : "grey.400"
//                                     }
//                                     sx={{ cursor: "pointer" }}
//                                     onClick={() => setCarouselIndex(index)}
//                                   />
//                                 )
//                               )}
//                             </Box>
//                           </>
//                         )}
//                       </Box>
//                     ) : (
//                       <div className="w-full h-48 bg-gray-200 rounded-md flex items-center justify-center">
//                         <span className="text-gray-500">No media</span>
//                       </div>
//                     )}
//                     <span className="absolute top-2 left-2 bg-white rounded-full p-1">
//                       {currentPost.CHANNEL === "Instagram" ? (
//                         <Instagram fontSize="small" />
//                       ) : (
//                         <Facebook fontSize="small" />
//                       )}
//                     </span>
//                   </div>
//                   <p className="text-sm mb-2">
//                     {currentPost.caption || "No caption available"}
//                   </p>
//                   <div className="flex items-center justify-around text-sm text-gray-600 mb-4">
//                     <div className="flex items-center gap-1">
//                       <IconButton
//                         onClick={likePost}
//                         disabled={likedPosts.has(currentPost.postId)}
//                         sx={{ padding: 0 }}
//                       >
//                         {likedPosts.has(currentPost.postId) ? (
//                           <Favorite fontSize="small" color="error" />
//                         ) : (
//                           <FavoriteBorder fontSize="small" />
//                         )}
//                       </IconButton>
//                       <span>{currentPost.likeCount || 0} Likes</span>
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <Comment fontSize="small" />
//                       <span>{currentPost.comments?.length || 0} Comments</span>
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <Send fontSize="small" />
//                       <span>{currentPost.sharesCount || 0} Shares</span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="h-[200px] overflow-y-auto mb-4">
//                   <div className="flex flex-col gap-4">
//                     {currentPost.comments?.map(
//                       (comment: any, index: number) => (
//                         <div
//                           key={comment.commentId || index}
//                           className="flex gap-2 mb-4"
//                         >
//                           <div className="w-8 h-8 rounded-full bg-[#2E2F5F] flex items-center justify-center">
//                             <Person className="text-white w-6 h-6" />
//                           </div>
//                           <div className="bg-white p-3 rounded-lg max-w-[70%]">
//                             <p className="text-sm">
//                               {comment.text || "No text"}
//                             </p>
//                             <p className="text-xs opacity-70 mt-1">
//                               {new Date(comment.timestamp).toLocaleTimeString()}
//                             </p>
//                           </div>
//                         </div>
//                       )
//                     ) || <p>No comments available</p>}
//                   </div>
//                 </div>

//                 <div className="flex justify-between items-start mt-4 gap-6">
//                   <div className="flex flex-col mt-10 gap-2">
//                     {[
//                       "Nice post!",
//                       "Interesting!",
//                       "Thanks for sharing",
//                       "More details?",
//                     ].map((text, index) => (
//                       <button
//                         key={index}
//                         className="px-4 py-1.5 text-sm bg-purple-50 text-[#65558F] border border-purple-100 rounded-full hover:bg-purple-100"
//                         onClick={() => {
//                           setCommentText(text);
//                           sendComment();
//                         }}
//                       >
//                         {text}
//                       </button>
//                     ))}
//                   </div>
//                   <div className="p-4 bg-[#65558F] mb-4 bg-opacity-[0.08] text-black rounded-lg w-[250px]">
//                     <div className="flex items-center mb-2">
//                       <p className="text-red-400 font-bold text-sm">
//                         Post Engagement
//                       </p>
//                     </div>
//                     <div className="w-full h-2 bg-gray-500 rounded-full overflow-hidden mb-4">
//                       <div className="h-full bg-green-500 w-[40%]" />
//                       <div className="h-full bg-yellow-500 w-[30%]" />
//                       <div className="h-full bg-red-500 w-[30%]" />
//                     </div>
//                     <div className="space-y-2 text-sm">
//                       <div className="flex justify-between">
//                         <span className="text-black">Likes</span>
//                         <span>{currentPost.likeCount || 0}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-black">Comments</span>
//                         <span>{currentPost.comments?.length || 0}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-black">Shares</span>
//                         <span>{currentPost.sharesCount || 0}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg bg-gray-50">
//                   <button className="p-1.5 hover:bg-gray-200 rounded-full">
//                     <Image className="w-5 h-5 text-gray-600" />
//                   </button>
//                   <button className="p-1.5 hover:bg-gray-200 rounded-full">
//                     <AttachFile className="w-5 h-5 text-gray-600" />
//                   </button>
//                   <input
//                     type="text"
//                     placeholder="Write a comment..."
//                     className="flex-1 bg-transparent outline-none text-sm"
//                     value={commentText}
//                     onChange={(e) => setCommentText(e.target.value)}
//                     onKeyPress={(e) => e.key === "Enter" && sendComment()}
//                   />
//                   <button
//                     className="p-1.5 hover:bg-gray-200 rounded-full"
//                     onClick={sendComment}
//                   >
//                     <Send className="w-5 h-5 text-gray-600" />
//                   </button>
//                 </div>
//               </>
//             ) : (
//               <div className="text-center text-gray-500 mt-10">
//                 Select a conversation or post to start
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="col-span-4 space-y-4">
//           <div className="bg-[#65558F] bg-opacity-[0.08] rounded-lg p-4">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-sm font-semibold">
//                 Platforms Health Details
//               </h2>
//               <div className="flex gap-2">
//                 <button className="px-4 py-1.5 text-sm border border-purple-100 text-[#65558F] rounded-lg hover:bg-purple-50">
//                   Date Range
//                 </button>
//                 <button className="px-4 py-1.5 text-sm bg-[#65558F] text-white rounded-lg">
//                   Platform
//                 </button>
//                 <IconButton onClick={handleClick}>
//                   <MoreVert />
//                 </IconButton>
//                 <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
//                   <MenuItem onClick={handleClose}>Engagement Graph</MenuItem>
//                   <MenuItem onClick={handleClose}>Sentiment Graph</MenuItem>
//                   <MenuItem onClick={handleClose}>Interaction Graph</MenuItem>
//                   <MenuItem onClick={handleClose}>Chats Graph</MenuItem>
//                 </Menu>
//               </div>
//             </div>
//             <div className="h-[300px]">
//               <ResponsiveContainer>
//                 <BarChart data={chartData}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
//                   <XAxis dataKey="month" />
//                   <YAxis />
//                   <Tooltip />
//                   <Bar
//                     dataKey="value"
//                     fill="#673ab7"
//                     barSize={40}
//                     radius={[4, 4, 0, 0]}
//                   />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           <div className="bg-[#65558F] bg-opacity-[0.08] rounded-lg p-4">
//             <h2 className="text-sm font-semibold mb-3">
//               AI Recommendation and Actions
//             </h2>
//             <div className="space-y-2">
//               <div className="flex justify-between">
//                 <p className="text-sm">Action</p>
//                 <p className="text-sm">Sell the product</p>
//               </div>
//               <div className="flex justify-between">
//                 <p className="text-sm">AI Recommendation</p>
//                 <p className="text-sm">Sell the product</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-[#65558F] bg-opacity-[0.08] rounded-lg p-4">
//             <h2 className="text-sm font-semibold mb-3">Summary</h2>
//             <div className="space-y-2">
//               {[
//                 { label: "Potential Risk", value: "Low" },
//                 { label: "Sales Opportunity", value: "High" },
//                 {
//                   label: "Upcoming Trends",
//                   value: "AI-driven automation is gaining traction",
//                 },
//                 { label: "Resolution Likelihood", value: "High" },
//                 { label: "Retention Probability", value: "95%" },
//               ].map((item, index) => (
//                 <div key={index} className="flex justify-between">
//                   <p className="text-sm">{item.label}</p>
//                   <p className="text-sm">{item.value}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {currentPost && (
//         <Dialog open={isModalOpen} onClose={closeModal} maxWidth="lg" fullWidth>
//           <DialogTitle>
//             Post by {currentPost.username || "botwot.io"}
//           </DialogTitle>
//           <DialogContent dividers>
//             <div className="grid grid-cols-2 gap-6">
//               <div className="flex items-center justify-center relative">
//                 {currentPost.mediaType === "VIDEO" ? (
//                   <video
//                     src={currentPost.mediaUrl}
//                     controls
//                     className="w-full h-auto max-h-[500px] rounded-lg shadow-md"
//                   />
//                 ) : currentPost.mediaType === "IMAGE" ? (
//                   <img
//                     src={currentPost.mediaUrl}
//                     alt="Post detail"
//                     className="w-full h-auto max-h-[500px] object-contain rounded-lg shadow-md"
//                   />
//                 ) : currentPost.mediaType === "CAROUSEL_ALBUM" &&
//                   currentPost.carouselMedia?.length > 0 ? (
//                   <Box position="relative" width="100%">
//                     <img
//                       src={currentPost.carouselMedia[carouselIndex].url}
//                       alt={`Carousel item ${carouselIndex + 1}`}
//                       className="w-full h-auto max-h-[500px] object-contain rounded-lg shadow-md"
//                     />
//                     {currentPost.carouselMedia.length > 1 && (
//                       <>
//                         <IconButton
//                           onClick={handlePrev}
//                           disabled={carouselIndex === 0}
//                           sx={{
//                             position: "absolute",
//                             left: 10,
//                             top: "50%",
//                             transform: "translateY(-50%)",
//                             backgroundColor: "rgba(0,0,0,0.5)",
//                             color: "white",
//                             "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
//                           }}
//                         >
//                           <ChevronLeft />
//                         </IconButton>
//                         <IconButton
//                           onClick={handleNext}
//                           disabled={
//                             carouselIndex ===
//                             currentPost.carouselMedia.length - 1
//                           }
//                           sx={{
//                             position: "absolute",
//                             right: 10,
//                             top: "50%",
//                             transform: "translateY(-50%)",
//                             backgroundColor: "rgba(0,0,0,0.5)",
//                             color: "white",
//                             "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
//                           }}
//                         >
//                           <ChevronRightIcon />
//                         </IconButton>
//                         <Box
//                           display="flex"
//                           justifyContent="center"
//                           mt={2}
//                           gap={1}
//                         >
//                           {currentPost.carouselMedia.map(
//                             (_: any, index: number) => (
//                               <Box
//                                 key={index}
//                                 width={8}
//                                 height={8}
//                                 borderRadius="50%"
//                                 bgcolor={
//                                   index === carouselIndex
//                                     ? "#65558F"
//                                     : "grey.400"
//                                 }
//                                 sx={{ cursor: "pointer" }}
//                                 onClick={() => setCarouselIndex(index)}
//                               />
//                             )
//                           )}
//                         </Box>
//                       </>
//                     )}
//                   </Box>
//                 ) : (
//                   <div className="w-full h-[500px] bg-gray-200 rounded-lg flex items-center justify-center">
//                     <span className="text-gray-500">No media available</span>
//                   </div>
//                 )}
//               </div>

//               <div className="flex flex-col h-full">
//                 <div className="flex items-center mb-4">
//                   {currentPost.CHANNEL === "Instagram" ? (
//                     <Instagram
//                       fontSize="large"
//                       className="text-pink-500 mr-2"
//                     />
//                   ) : (
//                     <Facebook fontSize="large" className="text-blue-600 mr-2" />
//                   )}
//                   <Typography variant="h6">{currentPost.CHANNEL}</Typography>
//                 </div>
//                 <Typography variant="body1" className="mb-4">
//                   {currentPost.caption || "No caption available"}
//                 </Typography>
//                 <div className="flex items-center mb-4">
//                   <div className="flex items-center gap-1 mr-4">
//                     <IconButton
//                       onClick={likePost}
//                       disabled={likedPosts.has(currentPost.postId)}
//                       sx={{ padding: 0 }}
//                     >
//                       {likedPosts.has(currentPost.postId) ? (
//                         <Favorite fontSize="small" color="error" />
//                       ) : (
//                         <FavoriteBorder fontSize="small" />
//                       )}
//                     </IconButton>
//                     <span>{currentPost.likeCount || 0} Likes</span>
//                   </div>
//                   <div className="flex items-center gap-1 mr-4">
//                     <Comment fontSize="small" />
//                     <span>{currentPost.comments?.length || 0} Comments</span>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <Send fontSize="small" />
//                     <span>{currentPost.sharesCount || 0} Shares</span>
//                   </div>
//                 </div>
//                 <Divider />
//                 <Typography variant="subtitle1" className="mt-4 mb-2">
//                   Add a comment
//                 </Typography>
//                 <Box display="flex" alignItems="center" mb={2}>
//                   <TextField
//                     fullWidth
//                     variant="outlined"
//                     placeholder="Write a comment..."
//                     value={commentText}
//                     onChange={(e) => setCommentText(e.target.value)}
//                     onKeyPress={(e) => e.key === "Enter" && sendComment()}
//                     size="small"
//                   />
//                   <Button
//                     onClick={sendComment}
//                     variant="contained"
//                     sx={{
//                       ml: 1,
//                       backgroundColor: "#65558F",
//                       "&:hover": { backgroundColor: "#56497A" },
//                     }}
//                     disabled={!commentText.trim()}
//                   >
//                     Post
//                   </Button>
//                 </Box>
//                 <Typography variant="subtitle1" className="mb-2">
//                   Trending comments
//                 </Typography>
//                 <div className="overflow-y-auto max-h-[350px]">
//                   {currentPost.comments?.map((c: any) => (
//                     <div
//                       key={c.commentId}
//                       className="flex items-start mb-3 p-2 hover:bg-gray-100 rounded-lg"
//                     >
//                       <Avatar sx={{ width: 24, height: 24 }} className="mr-2">
//                         {c.username?.[0] || "U"}
//                       </Avatar>
//                       <div className="flex-1">
//                         <Typography variant="subtitle2">
//                           {c.username || "Unknown"}
//                         </Typography>
//                         <Typography variant="body2" className="break-words">
//                           {c.text || "No text"}
//                         </Typography>
//                         <div className="flex items-center gap-2">
//                           <Typography
//                             variant="caption"
//                             className="text-gray-400"
//                           >
//                             {new Date(c.timestamp).toLocaleTimeString()}
//                           </Typography>
//                           <div className="flex items-center gap-1">
//                             <FavoriteBorder fontSize="small" />
//                             <Typography
//                               variant="caption"
//                               className="text-gray-600"
//                             >
//                               {c.likeCount || 0} Likes
//                             </Typography>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </DialogContent>
//           <DialogActions>
//             <Button
//               onClick={closeModal}
//               variant="outlined"
//               color="primary"
//               sx={{
//                 borderRadius: "12px",
//                 backgroundColor: "#65558F",
//                 color: "#fff",
//                 px: 3,
//                 py: 1,
//                 fontWeight: "500",
//                 "&:hover": { backgroundColor: "#56497A" },
//               }}
//             >
//               Close
//             </Button>
//           </DialogActions>
//         </Dialog>
//       )}
//     </div>
//   );
// };

// Date.prototype.toLocaleTimeString = function () {
//   const now = new Date();
//   const diffMs = now.getTime() - (this as Date).getTime();
//   const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
//   const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
//   const diffMinutes = Math.floor(diffMs / (1000 * 60));

//   if (diffDays > 0) return `${diffDays} day(s) ago`;
//   if (diffHours > 0) return `${diffHours} hour(s) ago`;
//   if (diffMinutes > 0) return `${diffMinutes} minute(s) ago`;
//   return "just now";
// };

// export default EngagementTab;

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState, useCallback } from "react";
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
  Reply,
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
import { getInstagramData } from "../../api/services/integrationServices";
import { getFacebookIntegrations } from "../../api/services/integrationServices";

// Define sender types as constants
const SenderType = {
  USER: "USER", // Message sent by the user
  ADMIN: "ADMIN", // Message sent by an admin
  AI: "AI", // AI-generated message
  CUSTOM_MESSAGE: "CUSTOM_MESSAGE",
};

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
  const [replyText, setReplyText] = useState("");
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(
    null
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<any>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [filterType, setFilterType] = useState<"conversations" | "comments">(
    "conversations"
  );
  const [error, setError] = useState<string | null>(null);
  const [integrationId, setIntegrationId] = useState<string | null>(null); // Instagram integrationId
  const [facebookIntegrationId, setFacebookIntegrationId] = useState<
    string | null
  >(null); // Facebook-specific integrationId
  const [integrationFetchError, setIntegrationFetchError] = useState<
    string | null
  >(null);
  const open = Boolean(anchorEl);
  const socketRef = useRef<Socket | null>(null);
  const orgId = localStorage.getItem("orgId");

  // Fetch platform-specific integrationIds
  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        // Fetch Instagram integration
        const igResponse = await getInstagramData();
        const igIntegrations = Array.isArray(igResponse?.data)
          ? igResponse.data
          : [];
        console.log("Instagram Integrations:", igIntegrations);
        if (igIntegrations.length > 0) {
          setIntegrationId(igIntegrations[0]._id);
        } else {
          setIntegrationId(null);
        }

        // Fetch Facebook integration
        const fbResponse = await getFacebookIntegrations();
        const fbIntegrations = Array.isArray(fbResponse?.data)
          ? fbResponse.data
          : [];
        console.log("Facebook Integrations:", fbIntegrations);
        if (fbIntegrations.length > 0) {
          setFacebookIntegrationId(fbIntegrations[0]._id);
        }
        setIntegrationFetchError(null);
      } catch (error) {
        console.error("Error fetching integrations:", error);
        setIntegrationFetchError(
          "Failed to fetch integrations. Please try again later."
        );
        setIntegrationId(null);
        setFacebookIntegrationId(null);
      }
    };

    fetchIntegrations();
  }, []);

  const updateConversation = useCallback((data: any, channel: string) => {
    setConversations((prev) => {
      const existingConv = prev.find(
        (c) => c.userId === data.userId && c.CHANNEL === channel
      );
      if (existingConv) {
        return prev.map((c) =>
          c.userId === data.userId && c.CHANNEL === channel
            ? {
                ...c,
                messages: [
                  ...(c.messages || []),
                  {
                    ...data,
                    CHANNEL: channel,
                    timestamp: data.timestamp || new Date().toISOString(),
                  },
                ],
                messageCount: (c.messageCount || 0) + 1,
              }
            : c
        );
      } else {
        return [
          ...prev,
          {
            userId: data.userId,
            username: data.recipientUsername || data.username || "Unknown",
            CHANNEL: channel,
            messages: [
              {
                ...data,
                CHANNEL: channel,
                timestamp: data.timestamp || new Date().toISOString(),
              },
            ],
            messageCount: 1,
          },
        ];
      }
    });
  }, []);

  const updatePostComment = useCallback(
    (data: any, channel: string) => {
      const newComment = {
        commentId: data.commentId,
        username: data.recipientUsername || data.username || "Agent",
        text: data.message?.text || data.text || "",
        timestamp: data.timestamp || new Date().toISOString(),
        CHANNEL: channel,
        likeCount: data.likeCount || 0,
        parentId: data.parentId || null,
      };

      setPosts((prev) =>
        prev.map((p) =>
          p.postId === data.postId && p.CHANNEL === channel
            ? {
                ...p,
                comments: [...(p.comments || []), newComment],
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
          comments: [...(prev.comments || []), newComment],
        }));
      }
    },
    [currentPost]
  );

  useEffect(() => {
    if (!orgId) {
      setError("No organization ID found. Please log in again.");
      return;
    }

    const socket = io(`${import.meta.env.VITE_FIREBASE_BASE_URL}/engagement`, {
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      transports: ["websocket"],
      query: { orgId },
    });
    socketRef.current = socket;

    const setupListeners = () => {
      socket.on("connect", () => {
        console.log("Socket connected", socket.id);
        fetchInitialData();
      });

      socket.on("connect_error", (err) => {
        console.error("Socket connection error", err);
        setError("Failed to connect to server. Retrying...");
      });

      socket.on("reconnect_attempt", () => {
        console.log("Socket reconnecting...");
      });

      socket.on("disconnect", (reason) => {
        console.warn("Socket disconnected", reason);
        setError("Disconnected from server. Reconnecting...");
      });

      // Instagram Events
      socket.on("igInitialData", (data) => {
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
                  text: msg.message?.text || "",
                  type: msg.message?.type || "text",
                  senderType: msg.senderType || SenderType.USER,
                  mediaUrl: msg.message?.mediaUrl || "",
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
              caption: post.caption || "",
              mediaType: post.mediaType,
              likeCount: post.likeCount || 0,
              timestamp: post.timestamp,
              createdAt: post.createdAt,
              updatedAt: post.updatedAt,
              carouselMedia: post.carouselMedia || [],
              comments: (post.comments || []).map((comment: any) => ({
                ...comment,
                text: comment.text || "",
                username: comment.username || "Unknown",
                timestamp: comment.timestamp || new Date().toISOString(),
                likeCount: comment.likeCount || 0,
                parentId: comment.parentId || null,
              })),
              mediaUrl:
                post.mediaUrl ||
                (post.carouselMedia?.length ? post.carouselMedia[0].url : ""),
            }))
          );

          console.log("Processed conversations:", processedConversations);
          console.log("Processed posts:", processedPosts);

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
        if (platform === "all-platforms" || platform === "instagram") {
          updateConversation(data, "Instagram");
        }
      });

      socket.on("igManualAdminComment", (data) => {
        if (platform === "all-platforms" || platform === "instagram") {
          updatePostComment(data, "Instagram");
        }
      });

      socket.on("igBotReplyComment", (data) => {
        if (platform === "all-platforms" || platform === "instagram") {
          updatePostComment(data, "Instagram");
          updateConversation(data, "Instagram");
        }
      });

      socket.on("igNewPost", (data) => {
        if (platform === "all-platforms" || platform === "instagram") {
          setPosts((prev) => [
            { ...data, CHANNEL: "Instagram" },
            ...prev.filter((p) => p.postId !== data.postId),
          ]);
        }
      });

      socket.on("igIncomingUserComment", (data) => {
        if (platform === "all-platforms" || platform === "instagram") {
          updatePostComment(data, "Instagram");
        }
      });

      socket.on("igBotReplyMessage", (data) => {
        if (platform === "all-platforms" || platform === "instagram") {
          updateConversation(data, "Instagram");
        }
      });

      socket.on("igIncomingUserMessage", (data) => {
        if (platform === "all-platforms" || platform === "instagram") {
          updateConversation(data, "Instagram");
        }
      });

      socket.on("igCommentSendError", (e) => {
        console.error("igCommentSendError", e);
        setError("Failed to send comment. Please try again.");
      });

      socket.on("igCommentSendSuccess", (data) => {
        if (platform === "all-platforms" || platform === "instagram") {
          updatePostComment(data, "Instagram");
          setError(null);
        }
      });

      socket.on("igBroadcastOutgoingComment", (data) => {
        if (platform === "all-platforms" || platform === "instagram") {
          updatePostComment(data, "Instagram");
        }
      });

      socket.on("igSendCommentReplyError", (e) => {
        console.error("igSendCommentReplyError", e);
        setError("Failed to send comment reply. Please try again.");
      });

      socket.on("igSendCommentReplySuccess", (data) => {
        if (platform === "all-platforms" || platform === "instagram") {
          updatePostComment(data, "Instagram");
          setError(null);
        }
      });

      socket.on("igBroadcastOutgoingCommentReply", (data) => {
        if (platform === "all-platforms" || platform === "instagram") {
          updatePostComment(data, "Instagram");
        }
      });

      socket.on("igMessageSendError", (e) => {
        console.error("igMessageSendError", e);
        setError("Failed to send message. Please try again.");
      });

      socket.on("igBroadcastOutgoingMessage", (data) => {
        if (platform === "all-platforms" || platform === "instagram") {
          updateConversation(data, "Instagram");
        }
      });

      socket.on("igMessageSendSuccess", (data) => {
        if (platform === "all-platforms" || platform === "instagram") {
          updateConversation(data, "Instagram");
          setError(null);
        }
      });

      socket.on("igLikePostSuccess", (data) => {
        if (platform === "all-platforms" || platform === "instagram") {
          setPosts((prev) =>
            prev.map((p) =>
              p.postId === data.postId && p.CHANNEL === "Instagram"
                ? { ...p, likeCount: (p.likeCount || 0) + 1 }
                : p
            )
          );
          if (currentPost?.postId === data.postId) {
            setCurrentPost((prev: any) => ({
              ...prev,
              likeCount: (prev.likeCount || 0) + 1,
            }));
          }
          setError(null);
        }
      });

      socket.on("igLikePostError", (e) => {
        console.error("igLikePostError", e);
        setError("Failed to like post. Please try again.");
        setLikedPosts((prev) => {
          const newSet = new Set(prev);
          newSet.delete(e.postId);
          return newSet;
        });
      });

      // Facebook Events
      socket.on("fbInitialData", (data) => {
        if (platform === "all-platforms" || platform === "facebook") {
          const processedConversations = data.data.flatMap((item: any) =>
            item.conversations.map((conv: any) => ({
              ...conv,
              CHANNEL: "Facebook",
              userId: conv.userId,
              username: conv.username || "Unknown",
              messages: conv.messages.map((msg: any) => ({
                ...msg,
                CHANNEL: "Facebook",
                messageId: msg.messageId,
                message: {
                  text: msg.message?.text || "",
                  type: msg.message?.type || "TEXT",
                  senderType: msg.senderType || SenderType.USER,
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
              CHANNEL: "Facebook",
              postId:
                post._id || `post_${Math.random().toString(36).substr(2, 9)}`,
              caption: post.caption || "",
              mediaType: post.mediaType,
              likeCount: post.likeCount || 0,
              timestamp: post.timestamp,
              createdAt: post.createdAt,
              updatedAt: post.updatedAt,
              carouselMedia: post.carouselMedia || [],
              comments: (post.comments || []).map((comment: any) => ({
                ...comment,
                text: comment.text || "",
                username: comment.username || "Unknown",
                timestamp: comment.timestamp || new Date().toISOString(),
                likeCount: comment.likeCount || 0,
              })),
              mediaUrl:
                post.mediaUrl ||
                (post.carouselMedia?.length ? post.carouselMedia[0].url : ""),
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
        if (platform === "all-platforms" || platform === "facebook") {
          updateConversation(data, "Facebook");
        }
      });

      socket.on("fbBotReplyComment", (data) => {
        if (platform === "all-platforms" || platform === "facebook") {
          updatePostComment(data, "Facebook");
          updateConversation(data, "Facebook");
        }
      });

      socket.on("fbNewPost", (data) => {
        if (platform === "all-platforms" || platform === "facebook") {
          setPosts((prev) => [
            { ...data, CHANNEL: "Facebook" },
            ...prev.filter((p) => p.postId !== data.postId),
          ]);
        }
      });

      socket.on("fbIncomingUserComment", (data) => {
        if (platform === "all-platforms" || platform === "facebook") {
          updatePostComment(data, "Facebook");
        }
      });

      socket.on("fbBotReplyMessage", (data) => {
        if (platform === "all-platforms" || platform === "facebook") {
          updateConversation(data, "Facebook");
        }
      });

      socket.on("fbIncomingUserMessage", (data) => {
        if (platform === "all-platforms" || platform === "facebook") {
          updateConversation(data, "Facebook");
        }
      });

      socket.on("fbMessageSendSuccess", (data) => {
        if (platform === "all-platforms" || platform === "facebook") {
          updateConversation(data, "Facebook");
          setError(null);
        }
      });

      socket.on("fbBroadcastOutgoingMessage", (data) => {
        if (platform === "all-platforms" || platform === "facebook") {
          updateConversation(data, "Facebook");
        }
      });

      socket.on("fbMessageSendError", (e) => {
        console.error("fbMessageSendError", e);
        setError("Failed to send message. Please try again.");
      });

      socket.on("fbCommentSendError", (e) => {
        console.error("fbCommentSendError", e);
        setError("Failed to send comment. Please try again.");
      });

      socket.on("fbBroadcastOutgoingComment", (data) => {
        if (platform === "all-platforms" || platform === "facebook") {
          updatePostComment(data, "Facebook");
          updateConversation(data, "Facebook");
        }
      });

      socket.on("fbCommentSendSuccess", (data) => {
        if (platform === "all-platforms" || platform === "facebook") {
          updatePostComment(data, "Facebook");
          updateConversation(data, "Facebook");
          setError(null);
        }
      });

      socket.on("fbLikePostSuccess", (data) => {
        if (platform === "all-platforms" || platform === "facebook") {
          setPosts((prev) =>
            prev.map((p) =>
              p.postId === data.postId && p.CHANNEL === "Facebook"
                ? { ...p, likeCount: (p.likeCount || 0) + 1 }
                : p
            )
          );
          if (currentPost?.postId === data.postId) {
            setCurrentPost((prev: any) => ({
              ...prev,
              likeCount: (prev.likeCount || 0) + 1,
            }));
          }
          setError(null);
        }
      });

      socket.on("fbLikePostError", (e) => {
        console.error("fbLikePostError", e);
        setError("Failed to like post. Please try again.");
        setLikedPosts((prev) => {
          const newSet = new Set(prev);
          newSet.delete(e.postId);
          return newSet;
        });
      });

      socket.on("error", (e) => {
        console.error("Socket error", e);
        setError(`Server error: ${e.message || "Unknown error"}`);
      });
    };

    const fetchInitialData = () => {
      if (platform === "all-platforms") {
        socketRef.current!.emit("fbFetchInitialData", orgId);
        socketRef.current!.emit("igFetchInitialData", orgId);
      } else {
        const event =
          platform === "facebook" ? "fbFetchInitialData" : "igFetchInitialData";
        socketRef.current!.emit(event, orgId);
      }
    };

    setupListeners();

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    };
  }, [
    platform,
    orgId,
    updateConversation,
    updatePostComment,
    currentPost?.postId,
  ]);

  const sendMessage = useCallback(() => {
    if (!inputText.trim()) {
      setError("Message cannot be empty.");
      return;
    }
    if (!selectedConversationId) {
      setError("Please select a conversation.");
      return;
    }
    if (!orgId) {
      setError("Organization ID is missing. Please log in again.");
      return;
    }

    const conv = conversations.find((c) => c.userId === selectedConversationId);
    if (!conv || !conv.userId) {
      setError("Selected conversation is invalid.");
      return;
    }

    const event =
      conv.CHANNEL === "Facebook"
        ? "fbSendMessageRequest"
        : "igSendMessageRequest";
    const messageId = `msg_${Math.random().toString(36).substr(2, 9)}`;

    let payload: {
      integrationId: string | null;
      recipientId: string;
      recipientUsername: string;
      recipientName?: string;
      message: string;
      orgId: string;
    };
    if (conv.CHANNEL === "Facebook") {
      payload = {
        integrationId: facebookIntegrationId,
        recipientUsername: conv.username || "Unknown",
        recipientId: conv.userId,
        message: inputText.trim(),
        orgId: orgId,
      };
    } else {
      payload = {
        integrationId: integrationId,
        recipientId: conv.usersternam || "string",
        recipientName: conv.recipientName || conv.username || "string",
        recipientUsername: conv.username || "Unknown",
        message: inputText.trim(),
        orgId: orgId,
      };
    }

    if (!payload.integrationId) {
      setError(
        `${conv.CHANNEL} integration ID is missing. Please set up an integration.`
      );
      return;
    }
    if (!payload.recipientId) {
      setError("Recipient ID is missing.");
      return;
    }
    if (!payload.message) {
      setError("Message cannot be empty.");
      return;
    }
    if (conv.CHANNEL === "Facebook" && !payload.recipientUsername) {
      setError("Recipient username is required for Facebook.");
      return;
    }
    if (conv.CHANNEL === "Instagram" && !payload.recipientUsername) {
      setError("Recipient username is required for Instagram.");
      return;
    }
    if (conv.CHANNEL === "Instagram" && !payload.recipientName) {
      setError("Recipient name is required for Instagram.");
      return;
    }

    console.log("Sending message payload:", payload);

    socketRef.current!.emit(event, payload);

    setConversations((prev) =>
      prev.map((c) =>
        c.userId === selectedConversationId && c.CHANNEL === conv.CHANNEL
          ? {
              ...c,
              messages: [
                ...(c.messages || []),
                {
                  messageId,
                  message: {
                    text: inputText.trim(),
                    type: "text",
                    senderType: SenderType.ADMIN,
                  },
                  timestamp: new Date().toISOString(),
                  status: "SENT",
                  CHANNEL: conv.CHANNEL,
                },
              ],
              messageCount: (c.messageCount || 0) + 1,
            }
          : c
      )
    );

    setInputText("");
    setError(null);
  }, [
    inputText,
    selectedConversationId,
    orgId,
    conversations,
    integrationId,
    facebookIntegrationId,
  ]);

  const sendComment = useCallback(() => {
    if (!commentText.trim() || !currentPost || !orgId) {
      setError(
        "Please enter a comment, select a post, and ensure organization ID is set."
      );
      return;
    }

    const integrationID =
      currentPost.CHANNEL === "Facebook"
        ? facebookIntegrationId
        : integrationId;

    if (!integrationID) {
      setError(
        `${currentPost.CHANNEL} integration ID is missing. Please set up an integration.`
      );
      return;
    }

    const event =
      currentPost.CHANNEL === "Facebook"
        ? "fbSendCommentReplyRequest"
        : "igSendCommentRequest";
    const commentId = `comment_${Math.random().toString(36).substr(2, 9)}`;
    socketRef.current!.emit(event, {
      integrationID,
      parentID: null,
      text: commentText,
      postID: currentPost.postId,
      orgID: orgId,
    });

    const newComment = {
      commentId,
      username: "Agent",
      text: commentText,
      timestamp: new Date().toISOString(),
      CHANNEL: currentPost.CHANNEL,
      likeCount: 0,
      parentId: null,
    };

    setPosts((prev) =>
      prev.map((p) =>
        p.postId === currentPost.postId && p.CHANNEL === currentPost.CHANNEL
          ? { ...p, comments: [...(p.comments || []), newComment] }
          : p
      )
    );

    setCurrentPost((prev: any) => ({
      ...prev,
      comments: [...(prev.comments || []), newComment],
    }));

    setCommentText("");
    setError(null);
  }, [commentText, currentPost, orgId, integrationId, facebookIntegrationId]);

  const sendCommentReply = useCallback(() => {
    if (!replyText.trim() || !currentPost || !selectedCommentId || !orgId) {
      setError(
        "Please enter a reply, select a comment and post, and ensure organization ID is set."
      );
      return;
    }

    const integrationID =
      currentPost.CHANNEL === "Facebook"
        ? facebookIntegrationId
        : integrationId;

    if (!integrationID) {
      setError(
        `${currentPost.CHANNEL} integration ID is missing. Please set up an integration.`
      );
      return;
    }

    const commentId = `comment_${Math.random().toString(36).substr(2, 9)}`;
    socketRef.current!.emit("igSendCommentReplyRequest", {
      integrationID,
      parentID: selectedCommentId,
      text: replyText,
      postID: currentPost.postId,
      orgID: orgId,
    });

    const newComment = {
      commentId,
      username: "Agent",
      text: replyText,
      timestamp: new Date().toISOString(),
      CHANNEL: currentPost.CHANNEL,
      likeCount: 0,
      parentId: selectedCommentId,
    };

    setPosts((prev) =>
      prev.map((p) =>
        p.postId === currentPost.postId && p.CHANNEL === currentPost.CHANNEL
          ? { ...p, comments: [...(p.comments || []), newComment] }
          : p
      )
    );

    setCurrentPost((prev: any) => ({
      ...prev,
      comments: [...(prev.comments || []), newComment],
    }));

    setReplyText("");
    setSelectedCommentId(null);
    setError(null);
  }, [
    replyText,
    currentPost,
    selectedCommentId,
    orgId,
    integrationId,
    facebookIntegrationId,
  ]);

  const likePost = useCallback(() => {
    if (!currentPost || !orgId || likedPosts.has(currentPost.postId)) {
      setError("Post already liked or invalid post.");
      return;
    }

    const event =
      currentPost.CHANNEL === "Facebook"
        ? "fbLikePostRequest"
        : "igLikePostRequest";
    socketRef.current!.emit(event, { orgId, postId: currentPost.postId });

    setLikedPosts((prev) => new Set(prev).add(currentPost.postId));
    setPosts((prev) =>
      prev.map((p) =>
        p.postId === currentPost.postId && p.CHANNEL === currentPost.CHANNEL
          ? { ...p, likeCount: (p.likeCount || 0) + 1 }
          : p
      )
    );
    setCurrentPost((prev: any) => ({
      ...prev,
      likeCount: (prev.likeCount || 0) + 1,
    }));

    setError(null);
  }, [currentPost, orgId, likedPosts]);

  const handleClick = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const openPostModal = (post: any) => {
    setCurrentPost(post);
    setCarouselIndex(0);
    setCommentText("");
    setReplyText("");
    setSelectedCommentId(null);
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

  const isSendMessageDisabled =
    !inputText.trim() ||
    !selectedConversationId ||
    !orgId ||
    (selectedConversation?.CHANNEL === "Instagram" && !integrationId) ||
    (selectedConversation?.CHANNEL === "Facebook" && !facebookIntegrationId);

  return (
    <div className="p-6 bg-white min-h-screen">
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}
      {integrationFetchError && (
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded-lg mb-4">
          {integrationFetchError}
        </div>
      )}
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
                      {post?.caption || "No caption"}
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
        <div className="col-span-3 h-[calc(100vh-200px)] flex flex-col">
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
          <div className="bg-[#65558F] bg-opacity-[0.08] mt-4 rounded-lg overflow-y-auto flex-1">
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
                      {item.username || "Unknown"} commented:{" "}
                      {item.text || "No text"} (
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
                      {selectedConversation.username || "Unknown"}
                    </h2>
                  </div>
                </div>

                <div className="h-[400px] overflow-y-auto mb-4">
                  {(selectedConversation.messages || []).map(
                    (message, index) => (
                      <div
                        key={message.messageId || index}
                        className={
                          message.senderType === SenderType.USER
                            ? "flex gap-2 mb-4"
                            : "flex justify-end mb-4"
                        }
                      >
                        {message.senderType === SenderType.USER && (
                          <div className="w-8 h-8 rounded-full bg-[#2E2F5F] flex items-center justify-center">
                            <SmartToy className="text-white w-6 h-6" />
                          </div>
                        )}
                        <div
                          className={
                            message.senderType === SenderType.USER
                              ? "bg-white p-3 rounded-lg max-w-[70%]"
                              : "bg-[#2E2F5F] text-white p-3 rounded-lg max-w-[70%]"
                          }
                        >
                          {message.message.type === "text" ? (
                            <p className="text-sm">
                              {message.message.text || "No text"}
                            </p>
                          ) : message.message.type === "image" ? (
                            <img
                              src={message.message.mediaUrl}
                              alt="Message image"
                              className="max-w-[200px] rounded-md"
                            />
                          ) : message.message.type === "video" ? (
                            <video
                              src={message.message.mediaUrl}
                              controls
                              className="max-w-[200px] rounded-md"
                            />
                          ) : message.message.type === "audio" ? (
                            <audio
                              src={message.message.mediaUrl}
                              controls
                              className="w-full"
                            />
                          ) : (
                            <p className="text-sm">Unsupported message type</p>
                          )}
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                        {(message.senderType === SenderType.ADMIN ||
                          message.senderType === SenderType.AI ||
                          message.senderType === SenderType.CUSTOM_MESSAGE) && (
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
                          className="px-4 py-1.5 text-sm bg-purple-50 text-[#65558F] border border-purple-100 rounded-full hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => {
                            setInputText(text);
                            sendMessage();
                          }}
                          disabled={isSendMessageDisabled}
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
                    disabled={integrationFetchError !== null}
                  />
                  <button
                    className="p-1.5 hover:bg-gray-200 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={sendMessage}
                    disabled={isSendMessageDisabled}
                  >
                    <Send className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </>
            ) : selectedCommentPost && filterType === "comments" ? (
              <>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-md font-semibold">
                      Post by {selectedCommentPost.username || "botwot.io"}
                    </h2>
                  </div>
                </div>

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
                </div>

                <div className="h-[200px] overflow-y-auto mb-4">
                  <div className="flex flex-col gap-4">
                    {currentPost.comments?.map(
                      (comment: any, index: number) => (
                        <div
                          key={comment.commentId || index}
                          className="flex gap-2 mb-4"
                        >
                          <div className="w-8 h-8 rounded-full bg-[#2E2F5F] flex items-center justify-center">
                            <Person className="text-white w-6 h-6" />
                          </div>
                          <div className="bg-white p-3 rounded-lg max-w-[70%]">
                            <p className="text-sm">
                              {comment.text || "No text"}
                            </p>
                            <p className="text-xs opacity-70 mt-1">
                              {new Date(comment.timestamp).toLocaleTimeString()}
                            </p>
                            {currentPost.CHANNEL === "Instagram" && (
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setSelectedCommentId(comment.commentId);
                                  setReplyText("");
                                }}
                              >
                                <Reply fontSize="small" />
                              </IconButton>
                            )}
                          </div>
                        </div>
                      )
                    ) || <p>No comments available</p>}
                  </div>
                </div>

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

                {selectedCommentId && (
                  <div className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg bg-gray-50 mt-2">
                    <input
                      type="text"
                      placeholder="Write a reply..."
                      className="flex-1 bg-transparent outline-none text-sm"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && sendCommentReply()
                      }
                    />
                    <button
                      className="p-1.5 hover:bg-gray-200 rounded-full"
                      onClick={sendCommentReply}
                    >
                      <Send className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                      className="p-1.5 hover:bg-gray-200 rounded-full"
                      onClick={() => setSelectedCommentId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                )}
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
                <Typography variant="body1" className="mb-4">
                  {currentPost.caption || "No caption available"}
                </Typography>
                <div className="flex items-center mb-4">
                  <div className="flex items-center gap-1 mr-4">
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
                  <div className="flex items-center gap-1 mr-4">
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
                        {c.username?.[0] || "U"}
                      </Avatar>
                      <div className="flex-1">
                        <Typography variant="subtitle2">
                          {c.username || "Unknown"}
                        </Typography>
                        <Typography variant="body2" className="break-words">
                          {c.text || "No text"}
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
                          {currentPost.CHANNEL === "Instagram" && (
                            <IconButton
                              size="small"
                              onClick={() => {
                                setSelectedCommentId(c.commentId);
                                setReplyText("");
                              }}
                            >
                              <Reply fontSize="small" />
                            </IconButton>
                          )}
                        </div>
                        {c.commentId === selectedCommentId && (
                          <Box display="flex" alignItems="center" mt={1}>
                            <TextField
                              fullWidth
                              variant="outlined"
                              placeholder="Write a reply..."
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              onKeyPress={(e) =>
                                e.key === "Enter" && sendCommentReply()
                              }
                              size="small"
                            />
                            <Button
                              onClick={sendCommentReply}
                              variant="contained"
                              sx={{
                                ml: 1,
                                backgroundColor: "#65558F",
                                "&:hover": { backgroundColor: "#56497A" },
                              }}
                              disabled={!replyText.trim()}
                            >
                              Reply
                            </Button>
                            <Button
                              onClick={() => setSelectedCommentId(null)}
                              variant="outlined"
                              sx={{ ml: 1 }}
                            >
                              Cancel
                            </Button>
                          </Box>
                        )}
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
