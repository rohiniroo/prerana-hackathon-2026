"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const containers = [
  { id: "BT-2026-001", department: "Emergency Ward", category: "Yellow", quantity: "2.5 kg", status: "Awaiting Collection" },
  { id: "BT-2026-002", department: "Operation Theatre", category: "Red", quantity: "1.8 kg", status: "In Transit" },
  { id: "BT-2026-003", department: "ICU", category: "White", quantity: "0.8 kg", status: "Collected" },
  { id: "BT-2026-004", department: "Laboratory", category: "Blue", quantity: "1.2 kg", status: "Delayed" },
];

const stats = [
  { title: "Total Waste Generated", value: "248.5", unit: "kg", description: "Across all departments", icon: "♻", color: "#176B45", bg: "#EAF4ED" },
  { title: "Active Containers", value: "36", unit: "units", description: "Currently being tracked", icon: "▣", color: "#477DB9", bg: "#EDF3FB" },
  { title: "Awaiting Collection", value: "08", unit: "containers", description: "Require attention", icon: "◷", color: "#B47B22", bg: "#FFF5E5" },
  { title: "Disposal Completed", value: "124", unit: "records", description: "Successfully recorded", icon: "✓", color: "#8064B5", bg: "#F1EDFA" },
];

const departments = [
  { name: "Emergency Ward", amount: 65, color: "#176B45" },
  { name: "Operation Theatre", amount: 52, color: "#32966B" },
  { name: "ICU", amount: 43, color: "#73B895" },
  { name: "Laboratory", amount: 35, color: "#B4D9C2" },
];

const categories = [
  { name: "Yellow", amount: 92, color: "#E8B642" },
  { name: "Red", amount: 68, color: "#DF6969" },
  { name: "White", amount: 48, color: "#AAB4B0" },
  { name: "Blue", amount: 40, color: "#6597D8" },
];

function getPieGradient() {
  const total = categories.reduce((sum, item) => sum + item.amount, 0);
  let current = 0;

  const sections = categories.map((item) => {
    const start = current;
    current += (item.amount / total) * 100;
    return `${item.color} ${start}% ${current}%`;
  });

  return `conic-gradient(${sections.join(", ")})`;
}

