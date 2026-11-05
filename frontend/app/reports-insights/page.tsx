
"use client";

import { useMemo, useState } from "react";

type WasteRecord = {
  id: string;
  department: string;
  category: string;
  weight: number;
  status: string;
  date: string;
};

const demoRecords: WasteRecord[] = [
  { id: "BT-001", department: "Emergency Ward", category: "Yellow", weight: 2.5, status: "Awaiting Collection", date: "2026-11-05" },
  { id: "BT-002", department: "Operation Theatre", category: "Red", weight: 1.8, status: "In Transit", date: "2026-11-05" },
  { id: "BT-003", department: "ICU", category: "White", weight: 0.8, status: "Collected", date: "2026-11-05" },
  { id: "BT-004", department: "Laboratory", category: "Blue", weight: 1.2, status: "Delayed", date: "2026-11-04" },
  { id: "BT-005", department: "Emergency Ward", category: "Red", weight: 2.1, status: "Collected", date: "2026-11-04" },
  { id: "BT-006", department: "ICU", category: "Yellow", weight: 3.2, status: "Awaiting Collection", date: "2026-11-04" },
  { id: "BT-007", department: "Laboratory", category: "Blue", weight: 0.9, status: "Collected", date: "2026-11-03" },
  { id: "BT-008", department: "Operation Theatre", category: "White", weight: 1.4, status: "In Transit", date: "2026-11-03" },
];

const categoryColors: Record<string, string> = {
  Yellow: "bg-amber-400",
  Red: "bg-red-400",
  White: "bg-gray-400",
  Blue: "bg-blue-400",
};

