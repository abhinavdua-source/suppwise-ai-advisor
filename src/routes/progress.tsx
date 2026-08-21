import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Icon } from "@/components/Icon";
import { useStack } from "@/lib/stack-store";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Progress — SuppWise" },
      {
        name: "description",
        content:
          "Track energy, sleep and focus over time, log how you feel and see adherence for your supplement stack.",
      },
      { property: "og:title", content: "Progress — SuppWise" },
      {
        property: "og:description",
        content: "Weekly trends, adherence rate and correlations between your stack and how you feel.",
      },
    ],
  }),
  component: Progress,
});

const SERIES: Record<string, number[]> = {
  Energy: [52, 58, 55, 64, 70, 68, 76],
  Sleep: [61, 59, 66, 63, 72, 78, 80],
  Focus: [48, 55, 51, 60, 66, 71, 74],
};

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

const HEALTH_METRICS = [
  { label: "Steps", value: "8,412", icon: "directions_walk" },
  { label: "Resting HR", value: "54 bpm", icon: "favorite" },
  { label: "HRV", value: "68 ms", icon: "monitor_heart" },
  { label: "Sleep", value: "7h 24m", icon: "bedtime" },
];

function Progress() {
  const [metric, setMetric] = useState<keyof typeof SERIES>("Energy");
  const [mood, setMood] = useState(4);
  const [logged, setLogged] = useState(false);
  const [health, setHealth] = useState<"off" | "syncing" | "on">("off");
  const stack = useStack();

  const connectHealth = () => {
    if (health !== "off") {
      setHealth("off");
      return;
    }
    setHealth("syncing");
    setTimeout(() => setHealth("on"), 1400);
  };

  const data = SERIES[metric] ?? [];
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * 100},${40 - (v / 100) * 36}`)
    .join(" ");
  const delta = data.length > 1 ? (data[data.length - 1] ?? 0) - (data[0] ?? 0) : 0;

  return (
    <AppShell title="Progress">
      <div className="flex w-full flex-col gap-8 px-5 py-4 fade-up">
        <header className="space-y-2">
          <h1 className="text-headline tracking-tight text-on-background">Progress</h1>
          <p className="text-body text-on-surface-variant">Last 7 days of subjective tracking.</p>
        </header>

        <section className="rounded-xl bg-surface-container-lowest p-4 card-shadow">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-full ${
                health === "on" ? "bg-primary text-on-primary" : "bg-error-container text-on-error-container"
              }`}
            >
              <Icon name="watch" filled={health === "on"} />
            </div>
            <div className="flex-1">
              <p className="text-body font-medium text-on-surface">Apple Health & Apple Watch</p>
              <p className="caps mt-0.5 text-on-surface-variant">
                {health === "on"
                  ? "Synced just now · Steps, HR, HRV, Sleep"
                  : health === "syncing"
                    ? "Requesting permissions…"
                    : "Import objective data automatically"}
              </p>
            </div>
            <button
              type="button"
              onClick={connectHealth}
              disabled={health === "syncing"}
              className={`caps rounded-full px-3 py-2 transition-colors ${
                health === "on"
                  ? "bg-surface-container text-on-surface-variant"
                  : "bg-primary text-on-primary"
              }`}
            >
              {health === "on" ? "Disconnect" : health === "syncing" ? "Syncing…" : "Connect"}
            </button>
          </div>

          {health === "on" && (
            <div className="mt-4 grid grid-cols-2 gap-2">
              {HEALTH_METRICS.map((m) => (
                <div
                  key={m.label}
                  className="flex items-center gap-3 rounded-xl bg-surface-container p-3"
                >
                  <Icon name={m.icon} className="text-[20px] text-primary" />
                  <div>
                    <p className="font-mono text-body text-on-surface">{m.value}</p>
                    <p className="caps text-[10px] text-on-surface-variant">{m.label}</p>
                  </div>
                </div>
              ))}
              <p className="caps col-span-2 text-on-surface-variant">
                SuppWise blends these with your logs to score supplement impact.
              </p>
            </div>
          )}
        </section>


        <section className="rounded-xl bg-surface-container-lowest p-4 card-shadow">
          <div className="mb-4 flex gap-2">
            {(Object.keys(SERIES) as (keyof typeof SERIES)[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMetric(m)}
                className={`caps rounded-full px-3 py-1.5 transition-colors ${
                  metric === m
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container text-on-surface-variant"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-mono text-headline text-on-surface">
              {data[data.length - 1]}
            </span>
            <span className="caps flex items-center gap-1 text-primary">
              <Icon name={delta >= 0 ? "trending_up" : "trending_down"} className="text-[14px]" />
              {delta >= 0 ? "+" : ""}
              {delta}% this week
            </span>
          </div>

          <svg className="mt-4 h-32 w-full text-primary" preserveAspectRatio="none" viewBox="0 0 100 40">
            <polyline
              points={`0,40 ${points} 100,40`}
              fill="currentColor"
              fillOpacity="0.08"
              stroke="none"
            />
            <polyline
              points={points}
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <div className="mt-2 flex justify-between">
            {DAYS.map((d, i) => (
              <span key={`${d}-${i}`} className="caps text-[10px] text-on-surface-variant">
                {d}
              </span>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-title text-on-surface">How do you feel today?</h2>
          <div className="rounded-xl bg-surface-container p-4">
            <div className="flex justify-between">
              {[1, 2, 3, 4, 5].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => {
                    setMood(v);
                    setLogged(false);
                  }}
                  aria-label={`Rate ${v} of 5`}
                  className={`flex h-12 w-12 items-center justify-center rounded-full text-body transition-transform active:scale-95 ${
                    mood === v
                      ? "bg-primary text-on-primary"
                      : "bg-surface-container-high text-on-surface-variant"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setLogged(true)}
              className="mt-4 w-full rounded-lg bg-primary py-2.5 text-body font-medium text-on-primary"
            >
              {logged ? "Logged for today" : "Log today"}
            </button>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-surface-container-high p-4">
            <p className="caps text-on-surface-variant">Adherence</p>
            <p className="mt-1 font-mono text-headline text-on-surface">92%</p>
            <p className="caps mt-1 text-on-surface-variant">{stack.length} supplements tracked</p>
          </div>
          <div className="rounded-xl bg-surface-container-high p-4">
            <p className="caps text-on-surface-variant">Streak</p>
            <p className="mt-1 font-mono text-headline text-on-surface">18d</p>
            <p className="caps mt-1 text-on-surface-variant">Personal best</p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-title text-on-surface">Correlations</h2>
          {[
            {
              icon: "science",
              title: "Magnesium ↑ deep sleep",
              body: "Nights you took magnesium averaged 34 min more deep sleep.",
            },
            {
              icon: "local_cafe",
              title: "Late caffeine ↓ energy",
              body: "Afternoon coffee days score 11% lower on next-day energy.",
            },
          ].map((c) => (
            <div key={c.title} className="flex gap-3 rounded-xl bg-surface-container-low p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-tertiary-fixed text-on-tertiary-fixed">
                <Icon name={c.icon} className="text-[18px]" />
              </div>
              <div>
                <h3 className="text-body font-medium text-on-surface">{c.title}</h3>
                <p className="mt-1 text-body text-on-surface-variant">{c.body}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
