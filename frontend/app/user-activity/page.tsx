
"use client";

import { useState } from "react";

type Staff = {
  id: number;
  name: string;
  email: string;
  department: string;
  role: string;
  status: string;
};

type Activity = {
  id: number;
  user: string;
  action: string;
  container: string;
  time: string;
};

const initialStaff: Staff[] = [
  {
    id: 1,
    name: "Rohit Sharma",
    email: "rohit@biotrack.demo",
    department: "Emergency Ward",
    role: "Waste Generator",
    status: "Active",
  },
  {
    id: 2,
    name: "Ananya Rao",
    email: "ananya@biotrack.demo",
    department: "Operation Theatre",
    role: "Collection Staff",
    status: "Active",
  },
  {
    id: 3,
    name: "Kiran Kumar",
    email: "kiran@biotrack.demo",
    department: "Waste Management",
    role: "Administrator",
    status: "Active",
  },
  {
    id: 4,
    name: "Meera N",
    email: "meera@biotrack.demo",
    department: "ICU",
    role: "Compliance Officer",
    status: "Active",
  },
];

const initialActivities: Activity[] = [
  {
    id: 1,
    user: "Rohit Sharma",
    action: "Waste container registered",
    container: "BT-2026-001",
    time: "09:15 AM",
  },
  {
    id: 2,
    user: "Ananya Rao",
    action: "Waste collection recorded",
    container: "BT-2026-002",
    time: "10:30 AM",
  },
  {
    id: 3,
    user: "Meera N",
    action: "Compliance record reviewed",
    container: "BT-2026-003",
    time: "11:45 AM",
  },
];

const roles = [
  "Waste Generator",
  "Collection Staff",
  "Transport Staff",
  "Compliance Officer",
  "Administrator",
];

export default function UserActivityPage() {
  const [staff, setStaff] = useState(initialStaff);
  const [activities, setActivities] = useState(initialActivities);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("Waste Generator");

  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const activeUsers = staff.filter(
    (person) => person.status === "Active"
  ).length;

  function addStaff(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !department.trim()) {
      setMessage("Please complete all staff details.");
      return;
    }

    if (
      staff.some(
        (person) => person.email.toLowerCase() === email.toLowerCase()
      )
    ) {
      setMessage("A staff member with this email already exists.");
      return;
    }

    const newStaff: Staff = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim(),
      department: department.trim(),
      role,
      status: "Active",
    };

    setStaff((previous) => [...previous, newStaff]);

    setActivities((previous) => [
      {
        id: Date.now() + 1,
        user: "Administrator",
        action: `Added staff member and assigned role: ${role}`,
        container: newStaff.name,
        time: new Date().toLocaleTimeString(),
      },
      ...previous,
    ]);

    setName("");
    setEmail("");
    setDepartment("");
    setRole("Waste Generator");
    setMessage("Staff member added successfully!");
  }

  function changeRole(id: number, newRole: string) {
    const person = staff.find((item) => item.id === id);
    if (!person) return;

    setStaff((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, role: newRole } : item
      )
    );

    setActivities((previous) => [
      {
        id: Date.now(),
        user: "Administrator",
        action: `Role changed from ${person.role} to ${newRole}`,
        container: person.name,
        time: new Date().toLocaleTimeString(),
      },
      ...previous,
    ]);

    setMessage(`Role updated for ${person.name}.`);
  }

  const filteredStaff = staff.filter((person) =>
    `${person.name} ${person.email} ${person.department} ${person.role}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#F5F7F5] p-5 md:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold text-emerald-700">
            BIOTRACK / ADMINISTRATION
          </p>
          <h1 className="text-3xl font-bold text-gray-900">
            User & Activity Management
          </h1>
          <p className="mt-2 text-gray-500">
            Manage staff responsibilities and review recorded system activities.
          </p>
        </div>

        {/* Statistics */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              label: "Total Staff",
              value: staff.length,
              color: "text-gray-900",
            },
            {
              label: "Active Users",
              value: activeUsers,
              color: "text-emerald-700",
            },
            {
              label: "Recorded Activities",
              value: activities.length,
              color: "text-blue-700",
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

          {/* Add Staff */}
          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm lg:col-span-2">
            <h2 className="text-lg font-bold text-gray-900">
              Add Staff Member
            </h2>
            <p className="mb-5 mt-1 text-sm text-gray-500">
              Register a staff member and assign a responsibility.
            </p>

            <form onSubmit={addStaff} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Full Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter staff name"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Department
                </label>
                <input
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Enter department"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Assign Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-emerald-600"
                >
                  {roles.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              {message && (
                <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">
                  {message}
                </p>
              )}

              <button
                type="submit"
                className="w-full rounded-xl bg-[#176B45] px-5 py-3 font-semibold text-white hover:bg-[#125638]"
              >
                Add Staff Member
              </button>
            </form>
          </section>

          {/* Staff Directory */}
          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm lg:col-span-3">
            <h2 className="text-lg font-bold text-gray-900">
              Staff Directory
            </h2>
            <p className="mb-5 mt-1 text-sm text-gray-500">
              View staff and manage their assigned roles.
            </p>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, department or role..."
              className="mb-5 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-emerald-600"
            />

            <div className="space-y-4">
              {filteredStaff.map((person) => (
                <div
                  key={person.id}
                  className="rounded-xl border border-gray-100 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {person.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {person.email}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {person.department}
                      </p>
                    </div>

                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {person.status}
                    </span>
                  </div>

                  <div className="mt-4">
                    <label className="mb-2 block text-xs font-semibold text-gray-500">
                      ASSIGNED RESPONSIBILITY
                    </label>
                    <select
                      value={person.role}
                      onChange={(e) =>
                        changeRole(person.id, e.target.value)
                      }
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-600"
                    >
                      {roles.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}

              {filteredStaff.length === 0 && (
                <p className="rounded-xl bg-gray-50 p-5 text-center text-sm text-gray-500">
                  No staff members found.
                </p>
              )}
            </div>
          </section>
        </div>

        {/* Audit Trail */}
        <section className="mt-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-gray-900">
              Compliance Activity Trail
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Review sample actions recorded in the system.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-500">
                  <th className="px-3 py-3">USER</th>
                  <th className="px-3 py-3">ACTIVITY</th>
                  <th className="px-3 py-3">REFERENCE</th>
                  <th className="px-3 py-3">TIME</th>
                </tr>
              </thead>

              <tbody>
                {activities.map((activity) => (
                  <tr key={activity.id} className="border-b border-gray-50">
                    <td className="px-3 py-4 text-sm font-medium text-gray-800">
                      {activity.user}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-600">
                      {activity.action}
                    </td>
                    <td className="px-3 py-4 text-sm text-emerald-700">
                      {activity.container}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500">
                      {activity.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Disclaimer */}
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <h3 className="font-semibold text-amber-900">
            Demo Mode – Audit Trail
          </h3>
          <p className="mt-2 text-sm leading-6 text-amber-800">
            Staff details and activity records are temporary demonstration
            data. Actual authentication, role-based access restrictions,
            tamper-resistant audit logs and permanent timestamps must be
            implemented through the backend and database.
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-gray-400">
          BioTrack · Every Trace Tells a Story of Care.
        </p>
      </div>
    </main>
  );
}
