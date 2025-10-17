# ZIME - Sales Pipeline Dashboard

## Overview
A comprehensive sales pipeline management dashboard built for VP of Sales to track deal risks, rep performance, call analysis, and team playbook adoption. Built with React, TypeScript, Express, and Tailwind CSS following a modern Linear/Notion aesthetic.

## Project Architecture

### Tech Stack
- **Frontend**: React 18, TypeScript, Wouter (routing), TanStack Query (data fetching)
- **Backend**: Express.js, Node.js
- **Styling**: Tailwind CSS, Shadcn UI components, Inter font
- **Storage**: In-memory storage (MemStorage)

### Application Structure

#### 4 Main Screens:
1. **Dashboard (/)** - Deal risk overview with summary cards and team leaderboard
2. **Rep Scorecard (/rep/:id)** - Individual rep performance metrics and coaching opportunities
3. **Call Analysis (/call/:id)** - Detailed call transcript, actions checklist, and AI insights
4. **Team Adoption (/team/adoption)** - Team-wide playbook adoption tracking and coaching priorities

### Data Models
- **Deal**: Sales opportunity with risk scoring (0-100), stage tracking, root cause analysis
- **Rep**: Sales representative with performance metrics (adoption %, call score, win rate, pipeline value)
- **Call**: Sales call record with scoring, action completion tracking
- **CallDetail**: Extended call info with transcript, coaching tips, AI insights
- **TeamMember**: Leaderboard entry with rankings
- **CoachingPriority**: Top coaching opportunities ranked by impact

### Design System
- **Primary Color**: Blue (#3B82F6) for CTAs
- **Risk Indicators**:
  - High Risk: Red (#EF4444) with #FEF2F2 background
  - Medium Risk: Yellow (#F59E0B) with #FFFBEB background
  - Low Risk: Green (#10B981) with #F0FDF4 background
- **Performance Colors**:
  - Green: >80% (high performance)
  - Orange/Yellow: 60-80% (needs attention)
  - Red: <60% (critical)
- **Typography**: Inter font family
- **Spacing**: 24px generous padding between cards
- **Components**: Shadcn UI with subtle shadows and clean borders

## API Endpoints

### Deals
- `GET /api/deals` - List all deals
- `GET /api/deals/:id` - Get deal details

### Team
- `GET /api/team` - Get team leaderboard

### Reps
- `GET /api/reps/:id` - Get rep profile
- `GET /api/reps/:id/actions` - Get rep's playbook actions by stage
- `GET /api/reps/:id/calls` - Get rep's recent calls

### Calls
- `GET /api/calls/:id` - Get call detail with transcript and insights

### Team Analytics
- `GET /api/team/actions` - Get team-wide action breakdown
- `GET /api/team/coaching-priorities` - Get top coaching opportunities
- `GET /api/team/adoption-trends` - Get adoption trend data

## Key Features

### Deal Risk Dashboard
- Real-time risk scoring (85/100 scale)
- Summary cards showing high/medium/low risk deals and total value
- Root cause identification with impact percentages
- Recommended actions for each at-risk deal
- Team leaderboard sidebar

### Rep Performance Scorecard
- 6 metric cards with trend indicators (↑↓→)
- Playbook adoption breakdown by stage (Discovery/Demo/Negotiation)
- Color-coded progress bars (green/yellow/red)
- Coaching opportunity highlights with suggested actions
- Recent calls table with scores

### Call Analysis
- Tabbed interface (Transcript/Actions/Insights)
- Timestamped transcript with speaker labels
- Playbook actions checklist with completion status
- Coaching tips with timestamp and context
- AI insights: sentiment, objections, competitors, stakeholders
- AI-generated follow-up email with copy/edit/send functionality

### Team Playbook Adoption
- Adoption trends visualization (placeholder for chart)
- Action breakdown tables by stage with completion rates
- Impact on win rate metrics
- Top coaching priorities ranked by impact
- Affected reps listing

## User Experience

### Navigation Flow
Dashboard → Rep Scorecard (click team member) → Call Analysis (click "View Call")
← Back buttons for navigation
All routes use Wouter for client-side routing

### Loading States
- Skeleton loaders for cards and tables
- Pulse animations during data fetch
- Maintained beautiful UI during loading

### Color Coding
- Consistent risk/performance indicators across all screens
- Green: Good performance (>80%)
- Yellow: Moderate (60-80%)
- Red: Needs attention (<60%)

## Development Notes

### Component Organization
- Pages in `client/src/pages/`
- Reusable UI components in `client/src/components/ui/` (Shadcn)
- Shared types in `shared/schema.ts`
- Storage layer in `server/storage.ts`
- API routes in `server/routes.ts`

### Mock Data
- 3 deals with varying risk levels (85, 72, 45)
- 5 sales reps with complete metrics
- 5 recent calls per rep
- Complete playbook actions for all stages
- Coaching priorities and adoption trends

### Styling Approach
- Tailwind utility classes
- Custom color variables in index.css
- Inter font from Google Fonts
- Shadcn UI components for consistency
- Hover/active elevation utilities for interactions

## Running the Project
```bash
npm run dev
```
Starts Express backend and Vite frontend on the same port (5000).

## Recent Changes
- October 17, 2025: Initial implementation of all 4 screens
- Implemented comprehensive data models and mock data
- Created all API endpoints with in-memory storage
- Built beautiful, responsive UI following design guidelines
