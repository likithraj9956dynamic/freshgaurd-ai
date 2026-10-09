// ============================================================
// FreshGuard AI — Components: Challenge This Panel
// ============================================================

import React from 'react';
import { HelpCircle, Lightbulb, Puzzle, AlertTriangle } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  answer: string;
  icon: React.ElementType;
}

export function ChallengeThisPanel() {
  const questions: Question[] = [
    {
      id: 'q1',
      question: 'What evidence supports this diagnosis?',
      answer: 'Sales declined 18% while footfall declined only 5%. Twelve fast-moving products are below required stock levels. A supplier delivery (CF-10482) was reported late. Fresh-food wastage increased 28%.',
      icon: HelpCircle,
    },
    {
      id: 'q2',
      question: 'What other explanations are possible?',
      answer: 'A seasonal shift in demand, competitive pricing pressure, customer experience issues unrelated to product availability, or internal staffing reductions during peak periods.',
      icon: Lightbulb,
    },
    {
      id: 'q3',
      question: 'What information is missing?',
      answer: 'Direct transaction-level data linking the late delivery to specific lost sales. Information on concurrent marketing or pricing changes. Customer feedback data beyond the store manager\'s report.',
      icon: Puzzle,
    },
    {
      id: 'q4',
      question: 'What happens if no action is taken?',
      answer: 'Revenue decline may continue as customers shift to competitors. Fresh-food wastage could increase further, eroding margins. Compliance issues may escalate and attract regulatory attention.',
      icon: AlertTriangle,
    },
  ];

  const [expanded, setExpanded] = React.useState<string | null>('q1');

  return (
    <div className="rounded-lg border border-border-subtle bg-white">
      <div className="px-4 py-3 border-b border-border-subtle">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-accent" />
          Challenge This Diagnosis
        </h3>
        <p className="text-xs text-muted-foreground">
          Critical questions to test the strength of this investigation.
        </p>
      </div>
      <div className="divide-y border-border-subtle">
        {questions.map((q) => {
          const isExpanded = expanded === q.id;
          return (
            <button
              key={q.id}
              className="w-full flex items-start gap-3 p-4 text-left transition-colors hover:bg-muted/30"
              onClick={() => setExpanded(isExpanded ? null : q.id)}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isExpanded ? 'bg-accent-soft' : 'bg-muted'
                }`}
              >
                <q.icon className="w-4 h-4 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold">{q.question}</h4>
                  <span className="text-xs text-muted-foreground">
                    {isExpanded ? '▲' : '▼'}
                  </span>
                </div>
                {isExpanded && (
                  <p className="text-sm text-muted-foreground leading-relaxed">{q.answer}</p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
