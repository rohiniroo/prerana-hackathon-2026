
"use client";

import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setMessage("Please enter your email and password.");
      return;
    }

    setMessage(
      "Demo interface only. Authentication will be connected in a later step."
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F7F5] flex items-center justify-center p-5">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* LEFT BRANDING SECTION */}
        <section className="relative bg-[#176B45] text-white p-8 md:p-12 flex flex-col justify-between min-h-[560px] overflow-hidden">

          <div className="absolute w-80 h-80 rounded-full border border-white/10 -top-32 -right-24" />
          <div className="absolute w-64 h-64 rounded-full border border-white/10 -bottom-24 -left-20" />

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#176B45] text-2xl font-bold">
                B
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-wide">
                  BioTrack
                </h1>
                <p className="text-xs text-green-100 tracking-wider">
                  HEALTHCARE WASTE INTELLIGENCE
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 my-12">
            <p className="text-green-100 text-sm font-semibold uppercase tracking-[0.2em] mb-5">
              Every trace matters
            </p>

            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Care doesn't end at the bedside.
            </h2>

            <p className="text-lg text-green-50 leading-relaxed max-w-md">
              It continues with every safe step. Track biomedical waste,
              protect healthcare workers and build a safer tomorrow.
            </p>

            <div className="mt-9 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
                ✓
              </div>
              <p className="text-sm text-green-50">
                Responsible. Traceable. Accountable.
              </p>
            </div>
          </div>

          <div className="relative z-10 border-t border-white/20 pt-5">
            <p className="text-sm text-green-100">
              Every Trace Tells a Story of Care.
            </p>
            <p className="text-xs text-green-200 mt-2">
              PRERANA 2026 | TEAM DR.SUDHA
            </p>
          </div>
        </section>

        {/* RIGHT LOGIN SECTION */}
        <section className="p-8 md:p-12 flex flex-col justify-center">

          <div className="max-w-md w-full mx-auto">

            <div className="mb-9">
              <span className="text-sm font-semibold text-[#239B65]">
                WELCOME TO BIOTRACK
              </span>

              <h2 className="text-3xl font-bold text-[#202B25] mt-3">
                Welcome back
              </h2>

              <p className="text-gray-500 mt-2">
                Sign in to manage and monitor healthcare waste safely.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-800 outline-none focus:border-[#239B65] focus:ring-2 focus:ring-green-100 transition"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 pr-20 text-gray-800 outline-none focus:border-[#239B65] focus:ring-2 focus:ring-green-100 transition"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-[#176B45] hover:underline"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#176B45] hover:bg-[#125638] text-white font-semibold py-3.5 rounded-lg transition duration-200 shadow-md"
              >
                Sign In →
              </button>

              {message && (
                <div
                  role="status"
                  className="bg-green-50 border border-green-200 text-[#176B45] text-sm p-3 rounded-lg"
                >
                  {message}
                </div>
              )}

            </form>

            <div className="mt-9 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <span className="text-[#239B65]">●</span>
                Designed for safer healthcare waste management
              </div>

              <p className="text-center text-xs text-gray-400 mt-6">
                © 2026 BioTrack. Built with care and responsibility.
              </p>
            </div>

          </div>
        </section>

      </div>
    </main>
  );
}
