import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Icon } from "@/components/Icon";
import { BIOMARKERS } from "@/data/wisement";

export const Route = createFileRoute("/bloodwork")({
  head: () => ({
    meta: [
      { title: "Blood Test Analysis — WiseMent" },
      {
        name: "description",
        content:
          "Upload a blood panel and see each biomarker explained, flagged as optimal or sub-optimal, with targeted suggestions.",
      },
      { property: "og:title", content: "Blood Test Analysis — WiseMent" },
      {
        property: "og:description",
        content: "Biomarker-by-biomarker interpretation with plain-English explanations.",
      },
    ],
  }),
  component: Bloodwork,
});

function Bloodwork() {
  const [uploaded, setUploaded] = useState(true);
  const flagged = BIOMARKERS.filter((b) => b.status === "SUB-OPTIMAL");

  return (
    <AppShell title="Bloodwork" back={{ to: "/", label: "Back home" }}>
      <div className="flex w-full flex-col gap-8 px-5 py-4 fade-up">
        <header className="space-y-2">
          <h1 className="text-headline tracking-tight text-on-background">Blood Test Analysis</h1>
          <p className="text-body text-on-surface-variant">
            Panel from 12 March 2026 · 6 biomarkers reviewed
          </p>
        </header>

        {!uploaded ? (
          <button
            type="button"
            onClick={() => setUploaded(true)}
            className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-outline-variant bg-surface-container-low p-8"
          >
            <Icon name="upload_file" className="text-[32px] text-on-surface-variant" />
            <span className="text-body text-on-surface">Upload a PDF or photo of your panel</span>
            <span className="caps text-on-surface-variant">Processed privately</span>
          </button>
        ) : (
          <div className="flex items-center gap-3 rounded-xl bg-surface-container-high p-4">
            <Icon name="description" className="text-on-surface-variant" />
            <div className="flex-1">
              <p className="text-body text-on-surface">blood-panel-march.pdf</p>
              <p className="caps mt-0.5 text-on-surface-variant">Analyzed · 2 flags</p>
            </div>
            <button
              type="button"
              onClick={() => setUploaded(false)}
              className="caps text-primary"
            >
              Replace
            </button>
          </div>
        )}

        <section className="space-y-3">
          <h2 className="text-title text-on-surface">Needs attention</h2>
          {flagged.map((b) => (
            <div key={b.name} className="rounded-xl bg-error-container p-4">
              <div className="flex items-center gap-2">
                <Icon name={b.icon} className="text-on-error-container" />
                <h3 className="flex-1 text-body font-medium text-on-error-container">{b.name}</h3>
                <span className="font-mono text-body text-on-error-container">
                  {b.value} {b.unit}
                </span>
              </div>
              <p className="mt-2 text-body text-on-error-container/80">{b.note}</p>
              {b.advice && (
                <p className="caps mt-2 text-on-error-container">{b.advice}</p>
              )}
            </div>
          ))}
        </section>

        <section className="space-y-3">
          <h2 className="text-title text-on-surface">All biomarkers</h2>
          <div className="flex flex-col gap-3">
            {BIOMARKERS.map((b) => {
              const low = b.status === "SUB-OPTIMAL";
              return (
                <div key={b.name} className="rounded-xl bg-surface-container-lowest p-4 card-shadow">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                        low
                          ? "bg-error-container text-on-error-container"
                          : "bg-primary-fixed text-on-primary-fixed"
                      }`}
                    >
                      <Icon name={b.icon} className="text-[20px]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-body font-medium text-on-surface">{b.name}</h3>
                      <p className="caps mt-0.5 text-on-surface-variant">{b.status}</p>
                    </div>
                    <span className="font-mono text-body text-on-surface">
                      {b.value}
                      <span className="caps ml-1 text-on-surface-variant">{b.unit}</span>
                    </span>
                  </div>
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-variant">
                    <div
                      className={`h-full rounded-full ${low ? "bg-error" : "bg-primary"}`}
                      style={{ width: `${b.percent}%` }}
                    />
                  </div>
                  <p className="mt-2 text-body text-on-surface-variant">{b.note}</p>
                </div>
              );
            })}
          </div>
        </section>

        <Link
          to="/advisor"
          search={{ q: "Explain my latest blood panel results" }}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-body font-medium text-on-primary"
        >
          <Icon name="psychology" className="text-[20px]" />
          Discuss with AI Advisor
        </Link>

        <p className="caps pb-4 text-center text-[10px] text-on-surface-variant/60">
          Not a medical diagnosis. Share results with your doctor.
        </p>
      </div>
    </AppShell>
  );
}
