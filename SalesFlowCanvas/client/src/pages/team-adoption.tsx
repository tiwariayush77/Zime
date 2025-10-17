import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { StageActions, CoachingPriority, AdoptionTrend } from "@shared/schema";

export default function TeamAdoption() {
  const { data: stageActions = [], isLoading: actionsLoading } = useQuery<StageActions[]>({
    queryKey: ["/api/team/actions"],
  });

  const { data: coachingPriorities = [], isLoading: prioritiesLoading } = useQuery<CoachingPriority[]>({
    queryKey: ["/api/team/coaching-priorities"],
  });

  const { data: adoptionTrends = [], isLoading: trendsLoading } = useQuery<AdoptionTrend[]>({
    queryKey: ["/api/team/adoption-trends"],
  });

  return (
    <div className="min-h-screen bg-background p-6">
      <Link href="/">
        <Button variant="ghost" size="sm" className="mb-6" data-testid="button-back">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Dashboard
        </Button>
      </Link>

      <h1 className="text-3xl font-bold mb-6" data-testid="text-page-title">Team Playbook Adoption Trends</h1>

      <Card className="p-6 mb-6" data-testid="card-adoption-trend">
        <h2 className="text-lg font-semibold mb-4">Playbook Adoption - Last 4 Weeks</h2>
        <div className="bg-muted/30 rounded-lg p-8 flex items-center justify-center min-h-[200px] border-2 border-dashed border-muted-foreground/20">
          <div className="text-center text-muted-foreground">
            <div className="text-sm font-medium mb-2">Chart showing rep adoption trends over time</div>
            <div className="text-xs">(Visualization placeholder)</div>
          </div>
        </div>
        {trendsLoading ? (
          <div className="mt-4 h-6 bg-muted rounded animate-pulse"></div>
        ) : (
          <div className="mt-4 text-sm text-muted-foreground">
            {adoptionTrends.map((trend, idx) => (
              <span key={idx}>
                {idx > 0 && ' | '}
                <span className="font-medium text-foreground">{trend.repName}</span>: {trend.startAdoption}% → {trend.endAdoption}% (
                <span className={trend.change > 0 ? 'text-green-600' : 'text-red-600'}>
                  {trend.change > 0 ? '+' : ''}{trend.change}%
                </span>)
              </span>
            ))}
          </div>
        )}
      </Card>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Action Breakdown by Stage</h2>
        <div className="space-y-4">
          {actionsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-muted rounded animate-pulse"></div>
              ))}
            </div>
          ) : (
            stageActions.map((stage) => (
              <Card key={stage.stage} className="overflow-hidden" data-testid={`card-stage-${stage.stage.toLowerCase()}`}>
                <div className="bg-muted/50 px-6 py-3 border-b">
                  <h3 className="font-semibold">{stage.stage} Stage Actions</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/30">
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Action</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Team Avg</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground w-1/3">Completion Rate</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Impact on Win Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stage.actions.map((action, idx) => (
                        <tr key={idx} className="border-b last:border-0 hover-elevate">
                          <td className="p-4 text-sm font-medium">{action.action}</td>
                          <td className="p-4 text-sm">
                            <span className={
                              action.completionRate >= 80 ? 'text-green-600 font-semibold' :
                              action.completionRate >= 60 ? 'text-yellow-600 font-semibold' :
                              'text-red-600 font-semibold'
                            }>
                              {action.completionRate}%
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
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
                          </td>
                          <td className="p-4 text-sm text-green-600 font-medium">
                            +{action.impactOnWinRate}% win rate
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Top Coaching Opportunities (Ranked by Impact)</h2>
        {prioritiesLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted rounded animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {coachingPriorities.map((priority) => (
              <Card key={priority.rank} className="p-6" data-testid={`card-priority-${priority.rank}`}>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                      {priority.rank}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">
                      {priority.title} ({priority.stage})
                    </h3>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span className="text-red-600 font-medium">→</span>
                        <span>{priority.skipRate}% of reps skip this action</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-red-600 font-medium">→</span>
                        <span>Skipping reduces win rate by {priority.impactOnWinRate}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-red-600 font-medium">→</span>
                        <span>Affects: {priority.affectedReps.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
