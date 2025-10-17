import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Lightbulb } from "lucide-react";
import type { Rep, StageActions, Call } from "@shared/schema";

export default function RepScorecard() {
  const [, params] = useRoute("/rep/:id");
  const repId = params?.id;

  const { data: rep, isLoading: repLoading } = useQuery<Rep>({
    queryKey: [`/api/reps/${repId}`],
    enabled: !!repId,
  });

  const { data: stageActions = [], isLoading: actionsLoading } = useQuery<StageActions[]>({
    queryKey: [`/api/reps/${repId}/actions`],
    enabled: !!repId,
  });

  const { data: recentCalls = [], isLoading: callsLoading } = useQuery<Call[]>({
    queryKey: [`/api/reps/${repId}/calls`],
    enabled: !!repId,
  });

  if (repLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-48"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!rep) return null;

  return (
    <div className="min-h-screen bg-background p-6">
      <Link href="/">
        <Button variant="ghost" size="sm" className="mb-6" data-testid="button-back">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Dashboard
        </Button>
      </Link>

      <div className="mb-6">
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-semibold">
              {rep.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-3xl font-bold" data-testid="text-rep-name">{rep.name}</h1>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <MetricCard
            label="Playbook Adoption"
            value={`${rep.playbookAdoption}%`}
            change={rep.playbookAdoptionChange}
            sublabel="Last 30 days"
            testId="metric-adoption"
          />
          <MetricCard
            label="Avg Call Score"
            value={`${rep.avgCallScore}/10`}
            change={rep.avgCallScoreChange}
            sublabel="Last 30 days"
            testId="metric-call-score"
          />
          <MetricCard
            label="Win Rate"
            value={`${rep.winRate}%`}
            change={rep.winRateChange}
            sublabel="Last quarter"
            testId="metric-win-rate"
          />
          <MetricCard
            label="Active Deals"
            value={rep.activeDeals.toString()}
            change={rep.activeDealsChange}
            sublabel="This month"
            testId="metric-active-deals"
          />
          <MetricCard
            label="Pipeline Value"
            value={`$${(rep.pipelineValue / 1000).toFixed(0)}K`}
            change={rep.pipelineValueChange / 1000}
            sublabel="Open opportunities"
            prefix="$"
            suffix="K"
            testId="metric-pipeline-value"
          />
          <MetricCard
            label="Avg Deal Size"
            value={`$${(rep.avgDealSize / 1000).toFixed(0)}K`}
            change={rep.avgDealSizeChange / 1000}
            sublabel="Last 30 days"
            prefix="$"
            suffix="K"
            testId="metric-deal-size"
          />
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Playbook Adoption by Stage</h2>
        <div className="grid grid-cols-3 gap-4">
          {actionsLoading ? (
            <div className="col-span-3 h-48 bg-muted rounded animate-pulse"></div>
          ) : (
            stageActions.map((stage) => (
              <Card key={stage.stage} className="p-4" data-testid={`card-stage-${stage.stage.toLowerCase()}`}>
                <h3 className="font-semibold mb-3">{stage.stage}</h3>
                <div className="space-y-3">
                  {stage.actions.map((action, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-sm">{action.action}</span>
                        <span className={`font-medium ${
                          action.completionRate >= 80 ? 'text-green-600' :
                          action.completionRate >= 60 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {action.completionRate}%
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            action.completionRate >= 80 ? 'bg-green-500' :
                            action.completionRate >= 60 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${action.completionRate}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      <Card className="p-6 mb-6 border-yellow-500 bg-yellow-50" data-testid="card-coaching-opportunity">
        <div className="flex gap-3">
          <Lightbulb className="h-6 w-6 text-yellow-700 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2 text-yellow-900">Opportunity Identified</h3>
            <p className="text-sm text-yellow-900 mb-3">
              {rep.name.split(' ')[0]} skips budget qualification in 60% of discovery calls. Top reps who ask about budget in the first call have 40% higher win rates.
            </p>
            <div className="mb-4">
              <div className="text-sm font-medium text-yellow-900 mb-2">Suggested Actions:</div>
              <ul className="space-y-1 text-sm text-yellow-900">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-700">•</span>
                  <span>Share call recording from top rep John (Deal: Acme Corp, 10/12)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-700">•</span>
                  <span>Add budget qualification to {rep.name.split(' ')[0]}'s next 3 pre-call checklists</span>
                </li>
              </ul>
            </div>
            <Button size="sm" data-testid="button-create-coaching">Create Coaching Task</Button>
          </div>
        </div>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Calls</h2>
        <Card>
          <div className="divide-y">
            <div className="grid grid-cols-4 gap-4 p-4 text-sm font-medium text-muted-foreground">
              <div>Date</div>
              <div>Deal Name</div>
              <div>Score</div>
              <div>Actions Completed</div>
            </div>
            {callsLoading ? (
              <div className="p-4">
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-8 bg-muted rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            ) : (
              recentCalls.map((call) => (
                <Link key={call.id} href={`/call/${call.id}`}>
                  <div
                    className="grid grid-cols-4 gap-4 p-4 text-sm hover-elevate active-elevate-2 cursor-pointer"
                    data-testid={`row-call-${call.id}`}
                  >
                    <div>{call.date}</div>
                    <div className="font-medium">{call.dealName}</div>
                    <div>
                      <span className={call.score >= 8 ? 'text-green-600 font-semibold' : call.score >= 6 ? 'text-yellow-600 font-semibold' : 'text-red-600 font-semibold'}>
                        {call.score}/10
                      </span>
                    </div>
                    <div className="text-muted-foreground">
                      {call.actionsCompleted}/{call.totalActions} actions
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  change,
  sublabel,
  prefix = '',
  suffix = '',
  testId
}: {
  label: string;
  value: string;
  change: number;
  sublabel: string;
  prefix?: string;
  suffix?: string;
  testId: string;
}) {
  const isPositive = change > 0;
  const isNeutral = change === 0;

  return (
    <Card className="p-4" data-testid={testId}>
      <div className="text-sm text-muted-foreground mb-1">{label}</div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="flex items-center gap-1 text-sm">
        {isNeutral ? (
          <Minus className="h-4 w-4 text-muted-foreground" />
        ) : isPositive ? (
          <TrendingUp className="h-4 w-4 text-green-600" />
        ) : (
          <TrendingDown className="h-4 w-4 text-red-600" />
        )}
        <span className={isNeutral ? 'text-muted-foreground' : isPositive ? 'text-green-600' : 'text-red-600'}>
          {isPositive ? '+' : ''}{prefix}{Math.abs(change)}{suffix}{isNeutral ? '' : '%'}
        </span>
        <span className="text-muted-foreground text-xs ml-1">{sublabel}</span>
      </div>
    </Card>
  );
}
