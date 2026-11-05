
"use client";

import { useState } from "react";
import type { FormEvent } from "react";

type HandoverRecord = {
  id: string;
  department: string;
  category: string;
  weight: string;
  status: string;
  facility: string;
  receiver: string;
  reference: string;
  remarks: string;
  verified: boolean;
  history: string[];
};

const initialRecords: HandoverRecord[] = [
  {
    id: "BT-2026-001",
    department: "Emergency Ward",
    category: "Yellow",
    weight: "2.5 kg",
    status: "Awaiting Handover",
    facility: "",
    receiver: "",
    reference: "",
    remarks: "",
    verified: false,
    history: ["Waste registered", "Awaiting collection"],
  },
  {
    id: "BT-2026-002",
    department: "Operation Theatre",
    category: "Red",
    weight: "1.8 kg",
    status: "In Transit",
    facility: "",
    receiver: "",
    reference: "",
    remarks: "",
    verified: false,
    history: ["Waste registered", "Collected", "In transit"],
  },
  {
    id: "BT-2026-003",
    department: "ICU",
    category: "White",
    weight: "0.8 kg",
    status: "Handover Completed",
    facility: "Demo Treatment Facility",
    receiver: "Sample Receiver",
    reference: "DEMO-001",
    remarks: "Sample handover record",
    verified: false,
    history: [
      "Waste registered",
      "Collected",
      "In transit",
      "Handover completed",
    ],
  },
];

