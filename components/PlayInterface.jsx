"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase";

// Browser TTS for Chronicler responses
function speakText(text, muted) {
  if (muted || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice =
    voices.find(
      (v) =>
        v.name.includes("Daniel") ||
        v.name.includes("Google UK English Male") ||
        v.name.includes("Arthur") ||
        (v.lang.startsWith("en") && v.name.toLowerCase().includes("male")),
    ) || voices.find((v) => v.lang.startsWith("en"));
  if (preferredVoice) utterance.voice = preferredVoice;
  utterance.rate = 0.88;
  utterance.pitch = 0.75;
  utterance.volume = 0.9;
  window.speechSynthesis.speak(utterance);
}

const INCOMPETECH_BASE =
  "https://incompetech.com/music/royalty-free/mp3-royaltyfree";

/** Scene mood loops — Kevin MacLeod / incompetech.com (CC BY 4.0). */
const MOOD_MUSIC = {
  exploration: `${INCOMPETECH_BASE}/Light%20Awash.mp3`,
  tense_combat: `${INCOMPETECH_BASE}/Volatile%20Reaction.mp3`,
  investigation: `${INCOMPETECH_BASE}/Comfortable%20Mystery%203.mp3`,
  triumph: `${INCOMPETECH_BASE}/Winner%20Winner.mp3`,
  dread: `${INCOMPETECH_BASE}/Despair%20and%20Triumph.mp3`,
  sanctuary: `${INCOMPETECH_BASE}/Angel%20Share.mp3`,
  revelation: `${INCOMPETECH_BASE}/Temple%20of%20the%20Manes.mp3`,
  nemesis: `${INCOMPETECH_BASE}/Heart%20of%20Nowhere.mp3`,
};

function D20({ rolling, result, onRoll }) {
  const canvasRef = useRef(null);
  const rotationRef = useRef({ x: 0, y: 0 });
  const animRef = useRef(null);
  const [localResult, setLocalResult] = useState(null);

  useEffect(() => {
    if (result != null) setLocalResult(result);
  }, [result]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const size = canvas.width;
    const cx = size / 2;
    const cy = size / 2;
    const r = size * 0.38;

    function drawDie(rotation) {
      ctx.clearRect(0, 0, size, size);

      const grd = ctx.createRadialGradient(cx, cy, r * 0.3, cx, cy, r * 1.2);
      grd.addColorStop(0, "rgba(74,127,212,0.15)");
      grd.addColorStop(1, "rgba(74,127,212,0)");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, size, size);

      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = rotation + (i * Math.PI * 2) / 6;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle) * 0.85;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();

      const bodyGrd = ctx.createRadialGradient(cx - r * 0.2, cy - r * 0.2, 0, cx, cy, r);
      bodyGrd.addColorStop(0, "rgba(30, 60, 110, 0.95)");
      bodyGrd.addColorStop(0.6, "rgba(13, 27, 53, 0.95)");
      bodyGrd.addColorStop(1, "rgba(7, 8, 15, 0.98)");
      ctx.fillStyle = bodyGrd;
      ctx.fill();

      ctx.strokeStyle = "rgba(201,168,76,0.6)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      for (let i = 0; i < 3; i++) {
        const angle = rotation + (i * Math.PI * 2) / 3;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(
          cx + r * 0.75 * Math.cos(angle),
          cy + r * 0.75 * Math.sin(angle) * 0.85,
        );
        ctx.strokeStyle = "rgba(201,168,76,0.2)";
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = rotation + (i * Math.PI * 2) / 6;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle) * 0.85;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      const edgeGrd = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
      edgeGrd.addColorStop(0, "rgba(201,168,76,0.8)");
      edgeGrd.addColorStop(0.5, "rgba(232,185,79,0.3)");
      edgeGrd.addColorStop(1, "rgba(201,168,76,0.1)");
      ctx.strokeStyle = edgeGrd;
      ctx.lineWidth = 2;
      ctx.stroke();

      const displayNum = localResult || "⚔";
      ctx.font = `bold ${r * 0.65}px 'Cinzel', serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = localResult
        ? localResult === 20
          ? "#E8B94F"
          : localResult === 1
            ? "#C04040"
            : "rgba(232,220,200,0.9)"
        : "rgba(201,168,76,0.5)";
      ctx.fillText(String(displayNum), cx, cy + 2);

      if (localResult === 20) {
        ctx.shadowColor = "rgba(232,185,79,0.8)";
        ctx.shadowBlur = 20;
        ctx.fillText(String(displayNum), cx, cy + 2);
        ctx.shadowBlur = 0;
      }
    }

    let rot = rotationRef.current.x;
    if (rolling) {
      let speed = 0.15;
      let frames = 0;
      function spin() {
        rot += speed;
        speed *= 0.97;
        frames++;
        drawDie(rot);
        if (frames < 80) {
          animRef.current = requestAnimationFrame(spin);
        } else {
          rotationRef.current.x = rot;
        }
      }
      animRef.current = requestAnimationFrame(spin);
    } else {
      drawDie(rot);
    }

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [rolling, localResult]);

  function handleRoll() {
    const val = Math.floor(Math.random() * 20) + 1;
    setLocalResult(val);
    onRoll(val);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <canvas
        ref={canvasRef}
        width={110}
        height={110}
        onClick={handleRoll}
        style={{
          cursor: "pointer",
          filter: rolling
            ? "drop-shadow(0 0 12px rgba(201,168,76,0.6))"
            : "drop-shadow(0 0 4px rgba(201,168,76,0.2))",
          transition: "filter 0.3s",
        }}
      />
      <button
        type="button"
        onClick={handleRoll}
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 10,
          letterSpacing: "0.15em",
          color: "rgba(201,168,76,0.7)",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
        }}
      >
        ROLL D20
      </button>
    </div>
  );
}

function MessageBubble({ msg, isLatest }) {
  const isUser = msg.role === "user";
  const isRoll = msg.content?.startsWith("[ROLL:");

  if (isRoll) {
    const rollMatch = msg.content.match(/\[ROLL:\s*(\d+)\/20\s*—\s*([^\]]+)\]/);
    const n = rollMatch?.[1] ?? "?";
    const label = rollMatch?.[2] ?? "Roll";
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "8px 0",
          animation: isLatest ? "fade-up 0.4s ease both" : "none",
        }}
      >
        <div
          style={{
            padding: "8px 20px",
            background: "rgba(201,168,76,0.08)",
            border: "1px solid rgba(201,168,76,0.2)",
            fontFamily: "var(--font-display)",
            fontSize: 12,
            letterSpacing: "0.1em",
            color: "var(--gold)",
          }}
        >
          🎲 Rolled {n}/20 — {label}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        padding: "6px 0",
        animation: isLatest ? "fade-up 0.4s ease both" : "none",
      }}
    >
      <div
        style={{
          maxWidth: "80%",
          padding: "14px 18px",
          background: isUser ? "rgba(27,58,107,0.5)" : "rgba(13,20,40,0.7)",
          border: isUser
            ? "1px solid rgba(74,127,212,0.3)"
            : "1px solid rgba(201,168,76,0.1)",
          backdropFilter: "blur(8px)",
          borderRadius: isUser ? "12px 12px 2px 12px" : "2px 12px 12px 12px",
        }}
      >
        {!isUser && (
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 9,
              letterSpacing: "0.2em",
              color: "var(--gold)",
              opacity: 0.6,
              marginBottom: 6,
            }}
          >
            THE CHRONICLER
          </div>
        )}
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 16,
            lineHeight: 1.7,
            color: isUser ? "rgba(200,215,240,0.9)" : "var(--mist)",
            margin: 0,
            whiteSpace: "pre-wrap",
          }}
        >
          {msg.content}
        </p>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "8px 0" }}>
      <div
        style={{
          padding: "12px 18px",
          background: "rgba(13,20,40,0.7)",
          border: "1px solid rgba(201,168,76,0.1)",
          borderRadius: "2px 12px 12px 12px",
          display: "flex",
          gap: 5,
          alignItems: "center",
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "rgba(201,168,76,0.6)",
              animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function RollGrid({ onSelect }) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "100%",
        right: 0,
        marginBottom: 8,
        background: "rgba(7,8,15,0.97)",
        border: "1px solid rgba(201,168,76,0.2)",
        backdropFilter: "blur(12px)",
        padding: 16,
        width: 280,
        animation: "fade-up 0.2s ease both",
        zIndex: 10,
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 10,
          letterSpacing: "0.2em",
          color: "var(--gold)",
          marginBottom: 12,
          opacity: 0.7,
        }}
      >
        SELECT YOUR ROLL
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 4,
          marginBottom: 8,
        }}
      >
        {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onSelect(n)}
            style={{
              padding: "8px 0",
              background:
                n === 20
                  ? "rgba(232,185,79,0.15)"
                  : n === 1
                    ? "rgba(192,64,64,0.15)"
                    : "rgba(13,27,53,0.5)",
              border:
                n === 20
                  ? "1px solid rgba(232,185,79,0.4)"
                  : n === 1
                    ? "1px solid rgba(192,64,64,0.3)"
                    : "1px solid rgba(201,168,76,0.1)",
              color: n === 20 ? "#E8B94F" : n === 1 ? "#C04040" : "var(--silver)",
              fontFamily: "var(--font-display)",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor =
                n === 20
                  ? "rgba(232,185,79,0.4)"
                  : n === 1
                    ? "rgba(192,64,64,0.3)"
                    : "rgba(201,168,76,0.1)";
            }}
          >
            {n}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onSelect(Math.floor(Math.random() * 20) + 1)}
        style={{
          width: "100%",
          padding: "10px",
          background: "rgba(201,168,76,0.1)",
          border: "1px solid rgba(201,168,76,0.25)",
          color: "var(--gold)",
          fontFamily: "var(--font-display)",
          fontSize: 11,
          letterSpacing: "0.15em",
          cursor: "pointer",
        }}
      >
        🎲 ROLL FOR ME
      </button>
    </div>
  );
}

function SparkDisplay({ spark }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 10,
          letterSpacing: "0.15em",
          color: "var(--silver)",
          opacity: 0.5,
        }}
      >
        SPARK
      </span>
      <div style={{ display: "flex", gap: 3 }}>
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: i < (spark || 0) ? "var(--gold)" : "rgba(201,168,76,0.15)",
              boxShadow: i < (spark || 0) ? "0 0 4px rgba(201,168,76,0.5)" : "none",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 11,
          color: "var(--gold)",
          fontWeight: 600,
        }}
      >
        {spark || 0}
      </span>
    </div>
  );
}

const MOOD_LABELS = {
  exploration: { label: "Exploring", color: "#4A7FD4", icon: "🗺" },
  tense_combat: { label: "Combat", color: "#C04040", icon: "⚔️" },
  investigation: { label: "Investigation", color: "#6B4A7F", icon: "🔍" },
  triumph: { label: "Triumph", color: "#C9A84C", icon: "✦" },
  dread: { label: "Dread", color: "#2A2A3A", icon: "🌑" },
  sanctuary: { label: "Sanctuary", color: "#1A6B2A", icon: "🕯" },
  revelation: { label: "Revelation", color: "#E8B94F", icon: "💫" },
  nemesis: { label: "Nemesis", color: "#8B2020", icon: "👁" },
};

export default function PlayInterface({ campaignId, userId: _userId }) {
  const [messages, setMessages] = useState([]);
  const [campaign, setCampaign] = useState(null);
  const [state, setState] = useState(null);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showRoll, setShowRoll] = useState(false);
  const [rolling, setRolling] = useState(false);
  const [dieResult, setDieResult] = useState(null);
  const [muted, setMuted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  const mutedRef = useRef(muted);
  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);
  const lastMoodUrlRef = useRef(null);
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/play/campaign?id=${campaignId}`);
        if (!res.ok) throw new Error("Could not load campaign");
        const data = await res.json();
        setCampaign(data.campaign);
        setMessages(data.messages || []);
        setState(data.state);
        setLoaded(true);
      } catch {
        setError("Could not load your campaign. Please try again.");
        setLoaded(true);
      }
    }
    load();
  }, [campaignId]);

  useEffect(() => {
    window.speechSynthesis?.getVoices();
    const onVoicesChanged = () => {
      window.speechSynthesis?.getVoices();
    };
    window.speechSynthesis?.addEventListener("voiceschanged", onVoicesChanged);
    return () => {
      window.speechSynthesis?.removeEventListener("voiceschanged", onVoicesChanged);
    };
  }, []);

  useEffect(() => {
    if (!campaignId) return;

    const channel = supabase
      .channel(`campaign:${campaignId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `campaign_id=eq.${campaignId}`,
        },
        (payload) => {
          const newMsg = payload.new;
          if (newMsg.role === "assistant") {
            setIsTyping(false);
            let appended = false;
            setMessages((prev) => {
              if (newMsg.id && prev.some((m) => m.id === newMsg.id)) return prev;
              if (
                prev.some(
                  (m) =>
                    m.created_at === newMsg.created_at && m.content === newMsg.content,
                )
              ) {
                return prev;
              }
              appended = true;
              return [...prev, newMsg];
            });
            if (appended && !mutedRef.current) {
              const cleanText = newMsg.content
                .replace(/\[NPC:[^\]]+\]/g, "")
                .replace(/\[CHRONICLER\]/g, "")
                .replace(/\[WITNESS\]/g, "")
                .trim();
              setTimeout(() => speakText(cleanText, mutedRef.current), 300);
            }
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "campaign_state",
          filter: `campaign_id=eq.${campaignId}`,
        },
        (payload) => {
          setState(payload.new);
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [campaignId, supabase]);

  const mood = state?.scene_mood || "exploration";
  const moodUrl = MOOD_MUSIC[mood] ?? MOOD_MUSIC.exploration;

  useEffect(() => {
    let el = audioRef.current;
    if (!el) {
      el = new Audio();
      audioRef.current = el;
    }

    if (muted) {
      el.pause();
      return;
    }

    if (lastMoodUrlRef.current === moodUrl && !el.paused) return;

    lastMoodUrlRef.current = moodUrl;
    el.loop = true;
    el.volume = 0.28;
    el.src = moodUrl;
    void el.play().catch(() => {});

    return () => {
      el.pause();
    };
  }, [moodUrl, muted]);

  useEffect(() => {
    return () => {
      const a = audioRef.current;
      if (a) {
        a.pause();
        a.src = "";
        a.load();
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = useCallback(
    async (text) => {
      if (!text?.trim() || sending) return;
      const msg = text.trim();
      setInput("");
      setSending(true);
      setIsTyping(true);
      setShowRoll(false);

      const tempMsg = {
        role: "user",
        content: msg,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, tempMsg]);

      try {
        const res = await fetch("/api/play/message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ campaignId, message: msg }),
        });
        if (!res.ok) throw new Error("Send failed");
      } catch {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "The Rift flickers. Something disrupted the connection — please try again.",
            created_at: new Date().toISOString(),
          },
        ]);
      } finally {
        setSending(false);
      }
    },
    [campaignId, sending],
  );

  function handleRoll(value) {
    setRolling(true);
    setDieResult(value);
    setShowRoll(false);
    setTimeout(() => setRolling(false), 2000);

    const tier =
      value === 20
        ? "Echo Surge — legendary!"
        : value >= 18
          ? "Critical Success"
          : value >= 12
            ? "Success"
            : value >= 7
              ? "Partial Success"
              : value > 1
                ? "Failure"
                : "Critical Failure";

    void sendMessage(
      `I rolled ${value} on my d20. Tier: ${tier}. Weave this into the story naturally.`,
    );
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage(input);
    }
  }

  const moodConfig = MOOD_LABELS[mood] || MOOD_LABELS.exploration;
  const worldTitle = campaign
    ? campaign.mash_enabled && campaign.secondary_genre
      ? `${campaign.primary_genre} × ${campaign.secondary_genre}`
      : campaign.primary_genre || "Your Adventure"
    : "Loading...";

  if (!loaded) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--void)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: "var(--font-deco)",
              fontSize: 24,
              color: "var(--gold)",
              marginBottom: 16,
              animation: "rift-pulse 2s infinite",
            }}
          >
            GENESIS
          </div>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontStyle: "italic",
              color: "var(--silver)",
              opacity: 0.6,
            }}
          >
            The Rift opens...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--void)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
        <Image
          src="/genesis-bg-rift-tinted.png"
          alt=""
          fill
          style={{ objectFit: "cover", objectPosition: "center 30%" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(7,8,15,0.75)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(7,8,15,0.8) 0%, rgba(7,8,15,0.3) 30%, rgba(7,8,15,0.5) 100%)",
          }}
        />
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 10,
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(7,8,15,0.7)",
          borderBottom: "1px solid rgba(201,168,76,0.1)",
          backdropFilter: "blur(12px)",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <Image
              src="/genesis-logo.png"
              alt="Genesis"
              width={32}
              height={32}
              style={{ objectFit: "contain" }}
            />
          </Link>
          <div
            style={{
              width: 1,
              height: 24,
              background: "rgba(201,168,76,0.2)",
            }}
          />
          <div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 13,
                fontWeight: 600,
                color: "var(--mist)",
                letterSpacing: "0.05em",
              }}
            >
              {worldTitle}
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 9,
                letterSpacing: "0.2em",
                color: "var(--silver)",
                opacity: 0.4,
              }}
            >
              {campaign?.time_period?.toUpperCase().replace("_", " ") || ""}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 14px",
            background: `${moodConfig.color}15`,
            border: `1px solid ${moodConfig.color}30`,
          }}
        >
          <span style={{ fontSize: 14 }}>{moodConfig.icon}</span>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 10,
              letterSpacing: "0.15em",
              color: moodConfig.color,
            }}
          >
            {moodConfig.label.toUpperCase()}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <SparkDisplay spark={state?.spark} />
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 16,
              opacity: 0.5,
              transition: "opacity 0.2s",
            }}
            title={muted ? "Unmute" : "Mute"}
          >
            {muted ? "🔇" : "🔊"}
          </button>
          <Link
            href={`/interface?campaign=${campaignId}`}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 10,
              letterSpacing: "0.15em",
              color: "var(--silver)",
              opacity: 0.4,
              textDecoration: "none",
              transition: "opacity 0.2s",
            }}
          >
            ⚙
          </Link>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px 20px",
          position: "relative",
          zIndex: 1,
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(201,168,76,0.2) transparent",
        }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          {messages.length === 0 && !isTyping && (
            <div
              style={{
                textAlign: "center",
                padding: "80px 40px",
                animation: "fade-up 0.6s ease both",
              }}
            >
              <div
                style={{
                  fontSize: 48,
                  marginBottom: 24,
                  opacity: 0.6,
                  animation: "float 4s ease-in-out infinite",
                }}
              >
                ✦
              </div>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontStyle: "italic",
                  fontSize: 20,
                  color: "var(--silver)",
                  opacity: 0.6,
                  lineHeight: 1.6,
                }}
              >
                The Rift opens before you.
                <br />
                Speak, and your story begins.
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <MessageBubble
              key={msg.id ?? `${msg.created_at}-${i}`}
              msg={msg}
              isLatest={i === messages.length - 1}
            />
          ))}

          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 10,
          padding: "16px 20px",
          background: "rgba(7,8,15,0.85)",
          borderTop: "1px solid rgba(201,168,76,0.1)",
          backdropFilter: "blur(16px)",
          flexShrink: 0,
        }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          {error && (
            <div
              style={{
                padding: "10px 16px",
                marginBottom: 12,
                background: "rgba(139,32,32,0.2)",
                border: "1px solid rgba(139,32,32,0.3)",
                fontFamily: "var(--font-body)",
                fontSize: 14,
                color: "#FF8080",
              }}
            >
              {error}
            </div>
          )}

          <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
            <div style={{ flexShrink: 0 }}>
              <D20 rolling={rolling} result={dieResult} onRoll={handleRoll} />
            </div>

            <div style={{ flex: 1, position: "relative" }}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="What do you do..."
                disabled={sending}
                rows={1}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  background: "rgba(13,27,53,0.5)",
                  border: "1px solid rgba(201,168,76,0.15)",
                  color: "var(--mist)",
                  fontFamily: "var(--font-body)",
                  fontSize: 16,
                  resize: "none",
                  outline: "none",
                  lineHeight: 1.5,
                  maxHeight: 120,
                  overflow: "auto",
                  transition: "border-color 0.2s",
                  backdropFilter: "blur(8px)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(201,168,76,0.4)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(201,168,76,0.15)";
                }}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  onClick={() => setShowRoll((v) => !v)}
                  title="Roll dice"
                  style={{
                    width: 44,
                    height: 44,
                    background: showRoll ? "rgba(201,168,76,0.15)" : "rgba(13,27,53,0.5)",
                    border: "1px solid rgba(201,168,76,0.2)",
                    color: "var(--gold)",
                    fontSize: 18,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  🎲
                </button>
                {showRoll && <RollGrid onSelect={handleRoll} />}
              </div>

              <button
                type="button"
                onClick={() => void sendMessage(input)}
                disabled={!input.trim() || sending}
                style={{
                  width: 44,
                  height: 44,
                  background:
                    input.trim() && !sending
                      ? "linear-gradient(135deg, var(--gold), var(--ember, #E8B94F))"
                      : "rgba(13,27,53,0.3)",
                  border: "1px solid rgba(201,168,76,0.2)",
                  color: input.trim() && !sending ? "var(--void)" : "rgba(201,168,76,0.3)",
                  fontSize: 18,
                  cursor: input.trim() && !sending ? "pointer" : "not-allowed",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {sending ? "⏳" : "→"}
              </button>
            </div>
          </div>

          <div
            style={{
              marginTop: 8,
              textAlign: "center",
              fontFamily: "var(--font-display)",
              fontSize: 9,
              letterSpacing: "0.15em",
              color: "var(--silver)",
              opacity: 0.3,
            }}
          >
            ENTER TO SEND · CLICK DIE TO ROLL · 🎲 FOR MANUAL ROLL · Ambient music: Kevin MacLeod
            (incompetech.com) — CC BY
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
