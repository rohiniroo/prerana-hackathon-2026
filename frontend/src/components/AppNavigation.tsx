
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { icon: "▦", name: "Dashboard", href: "/dashboard" },
  { icon: "＋", name: "Waste Registration", href: "/waste-registration" },
  { icon: "▣", name: "Container Management", href: "/container-management" },
  { icon: "⌗", name: "QR Tracking", href: "/qr-tracking" },
  { icon: "⇄", name: "Collection & Transport", href: "/collection-transport" },
  { icon: "✓", name: "Handover & Disposal", href: "/handover-disposal" },
  { icon: "♙", name: "Users & Audit", href: "/user-activity" },
  { icon: "▤", name: "Reports & Insights", href: "/reports-insights" },
];

export default function AppNavigation() {
  const pathname = usePathname();

  if (pathname === "/") return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E6ECE8] bg-white">
      <div className="mx-auto max-w-[1600px] px-5 md:px-8">

        <div className="flex min-h-[76px] items-center justify-between gap-4">

          {/* BRAND */}
          <Link href="/dashboard" className="flex items-center gap-3 shrink-0">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#176B45] text-2xl font-bold text-white shadow-sm">
              B
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-[#176B45]">
                BioTrack
              </h1>
              <p className="text-[10px] tracking-wide text-[#78877E]">
                HEALTHCARE INTELLIGENCE
              </p>
            </div>
          </Link>

          {/* ENVIRONMENT */}
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-[#DCEDE3] bg-[#F1F8F3] px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-[#239B65]" />
            <span className="text-xs font-semibold text-[#176B45]">
              Demo Environment
            </span>
          </div>

        </div>

        {/* NAVIGATION */}
        <nav className="flex items-center gap-2 overflow-x-auto pb-3">
          {navigation.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-[#EAF4ED] text-[#176B45] shadow-sm"
                    : "text-[#68756D] hover:bg-[#F5F8F5] hover:text-[#176B45]"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

      </div>
    </header>
  );
}
