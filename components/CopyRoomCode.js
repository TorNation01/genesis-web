"use client";

import { useState } from "react";

export default function CopyRoomCode({ code }) {
  const [done, setDone] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    } catch {
      setDone(false);
    }
  }

  return (
    <div className="mt-10 rounded-2xl border border-[#C9A84C]/25 bg-black/20 p-6 text-center">
      <p className="text-sm text-white/60">Rift Code</p>
      <p className="mt-2 font-mono text-3xl font-bold tracking-[0.35em] text-[#C9A84C]">
        {code}
      </p>
      <p className="mt-3 text-sm text-white/55">
        Share your Rift code with friends to join your campaign
      </p>
      <button
        type="button"
        onClick={copy}
        className="mt-4 rounded-full border border-[#C9A84C]/50 bg-[#C9A84C]/10 px-6 py-2 text-sm font-medium text-[#C9A84C] transition hover:bg-[#C9A84C]/20"
      >
        {done ? "Copied" : "Copy Rift code"}
      </button>
    </div>
  );
}
