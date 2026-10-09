// ============================================================
// FreshGuard AI — Investigation Room: Challenge Panel
// ============================================================

import React from 'react';

export function ChallengeThisPanel() {
  const questions = [
    { id: 'q1', question: 'What evidence supports this diagnosis?', answer: 'Sales declined 18% while footfall declined only 5%. 12 fast-moving products are below required stock levels. A supplier delivery was reported late. Fresh-food wastage increased 28%.', icon: 'help' },
    { id: 'q2', question: 'What other explanations are possible?', answer: 'A seasonal shift in demand, competitive pricing pressure, customer experience issues, or internal staffing reductions.', icon: 'lightbulb' },
    { id: 'q3', question: 'What information is missing?', answer: 'Direct transaction-level data linking the late delivery to specific lost sales. Information on concurrent marketing or pricing changes.', icon: 'puzzle' },
    { id: 'q4', question: 'What happens if no action is taken?', answer: 'Revenue decline may continue as customers shift to competitors. Fresh-food wastage could increase, eroding margins. Compliance issues may escalate.', icon: 'alert' },
  ];

  const [expanded, setExpanded] = React.useState<string | null>('q1');

  return (
    <div>
      <h3 className="text-sm font-semibold mb-2">Challenge this diagnosis</h3>
      <p className="text-xs text-muted-foreground mb-3">Critical questions to test the strength of this investigation.</p>
      <div className="divide-y border border-border-subtle">
        {questions.map((q) => {
          const isExpanded = expanded === q.id;
          return (
            <button key={q.id} className="w-full flex items-start gap-3 p-4 text-left transition-colors hover:bg-muted/30" onClick={() => setExpanded(isExpanded ? null : q.id)}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isExpanded?'bg-accent-soft':'bg-muted'}`}>
                <QuestionIcon name={q.icon} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold">{q.question}</span>
                  <span className="text-xs text-muted-foreground">{isExpanded?'▲':'▼'}</span>
                </div>
                {isExpanded && <p className="text-sm text-muted-foreground leading-relaxed">{q.answer}</p>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function QuestionIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    help: <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.903-.542.104-.994.54-.994 1.096v1.096c0 .556.443 1 1.005 1h8.218c1.105 0 2.037-.869 2.037-1.94 0-.556-.443-1-1.005-1H9.234c-.558 0-.994-.444-.994-.994v-2.25z" /></svg>,
    lightbulb: <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m0 0v-4.5m0 4.5a6.01 6.01 0 01-1.5-.189m1.5.189a6.01 6.01 0 001.5-.189m0 0a6.01 6.01 0 00-1.5.189m2.25 4.5a6.01 6.01 0 01-1.5-.189m0 0v-2.25m0 2.25a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m0 0v-4.5m0 4.5a6.01 6.01 0 01-1.5-.189m1.5.189a6.01 6.01 0 001.5-.189M12 6.75a6.01 6.01 0 00-1.5-.189m1.5.189a6.01 6.01 0 001.5-.189m0 0a6.01 6.01 0 00-1.5.189M12 12a6.01 6.01 0 01-1.5-.189m1.5.189a6.01 6.01 0 001.5-.189m0 0a6.01 6.01 0 00-1.5.189" /></svg>,
    puzzle: <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 00-1 1v-1a1 1 0 01-1-1h3a2 2 0 100-4h-1a1 1 0 01-1-1v-3a1 1 0 011-1h3a1 1 0 011 1v1a1 1 0 01-1 1h-1a2 2 0 100-4h-1a1 1 0 01-1-1v-1a1 1 0 00-1-1z" /></svg>,
    alert: <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>,
  };
  return icons[name] || <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.903-.542.104-.994.54-.994 1.096v1.096c0 .556.443 1 1.005 1h8.218c1.105 0 2.037-.869 2.037-1.94 0-.556-.443-1-1.005-1H9.234c-.558 0-.994-.444-.994-.994v-2.25z" /></svg>;
}
