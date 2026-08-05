import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Icon } from "@/components/Icon";
import { removeFromStack, toggleReminder, useStack } from "@/lib/stack-store";
import type { Supplement } from "@/data/wisement";

export const Route = createFileRoute("/stack")({
  head: () => ({
    meta: [
      { title: "My Stack — WiseMent" },
      {
        name: "description",
        content:
          "Your active supplement stack with dosage, timing, reminders, refill status and monthly cost.",
      },
      { property: "og:title", content: "My Stack — WiseMent" },
      {
        property: "og:description",
        content: "Morning and evening routines, interaction checks and refill tracking.",
      },
    ],
  }),
  component: Stack,
});

const TONE: Record<string, string> = {
  primary: "bg-primary-fixed text-on-primary-fixed",
  secondary: "bg-secondary-fixed text-on-secondary-fixed",
  tertiary: "bg-tertiary-fixed text-on-tertiary-fixed",
};

function Card({ item }: { item: Supplement }) {
  return (
    <div className="rounded-xl bg-surface-container-lowest p-4 card-shadow">
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
            TONE[item.tone] ?? TONE["primary"]
          }`}
        >
          <Icon name={item.icon} className="text-[20px]" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-body font-medium text-on-surface">{item.name}</h3>
          <p className="caps mt-1 text-on-surface-variant">
            {item.dose} · {item.timing}
          </p>
        </div>
        <button
          type="button"
          onClick={() => removeFromStack(item.id)}
          aria-label={`Remove ${item.name}`}
          className="rounded-full p-1 text-on-surface-variant transition-colors hover:text-error"
        >
          <Icon name="close" className="text-[18px]" />
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="flex-1">
          <div className="mb-1 flex items-center justify-between">
            <span className="caps text-on-surface-variant">Refill</span>
            <span className="caps font-mono text-on-surface">{item.daysLeft}d left</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-variant">
            <div
              className={`h-full rounded-full ${item.daysLeft <= 14 ? "bg-error" : "bg-primary"}`}
              style={{ width: `${Math.min(100, (item.daysLeft / 30) * 100)}%` }}
            />
          </div>
        </div>
        <button
          type="button"
          onClick={() => toggleReminder(item.id)}
          className={`flex items-center gap-1 rounded-full px-3 py-1.5 caps transition-colors ${
            item.reminder
              ? "bg-primary text-on-primary"
              : "bg-surface-container text-on-surface-variant"
          }`}
        >
          <Icon name={item.reminder ? "notifications_active" : "notifications_off"} className="text-[14px]" />
          {item.reminder ? "On" : "Off"}
        </button>
      </div>
    </div>
  );
}

function Stack() {
  const stack = useStack();
  const morning = stack.filter((s) => s.routine === "Morning Routine");
  const evening = stack.filter((s) => s.routine === "Evening Routine");
  const cost = stack.reduce((sum, s) => sum + s.monthlyCost, 0);
  const lowStock = stack.filter((s) => s.daysLeft <= 14);

  return (
    <AppShell title="My Stack">
      <div className="flex w-full flex-col gap-8 px-5 py-4 fade-up">
        <header className="space-y-2">
          <h1 className="text-headline tracking-tight text-on-background">My Stack</h1>
          <p className="text-body text-on-surface-variant">
            {stack.length} active supplements · ${cost}/month
          </p>
        </header>

        <section className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-surface-container-high p-4">
            <p className="caps text-on-surface-variant">Monthly cost</p>
            <p className="mt-1 font-mono text-headline text-on-surface">${cost}</p>
          </div>
          <div className="rounded-xl bg-surface-container-high p-4">
            <p className="caps text-on-surface-variant">Interactions</p>
            <p className="mt-1 flex items-center gap-1 text-body text-primary">
              <Icon name="verified_user" className="text-[18px]" filled /> None found
            </p>
          </div>
        </section>

        {lowStock.length > 0 && (
          <div className="flex items-center gap-3 rounded-xl bg-error-container p-4">
            <Icon name="inventory_2" className="text-on-error-container" />
            <p className="flex-1 text-body text-on-error-container">
              {lowStock.map((s) => s.name).join(", ")} running low.
            </p>
            <span className="caps text-on-error-container">Reorder</span>
          </div>
        )}

        {[
          { label: "Morning Routine", icon: "wb_sunny", items: morning },
          { label: "Evening Routine", icon: "bedtime", items: evening },
        ].map((group) => (
          <section key={group.label} className="space-y-3">
            <h2 className="flex items-center gap-2 text-title text-on-surface">
              <Icon name={group.icon} className="text-[18px] text-on-surface-variant" />
              {group.label}
            </h2>
            {group.items.length === 0 ? (
              <p className="rounded-xl bg-surface-container-low p-4 text-body text-on-surface-variant">
                Nothing scheduled yet.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {group.items.map((item) => (
                  <Card key={item.id} item={item} />
                ))}
              </div>
            )}
          </section>
        ))}

        <Link
          to="/advisor"
          className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-body font-medium text-on-primary"
        >
          <Icon name="add" className="text-[20px]" />
          Find something to add
        </Link>
      </div>
    </AppShell>
  );
}
