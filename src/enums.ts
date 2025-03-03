export enum THEME {
  light = "light",
  dark = "dark",
}
export enum BOTICONS {
  list = "list",
  custom = "custom",
}

export enum MessageStatusType {
  DRAFT = "draft", //when admin initiate the message
  SENT = "sent", //single tick (admin to user)
  DELIVERED = "delivered", //double tick (admin to user)
  READ = "read", //blue tick (admin to user)
  RECEIVED = "received", //blue tick (user to admin)
  FAILED = "failed",
}
