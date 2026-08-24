import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Icon } from "./Icon";

import logoSrc from "@/assets/suppwise-logo.png";

const TABS = [
  { to: "/", label: "Home", icon: "home" },
  { to: "/advisor", label: "AI Advisor", icon: "psychology" },
  { to: "/stack", label: "My Stack", icon: "medication" },
  { to: "/progress", label: "Progress", icon: "monitoring" },
  { to: "/profile", label: "Profile", icon: "account_circle" },
] as const;

export function AppShell({
  title,
  children,
  back,
}: {
  title: string;
  children: ReactNode;
  back?: { to: string; label: string };
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  return (
    <div className="min-h-screen w-full bg-background">
      <header className="fixed top-0 z-50 w-full bg-surface/80 pt-safe shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-lg items-center justify-between px-5">
          <div className="flex items-center gap-3">
            {back ? (
              <Link
                to={back.to}
                aria-label={back.label}
                className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full text-on-surface transition-colors hover:bg-surface-container"
              >
                <Icon name="arrow_back" />
              </Link>
            ) : null}
            <img
              alt="SuppWise — track. supplement. improve."
              className="h-7 w-auto object-contain"
              src={logoSrc}
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="caps text-outline">{title}</span>
            <Link
              to="/profile"
              aria-label="Profile"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary"
            >
              <Icon name="person" className="text-[18px] text-on-primary" />
            </Link>
          </div>
        </div>
      </header>

      <main className="relative mx-auto min-h-screen w-full max-w-lg bg-background pt-16 pb-32">
        {children}
      </main>

      <nav className="fixed bottom-0 z-50 w-full bg-surface/80 pb-safe shadow-[0_-1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-lg items-center justify-between px-4">
          {TABS.map((tab) => (
            <Link
              key={tab.to}
              to={tab.to}
              className={`flex min-w-[44px] flex-col items-center justify-center gap-1 transition-colors ${
                isActive(tab.to) ? "text-primary" : "text-on-surface-variant hover:text-primary"
              }`}
            >
              <Icon name={tab.icon} filled={isActive(tab.to)} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
