# Sales Pipeline Dashboard - Design Guidelines

## Design System Foundation

**Design Reference**: Linear/Notion aesthetic - clean, modern, data-focused interface
**Framework**: Tailwind CSS
**Typography**: Inter or SF Pro Display
**Color Philosophy**: Color-coded risk indicators (Green/Yellow/Red) with clean white backgrounds

## Color Palette

**Risk Indicators**:
- High Risk: Red (#EF4444), Background #FEF2F2
- Medium Risk: Yellow (#F59E0B), Background #FFFBEB  
- Low Risk: Green (#10B981), Background #F0FDF4

**Performance Scoring**:
- Green: >80% (high performance)
- Orange: 60-80% (needs attention)
- Red: <60% (critical)

**Interactive Elements**:
- Primary CTA: Blue (#3B82F6)
- Secondary: Gray (#6B7280)
- Outline buttons: Gray border with transparent background

## Layout System

**Spacing**: Generous 24px padding between major card components
**Container Width**: Max-width content containers for readability
**Grid System**: 
- 3-column summary cards (equal width)
- 2-column layouts for detail views (60/40 split)
- 3-column metric cards (2 rows of 3)

## Component Specifications

### Cards & Containers
- White background with subtle shadows (shadow-sm to shadow-md)
- Rounded corners (rounded-lg)
- 16-24px internal padding
- Clear visual hierarchy with bold headers

### Summary Metrics Cards
- Large bold numbers (text-4xl or text-5xl)
- Subtitle text below (text-sm, text-gray-600)
- Tinted backgrounds based on risk level
- Equal width distribution in grid

### Risk Score Badges
- Large circular score display (e.g., "85/100")
- Color-coded based on risk level
- Prominent placement in deal cards

### Progress Bars
- Full-width horizontal bars
- Color-coded (green/orange/red) based on completion %
- Smooth fill animation on load
- Percentage label at end of bar

### Tables
- Striped rows for readability
- Sortable column headers with hover states
- Clean typography hierarchy
- Compact row spacing for data density

## Navigation & Interaction

**Flow**: Dashboard → Rep Scorecard → Call Analysis (with back buttons)
**Buttons**: 
- Primary actions: Solid blue background
- Secondary: Solid gray background  
- Tertiary: Outline style with gray border
- Consistent padding and hover states

## Screen-Specific Elements

### Deal Risk Cards
- Header: Deal name (bold), amount, stage, rep name in single row
- Badge row: Days in stage (gray bg) + Risk score (colored circle)
- Bullet points with red X icons for issues
- Yellow highlighted action box
- 3-button action row at bottom

### Rep Performance Metrics
- 6 metric cards in 2x3 grid
- Trend arrows (↑↓→) with percentage changes
- Clear labels and time periods
- Circular rep photo (80px) prominently placed

### Coaching Opportunities
- Yellow border with light yellow background (#FFFBEB)
- 💡 emoji icon
- Clear title and explanation
- Bulleted suggested actions
- Blue CTA button

### Call Analysis Layout
- Two-column: Left (transcript) | Right (checklist + coaching)
- Light gray background for transcript area
- Timestamp + speaker labels
- Checkmarks (✅) and X icons (❌) for action completion
- Orange-bordered coaching tip cards

### AI Insights Cards
- 4 equal-width cards in row
- Colorful emoji icons (😊⚠️🏆👥)
- Clean white background
- Concise data presentation

## Data Visualization

**Adoption Trends**: Placeholder for chart showing rep performance over 4 weeks
**Action Tables**: 3 separate tables for Discovery/Demo/Negotiation stages with completion rates
**Leaderboard**: Sortable 5-column table with rank, name, adoption %, avg score, win rate

## Typography Scale

- Page titles: text-3xl, font-bold
- Section headers: text-xl, font-semibold
- Card titles: text-lg, font-medium
- Body text: text-base
- Supporting text/labels: text-sm, text-gray-600
- Large metrics: text-4xl to text-5xl, font-bold

## Images

**Rep Photos**: Circular avatars (80px) for rep profile headers
**Icons**: Use emoji or icon libraries for:
- Risk indicators (⚠️)
- Coaching tips (💡🎯)
- Sentiment analysis (😊)
- Competitors (🏆)
- Stakeholders (👥)