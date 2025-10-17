import { type User, type InsertUser, type Deal, type Rep, type StageActions, type Call, type CallDetail, type TeamMember, type CoachingPriority, type AdoptionTrend, type TranscriptEntry, type CallAction, type CoachingTip, type AIInsight } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getDeals(): Promise<Deal[]>;
  getDeal(id: string): Promise<Deal | undefined>;
  
  getTeamMembers(): Promise<TeamMember[]>;
  
  getRep(id: string): Promise<Rep | undefined>;
  getRepStageActions(repId: string): Promise<StageActions[]>;
  getRepCalls(repId: string): Promise<Call[]>;
  
  getCallDetail(id: string): Promise<CallDetail | undefined>;
  
  getTeamStageActions(): Promise<StageActions[]>;
  getCoachingPriorities(): Promise<CoachingPriority[]>;
  getAdoptionTrends(): Promise<AdoptionTrend[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private deals: Deal[];
  private reps: Rep[];
  private calls: Call[];
  private teamMembers: TeamMember[];

  constructor() {
    this.users = new Map();
    this.deals = this.createMockDeals();
    this.reps = this.createMockReps();
    this.calls = this.createMockCalls();
    this.teamMembers = this.createMockTeamMembers();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getDeals(): Promise<Deal[]> {
    return this.deals;
  }

  async getDeal(id: string): Promise<Deal | undefined> {
    return this.deals.find(d => d.id === id);
  }

  async getTeamMembers(): Promise<TeamMember[]> {
    return this.teamMembers;
  }

  async getRep(id: string): Promise<Rep | undefined> {
    return this.reps.find(r => r.id === id);
  }

  async getRepStageActions(repId: string): Promise<StageActions[]> {
    return [
      {
        stage: 'Discovery',
        actions: [
          { action: 'Ask about current pain point', completionRate: 95, impactOnWinRate: 12 },
          { action: 'Identify decision-makers', completionRate: 60, impactOnWinRate: 8 },
          { action: 'Ask about budget', completionRate: 40, impactOnWinRate: 18 },
        ],
      },
      {
        stage: 'Demo',
        actions: [
          { action: 'Customize demo to pain points', completionRate: 85, impactOnWinRate: 15 },
          { action: 'Involve multiple stakeholders', completionRate: 55, impactOnWinRate: 12 },
          { action: 'Address objections directly', completionRate: 70, impactOnWinRate: 10 },
        ],
      },
      {
        stage: 'Negotiation',
        actions: [
          { action: 'Present ROI calculator', completionRate: 65, impactOnWinRate: 9 },
          { action: 'Offer tiered pricing options', completionRate: 80, impactOnWinRate: 7 },
          { action: 'Set clear next steps', completionRate: 90, impactOnWinRate: 11 },
        ],
      },
    ];
  }

  async getRepCalls(repId: string): Promise<Call[]> {
    return this.calls.filter(c => c.repId === repId);
  }

  async getCallDetail(id: string): Promise<CallDetail | undefined> {
    const call = this.calls.find(c => c.id === id);
    if (!call) return undefined;

    const transcript: TranscriptEntry[] = [
      { timestamp: '00:02', speaker: 'Sarah', text: 'Hi John, thanks for taking the time today. I really appreciate you making space in your schedule.' },
      { timestamp: '00:15', speaker: 'John', text: "No problem at all. I'm looking forward to learning more about your solution." },
      { timestamp: '08:15', speaker: 'John', text: "We're currently using Stripe for payments, but we're having some integration challenges with our legacy systems." },
      { timestamp: '15:30', speaker: 'Sarah', text: "That makes sense. I've worked with several companies transitioning from Stripe. Can you tell me more about the specific integration issues you're facing?" },
      { timestamp: '28:30', speaker: 'John', text: "Pricing is a concern for us. We need to make sure this fits within our Q1 budget." },
      { timestamp: '28:45', speaker: 'Sarah', text: "I understand. Let me show you how our pricing compares and the ROI you can expect in the first quarter." },
      { timestamp: '35:20', speaker: 'John', text: "This looks promising. I'd like to involve our CFO in the next conversation." },
      { timestamp: '41:30', speaker: 'Sarah', text: "That sounds great. I'll send over a calendar invite for next week. Looking forward to continuing the conversation." },
    ];

    const actions: CallAction[] = [
      { action: 'Asked about current pain point', completed: true },
      { action: 'Identified decision-makers', completed: true },
      { action: 'ask about budget', completed: false, impactText: '40% lower win rate when skipped' },
      { action: 'Mentioned case study', completed: true },
      { action: 'ask about timeline', completed: false },
    ];

    const coachingTip: CoachingTip = {
      timestamp: '28:30',
      context: 'John mentioned "pricing is a concern"',
      suggestion: "Sarah should have asked: 'What's your budget range for this project?' This question helps qualify the deal early.",
      exampleLink: 'Watch how top rep handles this (Deal: TechCorp, 15:22)',
    };

    const aiInsights: AIInsight[] = [
      {
        type: 'sentiment',
        icon: '😊',
        title: 'Sentiment Analysis',
        value: '+0.7 (Positive)',
      },
      {
        type: 'objections',
        icon: '⚠️',
        title: 'Objections Raised',
        value: ['Pricing concern', 'Integration complexity'],
      },
      {
        type: 'competitors',
        icon: '🏆',
        title: 'Competitors Mentioned',
        value: 'Stripe (current provider)',
      },
      {
        type: 'stakeholders',
        icon: '👥',
        title: 'Key Stakeholders',
        value: ['John Smith (Champion)', 'CFO mentioned but not on call'],
      },
    ];

    const followUpEmail = `Hi John,

Thanks for the great conversation today. Based on our discussion, I understand your main pain points are integration challenges with legacy systems and ensuring the solution fits within your Q1 budget.

I've attached a case study showing how TechCorp solved similar integration challenges and achieved 40% ROI in their first quarter.

Next steps:
- I'll send over pricing options by Thursday
- Let's schedule a demo with your CFO next week

Best,
Sarah`;

    return {
      call,
      transcript,
      actions,
      coachingTip,
      aiInsights,
      followUpEmail,
    };
  }

  async getTeamStageActions(): Promise<StageActions[]> {
    return [
      {
        stage: 'Discovery',
        actions: [
          { action: 'Ask about pain point', completionRate: 88, impactOnWinRate: 12 },
          { action: 'Identify decision-makers', completionRate: 72, impactOnWinRate: 8 },
          { action: 'Ask about budget', completionRate: 54, impactOnWinRate: 18 },
        ],
      },
      {
        stage: 'Demo',
        actions: [
          { action: 'Customize to pain points', completionRate: 82, impactOnWinRate: 15 },
          { action: 'Multi-thread stakeholders', completionRate: 62, impactOnWinRate: 12 },
          { action: 'Handle objections', completionRate: 75, impactOnWinRate: 10 },
        ],
      },
      {
        stage: 'Negotiation',
        actions: [
          { action: 'Share ROI calculator', completionRate: 69, impactOnWinRate: 9 },
          { action: 'Provide pricing tiers', completionRate: 78, impactOnWinRate: 7 },
          { action: 'Define clear next steps', completionRate: 85, impactOnWinRate: 11 },
        ],
      },
    ];
  }

  async getCoachingPriorities(): Promise<CoachingPriority[]> {
    return [
      {
        rank: 1,
        title: 'Budget Qualification',
        stage: 'Discovery',
        skipRate: 46,
        impactOnWinRate: 18,
        affectedReps: ['Sarah', 'Mike', 'Jessica'],
      },
      {
        rank: 2,
        title: 'Multi-threading',
        stage: 'Demo',
        skipRate: 38,
        impactOnWinRate: 12,
        affectedReps: ['John', 'Mike'],
      },
      {
        rank: 3,
        title: 'ROI Calculator',
        stage: 'Negotiation',
        skipRate: 31,
        impactOnWinRate: 9,
        affectedReps: ['Sarah', 'Jessica'],
      },
    ];
  }

  async getAdoptionTrends(): Promise<AdoptionTrend[]> {
    return [
      { repName: 'Sarah', startAdoption: 77, endAdoption: 92, change: 15 },
      { repName: 'John', startAdoption: 88, endAdoption: 91, change: 3 },
      { repName: 'Mike', startAdoption: 65, endAdoption: 74, change: 9 },
    ];
  }

  private createMockDeals(): Deal[] {
    return [
      {
        id: '1',
        name: 'Acme Corp - Enterprise Plan',
        value: 50000,
        stage: 'Discovery',
        repId: '1',
        repName: 'Sarah Johnson',
        riskScore: 85,
        daysInStage: 18,
        rootCauses: [
          'No economic buyer identified (40% lower win rate when skipped)',
          'Last activity 7 days ago',
          'Rep skipped budget qualification',
        ],
        recommendedAction: 'Schedule multi-threading call with CFO by Friday',
        lastActivity: '7 days ago',
      },
      {
        id: '2',
        name: 'TechStart Inc - Growth Package',
        value: 35000,
        stage: 'Demo',
        repId: '2',
        repName: 'John Smith',
        riskScore: 72,
        daysInStage: 12,
        rootCauses: [
          'Only 1 stakeholder engaged (67% lower win rate)',
          'No technical champion identified',
          'Integration concerns not addressed',
        ],
        recommendedAction: 'Schedule technical deep-dive with engineering team this week',
        lastActivity: '3 days ago',
      },
      {
        id: '3',
        name: 'GlobalTech Solutions',
        value: 75000,
        stage: 'Negotiation',
        repId: '3',
        repName: 'Mike Davis',
        riskScore: 45,
        daysInStage: 8,
        rootCauses: [
          'Pricing objection raised in last call',
        ],
        recommendedAction: 'Share ROI calculator and customer success story from similar company',
        lastActivity: '1 day ago',
      },
    ];
  }

  private createMockReps(): Rep[] {
    return [
      {
        id: '1',
        name: 'Sarah Johnson',
        photoUrl: '',
        playbookAdoption: 92,
        playbookAdoptionChange: 15,
        avgCallScore: 8.5,
        avgCallScoreChange: 1.2,
        winRate: 35,
        winRateChange: 0,
        activeDeals: 12,
        activeDealsChange: 3,
        pipelineValue: 540000,
        pipelineValueChange: 120000,
        avgDealSize: 45000,
        avgDealSizeChange: -5000,
      },
      {
        id: '2',
        name: 'John Smith',
        photoUrl: '',
        playbookAdoption: 88,
        playbookAdoptionChange: 5,
        avgCallScore: 9.1,
        avgCallScoreChange: 0.3,
        winRate: 42,
        winRateChange: 7,
        activeDeals: 10,
        activeDealsChange: 2,
        pipelineValue: 620000,
        pipelineValueChange: 80000,
        avgDealSize: 62000,
        avgDealSizeChange: 8000,
      },
      {
        id: '3',
        name: 'Mike Davis',
        photoUrl: '',
        playbookAdoption: 74,
        playbookAdoptionChange: 9,
        avgCallScore: 7.8,
        avgCallScoreChange: -0.5,
        winRate: 28,
        winRateChange: -3,
        activeDeals: 15,
        activeDealsChange: 5,
        pipelineValue: 480000,
        pipelineValueChange: 95000,
        avgDealSize: 32000,
        avgDealSizeChange: -2000,
      },
      {
        id: '4',
        name: 'Jessica Chen',
        photoUrl: '',
        playbookAdoption: 85,
        playbookAdoptionChange: 12,
        avgCallScore: 8.2,
        avgCallScoreChange: 1.8,
        winRate: 38,
        winRateChange: 5,
        activeDeals: 11,
        activeDealsChange: 1,
        pipelineValue: 590000,
        pipelineValueChange: 110000,
        avgDealSize: 53000,
        avgDealSizeChange: 3000,
      },
      {
        id: '5',
        name: 'David Martinez',
        photoUrl: '',
        playbookAdoption: 79,
        playbookAdoptionChange: 6,
        avgCallScore: 8.0,
        avgCallScoreChange: 0.8,
        winRate: 33,
        winRateChange: 2,
        activeDeals: 13,
        activeDealsChange: 4,
        pipelineValue: 510000,
        pipelineValueChange: 75000,
        avgDealSize: 39000,
        avgDealSizeChange: 1000,
      },
    ];
  }

  private createMockCalls(): Call[] {
    return [
      {
        id: '1',
        dealId: '1',
        dealName: 'Acme Corp - Enterprise Plan',
        date: 'Oct 16, 2025',
        duration: 42,
        participants: ['Sarah Johnson', 'John Smith (Buyer)'],
        score: 7,
        repId: '1',
        repName: 'Sarah Johnson',
        actionsCompleted: 3,
        totalActions: 5,
      },
      {
        id: '2',
        dealId: '1',
        dealName: 'Acme Corp - Follow-up',
        date: 'Oct 14, 2025',
        duration: 28,
        participants: ['Sarah Johnson', 'John Smith (Buyer)'],
        score: 8,
        repId: '1',
        repName: 'Sarah Johnson',
        actionsCompleted: 4,
        totalActions: 5,
      },
      {
        id: '3',
        dealId: '2',
        dealName: 'TechStart Inc - Discovery',
        date: 'Oct 15, 2025',
        duration: 35,
        participants: ['Sarah Johnson', 'Lisa Wong (CTO)'],
        score: 9,
        repId: '1',
        repName: 'Sarah Johnson',
        actionsCompleted: 5,
        totalActions: 5,
      },
      {
        id: '4',
        dealId: '3',
        dealName: 'GlobalTech Solutions',
        date: 'Oct 12, 2025',
        duration: 45,
        participants: ['Sarah Johnson', 'Mark Peterson (VP)'],
        score: 6,
        repId: '1',
        repName: 'Sarah Johnson',
        actionsCompleted: 2,
        totalActions: 5,
      },
      {
        id: '5',
        dealId: '1',
        dealName: 'Enterprise Account Check-in',
        date: 'Oct 10, 2025',
        duration: 22,
        participants: ['Sarah Johnson', 'Team'],
        score: 8,
        repId: '1',
        repName: 'Sarah Johnson',
        actionsCompleted: 4,
        totalActions: 5,
      },
      {
        id: '6',
        dealId: '2',
        dealName: 'TechStart Inc - Product Demo',
        date: 'Oct 17, 2025',
        duration: 50,
        participants: ['John Smith', 'Mike Chen (CTO)', 'Lisa Wang (VP)'],
        score: 9,
        repId: '2',
        repName: 'John Smith',
        actionsCompleted: 5,
        totalActions: 5,
      },
      {
        id: '7',
        dealId: '2',
        dealName: 'TechStart Inc - Discovery',
        date: 'Oct 15, 2025',
        duration: 38,
        participants: ['John Smith', 'Mike Chen (CTO)'],
        score: 8,
        repId: '2',
        repName: 'John Smith',
        actionsCompleted: 4,
        totalActions: 5,
      },
      {
        id: '8',
        dealId: '2',
        dealName: 'TechStart Inc - Initial Call',
        date: 'Oct 12, 2025',
        duration: 25,
        participants: ['John Smith', 'Mike Chen (CTO)'],
        score: 7,
        repId: '2',
        repName: 'John Smith',
        actionsCompleted: 3,
        totalActions: 5,
      },
    ];
  }

  private createMockTeamMembers(): TeamMember[] {
    return [
      { rank: 1, id: '2', name: 'John Smith', adoption: 88, avgScore: 9.1, winRate: 42 },
      { rank: 2, id: '1', name: 'Sarah Johnson', adoption: 92, avgScore: 8.5, winRate: 35 },
      { rank: 3, id: '4', name: 'Jessica Chen', adoption: 85, avgScore: 8.2, winRate: 38 },
      { rank: 4, id: '5', name: 'David Martinez', adoption: 79, avgScore: 8.0, winRate: 33 },
      { rank: 5, id: '3', name: 'Mike Davis', adoption: 74, avgScore: 7.8, winRate: 28 },
    ];
  }
}

export const storage = new MemStorage();
