
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  getBioTrackData,
  saveBioTrackData,
  subscribeToBioTrackData,
  type BioTrackData,
  type ContainerRecord,
} from "../../src/lib/biotrack-store";

const statusOptions = [
  "Awaiting Collection",
  "Collected",
  "In Transit",
  "Arrived at Treatment Facility",
];

export default function CollectionTransportPage() {
  const [containers, setContainers] = useState<ContainerRecord[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [collector, setCollector] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [notes, setNotes] = useState("");
  const [newStatus, setNewStatus] = useState(statusOptions[0]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success"
  );

  const loadData = useCallback(() => {
    const data = getBioTrackData();

    setContainers(data.containers);

    setSelectedId((current) => {
      if (current && data.containers.some((item) => item.id === current)) {
        return current;
      }

      return data.containers[0]?.id || "";
    });
  }, []);

  useEffect(() => {
    loadData();
    return subscribeToBioTrackData(loadData);
  }, [loadData]);

  const selected = containers.find((item) => item.id === selectedId);

  useEffect(() => {
    if (!selected) {
      setCollector("");
      setVehicle("");
      setNotes("");
      setNewStatus(statusOptions[0]);
      return;
    }

    const data = getBioTrackData();
    const latestRecord = [...data.collectionRecords]
      .reverse()
      .find((record) => record.containerId === selected.id);

    setCollector(latestRecord?.collector || "");
    setVehicle(latestRecord?.vehicle || "");
    setNotes("");
    setNewStatus(
      statusOptions.includes(selected.status)
        ? selected.status
        : statusOptions[0]
    );
    setMessage("");
  }, [selectedId, selected?.id]);

  const awaiting = containers.filter(
    (item) => item.status === "Awaiting Collection"
  ).length;

  const collected = containers.filter(
    (item) => item.status === "Collected"
  ).length;

  const inTransit = containers.filter(
    (item) => item.status === "In Transit"
  ).length;

  const arrived = containers.filter(
    (item) => item.status === "Arrived at Treatment Facility"
  ).length;

  function handleUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selected) return;

    if (newStatus !== "Awaiting Collection") {
      if (!collector.trim() || !vehicle.trim()) {
        setMessageType("error");
        setMessage("Enter the collector name and vehicle number.");
        return;
      }
    }

    const data: BioTrackData = getBioTrackData();
    const updatedAt = new Date().toISOString();

    const updatedContainers = data.containers.map((item) =>
      item.id === selectedId
        ? { ...item, status: newStatus }
        : item
    );

    const newCollectionRecord = {
      id: `COL-${Date.now()}`,
      containerId: selectedId,
      collector: collector.trim(),
      vehicle: vehicle.trim(),
      status: newStatus,
      date: updatedAt,
    };

    const updatedData: BioTrackData = {
      ...data,
      containers: updatedContainers,
      collectionRecords: [
        ...data.collectionRecords,
        newCollectionRecord,
      ],
      activities: [
        ...data.activities,
        {
          id: `ACT-${Date.now()}`,
          action: `Updated ${selectedId} status to ${newStatus}`,
          user: "Demo Administrator",
          date: updatedAt,
        },
      ],
    };

    saveBioTrackData(updatedData);

    setMessageType("success");
    setMessage("Container activity saved successfully.");
    loadData();
  }

  function statusColor(status: string) {
    switch (status) {
      case "Collected":
        return "bg-blue-50 text-blue-700";
      case "In Transit":
        return "bg-amber-50 text-amber-700";
      case "Arrived at Treatment Facility":
        return "bg-emerald-50 text-emerald-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  }

  function selectContainer(id: string) {
    setSelectedId(id);
    setMessage("");
  }

  return (
    <main className="min-h-screen bg-[#F5F7F5]">
      <div className="mx-auto max-w-7xl px-5 py-9 md:px-9">

        {/* HEADER */}
        <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#239B65]">
              EP-03 / Operations
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#202B25]">
              Collection & Transportation
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Manage container collection and movement.
            </p>
          </div>

          <Link
            href="/qr-tracking"
            className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-[#176B45] transition hover:bg-green-50"
          >
            Open QR Tracking →
          </Link>
        </div>

        {/* SUMMARY */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Awaiting Collection",
              value: awaiting,
              color: "text-gray-800",
              dot: "bg-gray-400",
            },
            {
              label: "Collected",
              value: collected,
              color: "text-blue-700",
              dot: "bg-blue-500",
            },
            {
              label: "In Transit",
              value: inTransit,
              color: "text-amber-600",
              dot: "bg-amber-500",
            },
            {
              label: "Arrived at Facility",
              value: arrived,
              color: "text-emerald-700",
              dot: "bg-emerald-500",
            },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${card.dot}`} />
                <p className="text-sm text-gray-500">{card.label}</p>
              </div>
              <p className={`mt-4 text-3xl font-bold ${card.color}`}>
                {card.value}
              </p>
            </div>
          ))}
        </div>

        {/* WORKSPACE */}
        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-5">

          {/* CONTAINER LIST */}
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm xl:col-span-2">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-[#202B25]">
                  Containers
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Select a container to manage.
                </p>
              </div>

              <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-[#176B45]">
                {containers.length} Total
              </span>
            </div>

            {containers.length > 0 ? (
              <div className="space-y-3">
                {containers.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectContainer(item.id)}
                    className={`w-full rounded-xl border p-4 text-left transition ${
                      selectedId === item.id
                        ? "border-[#239B65] bg-[#F1F8F3] shadow-sm"
                        : "border-gray-100 bg-white hover:border-green-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-bold text-gray-800">
                        {item.id}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <p className="mt-3 text-sm text-gray-600">
                      {item.department}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      {item.category} Category · {item.quantity}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-gray-300 px-5 py-12 text-center">
                <p className="font-semibold text-gray-700">
                  No containers yet
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Create a container before managing collection.
                </p>
                <Link
                  href="/container-management"
                  className="mt-5 inline-block rounded-lg bg-[#176B45] px-5 py-3 text-sm font-semibold text-white"
                >
                  Create Container
                </Link>
              </div>
            )}
          </section>

          {/* UPDATE FORM */}
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8 xl:col-span-3">
            <div className="mb-7">
              <p className="text-xs font-bold uppercase tracking-wider text-[#239B65]">
                Container Operations
              </p>
              <h2 className="mt-2 text-xl font-bold text-[#202B25]">
                Update Activity
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Record the responsible staff and movement status.
              </p>
            </div>

            {selected ? (
              <>
                <div className="mb-7 rounded-xl bg-[#F5F8F5] p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Selected Container
                  </p>
                  <h3 className="mt-2 text-xl font-bold text-[#176B45]">
                    {selected.id}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {selected.department} · {selected.category} Category
                  </p>
                </div>

                <form onSubmit={handleUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Collector Name
                      </label>
                      <input
                        value={collector}
                        onChange={(event) => setCollector(event.target.value)}
                        placeholder="Enter staff name"
                        className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#239B65] focus:ring-2 focus:ring-green-50"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Vehicle Number
                      </label>
                      <input
                        value={vehicle}
                        onChange={(event) => setVehicle(event.target.value)}
                        placeholder="e.g. KA-05-AB-1234"
                        className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#239B65] focus:ring-2 focus:ring-green-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Container Status
                    </label>
                    <select
                      value={newStatus}
                      onChange={(event) => setNewStatus(event.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#239B65]"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Activity Notes
                    </label>
                    <textarea
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      placeholder="Add relevant collection or transportation remarks..."
                      rows={4}
                      className="w-full resize-y rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#239B65] focus:ring-2 focus:ring-green-50"
                    />
                  </div>

                  {message && (
                    <div
                      role="status"
                      className={`rounded-lg border px-4 py-3 text-sm ${
                        messageType === "success"
                          ? "border-green-200 bg-green-50 text-green-800"
                          : "border-red-200 bg-red-50 text-red-700"
                      }`}
                    >
                      {message}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-5">
                    <p className="text-xs text-gray-400">
                      Updates are shared with other BioTrack pages.
                    </p>
                    <button
                      type="submit"
                      className="rounded-lg bg-[#176B45] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#125638]"
                    >
                      Save Activity
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="py-16 text-center text-sm text-gray-500">
                Select a container to update its activity.
              </div>
            )}
          </section>
        </div>

        {/* RECENT ACTIVITY */}
        <section className="mt-7 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-[#202B25]">
              Recent Collection Activity
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Latest recorded movement updates.
            </p>
          </div>

          {(() => {
            const records = [...getBioTrackData().collectionRecords]
              .reverse()
              .slice(0, 5);

            return records.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400">
                      <th className="px-3 py-3 font-semibold">Container</th>
                      <th className="px-3 py-3 font-semibold">Collector</th>
                      <th className="px-3 py-3 font-semibold">Vehicle</th>
                      <th className="px-3 py-3 font-semibold">Status</th>
                      <th className="px-3 py-3 font-semibold">Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record) => (
                      <tr key={record.id} className="border-b border-gray-50">
                        <td className="px-3 py-4 font-semibold text-gray-800">
                          {record.containerId}
                        </td>
                        <td className="px-3 py-4 text-gray-600">
                          {record.collector || "—"}
                        </td>
                        <td className="px-3 py-4 text-gray-600">
                          {record.vehicle || "—"}
                        </td>
                        <td className="px-3 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor(
                              record.status
                            )}`}
                          >
                            {record.status}
                          </span>
                        </td>
                        <td className="px-3 py-4 text-xs text-gray-500">
                          {new Date(record.date).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="rounded-xl bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
                No collection activity recorded yet.
              </p>
            );
          })()}
        </section>

        <footer className="py-8 text-center text-xs text-gray-400">
          BioTrack · Every Trace Tells a Story of Care.
          <br />
          PRERANA 2026 · TEAM DR.SUDHA
        </footer>
      </div>
    </main>
  );
}
