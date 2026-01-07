/**
 * Elite Login page with Cinematic UI
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "../../lib/auth";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      window.location.href = "/todos";
    } catch (err) {
      setError(err.message || "Invalid credentials. Neural link rejected.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail("demo@example.com");
    setPassword("demo");
    setError("");
    setLoading(true);

    try {
      await login("demo@example.com", "demo");
      window.location.href = "/todos";
    } catch (err) {
      setError(err.message || "Demo link failed. Systems offline.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      <div className="max-w-xl w-full animate-reveal">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-brand-400/30 text-brand-300 text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
            </span>
            Neural Authentication
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight text-white">
            Welcome <span className="text-gradient-elite">Back</span>
          </h1>
          <p className="text-gray-400 text-lg font-medium">Re-establish your neural connection.</p>
        </div>

        <div className="glass-panel p-10 md:p-14 rounded-[3rem] border-white/5 relative overflow-hidden group shadow-premium">
          <div className="absolute inset-0 bg-brand-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 mb-8 text-red-400 text-sm font-semibold flex items-center gap-3 animate-pop-in">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div className="space-y-6">
              <Input
                label="Neural ID (Email)"
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="identity@neural.link"
                required
                className="bg-black/40 border-white/10 focus:border-brand-500/50 py-4 px-6 rounded-2xl text-lg h-16"
              />

              <Input
                label="Security Key"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="bg-black/40 border-white/10 focus:border-brand-500/50 py-4 px-6 rounded-2xl text-lg h-16"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-brand-500 text-black rounded-2xl font-bold text-xl transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] shadow-neon hover:shadow-neon-hover disabled:opacity-50 btn-premium overflow-hidden relative"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="h-5 w-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  Synchronizing...
                </span>
              ) : (
                "Authorize Connection"
              )}
            </button>
          </form>

          <div className="mt-10 relative z-10">
            <div className="relative mb-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-[0.3em] font-black">
                <span className="px-4 bg-[#0a0f1d] text-gray-500">Bypass</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full py-5 glass-panel border-brand-500/20 text-brand-300 rounded-2xl font-bold text-xl hover:bg-brand-500/10 transition-all duration-500 hover:border-brand-500/40"
            >
              Initialize Demo Link
            </button>
          </div>

          <div className="mt-10 p-6 bg-brand-500/5 rounded-2xl border border-brand-500/10 group-hover:border-brand-500/20 transition-all duration-700">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-brand-300 text-sm mb-1 uppercase tracking-wider">Passive Mode Active</p>
                <p className="text-xs text-brand-200/60 leading-relaxed font-semibold">
                  System allows arbitrary identity verification. Neural profiles will be synthesized upon authorization.
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center mt-8 text-gray-500 text-sm font-medium">
          New to the system? <Link href="/tour" className="text-brand-400 hover:text-brand-300 underline underline-offset-4 decoration-brand-400/30">Explore the Interface</Link>
        </p>
      </div>
    </div>
  );
}
