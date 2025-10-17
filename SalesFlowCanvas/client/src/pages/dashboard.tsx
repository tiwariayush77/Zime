import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, X, AlertCircle } from "lucide-react";
import type { Deal, TeamMember } from "@shared/schema";

export default function Dashboard() {
  const { data: deals = [], isLoading: dealsLoading } = useQuery<Deal[]>({
    queryKey: ["/api/deals"],
  });

  const { data: teamMembers = [], isLoading: teamLoading } = useQuery<TeamMember[]>({
    queryKey: ["/api/team"],
  });

  const highRiskDeals = deals.filter(d => d.riskScore >= 80);
  const mediumRiskDeals = deals.filter(d => d.riskScore >= 60 && d.riskScore < 80);
  const lowRiskDeals = deals.filter(d => d.riskScore < 60);

  const highRiskValue = highRiskDeals.reduce((sum, d) => sum + d.value, 0);
  const mediumRiskValue = mediumRiskDeals.reduce((sum, d) => sum + d.value, 0);
  const lowRiskValue = lowRiskDeals.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold tracking-tight" data-testid="logo-zime">ZIME</h1>
          </div>
          
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search deals, reps, or actions..."
                className="pl-9"
                data-testid="input-search"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                AT
              </AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <div className="font-semibold" data-testid="text-user-name">Austin</div>
              <div className="text-xs text-muted-foreground">VP Sales</div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <main className="flex-1 p-6">
          <div className="grid grid-cols-3 gap-6 mb-6">
            <Card className="p-6" style={{ backgroundColor: '#FEF2F2' }} data-testid="card-high-risk">
              <div className="text-4xl font-bold text-red-600 mb-1" data-testid="text-high-risk-count">
                {highRiskDeals.length} deals
              </div>
              <div className="text-sm text-red-800 font-medium">
                ${(highRiskValue / 1000).toFixed(0)}K at risk
              </div>
            </Card>

            <Card className="p-6" style={{ backgroundColor: '#FFFBEB' }} data-testid="card-medium-risk">
              <div className="text-4xl font-bold text-yellow-600 mb-1" data-testid="text-medium-risk-count">
                {mediumRiskDeals.length} deals
              </div>
              <div className="text-sm text-yellow-800 font-medium">
                ${(mediumRiskValue / 1000).toFixed(0)}K needs attention
              </div>
            </Card>

            <Card className="p-6" style={{ backgroundColor: '#F0FDF4' }} data-testid="card-low-risk">
              <div className="text-4xl font-bold text-green-600 mb-1" data-testid="text-low-risk-count">
                {lowRiskDeals.length} deals
              </div>
              <div className="text-sm text-green-800 font-medium">
                ${(lowRiskValue / 1000).toFixed(0)}K on track
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            {dealsLoading ? (
              <Card className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              </Card>
            ) : (
              deals.slice(0, 3).map((deal) => (
                <DealRiskCard key={deal.id} deal={deal} />
              ))
            )}
          </div>
        </main>

        <aside className="w-80 border-l bg-card p-6">
          <h2 className="text-lg font-semibold mb-4" data-testid="text-team-performance">Team Performance</h2>
          <div className="space-y-2">
            <div className="grid grid-cols-5 gap-2 pb-2 border-b text-xs font-medium text-muted-foreground">
              <div>Rank</div>
              <div className="col-span-2">Name</div>
              <div className="text-right">Adoption</div>
              <div className="text-right">Win Rate</div>
            </div>
            {teamLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-8 bg-muted rounded animate-pulse"></div>
                ))}
              </div>
            ) : (
              teamMembers.map((member) => (
                <Link key={member.id} href={`/rep/${member.id}`}>
                  <div className="grid grid-cols-5 gap-2 py-2 text-sm hover-elevate active-elevate-2 rounded-md px-2 -mx-2 cursor-pointer" data-testid={`row-team-member-${member.id}`}>
                    <div className="font-medium">{member.rank}</div>
                    <div className="col-span-2 font-medium truncate">{member.name}</div>
                    <div className="text-right">
                      <span className={member.adoption >= 80 ? 'text-green-600' : member.adoption >= 60 ? 'text-yellow-600' : 'text-red-600'}>
                        {member.adoption}%
                      </span>
                    </div>
                    <div className="text-right">
                      <span className={member.winRate >= 30 ? 'text-green-600' : 'text-muted-foreground'}>
                        {member.winRate}%
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function DealRiskCard({ deal }: { deal: Deal }) {
  const riskColor = deal.riskScore >= 80 ? 'red' : deal.riskScore >= 60 ? 'yellow' : 'green';
  const riskBg = deal.riskScore >= 80 ? 'bg-red-50' : deal.riskScore >= 60 ? 'bg-yellow-50' : 'bg-green-50';
  const riskText = deal.riskScore >= 80 ? 'text-red-700' : deal.riskScore >= 60 ? 'text-yellow-700' : 'text-green-700';
  const riskBorder = deal.riskScore >= 80 ? 'border-red-200' : deal.riskScore >= 60 ? 'border-yellow-200' : 'border-green-200';

  return (
    <Card className="p-6" data-testid={`card-deal-${deal.id}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-baseline gap-3 mb-2">
            <h3 className="text-lg font-bold" data-testid={`text-deal-name-${deal.id}`}>{deal.name}</h3>
            <span className="text-base font-semibold text-muted-foreground">${(deal.value / 1000).toFixed(0)}K</span>
            <Badge variant="secondary" className="font-normal">{deal.stage}</Badge>
            <span className="text-sm text-muted-foreground">Rep: {deal.repName}</span>
          </div>
          <Badge variant="secondary" className="font-normal">
            {deal.daysInStage} days in {deal.stage}
          </Badge>
        </div>
        
        <div className={`flex items-center justify-center w-20 h-20 rounded-full ${riskBg} border-2 ${riskBorder}`}>
          <div className="text-center">
            <div className={`text-2xl font-bold ${riskText}`}>{deal.riskScore}</div>
            <div className={`text-xs ${riskText}`}>/100</div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
          Root Causes Identified:
        </h4>
        <div className="space-y-1.5">
          {deal.rootCauses.map((cause, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm">
              <X className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span className="text-foreground">{cause}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-semibold mb-2">Recommended Action:</h4>
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-sm text-yellow-900">
          {deal.recommendedAction}
        </div>
      </div>

      <div className="flex gap-2">
        <Link href={`/call/${deal.id}`}>
          <Button size="sm" data-testid={`button-view-call-${deal.id}`}>
            View Call
          </Button>
        </Link>
        <Button variant="secondary" size="sm" data-testid={`button-coach-rep-${deal.id}`}>
          Coach Rep
        </Button>
        <Button variant="outline" size="sm" data-testid={`button-mark-safe-${deal.id}`}>
          Mark Safe
        </Button>
      </div>
    </Card>
  );
}
