import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Icon } from "@/components/Icon";
import { BEHAVIOURS, DRIVERS, NUTRITION, PROTOCOL } from "@/data/wisement";
import { addToStack, useStack } from "@/lib/stack-store";

export const Route = createFileRoute("/advisor/report")({
  head: () => ({
    meta: [
      { title: "Cognitive Fatigue Analysis — SuppWise" },
      {
        name: "description",
        content:
          "A structured report of possible causes, lifestyle changes, nutrition and a supplement protocol for afternoon fatigue.",
      },
      { property: "og:title", content: "Cognitive Fatigue Analysis — SuppWise" },
      {
        property: "og:description",
        content: "Root-cause drivers, dosages, timing and evidence grades in one report.",
      },
    ],
  }),
  component: Report,
});

const TONE_BG: Record<string, string> = {
  error: "bg-error-container text-on-error-container",
  secondary: "bg-secondary-fixed text-on-secondary-fixed",
  outline: "bg-surface-variant text-on-surface",
};

function Report() {
  const stack = useStack();

  return (
    <AppShell title="Analysis" back={{ to: "/advisor", label: "Back to advisor" }}>
      <div className="flex w-full flex-col gap-10 px-5 py-4 fade-up">
        <header className="space-y-3">
          <span className="caps inline-block rounded-full bg-primary-fixed px-2 py-1 text-primary">
            [ 92% CONFIDENCE ]
          </span>
          <h1 className="text-headline tracking-tight text-on-background">
            Cognitive Fatigue Analysis
          </h1>
          <p className="text-body text-on-surface-variant">
            Built from your answers, sleep logs and last blood panel. Informational, not a
            diagnosis.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-title text-on-surface">Possible Causes</h2>
          {DRIVERS.map((driver) => (
            <div key={driver.title} className="rounded-xl bg-surface-container p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    TONE_BG[driver.tone] ?? TONE_BG["outline"]
                  }`}
                >
                  <Icon name={driver.icon} className="text-[20px]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-body font-medium text-on-surface">{driver.title}</h3>
                  <p className="caps mt-0.5 text-on-surface-variant">{driver.subtitle}</p>
                </div>
                <span className="caps text-on-surface-variant">{driver.level}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-variant">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${driver.confidence}%` }}
                />
              </div>
              <p className="caps mt-2 text-on-surface-variant">
                {driver.confidence}% contribution
              </p>
            </div>
          ))}
        </section>

        <section className="space-y-3">
          <h2 className="text-title text-on-surface">Lifestyle Recommendations</h2>
          <div className="flex flex-col gap-3">
            {BEHAVIOURS.map((item, i) => (
              <div key={item.title} className="flex gap-3 rounded-xl bg-surface-container-low p-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-tertiary-fixed font-mono text-[12px] text-on-tertiary-fixed">
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-body font-medium text-on-surface">{item.title}</h3>
                  <p className="mt-1 text-body text-on-surface-variant">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-title text-on-surface">Nutrition Suggestions</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-surface-container-low p-4">
              <p className="caps mb-2 flex items-center gap-1 text-primary">
                <Icon name="add_circle" className="text-[14px]" /> Increase
              </p>
              <ul className="space-y-1">
                {NUTRITION.increase.map((n) => (
                  <li key={n} className="text-body text-on-surface">
                    {n}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl bg-surface-container-low p-4">
              <p className="caps mb-2 flex items-center gap-1 text-on-surface-variant">
                <Icon name="do_not_disturb_on" className="text-[14px]" /> Reduce
              </p>
              <ul className="space-y-1">
                {NUTRITION.reduce.map((n) => (
                  <li key={n} className="text-body text-on-surface">
                    {n}
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 rounded-xl bg-surface-container-high p-4">
              <p className="caps mb-1 text-on-surface-variant">Daily macro target</p>
              <p className="font-mono text-body text-on-surface">{NUTRITION.macros}</p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-baseline justify-between">
            <h2 className="text-title text-on-surface">Supplement Recommendations</h2>
            <span className="caps text-on-surface-variant">{PROTOCOL.length} items</span>
          </div>
          <div className="flex flex-col gap-3">
            {PROTOCOL.map((item) => {
              const added = stack.some((s) => s.id === item.id);
              return (
                <div
                  key={item.id}
                  className="rounded-xl bg-surface-container-lowest p-4 card-shadow"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-fixed text-on-primary-fixed">
                        <Icon name={item.icon} className="text-[20px]" />
                      </div>
                      <div>
                        <h3 className="text-body font-medium text-on-surface">{item.name}</h3>
                        <p className="caps mt-1 text-on-surface-variant">
                          {item.dose} · {item.timing}
                        </p>
                      </div>
                    </div>
                    <span className="caps shrink-0 rounded-full bg-primary-fixed px-2 py-1 text-primary">
                      {item.match}% match
                    </span>
                  </div>

                  <p className="mt-3 text-body text-on-surface-variant">{item.rationale}</p>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-surface-container p-3">
                      <p className="caps text-on-surface-variant">Expected effect</p>
                      <p className="mt-1 text-body text-on-surface">{item.expected}</p>
                    </div>
                    <div className="rounded-lg bg-surface-container p-3">
                      <p className="caps text-on-surface-variant">Evidence</p>
                      <p className="mt-1 flex items-center gap-1 text-body text-on-surface">
                        <Icon name="verified" className="text-[16px] text-primary" filled />
                        {item.evidenceLabel}
                      </p>
                    </div>
                  </div>

                  <details className="group mt-3 rounded-lg bg-surface-container-low p-3">
                    <summary className="caps flex cursor-pointer list-none items-center justify-between text-on-surface-variant">
                      Safety &amp; interactions
                      <Icon
                        name="expand_more"
                        className="text-[18px] transition-transform group-open:rotate-180"
                      />
                    </summary>
                    <div className="mt-3 space-y-2">
                      <p className="text-body text-on-surface-variant">
                        <span className="text-on-surface">Side effects:</span> {item.sideEffects}
                      </p>
                      <p className="text-body text-on-surface-variant">
                        <span className="text-on-surface">Interactions:</span> {item.interactions}
                      </p>
                      <p className="text-body text-on-surface-variant">
                        <span className="text-on-surface">Who should avoid:</span> {item.avoid}
                      </p>
                    </div>
                  </details>

                  <div className="mt-4 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        addToStack({
                          id: item.id,
                          name: item.name,
                          icon: item.icon,
                          category: item.category,
                          dose: item.dose,
                          timing: item.timing,
                          routine: item.routine,
                          daysLeft: 30,
                          monthlyCost: 15,
                          reminder: true,
                          tone: item.tone,
                        })
                      }
                      disabled={added}
                      className={`flex flex-1 items-center justify-center gap-1 rounded-lg py-2.5 text-body font-medium transition-colors ${
                        added
                          ? "bg-surface-variant text-on-surface-variant"
                          : "bg-primary text-on-primary"
                      }`}
                    >
                      <Icon name={added ? "check" : "add"} className="text-[18px]" />
                      {added ? "In your stack" : "Add to stack"}
                    </button>
                    <Link
                      to="/evidence/$id"
                      params={{ id: item.id }}
                      className="flex items-center justify-center gap-1 rounded-lg border border-outline-variant px-4 py-2.5 text-body text-on-surface"
                    >
                      <Icon name="menu_book" className="text-[18px]" />
                      Evidence
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <p className="caps pb-4 text-center text-[10px] text-on-surface-variant/60">
          Informational only — consult a clinician before changing medication or supplements.
        </p>
      </div>
    </AppShell>
  );
}
