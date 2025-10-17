import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type Deal = {
  id: string;
  name: string;
  value: number;
  stage: 'Discovery' | 'Demo' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
  repId: string;
  repName: string;
  riskScore: number;
  daysInStage: number;
  rootCauses: string[];
  recommendedAction: string;
  lastActivity: string;
};

export type Rep = {
  id: string;
  name: string;
  photoUrl: string;
  playbookAdoption: number;
  playbookAdoptionChange: number;
  avgCallScore: number;
  avgCallScoreChange: number;
  winRate: number;
  winRateChange: number;
  activeDeals: number;
  activeDealsChange: number;
  pipelineValue: number;
  pipelineValueChange: number;
  avgDealSize: number;
  avgDealSizeChange: number;
};

export type PlaybookAction = {
  action: string;
  completionRate: number;
  impactOnWinRate: number;
};

export type StageActions = {
  stage: 'Discovery' | 'Demo' | 'Negotiation';
  actions: PlaybookAction[];
};

export type Call = {
  id: string;
  dealId: string;
  dealName: string;
  date: string;
  duration: number;
  participants: string[];
  score: number;
  repId: string;
  repName: string;
  actionsCompleted: number;
  totalActions: number;
};

export type TranscriptEntry = {
  timestamp: string;
  speaker: string;
  text: string;
};

export type CallAction = {
  action: string;
  completed: boolean;
  impactText?: string;
};

export type CoachingTip = {
  timestamp: string;
  context: string;
  suggestion: string;
  exampleLink?: string;
};

export type AIInsight = {
  type: 'sentiment' | 'objections' | 'competitors' | 'stakeholders';
  icon: string;
  title: string;
  value: string | string[];
};

export type CallDetail = {
  call: Call;
  transcript: TranscriptEntry[];
  actions: CallAction[];
  coachingTip: CoachingTip;
  aiInsights: AIInsight[];
  followUpEmail: string;
};

export type TeamMember = {
  rank: number;
  id: string;
  name: string;
  adoption: number;
  avgScore: number;
  winRate: number;
};

export type CoachingPriority = {
  rank: number;
  title: string;
  stage: string;
  skipRate: number;
  impactOnWinRate: number;
  affectedReps: string[];
};

export type AdoptionTrend = {
  repName: string;
  startAdoption: number;
  endAdoption: number;
  change: number;
};