export default function ReportsInsightsPage() {
  const [filter, setFilter] = useState("All");
  const [selectedPeriod, setSelectedPeriod] = useState("All records");

  const records = useMemo(() => {
    let result = demoRecords;

    if (filter !== "All") {
      result = result.filter((item) => item.category === filter);
    }

    if (selectedPeriod === "Today") {
      result = result.filter((item) => item.date === "2026-11-05");
    } else if (selectedPeriod === "Last 3 days") {
      result = result.filter((item) =>
        ["2026-11-03", "2026-11-04", "2026-11-05"].includes(item.date)
      );
    }

    return result;
  }, [filter, selectedPeriod]);

  const totalWeight = records.reduce(
    (sum, item) => sum + item.weight,
    0
  );

  const totalContainers = records.length;

  const delayedCount = records.filter(
    (item) =>
      item.status === "Delayed" ||
      item.status === "Awaiting Collection"
  ).length;

  const categoryStats = ["Yellow", "Red", "White", "Blue"].map(
    (category) => ({
      category,
      weight: records
        .filter((item) => item.category === category)
        .reduce((sum, item) => sum + item.weight, 0),
    })
  );

  const departmentStats = Array.from(
    new Set(records.map((item) => item.department))
  ).map((department) => ({
    department,
    weight: records
      .filter((item) => item.department === department)
      .reduce((sum, item) => sum + item.weight, 0),
  }));

  const maximumWeight = Math.max(
    ...categoryStats.map((item) => item.weight),
    1
  );

  const maximumDepartmentWeight = Math.max(
    ...departmentStats.map((item) => item.weight),
    1
  );

  const delayedRecords = records.filter(
    (item) =>
      item.status === "Delayed" ||
      item.status === "Awaiting Collection"
  );

  return (
    <main className="min-h-screen bg-[#F5F7F5] p-5 md:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold text-emerald-700">
              BIOTRACK / ANALYTICS
            </p>
            <h1 className="text-3xl font-bold text-gray-900">
              Reports & Insights
            </h1>
            <p className="mt-2 text-gray-500">
              Understand biomedical waste trends and monitor operational activities.
            </p>
          </div>

          <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-800">
            Demo Analytics
          </span>
        </div>

        {/* Filters */}
        <section className="mb-6 flex flex-wrap items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div>
            <label className="mb-2 block text-xs font-semibold text-gray-500">
              WASTE CATEGORY
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-600"
            >
              <option value="All">All Categories</option>
              <option value="Yellow">Yellow</option>
              <option value="Red">Red</option>
              <option value="White">White</option>
              <option value="Blue">Blue</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold text-gray-500">
              REPORT PERIOD
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-600"
            >
              <option>All records</option>
              <option>Today</option>
              <option>Last 3 days</option>
            </select>
          </div>

          <p className="ml-auto text-sm text-gray-500">
            Showing {records.length} sample records
          </p>
        </section>

        {/* Summary Cards */}
        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Total Containers",
              value: totalContainers,
              unit: "records",
              color: "text-gray-900",
            },
            {
              label: "Total Waste",
              value: totalWeight.toFixed(1),
              unit: "kg",
              color: "text-emerald-700",
            },
            {
              label: "Pending / Delayed",
              value: delayedCount,
              unit: "containers",
              color: "text-amber-600",
            },
            {
              label: "Departments",
              value: departmentStats.length,
              unit: "departments",
              color: "text-blue-700",
            },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <p className="text-sm text-gray-500">{card.label}</p>
              <div className="mt-3 flex items-baseline gap-2">
                <h2 className={`text-3xl font-bold ${card.color}`}>
                  {card.value}
                </h2>
                <span className="text-xs text-gray-400">{card.unit}</span>
              </div>
            </div>
          ))}
        </section>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* Category Chart */}
          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">
              Waste by Category
            </h2>
            <p className="mb-7 mt-1 text-sm text-gray-500">
              Total recorded weight for each waste category.
            </p>

            <div className="space-y-6">
              {categoryStats.map((item) => (
                <div key={item.category}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-medium text-gray-700">
                      {item.category} Waste
                    </span>
                    <span className="font-semibold text-gray-900">
                      {item.weight.toFixed(1)} kg
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full ${categoryColors[item.category]}`}
                      style={{
                        width: `${(item.weight / maximumWeight) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-6 text-xs text-gray-400">
              Values are calculated from the currently selected sample records.
            </p>
          </section>

          {/* Department Chart */}
          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">
              Department-wise Waste
            </h2>
            <p className="mb-7 mt-1 text-sm text-gray-500">
              Compare recorded waste across hospital departments.
            </p>

            <div className="space-y-6">
              {departmentStats.map((item) => (
                <div key={item.department}>
                  <div className="mb-2 flex justify-between gap-3 text-sm">
                    <span className="font-medium text-gray-700">
                      {item.department}
                    </span>
                    <span className="font-semibold text-gray-900">
                      {item.weight.toFixed(1)} kg
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-[#239B65]"
                      style={{
                        width: `${(item.weight / maximumDepartmentWeight) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Delayed Activities */}
        <section className="mt-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-gray-900">
              Delayed & Pending Activities
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Containers that need operational attention.
            </p>
          </div>

          {delayedRecords.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left">
                <thead>
                  <tr className="border-b border-gray-100 text-xs text-gray-500">
                    <th className="px-3 py-3">CONTAINER ID</th>
                    <th className="px-3 py-3">DEPARTMENT</th>
                    <th className="px-3 py-3">CATEGORY</th>
                    <th className="px-3 py-3">WEIGHT</th>
                    <th className="px-3 py-3">STATUS</th>
                  </tr>
                </thead>

                <tbody>
                  {delayedRecords.map((item) => (
                    <tr key={item.id} className="border-b border-gray-50">
                      <td className="px-3 py-4 text-sm font-semibold text-emerald-700">
                        {item.id}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-700">
                        {item.department}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-700">
                        {item.category}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-700">
                        {item.weight} kg
                      </td>
                      <td className="px-3 py-4">
                        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="rounded-xl bg-emerald-50 p-5 text-center text-sm text-emerald-800">
              No pending or delayed records in this selection.
            </p>
          )}
        </section>

        {/* Insights */}
        <section className="mt-6 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-xl">
              ✦
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                BioTrack Intelligence
              </h2>
              <p className="text-xs text-gray-500">
                Rule-based insights from sample data
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-emerald-50 p-4">
              <p className="font-semibold text-emerald-900">
                Waste Monitoring
              </p>
              <p className="mt-2 text-sm leading-6 text-emerald-800">
                {totalContainers > 0
                  ? `${totalContainers} sample containers represent ${totalWeight.toFixed(1)} kg of recorded waste in the selected report.`
                  : "No sample waste records match the selected filters."}
              </p>
            </div>

            <div className="rounded-xl bg-amber-50 p-4">
              <p className="font-semibold text-amber-900">
                Operational Attention
              </p>
              <p className="mt-2 text-sm leading-6 text-amber-800">
                {delayedCount > 0
                  ? `${delayedCount} sample containers are awaiting collection or marked delayed. Review their status and follow up.`
                  : "No pending or delayed sample containers were found in this selection."}
              </p>
            </div>
          </div>

          <p className="mt-4 text-xs leading-5 text-gray-400">
            These are simple rule-based demo insights, not predictions or
            outputs from a trained AI model. Real AI analysis can be integrated
            through the backend later.
          </p>
        </section>

        {/* Disclaimer */}
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <h3 className="font-semibold text-amber-900">
            Demo Analytics – Important
          </h3>
          <p className="mt-2 text-sm leading-6 text-amber-800">
            All reports use illustrative sample records. They are not live
            hospital statistics or verified compliance measurements.
            Database integration is required for actual reporting.
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-gray-400">
          BioTrack · Every Trace Tells a Story of Care.
        </p>
      </div>
    </main>
  );
}
