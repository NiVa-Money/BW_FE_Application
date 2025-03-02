/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ADVANCE_FEATURE,
  USER_ALL_SESSION,
  USER_ALL_SESSION_LIVE,
  USER_SESSION_HISTORY,
} from "../actionTypes/conversationActionsTypes";

export const getAllSession = (payload: any) => ({
  type: USER_ALL_SESSION,
  payload,
});

export const getAllSessionLive = (userId: any) => ({
  type: USER_ALL_SESSION_LIVE,
  payload: userId,
});

// conversationActions.ts
export const getAdvanceFeature = (
  sessionId: string,
  botId: string,
  adminPhoneNumberId: string,
  userPhoneNumberId: string,
  channelName: string
) => ({
  type: ADVANCE_FEATURE,
  payload: {
    sessionId,
    botId,
    adminPhoneNumberId,
    userPhoneNumberId,
    channelName,
  },
});

export const filteredSession = (payload: any) => {
  const processedSessions: any = [];

  payload?.filteredSessions[0]?.sessions.forEach((session: any) => {
    if (session.question) {
      processedSessions.push({
        text: session.question,
        sender: "user",
      });
    }
    if (session.answer) {
      processedSessions.push({
        text: session.answer,
        sender: "other",
      });
    }
  });

  const data = {
    sessionData: processedSessions,
    sessionId: payload.sessionId,
  };

  return {
    type: USER_SESSION_HISTORY,
    payload: data,
  };
};
