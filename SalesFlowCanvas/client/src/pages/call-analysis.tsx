import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Check, X, Target, Smile, AlertTriangle, Trophy, Users, Copy, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { CallDetail } from "@shared/schema";
import { useState, useEffect } from "react";

export default function CallAnalysis() {
  const [, params] = useRoute("/call/:id");
  const callId = params?.id;
  const { toast } = useToast();
  const [emailContent, setEmailContent] = useState("");

  const { data: callDetail, isLoading } = useQuery<CallDetail>({
    queryKey: [`/api/calls/${callId}`],
    enabled: !!callId,
  });

  useEffect(() => {
    if (callDetail?.followUpEmail) {
      setEmailContent(callDetail.followUpEmail);
    }
  }, [callDetail?.followUpEmail]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-48"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!callDetail) return null;

  const { call, transcript, actions, coachingTip, aiInsights, followUpEmail } = callDetail;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailContent);
    toast({
      title: "Copied to clipboard",
      description: "Email content copied successfully",
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <Link href={`/rep/${call.repId}`}>
        <Button variant="ghost" size="sm" className="mb-6" data-testid="button-back">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Rep Scorecard
        </Button>
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2" data-testid="text-call-title">{call.dealName} - Discovery Call</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{call.date}</span>
          <span>•</span>
          <span>{call.duration} mins</span>
          <span>•</span>
          <span>Participants: {call.participants.join(', ')}</span>
          <span>•</span>
          <Badge variant={call.score >= 8 ? "default" : call.score >= 6 ? "secondary" : "destructive"}>
            Score: {call.score}/10
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="transcript" className="mb-6">
        <TabsList data-testid="tabs-call-analysis">
          <TabsTrigger value="transcript" data-testid="tab-transcript">Transcript</TabsTrigger>
          <TabsTrigger value="actions" data-testid="tab-actions">Actions</TabsTrigger>
          <TabsTrigger value="insights" data-testid="tab-insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="transcript">
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
              <Card className="p-6 bg-muted/30">
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {transcript.map((entry, idx) => (
                    <div key={idx} className="space-y-1" data-testid={`transcript-entry-${idx}`}>
                      <div className="text-xs text-muted-foreground">
                        [{entry.timestamp}] <span className="font-semibold text-foreground">{entry.speaker}:</span>
                      </div>
                      <div className="text-sm text-foreground pl-4">{entry.text}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="space-y-4">
              <Card className="p-6" data-testid="card-actions-checklist">
                <h3 className="font-semibold mb-4">Playbook Actions</h3>
                <div className="space-y-3">
                  {actions.map((action, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      {action.completed ? (
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                      ) : (
                        <X className="h-5 w-5 text-red-600 flex-shrink-0" />
                      )}
                      <div className="flex-1 text-sm">
                        <div className={action.completed ? 'text-foreground' : 'font-medium'}>
                          {action.completed ? '' : 'Did NOT '}
                          {action.action}
                        </div>
                        {action.impactText && (
                          <div className="text-xs text-muted-foreground mt-0.5">
                            ({action.impactText})
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6 border-orange-500 bg-orange-50" data-testid="card-coaching-tip">
                <div className="flex gap-2 mb-3">
                  <Target className="h-5 w-5 text-orange-700 flex-shrink-0" />
                  <h3 className="font-semibold text-orange-900">Coaching Opportunity</h3>
                </div>
                <p className="text-sm text-orange-900 mb-3">
                  At {coachingTip.timestamp} when {coachingTip.context}, {coachingTip.suggestion}
                </p>
                {coachingTip.exampleLink && (
                  <a href="#" className="text-sm text-orange-700 hover:text-orange-800 flex items-center gap-1">
                    ▶ {coachingTip.exampleLink}
                  </a>
                )}
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="actions">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Action Completion Details</h3>
            <div className="space-y-4">
              {actions.map((action, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-md hover-elevate">
                  {action.completed ? (
                    <Check className="h-6 w-6 text-green-600 flex-shrink-0" />
                  ) : (
                    <X className="h-6 w-6 text-red-600 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <div className="font-medium">{action.action}</div>
                    {action.impactText && (
                      <div className="text-sm text-muted-foreground mt-1">
                        Impact: {action.impactText}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="insights">
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              {aiInsights.map((insight, idx) => (
                <Card key={idx} className="p-6" data-testid={`card-insight-${insight.type}`}>
                  <div className="text-3xl mb-2">{insight.icon}</div>
                  <div className="text-sm font-semibold mb-1">{insight.title}</div>
                  {Array.isArray(insight.value) ? (
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {insight.value.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-sm text-muted-foreground">{insight.value}</div>
                  )}
                </Card>
              ))}
            </div>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Detailed Analysis</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium mb-2">Call Flow Analysis</div>
                  <p className="text-sm text-muted-foreground">
                    The conversation followed a structured discovery pattern. The buyer showed positive engagement throughout, asking follow-up questions and sharing specific pain points. However, critical budget qualification was missed at the 28:30 mark when pricing concerns were raised.
                  </p>
                </div>
                <div>
                  <div className="text-sm font-medium mb-2">Opportunity Assessment</div>
                  <p className="text-sm text-muted-foreground">
                    High potential deal with engaged champion. Next steps should focus on multi-threading to CFO and addressing integration complexity concerns with technical resources.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">AI-Generated Follow-Up Email</h3>
        <Textarea
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
          className="min-h-[200px] mb-4 font-mono text-sm"
          data-testid="textarea-follow-up-email"
        />
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={handleCopyEmail} data-testid="button-copy-email">
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button size="sm" variant="secondary" data-testid="button-edit-email">
            Edit
          </Button>
          <Button size="sm" data-testid="button-send-email">
            <Send className="h-4 w-4 mr-2" />
            Send via Salesforce
          </Button>
        </div>
      </Card>
    </div>
  );
}
