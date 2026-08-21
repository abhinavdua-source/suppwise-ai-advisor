import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Icon } from "@/components/Icon";

type SearchParams = { q?: string | undefined };

export const Route = createFileRoute("/advisor/")({
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    q: typeof search["q"] === "string" ? search["q"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "AI Advisor — SuppWise" },
      {
        name: "description",
        content:
          "Describe your symptoms and SuppWise AI asks diagnostic follow-ups before suggesting an evidence-based protocol.",
      },
      { property: "og:title", content: "AI Advisor — SuppWise" },
      {
        property: "og:description",
        content: "Conversational root-cause analysis before any supplement recommendation.",
      },
    ],
  }),
  component: Advisor,
});

const SUGGESTIONS = [
  "I feel tired all the time",
  "I'm not recovering after workouts",
  "I can't lose fat",
  "I'm sleeping badly",
];

const QUESTIONS = [
  "Do you sleep less than 7 hours on average?",
  "Do you consume caffeine within 90 mins of waking?",
  "Have you had a comprehensive metabolic panel recently?",
];

type Phase = "empty" | "questions" | "analyzing" | "ready";

function Advisor() {
  const { q } = Route.useSearch();
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("empty");
  const [prompt, setPrompt] = useState("");
  const [draft, setDraft] = useState("");
  const [checked, setChecked] = useState<string[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const started = useRef(false);

  const send = (text: string) => {
    if (!text.trim()) return;
    setPrompt(text.trim());
    setDraft("");
    setChecked([]);
    setPhase("questions");
  };

  useEffect(() => {
    if (q && !started.current) {
      started.current = true;
      send(q);
    }
  }, [q]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [phase]);

  const analyze = () => {
    setPhase("analyzing");
    window.setTimeout(() => setPhase("ready"), 1600);
  };

  return (
    <AppShell title="AI Advisor">
      <div className="relative flex w-full flex-col">
        <div className="flex flex-1 flex-col gap-6 px-5 py-6 pb-56">
          {phase === "empty" ? (
            <div className="flex flex-col items-center justify-center gap-6 py-12 fade-up">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-fixed shadow-sm">
                <Icon name="psychology" className="text-[32px] text-on-primary-fixed" />
              </div>
              <div className="space-y-2 text-center">
                <h1 className="text-headline text-on-background">
                  What are you struggling with today?
                </h1>
                <p className="text-body text-on-surface-variant">
                  I can analyze your symptoms and suggest scientific protocols.
                </p>
              </div>
              <div className="mt-8 flex w-full flex-col gap-3">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="flex items-center justify-between rounded-xl bg-surface-container-low p-4 text-left text-on-background shadow-sm transition-colors hover:bg-surface-container"
                  >
                    <span className="text-body">&ldquo;{s}&rdquo;</span>
                    <Icon name="arrow_forward" className="text-on-surface-variant" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex w-full flex-col gap-6">
              <div className="flex w-full justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-surface-container-high px-4 py-3 text-on-background shadow-sm">
                  <p className="text-body">{prompt}</p>
                </div>
              </div>

              <div className="flex w-full flex-col gap-3 fade-up">
                <div className="flex items-center gap-2 px-1">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-container">
                    <Icon name="psychology" className="text-[14px] text-on-primary-container" />
                  </div>
                  <span className="caps text-on-surface-variant">SuppWise AI</span>
                  <span className="caps ml-auto rounded-full bg-primary-fixed px-2 py-0.5 text-primary">
                    [ 92% CONFIDENCE ]
                  </span>
                </div>
                <div className="max-w-[95%] space-y-4 rounded-2xl rounded-tl-sm bg-surface-container-lowest px-4 py-4 text-on-background shadow-sm">
                  <p className="text-body leading-relaxed">
                    Afternoon fatigue, often called the &ldquo;post-prandial dip,&rdquo; is common
                    but usually indicates sub-optimal metabolic or circadian alignment. To narrow
                    down the root cause, I need a bit more context.
                  </p>
                  <div className="space-y-3 rounded-xl bg-surface-container-low p-4">
                    <p className="caps text-on-surface-variant">Diagnostic Questions</p>
                    <div className="space-y-2">
                      {QUESTIONS.map((question) => (
                        <label
                          key={question}
                          className="flex cursor-pointer items-start gap-3 rounded-lg p-2 transition-colors hover:bg-surface"
                        >
                          <input
                            type="checkbox"
                            checked={checked.includes(question)}
                            onChange={() =>
                              setChecked((prev) =>
                                prev.includes(question)
                                  ? prev.filter((c) => c !== question)
                                  : [...prev, question],
                              )
                            }
                            className="mt-1 h-4 w-4 rounded accent-[var(--primary)]"
                          />
                          <span className="text-body text-on-surface">{question}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {[
                      { icon: "menu_book", label: "Circadian Rhythm" },
                      { icon: "science", label: "Adenosine Clearance" },
                    ].map((chip) => (
                      <span
                        key={chip.label}
                        className="caps inline-flex items-center gap-1 rounded-md bg-surface px-2 py-1 text-[10px] text-on-surface shadow-sm"
                      >
                        <Icon name={chip.icon} className="text-[12px]" />
                        {chip.label}
                      </span>
                    ))}
                  </div>
                  {phase === "questions" && (
                    <button
                      type="button"
                      onClick={analyze}
                      className="w-full rounded-lg bg-primary py-2.5 text-body font-medium text-on-primary"
                    >
                      Generate my analysis
                    </button>
                  )}
                </div>
              </div>

              {phase === "analyzing" && (
                <div className="flex w-full flex-col gap-3 opacity-70">
                  <div className="flex items-center gap-2 px-1">
                    <div className="flex h-6 w-6 animate-pulse items-center justify-center rounded-full bg-surface-container-high">
                      <Icon name="psychology" className="text-[14px] text-on-surface-variant" />
                    </div>
                    <span className="caps text-on-surface-variant">Analyzing input...</span>
                  </div>
                </div>
              )}

              {phase === "ready" && (
                <div className="flex w-full flex-col gap-3 fade-up">
                  <div className="flex items-center gap-2 px-1">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-container">
                      <Icon name="psychology" className="text-[14px] text-on-primary-container" />
                    </div>
                    <span className="caps text-on-surface-variant">SuppWise AI</span>
                  </div>
                  <div className="max-w-[95%] space-y-4 rounded-2xl rounded-tl-sm bg-surface-container-lowest px-4 py-4 shadow-sm">
                    <p className="text-body leading-relaxed text-on-background">
                      I&rsquo;ve cross-referenced your answers with your sleep logs and last blood
                      panel. Three drivers explain most of your fatigue.
                    </p>
                    <Link
                      to="/advisor/report"
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-body font-medium text-on-primary"
                    >
                      View full analysis
                      <Icon name="arrow_forward" className="text-[18px]" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="fixed right-0 bottom-16 left-0 z-40 mx-auto max-w-lg bg-gradient-to-t from-background via-background/95 to-transparent px-5 pt-8 pb-4">
          <div className="flex items-end gap-2 rounded-2xl bg-surface-container-lowest p-2 shadow-md transition-all focus-within:shadow-lg focus-within:ring-1 focus-within:ring-outline-variant">
            <button
              type="button"
              onClick={() => void navigate({ to: "/bloodwork" })}
              aria-label="Attach a blood report"
              className="shrink-0 rounded-full p-2 text-on-surface-variant transition-colors hover:text-primary"
            >
              <Icon name="add_circle" />
            </button>
            <textarea
              ref={inputRef}
              rows={1}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(draft);
                }
              }}
              className="max-h-32 w-full resize-none bg-transparent py-2 text-body text-on-background outline-none placeholder:text-on-surface-variant/50"
              placeholder="Describe your symptoms..."
            />
            <button
              type="button"
              onClick={() => send(draft)}
              aria-label="Send"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-on-primary shadow-sm transition-opacity hover:opacity-90"
            >
              <Icon name="arrow_upward" className="text-[20px]" />
            </button>
          </div>
          <div className="mt-2 text-center">
            <span className="caps text-[10px] text-on-surface-variant/60">
              Medical disclaimer: AI suggestions are for informational purposes only.
            </span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
