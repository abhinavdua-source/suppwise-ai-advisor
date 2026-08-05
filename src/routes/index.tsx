import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Icon } from "@/components/Icon";
import { ARTICLES } from "@/data/wisement";
import { useStack } from "@/lib/stack-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WiseMent — Your Daily Vitality Overview" },
      {
        name: "description",
        content:
          "Track habits, review your supplement stack and ask WiseMent AI why you feel the way you do.",
      },
      { property: "og:title", content: "WiseMent — Your Daily Vitality Overview" },
      {
        property: "og:description",
        content: "Habits, stack, energy trends and evidence-based research in one place.",
      },
    ],
  }),
  component: Home,
});

const HABITS = [
  { id: "water", icon: "water_drop", label: "Water" },
  { id: "sleep", icon: "bedtime", label: "Sleep" },
  { id: "supps", icon: "medication", label: "Supps" },
  { id: "move", icon: "directions_run", label: "Move" },
];

const GOALS = [
  { title: "Improve Sleep", sub: "Deep & REM", icon: "bed", bg: "bg-tertiary-fixed", fg: "text-on-tertiary-fixed" },
  { title: "Gain Muscle", sub: "Hypertrophy", icon: "fitness_center", bg: "bg-secondary-fixed", fg: "text-on-secondary-fixed" },
  { title: "Lose Fat", sub: "Metabolic Rate", icon: "monitor_weight", bg: "bg-primary-fixed", fg: "text-on-primary-fixed" },
  { title: "Increase Energy", sub: "ATP Production", icon: "bolt", bg: "bg-error-container", fg: "text-on-error-container" },
  { title: "Better Recovery", sub: "Inflammation", icon: "healing", bg: "bg-surface-variant", fg: "text-on-surface" },
  { title: "Brain Focus", sub: "Nootropics", icon: "psychology", bg: "bg-primary-fixed-dim", fg: "text-on-primary-fixed-variant" },
];

