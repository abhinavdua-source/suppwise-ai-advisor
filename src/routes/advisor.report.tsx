import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Icon } from "@/components/Icon";
import { DRIVERS, PROTOCOL } from "@/data/wisement";
import { addToStack, useStack } from "@/lib/stack-store";

export const Route = createFileRoute("/advisor/report")({
  head: () => ({
    meta: [
      { title: "Cognitive Fatigue Analysis — WiseMent" },
      {
        name: "description",
        content:
          "A structured report of possible causes, lifestyle changes, nutrition and supplement protocol for afternoon fatigue.",
      },
      { property: "og:title", content: "Cognitive Fatigue Analysis — WiseMent" },
      {
        property: "og:description",
        content: "Root-cause drivers, dosages, timing and evidence grades in one report.",
      },
    ],
  }),
  component: Report,
});

const LIFESTYLE = [
  {
    icon: "wb_sunny",
    title: "Morning light exposure",
    body: "10 minutes of outdoor light within 30 mins of waking to anchor cortisol rhythm.",
  },
  {
    icon: "local_cafe",
    title: "Delay caffeine 90 minutes",
    body: "Lets adenosine clear naturally and blunts the 3pm crash.",
  },
  {
    icon: "directions_walk",
    title: "Post-lunch 10 min walk",
    body: "Improves glucose disposal and reduces the post-prandial dip.",
  },
];

const NUTRITION = [
  { icon: "egg", title: "Protein-forward lunch", body: "40g protein, lower refined carbs." },
  { icon: "set_meal", title: "Oily fish 2x weekly", body: "Omega-3 for membrane fluidity." },
  { icon: "nutrition", title: "Iron + vitamin C pairing", body: "Improves non-heme absorption." },
];

function Report() {
  const stack = useStack();

  return (
    <AppShell title="Analysis" back="/advisor">
      <div className="flex w-full flex-col gap-10 px-5 py-4 fade-up">
        <header className="space-y-3">
          <span className="caps rounded-full bg-primary-fixed px-2 py-1 text-primary">
            [ 92% CONFIDENCE ]
          </span>
          <h1 className="text-headline tracking-tight text-on-background">
            Cognitive Fatigue Analysis
          </h1>
          <p className="text-body text-on-surface-variant">
            Based on your answers, sleep logs and last blood panel. Not a medical diagnosis.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-title text-on-surface">Possible Causes</h2>
          {DRIVERS.map((driver) => (
            <div key={driver.title} className="rounded-xl bg-surface-container p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Icon name={driver.icon} className="text-on-surface-variant" />
                  <h3 className="text-body font-medium text-on-surface">{driver.title}</h3>
                </div>
                <span className="caps text-on-surface-variant">{driver.weight}%</span>
              </div>
              <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-variant">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${driver.weight}%` }}
                />
              </div>
              <p className="text-body text-on-surface-variant">{driver.detail}</p>
            </div>
          ))}
        </section>

        <section className="space-y-3">
          <h2 className="text-title text-on-surface">Lifestyle Recommendations</h2>
          <div className="flex flex-col gap-3">
            {LIFESTYLE.map((item) => (
              <div key={item.title} className="flex gap-3 rounded-xl bg-surface-container-low p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-tertiary-fixed text-on-tertiary-fixed">
                  <Icon name={item.icon} className="text-[18px]" />
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
          <div className="grid grid-cols-1 gap-3">
            {NUTRITION.map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-3 rounded-xl bg-surface-container-low p-4"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary-fixed text-on-secondary-fixed">
                  <Icon name={item.icon} className="text-[18px]" />
                </div>
                <div>
                  <h3 className="text-body font-medium text-on-surface">{item.title}</h3>
                  <p className="caps mt-0.5 text-on-surface-variant">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-baseline justify-between">
            <h2 className="text-title text-on-surface">Supplement Protocol</h2>
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
                    <div>
                      <h3 className="text-body font-medium text-on-surface">{item.name}</h3>
                      <p className="caps mt-1 text-on-surface-variant">
                        {item.dose} · {item.timing}
                      </p>
                    </div>
                    <span className="caps rounded-full bg-primary-fixed px-2 py-1 text-primary">
                      Grade {item.evidence}
                    </span>
                  </div>
                  <p className="mt-3 text-body text-on-surface-variant">{item.why}</p>
                  <div className="mt-4 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => addToStack(item)}
                      disabled={added}
                      className={`flex flex-1 items-center justify-center gap-1 rounded-lg py-2.5 text-body font-medium transition-colors ${
                        added
                          ? "bg-surface-variant text-on-surface-variant"
                          : "bg-primary text-on-primary"
                      }`}
                    >
                      <Icon
                        name={added ? "check" : "add"}
                        className="text-[18px]"
                      />
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