function getStatusStyle(status: string) {
  switch (status) {
    case "Awaiting Collection":
      return "bg-amber-50 text-amber-700 border-amber-100";
    case "In Transit":
      return "bg-blue-50 text-blue-700 border-blue-100";
    case "Collected":
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    case "Delayed":
      return "bg-rose-50 text-rose-700 border-rose-100";
    default:
      return "bg-gray-50 text-gray-600 border-gray-100";
  }
}

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredContainers = useMemo(() => {
    return containers.filter((container) => {
      const matchesSearch =
        container.id.toLowerCase().includes(search.toLowerCase()) ||
        container.department.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" || container.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  const totalCategoryWaste = categories.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const totalDepartmentWaste = departments.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  return (
    <main className="min-h-screen w-full bg-[#F5F8F6] text-[#1D3025]">
      <div className="mx-auto w-full max-w-[1600px] space-y-8 px-5 py-7 sm:px-8 lg:px-10">

        {/* HEADER */}
        <section className="flex flex-wrap items-center justify-between gap-5">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Healthcare Facility
              <span className="text-gray-300">/</span>
              Overview
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-[#173B29] sm:text-4xl">
              Dashboard Overview
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Monitor, track and manage biomedical waste operations.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-800">
              HA
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Demo Administrator
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Facility Administrator
              </p>
            </div>
          </div>
        </section>

        {/* WELCOME BANNER */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#123D2B] via-[#176B45] to-[#239B65] p-7 text-white shadow-lg sm:p-9">
          <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full border-[35px] border-white/5" />
          <div className="absolute -bottom-24 right-36 h-56 w-56 rounded-full border-[30px] border-white/5" />

          <div className="relative z-10 max-w-2xl">
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-emerald-50">
              BIOTRACK · PRERANA 2026
            </span>

            <h2 className="mt-5 text-2xl font-bold sm:text-3xl">
              Every trace tells a story of care.
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-emerald-50/80">
              Your healthcare waste operations, organized in one intelligent
              platform. Track containers, monitor disposal and maintain
              compliance with confidence.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/waste-registration"
                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#176B45] shadow-sm transition hover:bg-emerald-50"
              >
                + Register Waste
              </Link>

              <Link
                href="/container-management"
                className="rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                Track Containers →
              </Link>
            </div>
          </div>
        </section>

        {/* DEMO NOTICE */}
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
            i
          </span>
          <p className="text-xs font-medium text-emerald-800">
            Demonstration mode — the figures shown below are illustrative sample records.
          </p>
        </div>

        {/* STATISTICS */}
        <section>
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#203B2C]">
                Operational Summary
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Your facility at a glance
              </p>
            </div>

            <span className="hidden rounded-full bg-white px-4 py-2 text-xs font-medium text-gray-500 shadow-sm sm:block">
              Overview · Demo data
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={stat.title}
                className="group rounded-2xl border border-[#E7EDE8] bg-white p-6 shadow-[0_4px_20px_rgba(20,60,35,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </p>

                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl text-xl"
                    style={{ color: stat.color, backgroundColor: stat.bg }}
                  >
                    {stat.icon}
                  </div>
                </div>

                <div className="mt-7 flex items-baseline gap-2">
                  <span className="text-4xl font-bold tracking-tight text-[#203B2C]">
                    {stat.value}
                  </span>
                  <span className="text-xs font-medium text-gray-400">
                    {stat.unit}
                  </span>
                </div>

                <p className="mt-3 text-xs text-gray-400">
                  {stat.description}
                </p>

                <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${[85, 65, 42, 76][index]}%`,
                      backgroundColor: stat.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ALERT */}
        <section className="flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-amber-100 bg-[#FFFCF5] p-5 sm:p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-xl font-bold text-amber-700">
              !
            </div>

            <div>
              <h3 className="font-bold text-amber-900">
                Collection attention required
              </h3>
              <p className="mt-1 text-sm text-amber-800/70">
                One container has a delayed collection status. Please review its tracking information.
              </p>
            </div>
          </div>

          <Link
            href="/container-management"
            className="rounded-xl border border-amber-200 bg-white px-5 py-3 text-sm font-semibold text-amber-800 transition hover:bg-amber-50"
          >
            Review Container →
          </Link>
        </section>

        {/* ANALYTICS */}
        <section>
          <div className="mb-5">
            <h2 className="text-xl font-bold text-[#203B2C]">
              Waste Analytics
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Visual insights into waste generation and department performance.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 2xl:grid-cols-2">

            {/* CATEGORY CHART */}
            <div className="rounded-2xl border border-[#E7EDE8] bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-800">
                    Waste Category Distribution
                  </h3>
                  <p className="mt-1 text-sm text-gray-400">
                    Category-wise waste generated
                  </p>
                </div>

                <span className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                  4 Categories
                </span>
              </div>

              <div className="mt-8 flex flex-col items-center justify-around gap-9 lg:flex-row">
                <div
                  className="relative h-56 w-56 shrink-0 rounded-full"
                  style={{ background: getPieGradient() }}
                  role="img"
                  aria-label="Waste category distribution chart"
                >
                  <div className="absolute inset-[25%] flex flex-col items-center justify-center rounded-full bg-white">
                    <span className="text-3xl font-bold text-[#203B2C]">
                      {totalCategoryWaste}
                    </span>
                    <span className="mt-1 text-xs text-gray-400">
                      Total kg
                    </span>
                  </div>
                </div>

                <div className="w-full max-w-[250px] space-y-5">
                  {categories.map((category) => (
                    <div
                      key={category.name}
                      className="flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="h-3.5 w-3.5 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <div>
                          <p className="text-sm font-semibold text-gray-700">
                            {category.name} Category
                          </p>
                          <p className="mt-1 text-xs text-gray-400">
                            {(
                              (category.amount / totalCategoryWaste) *
                              100
                            ).toFixed(1)}
                            % of total
                          </p>
                        </div>
                      </div>

                      <span className="text-sm font-bold text-gray-800">
                        {category.amount} kg
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 border-t border-gray-100 pt-5 text-xs text-gray-400">
                Total category waste:{" "}
                <strong className="text-emerald-700">
                  {totalCategoryWaste} kg
                </strong>
              </div>
            </div>

            {/* DEPARTMENT CHART */}
            <div className="rounded-2xl border border-[#E7EDE8] bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-800">
                    Department Overview
                  </h3>
                  <p className="mt-1 text-sm text-gray-400">
                    Waste generated by department
                  </p>
                </div>

                <span className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                  4 Units
                </span>
              </div>

              <div className="mt-9 space-y-8">
                {departments.map((department) => (
                  <div key={department.name}>
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        {department.name}
                      </span>

                      <span className="text-sm font-bold text-gray-800">
                        {department.amount} kg
                      </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${(department.amount / 70) * 100}%`,
                          backgroundColor: department.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-5">
                <span className="text-xs text-gray-400">
                  Total displayed
                </span>

                <span className="text-sm font-bold text-emerald-700">
                  {totalDepartmentWaste} kg
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* CONTAINER ACTIVITY */}
        <section className="overflow-hidden rounded-2xl border border-[#E7EDE8] bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-5 border-b border-gray-100 px-6 py-6 sm:px-8">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Recent Container Activity
              </h2>
              <p className="mt-1 text-sm text-gray-400">
                Monitor the latest biomedical waste movements.
              </p>
            </div>

            <span className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold tracking-wide text-emerald-700">
              DEMO RECORDS
            </span>
          </div>

          <div className="flex flex-wrap gap-4 border-b border-gray-100 px-6 py-5 sm:px-8">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search container ID or department..."
              className="min-w-[240px] flex-1 rounded-xl border border-gray-200 bg-gray-50 px-5 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
            />

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="min-w-[190px] rounded-xl border border-gray-200 bg-gray-50 px-5 py-3 text-sm text-gray-600 outline-none focus:border-emerald-500"
            >
              <option value="All">All statuses</option>
              <option value="Awaiting Collection">Awaiting Collection</option>
              <option value="In Transit">In Transit</option>
              <option value="Collected">Collected</option>
              <option value="Delayed">Delayed</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead className="bg-[#F8FAF8]">
                <tr className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  <th className="px-7 py-5">Container ID</th>
                  <th className="px-7 py-5">Department</th>
                  <th className="px-7 py-5">Category</th>
                  <th className="px-7 py-5">Quantity</th>
                  <th className="px-7 py-5">Current Status</th>
                  <th className="px-7 py-5">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredContainers.length > 0 ? (
                  filteredContainers.map((container) => (
                    <tr
                      key={container.id}
                      className="border-t border-gray-100 transition hover:bg-emerald-50/30"
                    >
                      <td className="px-7 py-6 text-sm font-bold text-emerald-700">
                        {container.id}
                      </td>

                      <td className="px-7 py-6 text-sm text-gray-600">
                        {container.department}
                      </td>

                      <td className="px-7 py-6 text-sm font-medium text-gray-600">
                        {container.category}
                      </td>

                      <td className="px-7 py-6 text-sm font-semibold text-gray-800">
                        {container.quantity}
                      </td>

                      <td className="px-7 py-6">
                        <span
                          className={`whitespace-nowrap rounded-full border px-3.5 py-2 text-xs font-semibold ${getStatusStyle(
                            container.status
                          )}`}
                        >
                          {container.status}
                        </span>
                      </td>

                      <td className="px-7 py-6">
                        <Link
                          href="/container-management"
                          className="text-sm font-bold text-emerald-700 hover:underline"
                        >
                          View details →
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-7 py-14 text-center text-sm text-gray-400"
                    >
                      No matching containers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-gray-100 px-7 py-5">
            <p className="text-xs text-gray-400">
              Showing {filteredContainers.length} of {containers.length} illustrative demo records.
            </p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 py-6">
          <div>
            <p className="text-sm font-bold text-emerald-700">BioTrack</p>
            <p className="mt-1 text-xs text-gray-400">
              Every Trace Tells a Story of Care.
            </p>
          </div>

          <p className="text-xs text-gray-400">
            PRERANA 2026 · TEAM DR.SUDHA
          </p>
        </footer>
      </div>
    </main>
  );
}