function Home() {
  const [done, setDone] = useState<string[]>(HABITS.map((h) => h.id));
  const [query, setQuery] = useState("");
  const stack = useStack();
  const navigate = useNavigate();

  const ask = () => {
    void navigate({
      to: "/advisor",
      search: query.trim() ? { q: query.trim() } : undefined,
    });
  };

  return (
    <AppShell title="Home">
      <div className="flex w-full flex-col fade-up">
        <section className="mb-12 px-5 pt-2">
          <h1 className="mb-2 text-headline tracking-tight text-on-background">Good morning, Alex.</h1>
          <p className="text-body text-on-surface-variant">Here is your daily vitality overview.</p>
        </section>

        <section className="mb-12 px-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-title text-on-surface">Daily Habits</h2>
            <span className="caps rounded-full bg-tertiary-fixed-dim px-2 py-1 text-on-tertiary-container">
              {done.length}/4 Completed
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {HABITS.map((habit) => {
              const active = done.includes(habit.id);
              return (
                <button
                  key={habit.id}
                  type="button"
                  onClick={() =>
                    setDone((prev) =>
                      prev.includes(habit.id)
                        ? prev.filter((id) => id !== habit.id)
                        : [...prev, habit.id],
                    )
                  }
                  className={`flex flex-col items-center justify-center gap-2 rounded-xl p-3 shadow-sm transition-transform active:scale-95 ${
                    active
                      ? "bg-primary text-on-primary"
                      : "bg-surface-container text-on-surface-variant"
                  }`}
                >
                  <Icon name={habit.icon} className="text-[24px]" filled={active} />
                  <span className="caps text-[10px]">{habit.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mb-12 px-5">
          <div className="relative w-full">
            <Icon
              name="search"
              className="absolute top-1/2 left-4 -translate-y-1/2 text-on-surface-variant"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") ask();
              }}
              className="w-full rounded-xl bg-surface-container-high py-4 pr-16 pl-12 text-body text-on-surface shadow-sm transition-shadow outline-none placeholder:text-on-surface-variant focus:ring-2 focus:ring-primary-fixed"
              placeholder="What can I help you with today?"
              type="text"
            />
            <button
              type="button"
              onClick={ask}
              aria-label="Ask WiseMent AI"
              className="absolute top-1/2 right-2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg bg-primary text-on-primary shadow-md"
            >
              <Icon name="arrow_forward" className="text-[20px]" />
            </button>
          </div>
        </section>

        <section className="mb-12 px-5">
          <h2 className="mb-3 text-title text-on-surface">Optimization Goals</h2>
          <div className="grid grid-cols-2 gap-3">
            {GOALS.map((goal) => (
              <Link
                key={goal.title}
                to="/advisor"
                search={{ q: `Which supplements help me ${goal.title.toLowerCase()}?` }}
                className="flex flex-col gap-3 rounded-xl bg-surface-container p-4 shadow-sm transition-colors active:bg-surface-variant"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${goal.bg} ${goal.fg}`}
                >
                  <Icon name={goal.icon} />
                </div>
                <div>
                  <h3 className="text-body font-medium text-on-surface">{goal.title}</h3>
                  <p className="caps mt-1 text-on-surface-variant">{goal.sub}</p>
                </div>
              </Link>
            ))}
            <Link
              to="/bloodwork"
              className="col-span-2 flex items-center gap-3 rounded-xl bg-primary p-4 shadow-sm"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-on-primary/15 text-on-primary">
                <Icon name="bloodtype" />
              </div>
              <div className="flex-1">
                <h3 className="text-body font-medium text-on-primary">Blood Test Review</h3>
                <p className="caps mt-1 text-on-primary/70">Biomarker analysis</p>
              </div>
              <Icon name="arrow_forward" className="text-on-primary" />
            </Link>
          </div>
        </section>

        <section className="mb-12 grid grid-cols-2 gap-3 px-5">
          <Link
            to="/stack"
            className="relative overflow-hidden rounded-xl bg-surface-container-high p-4 shadow-sm"
          >
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <Icon name="science" className="text-[80px]" />
            </div>
            <h3 className="caps mb-2 text-on-surface-variant">Current Stack</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-headline text-on-surface">{stack.length}</span>
              <span className="text-body text-on-surface-variant">supplements</span>
            </div>
            <p className="caps mt-2 flex items-center gap-1 text-[10px] text-primary">
              <Icon name="check_circle" className="text-[12px]" /> All taken today
            </p>
          </Link>

          <Link
            to="/progress"
            className="flex flex-col justify-between rounded-xl bg-surface-container-high p-4 shadow-sm"
          >
            <h3 className="caps mb-2 text-on-surface-variant">Energy Levels</h3>
            <div className="relative flex h-12 w-full flex-1 items-end">
              <svg
                className="h-full w-full text-secondary"
                preserveAspectRatio="none"
                viewBox="0 0 100 40"
              >
                <path
                  d="M0 35 Q10 20 20 25 T40 15 T60 20 T80 5 T100 10 L100 40 L0 40 Z"
                  fill="currentColor"
                  fillOpacity="0.1"
                />
                <path
                  d="M0 35 Q10 20 20 25 T40 15 T60 20 T80 5 T100 10"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <p className="caps mt-1 flex items-center gap-1 text-[10px] text-secondary">
              <Icon name="trending_up" className="text-[12px]" /> +12% this week
            </p>
          </Link>
        </section>

        <section className="mb-12 px-5">
          <div className="flex items-center justify-between rounded-xl bg-surface-container-lowest p-4 card-shadow">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-fixed text-on-secondary-fixed">
                <Icon name="alarm" filled />
              </div>
              <div>
                <p className="text-body font-medium text-on-surface">Evening reminder</p>
                <p className="caps mt-0.5 text-on-surface-variant">Magnesium · 21:30</p>
              </div>
            </div>
            <Link to="/stack" className="caps text-primary">
              Manage
            </Link>
          </div>
        </section>

        <section className="px-5">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-title text-on-surface">Trending Research</h2>
            <span className="caps text-primary">View All</span>
          </div>
          <div className="flex flex-col gap-4">
            {ARTICLES.map((article) => (
              <article
                key={article.title}
                className="flex gap-4 rounded-xl bg-surface-container p-4 shadow-sm"
              >
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-surface">
                  <div
                    className="h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: `url('${article.image}')` }}
                    role="img"
                    aria-label={article.title}
                  />
                </div>
                <div className="flex flex-col justify-center py-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="caps flex items-center gap-1 rounded-full bg-tertiary-fixed px-2 py-0.5 text-[10px] text-on-tertiary-fixed">
                      <Icon name={article.tagIcon} className="text-[10px]" />
                      {article.tag}
                    </span>
                    <span className="caps text-[10px] text-on-surface-variant">
                      [ {article.confidence}% CONFIDENCE ]
                    </span>
                  </div>
                  <h3 className="text-body leading-tight font-medium text-on-surface">
                    {article.title}
                  </h3>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
