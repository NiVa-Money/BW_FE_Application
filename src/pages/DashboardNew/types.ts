export interface StatsCardProps {
  title: string;
  content: string;
  iconSrc?: string;
}
export interface DashboardResponse {
  success: boolean;
  data: DashboardMetrics;
}

export interface DashboardMetrics {
  liveVsEndedSessions: SessionMetrics;
  messages: MessageMetrics;
  resolutionRate: number;
  escalationRate: BotStats[];
  aiVsHumanResolutionRate: AIHumanResolutionRate;
  channelWiseConversation: ChannelMetrics[];
  sentiments: SentimentMetrics;
  aiAgentMetrics: AIAgentMetrics[];
  chatTrafficOverview: any[];
  channelWiseResolutionMetrics: ChannelMetrics[];
  averageHandlingTime: HandlingTimeMetrics;
}

export interface SessionMetrics {
  live: number;
  ended: number;
  total: number;
}

export interface MessageMetrics {
  total: number;
  left: number;
  consumed: number;
}

export interface BotStats {
  name: string;
  escalated: number;
  solved: number;
}

export interface AIHumanResolutionRate {
  ai: number;
  human: number;
}

export interface ChannelMetrics {
  date: string;
  whatsapp: number;
  web: number;
}

export interface SentimentMetrics {
  Good: number;
  Neutral: number;
  Bad: number;
}

export interface AIAgentMetrics {
  date: string;
  agentName: string;
  totalSessions: number;
  totalWhatsappSessions: number;
  totalWebSessions: number;
  resolvedSessions: number;
}

export interface HandlingTimeMetrics {
  web: number;
  whatsapp: number;
}

export interface DashboardHeaderProps {
  headerData: DashboardHeaderMetrics;
}

export interface DashboardHeaderMetrics {
  resolutionRate: number;
  messages: MessageMetrics;
  liveVsEndedSessions: SessionMetrics;
  escalationRate: number;
  aiVsHumanResolutionRate: AIHumanResolutionRate;
}