export default function HandoverDisposalPage() {
  const [records, setRecords] = useState(initialRecords);
  const [selectedId, setSelectedId] = useState("BT-2026-001");
  const [facility, setFacility] = useState("");
  const [receiver, setReceiver] = useState("");
  const [reference, setReference] = useState("");
  const [remarks, setRemarks] = useState("");
  const [verified, setVerified] = useState(false);
  const [message, setMessage] = useState("");

  const selected = records.find((item) => item.id === selectedId);

  const pending = records.filter(
    (item) => item.status !== "Handover Completed"
  ).length;

  const handedOver = records.filter(
    (item) => item.status === "Handover Completed"
  ).length;

  const disposalVerified = records.filter(
    (item) => item.verified
  ).length;

  function selectRecord(id: string) {
    const item = records.find((record) => record.id === id);
    if (!item) return;

    setSelectedId(id);
    setFacility(item.facility);
    setReceiver(item.receiver);
    setReference(item.reference);
    setRemarks(item.remarks);
    setVerified(item.verified);
    setMessage("");
  }

  function handleHandover(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!selected) return;

    if (!facility.trim() || !receiver.trim() || !reference.trim()) {
      setMessage("Please fill in the facility, receiver and reference number.");
      return;
    }

    if (
      selected.status === "Awaiting Handover" ||
      selected.status === "In Transit"
    ) {
      setMessage(
        "Only containers that have reached the treatment facility can be handed over. Update the transportation stage first."
      );
      return;
    }

    setRecords((previous) =>
      previous.map((item) =>
        item.id === selectedId
          ? {
              ...item,
              status: "Handover Completed",
              facility,
              receiver,
              reference,
              remarks,
              verified: false,
              history: [
                ...item.history,
                "Handover recorded: " + new Date().toLocaleString(),
              ],
            }
          : item
      )
    );

    setMessage("Handover details recorded successfully!");
  }

  function handleVerification() {
    if (!selected) return;

    if (selected.status !== "Handover Completed") {
      setMessage("Complete the handover before recording disposal verification.");
      return;
    }

    setRecords((previous) =>
      previous.map((item) =>
        item.id === selectedId
          ? {
              ...item,
              verified: true,
              history: [
                ...item.history,
                "Disposal verification recorded: " +
                  new Date().toLocaleString(),
              ],
            }
          : item
      )
    );

    setVerified(true);
    setMessage("Demo disposal verification recorded!");
  }

  return (
    <main className="min-h-screen bg-[#F5F7F5] p-5 md:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold text-emerald-700">
            BIOTRACK / COMPLIANCE
          </p>
          <h1 className="text-3xl font-bold text-gray-900">
            Handover & Disposal Verification
          </h1>
          <p className="mt-2 text-gray-500">
            Record waste handover details and track disposal verification.
          </p>
        </div>

        {/* Summary */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              label: "Pending Handover",
              value: pending,
              color: "text-amber-600",
            },
            {
              label: "Handover Completed",
              value: handedOver,
              color: "text-blue-700",
            },
            {
              label: "Disposal Verified",
              value: disposalVerified,
              color: "text-emerald-700",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <p className="text-sm text-gray-500">{item.label}</p>
              <h2 className={`mt-3 text-3xl font-bold ${item.color}`}>
                {item.value}
              </h2>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">

          {/* Container List */}
          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm lg:col-span-2">
            <h2 className="mb-1 text-lg font-bold text-gray-900">
              Container Records
            </h2>
            <p className="mb-5 text-sm text-gray-500">
              Select a container to view its handover status.
            </p>

            <div className="space-y-3">
              {records.map((item) => (
                <button
                  key={item.id}
                  onClick={() => selectRecord(item.id)}
                  className={`w-full rounded-xl border p-4 text-left ${
                    selectedId === item.id
                      ? "border-emerald-600 bg-emerald-50"
                      : "border-gray-200 hover:border-emerald-300"
                  }`}
                >
                  <p className="font-semibold text-gray-900">{item.id}</p>
                  <p className="mt-1 text-sm text-gray-600">
                    {item.department} · {item.category} · {item.weight}
                  </p>
                  <p className="mt-2 text-xs font-semibold text-emerald-700">
                    {item.verified
                      ? "Disposal Verified"
                      : item.status}
                  </p>
                </button>
              ))}
            </div>
          </section>

          {/* Handover Form */}
          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm lg:col-span-3">
            <h2 className="text-lg font-bold text-gray-900">
              Handover Details
            </h2>
            <p className="mb-6 mt-1 text-sm text-gray-500">
              Enter the receiving facility and handover information.
            </p>

            {selected && (
              <>
                <div className="mb-6 rounded-xl bg-[#F5F7F5] p-4">
                  <p className="text-xs font-semibold text-gray-500">
                    SELECTED CONTAINER
                  </p>
                  <h3 className="mt-1 text-xl font-bold text-emerald-800">
                    {selected.id}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {selected.department} · {selected.category} ·{" "}
                    {selected.weight}
                  </p>
                </div>

                <form onSubmit={handleHandover} className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Treatment Facility Name
                    </label>
                    <input
                      value={facility}
                      onChange={(e) => setFacility(e.target.value)}
                      placeholder="Enter treatment facility name"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Receiving Staff Name
                    </label>
                    <input
                      value={receiver}
                      onChange={(e) => setReceiver(e.target.value)}
                      placeholder="Enter receiver name"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Handover Reference Number
                    </label>
                    <input
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      placeholder="Enter receipt or reference number"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Handover Remarks
                    </label>
                    <textarea
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      rows={3}
                      placeholder="Enter additional remarks..."
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-emerald-600"
                    />
                  </div>

                  {message && (
                    <div className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">
                      {message}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-[#176B45] px-5 py-3 font-semibold text-white hover:bg-[#125638]"
                  >
                    Record Handover
                  </button>
                </form>

                <div className="my-6 border-t border-gray-100" />

                {/* Disposal Verification */}
                <div>
                  <h3 className="font-bold text-gray-900">
                    Disposal Verification
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Record a demo verification after handover is completed.
                  </p>

                  <div className="mt-4 rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-gray-800">
                          Disposal verification
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {selected.verified
                            ? "Verification recorded in this demo."
                            : "Not yet verified"}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          selected.verified
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {selected.verified ? "Verified" : "Pending"}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleVerification}
                      disabled={selected.verified}
                      className="mt-4 w-full rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-gray-300"
                    >
                      {selected.verified
                        ? "Verification Recorded"
                        : "Record Demo Verification"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </section>
        </div>

        {/* Tracking History */}
        {selected && (
          <section className="mt-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">
              Container Tracking History
            </h2>
            <p className="mb-5 mt-1 text-sm text-gray-500">
              Activity history for {selected.id}
            </p>

            <div className="space-y-4">
              {selected.history.map((event, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-1 h-3 w-3 rounded-full bg-emerald-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {event}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Disclaimer */}
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <h3 className="font-semibold text-amber-900">
            Demonstration Mode – Important
          </h3>
          <p className="mt-2 text-sm leading-6 text-amber-800">
            All records are sample data stored temporarily in page state.
            Recording a demo verification does not prove that biomedical
            waste was actually treated or disposed of. Real verification
            requires authorized facility records, supporting documents,
            timestamps and backend validation.
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-gray-400">
          BioTrack · Every Trace Tells a Story of Care.
        </p>
      </div>
    </main>
  );
}
