import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Icon } from "@/components/Icon";
import { useStack } from "@/lib/stack-store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile & Premium — SuppWise" },
      {
        name: "description",
        content:
          "Manage your goals, health context, reminders and unlock SuppWise Premium for deeper analysis.",
      },
      { property: "og:title", content: "Profile & Premium — SuppWise" },
      {
        property: "og:description",
        content: "Personal health context, preferences and premium AI features.",
      },
    ],
  }),
  component: Profile,
});

const PREMIUM = [
  { icon: "biotech", title: "Deep blood panel analysis", body: "Full biomarker interpretation with trend tracking." },
  { icon: "insights", title: "Advanced correlations", body: "See what actually moves your energy and sleep." },
  { icon: "medication_liquid", title: "Interaction checker", body: "Cross-check supplements with medication." },
  { icon: "support_agent", title: "Unlimited AI consultations", body: "No cap on advisor sessions or reports." },
];

function Profile() {
  const stack = useStack();
  const [reminders, setReminders] = useState(true);
  const [weekly, setWeekly] = useState(false);

  return (
    <AppShell title="Profile">
      <div className="flex w-full flex-col gap-8 px-5 py-4 fade-up">
        <header className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-on-primary">
            <Icon name="person" className="text-[32px]" filled />
          </div>
          <div>
            <h1 className="text-title text-on-background">Alex Mercer</h1>
            <p className="caps mt-1 text-on-surface-variant">
              32 · Male · {stack.length} supplements
            </p>
          </div>
        </header>

        <section className="grid grid-cols-3 gap-3">
          {[
            { label: "Streak", value: "18d" },
            { label: "Adherence", value: "92%" },
            { label: "Reports", value: "7" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-surface-container-high p-3 text-center">
              <p className="font-mono text-title text-on-surface">{s.value}</p>
              <p className="caps mt-1 text-on-surface-variant">{s.label}</p>
            </div>
          ))}
        </section>

        <section className="space-y-3">
          <h2 className="text-title text-on-surface">Health context</h2>
          <div className="divide-y divide-outline-variant/40 overflow-hidden rounded-xl bg-surface-container-lowest card-shadow">
            {[
              { icon: "flag", label: "Primary goal", value: "Increase energy" },
              { icon: "restaurant", label: "Diet", value: "Omnivore, low dairy" },
              { icon: "medication", label: "Medication", value: "None" },
              { icon: "warning", label: "Allergies", value: "Shellfish" },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-3 p-4">
                <Icon name={row.icon} className="text-on-surface-variant" />
                <span className="flex-1 text-body text-on-surface">{row.label}</span>
                <span className="text-body text-on-surface-variant">{row.value}</span>
                <Icon name="chevron_right" className="text-[18px] text-outline" />
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-title text-on-surface">Preferences</h2>
          <div className="divide-y divide-outline-variant/40 overflow-hidden rounded-xl bg-surface-container-lowest card-shadow">
            {[
              { label: "Supplement reminders", value: reminders, set: setReminders },
              { label: "Weekly progress email", value: weekly, set: setWeekly },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-3 p-4">
                <span className="flex-1 text-body text-on-surface">{row.label}</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={row.value}
                  aria-label={row.label}
                  onClick={() => row.set(!row.value)}
                  className={`h-6 w-11 rounded-full p-0.5 transition-colors ${
                    row.value ? "bg-primary" : "bg-surface-variant"
                  }`}
                >
                  <span
                    className={`block h-5 w-5 rounded-full bg-surface-container-lowest shadow-sm transition-transform ${
                      row.value ? "translate-x-5" : ""
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3 rounded-2xl bg-primary p-5 text-on-primary">
          <span className="caps rounded-full bg-on-primary/15 px-2 py-1">SuppWise Premium</span>
          <h2 className="text-title">Go deeper on your data</h2>
          <div className="flex flex-col gap-3 pt-1">
            {PREMIUM.map((f) => (
              <div key={f.title} className="flex gap-3">
                <Icon name={f.icon} className="text-[20px] opacity-80" />
                <div>
                  <p className="text-body font-medium">{f.title}</p>
                  <p className="text-body opacity-70">{f.body}</p>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="mt-2 w-full rounded-xl bg-on-primary py-3 text-body font-medium text-primary"
          >
            Try free for 7 days
          </button>
          <p className="caps text-center opacity-60">Then $9.99/month · Cancel anytime</p>
        </section>

        <section className="divide-y divide-outline-variant/40 overflow-hidden rounded-xl bg-surface-container-lowest card-shadow">
          {[
            { icon: "bloodtype", label: "Blood test analysis", to: "/bloodwork" as const },
            { icon: "medication", label: "My stack", to: "/stack" as const },
            { icon: "monitoring", label: "Progress", to: "/progress" as const },
          ].map((row) => (
            <Link key={row.label} to={row.to} className="flex items-center gap-3 p-4">
              <Icon name={row.icon} className="text-on-surface-variant" />
              <span className="flex-1 text-body text-on-surface">{row.label}</span>
              <Icon name="chevron_right" className="text-[18px] text-outline" />
            </Link>
          ))}
        </section>

        <p className="caps pb-4 text-center text-[10px] text-on-surface-variant/60">
          SuppWise prototype · Demo data only
        </p>
      </div>
    </AppShell>
  );
}
