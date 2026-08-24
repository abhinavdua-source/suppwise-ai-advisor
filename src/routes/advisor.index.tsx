import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Icon } from "@/components/Icon";
import { getAnalysis, getFollowUps } from "@/lib/advisor.functions";
import type { Analysis, FollowUps } from "@/lib/advisor.server";
import { addToStack, isInStack } from "@/lib/stack-store";

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

type Phase = "empty" | "thinking" | "questions" | "analyzing" | "ready";

function slug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function Advisor() {
  const { q } = Route.useSearch();
  const navigate = useNavigate();
  const followUpsFn = useServerFn(getFollowUps);
  const analysisFn = useServerFn(getAnalysis);

  const [phase, setPhase] = useState<Phase>("empty");
  const [prompt, setPrompt] = useState("");
  const [draft, setDraft] = useState("");
  const [followUps, setFollowUps] = useState<FollowUps | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, forceRender] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const started = useRef(false);

  const send = (text: string) => {
    const concern = text.trim();
    if (!concern) return;
    setPrompt(concern);
    setDraft("");
    setFollowUps(null);
    setAnalysis(null);
    setAnswers([]);
    setError(null);
    setPhase("thinking");
    void followUpsFn({ data: { concern } })
      .then((res) => {
        setFollowUps(res);
        setAnswers(res.questions.map(() => "no"));
        setPhase("questions");
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
        setPhase("empty");
      });
  };

  useEffect(() => {
    if (q && !started.current) {
      started.current = true;
      send(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  useEffect(() => {
    if (phase === "empty") inputRef.current?.focus();
  }, [phase]);

  const analyze = () => {
    if (!followUps) return;
    setError(null);
    setPhase("analyzing");
    void analysisFn({
      data: {
        concern: prompt,
        intro: followUps.intro,
        answers: followUps.questions.map((question, i) => ({
          question,
          answer: answers[i] === "yes" ? "yes" : "no",
        })),
      },
    })
      .then((res) => {
        setAnalysis(res);
        setPhase("ready");
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : "Analysis failed. Please try again.");
        setPhase("questions");
      });
  };

  return (
    <AppShell title="AI Advisor">
      <div className="relative flex w-full flex-col">
        <div className="flex flex-1 flex-col gap-6 px-5 py-6 pb-56">
          {phase === "empty" && !prompt ? (
            <div className="fade-up flex flex-col items-center justify-center gap-6 py-12">
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
              {error && <p className="text-body text-error">{error}</p>}
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

              {phase === "thinking" && (
                <div className="flex items-center gap-2 px-1 opacity-70">
                  <div className="flex h-6 w-6 animate-pulse items-center justify-center rounded-full bg-surface-container-high">
                    <Icon name="psychology" className="text-[14px] text-on-surface-variant" />
                  </div>
                  <span className="caps text-on-surface-variant">Thinking about your case...</span>
                </div>
              )}

              {followUps && (
                <div className="fade-up flex w-full flex-col gap-3">
                  <div className="flex items-center gap-2 px-1">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-container">
                      <Icon name="psychology" className="text-[14px] text-on-primary-container" />
                    </div>
                    <span className="caps text-on-surface-variant">SuppWise AI</span>
                  </div>
                  <div className="max-w-[95%] space-y-4 rounded-2xl rounded-tl-sm bg-surface-container-lowest px-4 py-4 text-on-background shadow-sm">
                    <p className="text-body leading-relaxed">{followUps.intro}</p>
                    <div className="space-y-3 rounded-xl bg-surface-container-low p-4">
                      <p className="caps text-on-surface-variant">Diagnostic Questions</p>
                      <div className="space-y-2">
                        {followUps.questions.map((question, i) => (
                          <label
                            key={question}
                            className="flex cursor-pointer items-start gap-3 rounded-lg p-2 transition-colors hover:bg-surface"
                          >
                            <input
                              type="checkbox"
                              checked={answers[i] === "yes"}
                              onChange={() =>
                                setAnswers((prev) =>
                                  prev.map((a, idx) =>
                                    idx === i ? (a === "yes" ? "no" : "yes") : a,
                                  ),
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
                      {followUps.topics.map((topic) => (
                        <span
                          key={topic}
                          className="caps inline-flex items-center gap-1 rounded-md bg-surface px-2 py-1 text-[10px] text-on-surface shadow-sm"
                        >
                          <Icon name="science" className="text-[12px]" />
                          {topic}
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
              )}

              {error && <p className="px-1 text-body text-error">{error}</p>}

              {phase === "analyzing" && (
                <div className="flex items-center gap-2 px-1 opacity-70">
                  <div className="flex h-6 w-6 animate-pulse items-center justify-center rounded-full bg-surface-container-high">
                    <Icon name="psychology" className="text-[14px] text-on-surface-variant" />
                  </div>
                  <span className="caps text-on-surface-variant">
                    Cross-referencing your answers...
                  </span>
                </div>
              )}

              {analysis && phase === "ready" && (
                <div className="fade-up flex w-full flex-col gap-3">
                  <div className="flex items-center gap-2 px-1">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-container">
                      <Icon name="psychology" className="text-[14px] text-on-primary-container" />
                    </div>
                    <span className="caps text-on-surface-variant">SuppWise AI</span>
                  </div>
                  <div className="space-y-5 rounded-2xl rounded-tl-sm bg-surface-container-lowest px-4 py-4 shadow-sm">
                    <div className="space-y-1">
                      <h2 className="text-title text-on-background">{analysis.title}</h2>
                      <p className="text-body leading-relaxed text-on-surface-variant">
                        {analysis.summary}
                      </p>
                    </div>

                    {analysis.drivers.length > 0 && (
                      <section className="space-y-2">
                        <p className="caps text-on-surface-variant">Possible Causes</p>
                        {analysis.drivers.map((d) => (
                          <div key={d.name} className="space-y-1 rounded-xl bg-surface-container-low p-3">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-body font-medium text-on-background">
                                {d.name}
                              </span>
                              <span className="caps rounded-full bg-primary-fixed px-2 py-0.5 text-[10px] text-primary">
                                {Math.round(d.confidence)}%
                              </span>
                            </div>
                            <p className="text-body text-on-surface-variant">{d.detail}</p>
                          </div>
                        ))}
                      </section>
                    )}

                    {(
                      [
                        ["Lifestyle Recommendations", analysis.lifestyle],
                        ["Nutrition Suggestions", analysis.nutrition],
                      ] as const
                    ).map(([heading, items]) =>
                      items.length ? (
                        <section key={heading} className="space-y-2">
                          <p className="caps text-on-surface-variant">{heading}</p>
                          {items.map((item) => (
                            <div
                              key={item.title}
                              className="rounded-xl bg-surface-container-low p-3"
                            >
                              <p className="text-body font-medium text-on-background">
                                {item.title}
                              </p>
                              <p className="text-body text-on-surface-variant">{item.detail}</p>
                            </div>
                          ))}
                        </section>
                      ) : null,
                    )}

                    {analysis.supplements.length > 0 && (
                      <section className="space-y-2">
                        <p className="caps text-on-surface-variant">Supplement Recommendations</p>
                        {analysis.supplements.map((s) => {
                          const id = slug(s.name);
                          const added = isInStack(id);
                          return (
                            <div
                              key={s.name}
                              className="space-y-2 rounded-xl bg-surface-container-low p-3"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="text-body font-medium text-on-background">
                                    {s.name}
                                  </p>
                                  <p className="caps text-on-surface-variant">
                                    {s.dose} · {s.timing}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  disabled={added}
                                  onClick={() => {
                                    addToStack({
                                      id,
                                      name: s.name,
                                      icon: "medication",
                                      category: "AI Recommended",
                                      dose: s.dose,
                                      timing: s.timing,
                                      routine: /even|night|bed/i.test(s.timing)
                                        ? "Evening Routine"
                                        : "Morning Routine",
                                      daysLeft: 30,
                                      monthlyCost: 15,
                                      reminder: true,
                                      tone: "primary",
                                    });
                                    forceRender((n) => n + 1);
                                  }}
                                  className="caps shrink-0 rounded-lg bg-primary px-3 py-1.5 text-[10px] text-on-primary disabled:opacity-50"
                                >
                                  {added ? "In stack" : "Add"}
                                </button>
                              </div>
                              <p className="text-body text-on-surface-variant">{s.why}</p>
                              <p className="caps text-[10px] text-on-surface-variant">
                                Evidence: {s.evidence}
                              </p>
                            </div>
                          );
                        })}
                      </section>
                    )}
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
