import type { Metadata } from "next";
import { OtpForm } from "@/features/auth/components/OtpForm";

export const metadata: Metadata = {
  title: "Verify OTP - YegnaFinder",
};

export default function VerifyOtpPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#111625] text-slate-300 font-sans p-4 -m-8">
      {/* Logo Section */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-20 h-20 rounded-full border-[3px] border-[#2563eb] flex items-center justify-center bg-[#1e3a8a] mb-4 shadow-[0_0_15px_rgba(37,99,235,0.5)]">
          <div className="w-16 h-16 rounded-full border border-blue-400/30 flex items-center justify-center bg-[#1e40af]">
            <span className="text-3xl font-bold text-white tracking-tighter">Y</span>
          </div>
        </div>
        <h1 className="text-2xl font-black text-[#2563eb] tracking-widest uppercase mt-2">
          YEGNAFINDER
        </h1>
        <p className="text-xs text-slate-400 mt-1 font-medium tracking-wide">
          Ethiopia's Smart Local Discovery Platform
        </p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-sm bg-[#1e273f] rounded-2xl p-6 shadow-2xl border border-slate-700/50">
        <div className="text-center space-y-4 mb-6">
          <h2 className="text-[#3b82f6] text-xs font-bold tracking-[0.15em] uppercase">
            Two-Factor Challenge
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed px-2">
            A secure verification code has been dispatched.
          </p>
          <p className="text-xs text-slate-400">
            For simulation, enter code: 6582
          </p>
        </div>

        <OtpForm />
      </div>

      {/* Footer text */}
      <div className="mt-8 text-center space-y-2 opacity-60">
        <p className="text-[10px] text-slate-400 uppercase tracking-wider">
          Secure Connection. Authorized Personnel Only.
        </p>
        <p className="text-[10px] text-slate-500 uppercase tracking-[0.15em]">
          YEGNAFINDER SYNC ENGINE ACTIVE
        </p>
      </div>
    </div>
  );
}
