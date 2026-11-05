
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getBioTrackData,
  saveBioTrackData,
  subscribeToBioTrackData,
  type ContainerRecord,
  type WasteRecord,
} from "../../src/lib/biotrack-store";

export default function ContainerManagement() {
  const [containers, setContainers] = useState<ContainerRecord[]>([]);
  const [wasteRecords, setWasteRecords] = useState<WasteRecord[]>([]);
  const [selectedWasteId, setSelectedWasteId] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedContainer, setSelectedContainer] =
    useState<ContainerRecord | null>(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  useEffect(() => {
    const loadData = () => {
      const data = getBioTrackData();
      setContainers(data.containers);
      setWasteRecords(data.wasteRecords);
    };

    loadData();
    return subscribeToBioTrackData(loadData);
  }, []);

  const selectedWaste = wasteRecords.find(
    (record) => record.id === selectedWasteId
  );

  const filteredContainers = useMemo(() => {
    return containers.filter((container) => {
      const matchesSearch =
        container.id.toLowerCase().includes(search.toLowerCase()) ||
        container.department.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        categoryFilter === "All" || container.category === categoryFilter;

      const matchesStatus =
        statusFilter === "All" || container.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [containers, search, categoryFilter, statusFilter]);

  const awaiting = containers.filter(
    (c) => c.status === "Awaiting Collection"
  ).length;

  const inTransit = containers.filter(
    (c) => c.status === "In Transit"
  ).length;

  const collected = containers.filter(
    (c) => c.status === "Collected"
  ).length;

  function showMessage(text: string, type: "success" | "error" = "success") {
    setMessage(text);
    setMessageType(type);
  }

  function createContainer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!selectedWaste) {
      showMessage("Please select a registered waste record.", "error");
      return;
    }

    const currentData = getBioTrackData();

    const alreadyAssigned = currentData.containers.some(
      (container) => container.wasteId === selectedWaste.id
    );

    if (alreadyAssigned) {
      showMessage("A container has already been created for this waste record.", "error");
      return;
    }

    const id = `BT-${Date.now()}`;

    const newContainer: ContainerRecord = {
      id,
      wasteId: selectedWaste.id,
      department: selectedWaste.department,
      category: selectedWaste.category,
      quantity: selectedWaste.quantity,
      status: "Awaiting Collection",
      createdAt: new Date().toISOString(),
    };

    const updatedData = {
      ...currentData,
      containers: [newContainer, ...currentData.containers],
      activities: [
        {
          id: `ACT-${Date.now()}`,
          action: `Created container ${id}`,
          user: "Demo Administrator",
          date: new Date().toISOString(),
        },
        ...currentData.activities,
      ],
    };

    saveBioTrackData(updatedData);

    setContainers(updatedData.containers);
    setSelectedWasteId("");
    showMessage(`Container ${id} created successfully.`);
  }

  function getStatusStyle(status: string) {
    switch (status) {
      case "Collected":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "In Transit":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "Delayed":
        return "bg-red-50 text-red-700 border-red-100";
      default:
        return "bg-amber-50 text-amber-700 border-amber-100";
    }
  }

  const summaryCards = [
    {
      label: "Total Containers",
      value: containers.length,
      icon: "▣",
      color: "text-[#176B45]",
      background: "bg-[#EAF5EE]",
    },
    {
      label: "Awaiting Collection",
      value: awaiting,
      icon: "◷",
      color: "text-amber-700",
      background: "bg-amber-50",
    },
    {
      label: "In Transit",
      value: inTransit,
      icon: "↗",
      color: "text-blue-700",
      background: "bg-blue-50",
    },
    {
      label: "Collected",
      value: collected,
      icon: "✓",
      color: "text-emerald-700",
      background: "bg-emerald-50",
    },
  ];

  const inputClass =
    "w-full h-[50px] rounded-xl border border-[#E5EAE6] bg-[#FCFDFC] px-4 text-sm text-gray-700 outline-none transition focus:border-[#239B65] focus:ring-2 focus:ring-[#239B65]/10";

  return (
    <main className="min-h-screen bg-[#F5F7F5]">
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-10 md:py-12">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#239B65] mb-3">
              BIOTRACK / EP-02
            </p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#202B25]">
              Container Management
            </h1>
            <p className="text-sm text-gray-400 mt-3">
              Manage, identify and monitor waste containers.
            </p>
          </div>

          <a
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-[#176B45] hover:bg-green-50 transition"
          >
            ← Dashboard
          </a>
        </div>

        {/* SUMMARY */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
          {summaryCards.map((item) => (
            <div
              key={item.label}
              className="bg-white border border-[#E9EEE9] rounded-2xl p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-gray-500">
                  {item.label}
                </p>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold ${item.background} ${item.color}`}>
                  {item.icon}
                </div>
              </div>
              <p className={`text-3xl font-bold mt-5 ${item.color}`}>
                {item.value}
              </p>
            </div>
          ))}
        </section>

        {/* CREATE CONTAINER */}
        <section className="bg-white border border-[#E9EEE9] rounded-2xl shadow-sm overflow-hidden mb-10">

          <div className="px-6 md:px-8 py-7 border-b border-gray-100 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#EAF5EE] text-[#176B45] flex items-center justify-center text-xl">
              +
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#202B25]">
                Create Container
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Assign a container to a registered waste record.
              </p>
            </div>
          </div>

          <form onSubmit={createContainer} className="p-6 md:p-8">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">

              <div>
                <label htmlFor="wasteRecord" className="block text-sm font-semibold text-[#34443A] mb-3">
                  Select Waste Record
                </label>

                <select
                  id="wasteRecord"
                  value={selectedWasteId}
                  onChange={(e) => {
                    setSelectedWasteId(e.target.value);
                    setMessage("");
                  }}
                  className={inputClass}
                  required
                >
                  <option value="">Choose a waste record</option>
                  {wasteRecords.map((record) => (
                    <option key={record.id} value={record.id}>
                      {record.id} · {record.department} · {record.category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#34443A] mb-3">
                  Department
                </label>
                <div className={`${inputClass} flex items-center text-gray-500`}>
                  {selectedWaste?.department || "Auto-filled from record"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#34443A] mb-3">
                  Waste Category
                </label>
                <div className={`${inputClass} flex items-center text-gray-500`}>
                  {selectedWaste?.category || "Auto-filled from record"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#34443A] mb-3">
                  Quantity
                </label>
                <div className={`${inputClass} flex items-center text-gray-500`}>
                  {selectedWaste
                    ? `${selectedWaste.quantity} ${selectedWaste.unit}`
                    : "Auto-filled from record"}
                </div>
              </div>

            </div>

            {selectedWaste && (
              <div className="mt-6 p-4 rounded-xl bg-[#F0F7F2] border border-[#DDECE1] flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-[#176B45] uppercase tracking-wider">
                    Selected record
                  </p>
                  <p className="text-sm font-semibold text-[#26372D] mt-1">
                    {selectedWaste.id}
                  </p>
                </div>
                <span className="text-xs font-semibold bg-white text-[#176B45] rounded-lg px-3 py-2">
                  Ready for container creation
                </span>
              </div>
            )}

            {message && (
              <div
                role="status"
                className={`mt-6 rounded-xl p-4 text-sm border ${
                  messageType === "success"
                    ? "bg-green-50 border-green-100 text-[#176B45]"
                    : "bg-red-50 border-red-100 text-red-700"
                }`}
              >
                {message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:justify-end gap-3 mt-8 pt-7 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setSelectedWasteId("");
                  setMessage("");
                }}
                className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition"
              >
                Clear
              </button>

              <button
                type="submit"
                disabled={!selectedWaste}
                className="px-7 py-3 rounded-xl bg-[#176B45] text-white text-sm font-semibold hover:bg-[#125638] disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
              >
                + Create Container
              </button>
            </div>

            {wasteRecords.length === 0 && (
              <p className="text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-xl p-4 mt-5">
                No waste records available. Register waste first to create a container.
              </p>
            )}

          </form>
        </section>

        {/* CONTAINER LIST */}
        <section className="bg-white border border-[#E9EEE9] rounded-2xl shadow-sm overflow-hidden">

          <div className="px-6 md:px-8 py-7 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#202B25]">
                  All Containers
                </h2>
                <p className="text-sm text-gray-400 mt-2">
                  Container inventory and tracking status.
                </p>
              </div>

              <span className="bg-[#EAF5EE] text-[#176B45] px-4 py-2 rounded-full text-xs font-semibold">
                {containers.length} Total
              </span>
            </div>

            {/* FILTERS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-7">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="⌕  Search container or department"
                className={inputClass}
              />

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className={inputClass}
              >
                <option value="All">All Categories</option>
                <option value="Yellow">Yellow</option>
                <option value="Red">Red</option>
                <option value="White">White</option>
                <option value="Blue">Blue</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={inputClass}
              >
                <option value="All">All Statuses</option>
                <option value="Awaiting Collection">Awaiting Collection</option>
                <option value="In Transit">In Transit</option>
                <option value="Collected">Collected</option>
                <option value="Delayed">Delayed</option>
              </select>
            </div>
          </div>

          {/* TABLE */}
          {filteredContainers.length === 0 ? (
            <div className="py-16 px-6 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#F0F6F1] flex items-center justify-center text-3xl mb-5">
                ▣
              </div>
              <h3 className="font-bold text-gray-700">
                {containers.length === 0
                  ? "No containers created"
                  : "No matching containers"}
              </h3>
              <p className="text-sm text-gray-400 mt-2">
                {containers.length === 0
                  ? "Create your first container using a registered waste record."
                  : "Try changing your search or filters."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-left">
                <thead className="bg-[#F8FAF8] text-xs uppercase tracking-wider text-gray-400">
                  <tr>
                    <th className="px-7 py-5">Container ID</th>
                    <th className="px-7 py-5">Department</th>
                    <th className="px-7 py-5">Category</th>
                    <th className="px-7 py-5">Quantity</th>
                    <th className="px-7 py-5">Status</th>
                    <th className="px-7 py-5">Details</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredContainers.map((container) => (
                    <tr
                      key={container.id}
                      className="border-t border-gray-100 hover:bg-[#FAFCFA] transition"
                    >
                      <td className="px-7 py-5">
                        <span className="font-semibold text-sm text-[#176B45]">
                          {container.id}
                        </span>
                      </td>

                      <td className="px-7 py-5 text-sm text-gray-600">
                        {container.department}
                      </td>

                      <td className="px-7 py-5">
                        <span className="text-sm font-medium text-gray-700">
                          {container.category}
                        </span>
                      </td>

                      <td className="px-7 py-5 text-sm text-gray-600">
                        {container.quantity} kg
                      </td>

                      <td className="px-7 py-5">
                        <span className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold whitespace-nowrap ${getStatusStyle(container.status)}`}>
                          {container.status}
                        </span>
                      </td>

                      <td className="px-7 py-5">
                        <button
                          onClick={() => setSelectedContainer(container)}
                          className="text-sm font-semibold text-[#176B45] hover:underline"
                        >
                          View →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="px-7 py-5 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Showing {filteredContainers.length} of {containers.length} containers
            </p>
          </div>
        </section>

        {/* DETAILS MODAL */}
        {selectedContainer && (
          <div
            className="fixed inset-0 z-50 bg-[#15271D]/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedContainer(null)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="container-title"
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-[#176B45] px-7 py-7 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-green-100 uppercase tracking-widest">
                      Container Details
                    </p>
                    <h2 id="container-title" className="text-xl font-bold mt-2">
                      {selectedContainer.id}
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedContainer(null)}
                    aria-label="Close details"
                    className="text-white text-3xl hover:text-green-200"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-7 space-y-5">
                {[
                  ["Department", selectedContainer.department],
                  ["Waste Category", selectedContainer.category],
                  ["Quantity", `${selectedContainer.quantity} kg`],
                  ["Waste Record", selectedContainer.wasteId],
                  [
                    "Created",
                    new Date(selectedContainer.createdAt).toLocaleString(),
                  ],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-start justify-between gap-5 border-b border-gray-100 pb-4"
                  >
                    <span className="text-sm text-gray-400">{label}</span>
                    <span className="text-sm font-semibold text-gray-700 text-right">
                      {value}
                    </span>
                  </div>
                ))}

                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-gray-400">Current Status</span>
                  <span className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusStyle(selectedContainer.status)}`}>
                    {selectedContainer.status}
                  </span>
                </div>
              </div>

              <div className="px-7 pb-7">
                <button
                  onClick={() => setSelectedContainer(null)}
                  className="w-full bg-[#176B45] hover:bg-[#125638] text-white rounded-xl py-3 font-semibold text-sm transition"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <footer className="text-center text-xs text-gray-400 mt-12 pb-4">
          BioTrack · Every Trace Tells a Story of Care.
        </footer>
      </div>
    </main>
  );
}
