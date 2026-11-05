
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import {
  getBioTrackData,
  subscribeToBioTrackData,
  type ContainerRecord,
} from "../../src/lib/biotrack-store";

type QRContainer = ContainerRecord & {
  date: string;
  unit: string;
};

function QRScanner({
  onScan,
}: {
  onScan: (value: string) => void;
}) {
  const scannerRef = useRef<{ clear: () => Promise<void> } | null>(null);
  const callbackRef = useRef(onScan);

  useEffect(() => {
    callbackRef.current = onScan;
  }, [onScan]);

  useEffect(() => {
    let cancelled = false;

    async function startScanner() {
      try {
        const { Html5QrcodeScanner } = await import("html5-qrcode");

        if (cancelled) return;

        const scanner = new Html5QrcodeScanner(
          "biotrack-qr-reader",
          {
            fps: 10,
            qrbox: { width: 220, height: 220 },
            aspectRatio: 1,
          },
          false
        );

        scannerRef.current = scanner;

        scanner.render(
          (decodedText) => callbackRef.current(decodedText),
          () => {}
        );
      } catch {
        if (!cancelled) callbackRef.current("SCANNER_ERROR");
      }
    }

    void startScanner();

    return () => {
      cancelled = true;

      if (scannerRef.current) {
        void scannerRef.current.clear().catch(() => {});
        scannerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div id="biotrack-qr-reader" />
      <p className="mt-3 text-center text-xs text-gray-500">
        Allow camera access when your browser requests permission.
      </p>
    </div>
  );
}

export default function QRTracking() {
  const [containers, setContainers] = useState<QRContainer[]>([]);
  const [selected, setSelected] = useState<QRContainer | null>(null);
  const [manualId, setManualId] = useState("");
  const [scanMessage, setScanMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success"
  );
  const [showScanner, setShowScanner] = useState(false);

  const loadContainers = useCallback(() => {
    const data = getBioTrackData();

    const actualContainers: QRContainer[] = data.containers.map(
      (container) => {
        const wasteRecord = data.wasteRecords.find(
          (record) => record.id === container.wasteId
        );

        return {
          ...container,
          date: wasteRecord?.date || container.createdAt.slice(0, 10),
          unit: wasteRecord?.unit || "kg",
        };
      }
    );

    setContainers(actualContainers);

    setSelected((current) => {
      if (!current) return actualContainers[0] || null;

      return (
        actualContainers.find((item) => item.id === current.id) ||
        actualContainers[0] ||
        null
      );
    });
  }, []);

  useEffect(() => {
    loadContainers();
    return subscribeToBioTrackData(loadContainers);
  }, [loadContainers]);

  const identifyContainer = useCallback(
    (value: string) => {
      const id = value.trim();

      if (id === "SCANNER_ERROR") {
        setMessageType("error");
        setScanMessage(
          "Scanner could not start. Check camera permission and try again."
        );
        return;
      }

      const found = containers.find(
        (container) => container.id.toLowerCase() === id.toLowerCase()
      );

      if (found) {
        setSelected(found);
        setManualId(found.id);
        setMessageType("success");
        setScanMessage(`Container ${found.id} identified successfully.`);
        setShowScanner(false);
      } else {
        setSelected(null);
        setMessageType("error");
        setScanMessage(`No container found for "${id}".`);
      }
    },
    [containers]
  );

  function getStatusStyle(status: string) {
    const normalized = status.toLowerCase();

    if (normalized.includes("dispos") || normalized.includes("handed")) {
      return "bg-green-100 text-green-800";
    }

    if (normalized.includes("transit")) {
      return "bg-blue-100 text-blue-800";
    }

    if (normalized.includes("collect")) {
      return "bg-emerald-100 text-emerald-800";
    }

    if (normalized.includes("delay")) {
      return "bg-red-100 text-red-800";
    }

    return "bg-amber-100 text-amber-800";
  }

  function getTrackingStages(status: string) {
    const normalized = status.toLowerCase();

    const collectionDone =
      normalized.includes("collect") ||
      normalized.includes("transit") ||
      normalized.includes("handed") ||
      normalized.includes("dispos");

    const transportDone =
      normalized.includes("transit") ||
      normalized.includes("handed") ||
      normalized.includes("dispos");

    const handoverDone =
      normalized.includes("handed") || normalized.includes("dispos");

    const disposalDone = normalized.includes("dispos");

    return [
      {
        title: "Waste Registered",
        description: "Waste generation details recorded.",
        completed: true,
      },
      {
        title: "Container Identified",
        description: "Unique container ID assigned.",
        completed: true,
      },
      {
        title: "Collection",
        description: "Waste collected from department.",
        completed: collectionDone,
      },
      {
        title: "Transportation",
        description: "Waste moved to the designated facility.",
        completed: transportDone,
      },
      {
        title: "Handover",
        description: "Container received by the authorized facility.",
        completed: handoverDone,
      },
      {
        title: "Disposal Verification",
        description: "Final disposal confirmation recorded.",
        completed: disposalDone,
      },
    ];
  }

  function downloadQR() {
    if (!selected) return;

    const svg = document.querySelector(
      "#biotrack-generated-qr svg"
    );

    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${selected.id}-QR.svg`;
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-[#F5F7F5]">
      <div className="mx-auto max-w-7xl px-5 py-9 md:px-9">

        {/* PAGE HEADER */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#239B65]">
              EP-02 / Container Identification
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#202B25]">
              QR Tracking
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Identify and trace every registered waste container.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#176B45] transition hover:bg-green-50"
          >
            ← Dashboard
          </Link>
        </div>

        {/* SUMMARY */}
        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Registered Containers</p>
            <p className="mt-2 text-3xl font-bold text-[#176B45]">
              {containers.length}
            </p>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">QR Ready</p>
            <p className="mt-2 text-3xl font-bold text-[#176B45]">
              {containers.length}
            </p>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Selected Container</p>
            <p className="mt-2 truncate text-lg font-bold text-[#202B25]">
              {selected?.id || "None"}
            </p>
          </div>
        </div>

        {/* MAIN WORKSPACE */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

          {/* QR GENERATOR */}
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-xl text-[#176B45]">
                  ▦
                </div>
                <div>
                  <h2 className="font-bold text-[#202B25]">
                    Generate QR Code
                  </h2>
                  <p className="text-xs text-gray-500">
                    Create a unique identity for a container
                  </p>
                </div>
              </div>
            </div>

            {containers.length > 0 ? (
              <>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Select Container
                </label>

                <select
                  value={selected?.id || ""}
                  onChange={(event) => {
                    const found = containers.find(
                      (item) => item.id === event.target.value
                    );
                    setSelected(found || null);
                    setScanMessage("");
                  }}
                  className="mb-6 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#239B65]"
                >
                  {containers.map((container) => (
                    <option key={container.id} value={container.id}>
                      {container.id} — {container.department}
                    </option>
                  ))}
                </select>

                {selected && (
                  <div className="flex flex-col items-center rounded-xl border border-gray-100 bg-[#F8FAF8] p-6">
                    <div
                      id="biotrack-generated-qr"
                      className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
                    >
                      <QRCodeSVG
                        value={selected.id}
                        size={210}
                        level="H"
                        includeMargin
                      />
                    </div>

                    <h3 className="mt-5 text-xl font-bold text-[#176B45]">
                      {selected.id}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {selected.department}
                    </p>

                    <button
                      onClick={downloadQR}
                      className="mt-5 rounded-lg bg-[#176B45] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#125638]"
                    >
                      Download QR Code
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-5 py-12 text-center">
                <p className="text-lg font-semibold text-gray-700">
                  No containers available
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Register waste and create a container first.
                </p>
                <Link
                  href="/container-management"
                  className="mt-5 inline-block rounded-lg bg-[#176B45] px-5 py-3 text-sm font-semibold text-white"
                >
                  Go to Container Management
                </Link>
              </div>
            )}
          </section>

          {/* QR SCANNER */}
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-xl text-[#176B45]">
                ⌕
              </div>
              <div>
                <h2 className="font-bold text-[#202B25]">
                  Scan QR Code
                </h2>
                <p className="text-xs text-gray-500">
                  Identify a container instantly
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-[#F8FAF8] p-7 text-center">
              <div className="text-5xl text-[#176B45]">▦</div>
              <p className="mt-3 font-semibold text-gray-700">
                Camera Scanner
              </p>
              <button
                onClick={() => setShowScanner((current) => !current)}
                className="mt-5 rounded-lg bg-[#176B45] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#125638]"
              >
                {showScanner ? "Close Scanner" : "Open Camera"}
              </button>
            </div>

            {showScanner && (
              <div className="mt-5">
                <QRScanner onScan={identifyContainer} />
              </div>
            )}

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs text-gray-400">OR ENTER ID</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Container ID
            </label>

            <div className="flex gap-2">
              <input
                value={manualId}
                onChange={(event) => setManualId(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") identifyContainer(manualId);
                }}
                placeholder="Enter container ID"
                className="min-w-0 flex-1 rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#239B65]"
              />

              <button
                onClick={() => identifyContainer(manualId)}
                className="rounded-lg bg-[#239B65] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#176B45]"
              >
                Find
              </button>
            </div>

            {scanMessage && (
              <div
                role="status"
                className={`mt-4 rounded-lg border p-3 text-sm ${
                  messageType === "success"
                    ? "border-green-200 bg-green-50 text-green-800"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {scanMessage}
              </div>
            )}
          </section>
        </div>

        {/* CONTAINER DETAILS */}
        {selected && (
          <section className="mt-7 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#239B65]">
                  Container Record
                </p>
                <h2 className="mt-2 text-2xl font-bold text-[#202B25]">
                  {selected.id}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {selected.department} · {selected.category} Category
                </p>
              </div>

              <span
                className={`rounded-full px-4 py-2 text-xs font-semibold ${getStatusStyle(
                  selected.status
                )}`}
              >
                {selected.status}
              </span>
            </div>

            <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-[#F5F7F5] p-5">
                <p className="text-xs text-gray-500">Quantity</p>
                <p className="mt-2 text-xl font-bold text-gray-800">
                  {selected.quantity} {selected.unit}
                </p>
              </div>

              <div className="rounded-xl bg-[#F5F7F5] p-5">
                <p className="text-xs text-gray-500">Department</p>
                <p className="mt-2 text-lg font-bold text-gray-800">
                  {selected.department}
                </p>
              </div>

              <div className="rounded-xl bg-[#F5F7F5] p-5">
                <p className="text-xs text-gray-500">Generation Date</p>
                <p className="mt-2 text-lg font-bold text-gray-800">
                  {selected.date}
                </p>
              </div>
            </div>

            <div className="mt-9">
              <h3 className="font-bold text-[#202B25]">
                Container Journey
              </h3>

              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {getTrackingStages(selected.status).map((stage, index) => (
                  <div
                    key={stage.title}
                    className="flex items-start gap-3 rounded-xl border border-gray-100 p-4"
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                        stage.completed
                          ? "bg-[#176B45] text-white"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {stage.completed ? "✓" : index + 1}
                    </div>

                    <div>
                      <p
                        className={`text-sm font-semibold ${
                          stage.completed
                            ? "text-[#176B45]"
                            : "text-gray-600"
                        }`}
                      >
                        {stage.title}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-gray-400">
                        {stage.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-6 border-t border-gray-100 pt-4 text-xs text-gray-400">
              Demo tracking record. Verified timestamps and disposal
              confirmation will be connected to the backend later.
            </p>
          </section>
        )}

        <footer className="py-8 text-center text-xs text-gray-400">
          BioTrack · Every Trace Tells a Story of Care.
          <br />
          PRERANA 2026 · TEAM DR.SUDHA
        </footer>
      </div>
    </main>
  );
}
