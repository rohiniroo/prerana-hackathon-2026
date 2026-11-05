
"use client";

import { useEffect, useState } from "react";
import {
  getBioTrackData,
  saveBioTrackData,
  subscribeToBioTrackData,
  type WasteRecord,
} from "../../src/lib/biotrack-store";

export default function WasteRegistration() {
  const [department, setDepartment] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("kg");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [records, setRecords] = useState<WasteRecord[]>([]);

  useEffect(() => {
    const load = () => setRecords(getBioTrackData().wasteRecords);
    load();
    return subscribeToBioTrackData(load);
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const amount = Number(quantity);

    if (!department || !category || !quantity || !date) {
      setMessage("Please fill in all required fields.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setMessage("Enter a valid quantity.");
      return;
    }

    const current = getBioTrackData();

    const newRecord: WasteRecord = {
      id: `BT-${Date.now()}`,
      department,
      category,
      quantity: amount,
      unit,
      date,
      notes: description,
    };

    const updated = {
      ...current,
      wasteRecords: [newRecord, ...current.wasteRecords],
      activities: [
        {
          id: `ACT-${Date.now()}`,
          action: `Registered ${category} waste in ${department}`,
          user: "Demo Administrator",
          date: new Date().toISOString(),
        },
        ...current.activities,
      ],
    };

    saveBioTrackData(updated);
    setRecords(updated.wasteRecords);
    setMessage("Record saved successfully.");

    setDepartment("");
    setCategory("");
    setQuantity("");
    setUnit("kg");
    setDate("");
    setDescription("");
  }

  const labelClass = "block text-sm font-semibold text-[#34443A] mb-3";
  const inputClass =
    "w-full h-[52px] rounded-xl border border-[#E5EAE6] bg-[#FCFDFC] px-4 text-sm text-[#26372D] outline-none transition focus:border-[#239B65] focus:ring-2 focus:ring-[#239B65]/10";

  return (
    <main className="min-h-screen bg-[#F5F7F5]">
      <div className="max-w-6xl mx-auto px-5 md:px-10 py-10 md:py-14">

        {/* TOP */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-xs font-bold tracking-[0.16em] uppercase text-[#239B65] mb-3">
              BioTrack / Registration
            </p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#202B25]">
              Waste Registration
            </h1>
          </div>

          <a
            href="/dashboard"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-[#176B45] hover:text-[#239B65]"
          >
            <span>←</span> Dashboard
          </a>
        </div>

        {/* SUMMARY */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
          <div className="bg-white border border-[#E9EEE9] rounded-2xl p-6">
            <p className="text-sm text-gray-400 font-medium">Total records</p>
            <p className="text-3xl font-bold text-[#176B45] mt-3">
              {records.length}
            </p>
          </div>

          <div className="bg-[#176B45] rounded-2xl p-6">
            <p className="text-sm text-green-100 font-medium">Platform</p>
            <p className="text-2xl font-bold text-white mt-3">
              BioTrack
            </p>
          </div>
        </div>

        {/* FORM */}
        <section className="bg-white border border-[#E9EEE9] rounded-2xl shadow-sm">

          <div className="px-6 md:px-9 py-7 border-b border-[#EEF1EE]">
            <h2 className="text-xl font-bold text-[#202B25]">
              New Registration
            </h2>
            <p className="text-sm text-gray-400 mt-2">
              Enter the details below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-9">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-9 gap-y-8">

              <div>
                <label htmlFor="department" className={labelClass}>
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  id="department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                  className={inputClass}
                >
                  <option value="">Select department</option>
                  <option value="Emergency Ward">Emergency Ward</option>
                  <option value="Operation Theatre">Operation Theatre</option>
                  <option value="ICU">ICU</option>
                  <option value="Laboratory">Laboratory</option>
                  <option value="General Ward">General Ward</option>
                  <option value="Maternity Ward">Maternity Ward</option>
                  <option value="Outpatient Department">Outpatient Department</option>
                </select>
              </div>

              <div>
                <label htmlFor="category" className={labelClass}>
                  Waste Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className={inputClass}
                >
                  <option value="">Select category</option>
                  <option value="Yellow">Yellow</option>
                  <option value="Red">Red</option>
                  <option value="White">White</option>
                  <option value="Blue">Blue</option>
                </select>
              </div>

              <div>
                <label htmlFor="quantity" className={labelClass}>
                  Quantity <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-3">
                  <input
                    id="quantity"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="0.00"
                    required
                    className={inputClass}
                  />
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    aria-label="Unit"
                    className="h-[52px] rounded-xl border border-[#E5EAE6] bg-white px-4 text-sm outline-none focus:border-[#239B65]"
                  >
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="date" className={labelClass}>
                  Generation Date <span className="text-red-500">*</span>
                </label>
                <input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  required
                  className={inputClass}
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className={labelClass}>
                  Notes <span className="font-normal text-gray-400">(Optional)</span>
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a note..."
                  className="w-full rounded-xl border border-[#E5EAE6] bg-[#FCFDFC] px-4 py-4 text-sm outline-none resize-none focus:border-[#239B65] focus:ring-2 focus:ring-[#239B65]/10"
                />
              </div>
            </div>

            {message && (
              <div role="status" className="mt-7 rounded-xl bg-green-50 border border-green-100 px-5 py-4 text-sm text-[#176B45]">
                {message}
              </div>
            )}

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-9 pt-7 border-t border-[#EEF1EE]">
              <button
                type="button"
                onClick={() => {
                  setDepartment("");
                  setCategory("");
                  setQuantity("");
                  setUnit("kg");
                  setDate("");
                  setDescription("");
                  setMessage("");
                }}
                className="h-[50px] px-7 rounded-xl border border-[#E5EAE6] text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
              >
                Clear
              </button>

              <button
                type="submit"
                className="h-[50px] px-8 rounded-xl bg-[#176B45] text-white text-sm font-semibold hover:bg-[#125638] transition shadow-sm"
              >
                + Register Waste
              </button>
            </div>
          </form>
        </section>

        {/* RECORDS */}
        <section className="mt-10 bg-white border border-[#E9EEE9] rounded-2xl shadow-sm overflow-hidden">

          <div className="px-6 md:px-8 py-7 flex items-center justify-between border-b border-[#EEF1EE]">
            <div>
              <h2 className="text-xl font-bold text-[#202B25]">
                Recent Records
              </h2>
              <p className="text-sm text-gray-400 mt-2">
                Registration history
              </p>
            </div>
            <span className="rounded-full bg-[#EAF5EE] text-[#176B45] text-sm font-semibold px-4 py-2">
              {records.length}
            </span>
          </div>

          {records.length === 0 ? (
            <div className="py-16 text-center">
              <div className="text-4xl mb-4">♻️</div>
              <p className="font-semibold text-gray-600">No records yet</p>
              <p className="text-sm text-gray-400 mt-2">
                New registrations will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left">
                <thead className="bg-[#F8FAF8] text-xs uppercase tracking-wider text-gray-400">
                  <tr>
                    <th className="px-7 py-5">Record ID</th>
                    <th className="px-7 py-5">Department</th>
                    <th className="px-7 py-5">Category</th>
                    <th className="px-7 py-5">Quantity</th>
                    <th className="px-7 py-5">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record.id} className="border-t border-gray-100 text-sm hover:bg-gray-50">
                      <td className="px-7 py-5 font-semibold text-[#176B45]">
                        {record.id}
                      </td>
                      <td className="px-7 py-5 text-gray-600">
                        {record.department}
                      </td>
                      <td className="px-7 py-5 text-gray-600">
                        {record.category}
                      </td>
                      <td className="px-7 py-5 text-gray-600">
                        {record.quantity} {record.unit}
                      </td>
                      <td className="px-7 py-5 text-gray-600">
                        {record.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer className="text-center text-xs text-gray-400 mt-12 pb-5">
          BioTrack · Every Trace Tells a Story of Care.
        </footer>
      </div>
    </main>
  );
}
