import { createFileRoute, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Icon } from "@/components/Icon";
import { PROTOCOL } from "@/data/wisement";

export const Route = createFileRoute("/evidence/$id")({
  loader: ({ params }) => {
    const item = PROTOCOL.find((p) => p.id === params.id);
    if (!item) throw notFound();
    return { item };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Evidence unavailable — WiseMent" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.item.name} — Evidence | WiseMent`;
    const description = `Study count, scientific consensus and plain-English explanation for ${loaderData.item.name}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: Evidence,
});

function Evidence() {
  const { item } = Route.useLoaderData();

  return (
    <AppShell title="Evidence" back={{ to: "/advisor/report", label: "Back to report" }}>
      <div className="flex w-full flex-col gap-8 px-5 py-4 fade-up">
        <header className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-fixed text-on-primary-fixed">
              <Icon name={item.icon} />
            </div>
            <div>
              <h1 className="text-title text-on-background">{item.name}</h1>
              <p className="caps mt-0.5 text-on-surface-variant">{item.category}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Icon
                  key={i}
                  name="star"
                  filled={i < item.stars}
                  className={`text-[16px] ${i < item.stars ? "text-primary" : "text-outline-variant"}`}
                />
              ))}
            </span>
            <span className="caps text-on-surface-variant">{item.evidenceLabel}</span>
          </div>
        </header>

        <section className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-surface-container p-4">
            <p className="caps text-on-surface-variant">Studies reviewed</p>
            <p className="mt-1 font-mono text-headline text-on-surface">{item.studies}</p>
          </div>
          <div className="rounded-xl bg-surface-container p-4">
            <p className="caps text-on-surface-variant">Match to you</p>
            <p className="mt-1 font-mono text-headline text-on-surface">{item.match}%</p>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-title text-on-surface">Scientific consensus</h2>
          <p className="text-body leading-relaxed text-on-surface-variant">{item.consensus}</p>
        </section>

        <section className="space-y-2 rounded-xl bg-secondary-fixed p-4">
          <h2 className="caps flex items-center gap-1 text-on-secondary-fixed">
            <Icon name="lightbulb" className="text-[14px]" /> In plain English
          </h2>
          <p className="text-body leading-relaxed text-on-secondary-fixed">{item.plain}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-title text-on-surface">References</h2>
          {item.references.map((ref: { label: string; source: string }) => (
            <div
              key={ref.label}
              className="flex items-start gap-3 rounded-xl bg-surface-container-low p-4"
            >
              <Icon name="description" className="mt-0.5 text-on-surface-variant" />
              <div>
                <p className="text-body text-on-surface">{ref.label}</p>
                <p className="caps mt-1 text-on-surface-variant">{ref.source}</p>
              </div>
            </div>
          ))}
        </section>

        <p className="caps pb-4 text-center text-[10px] text-on-surface-variant/60">
          References are illustrative in this prototype.
        </p>
      </div>
    </AppShell>
  );
}
