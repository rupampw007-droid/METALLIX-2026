"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Clock, MapPin, Check, Radio, ChevronRight } from "lucide-react";

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
interface TimelineItem {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  venue: string;
  description?: string;
  tag?: string;
}
interface TimelineProps { items: TimelineItem[]; }

/* ─────────────────────────────────────────
   Status helpers
───────────────────────────────────────── */
const isCompleted = (e: string, now: Date) => now >= new Date(e);
const isLive      = (s: string, e: string, now: Date) =>
  now >= new Date(s) && now < new Date(e);

/* ─────────────────────────────────────────
   Theme
───────────────────────────────────────── */
const THEME = {
  done: {
    primary:     "#c084fc",
    glow:        "rgba(192,132,252,0.95)",
    soft:        "rgba(192,132,252,0.18)",
    titleColor:  "#f3e8ff",
    titleShadow: "0 0 12px rgba(192,132,252,0.9),0 0 30px rgba(168,85,247,0.55)",
    metaColor:   "#e9d5ff",
    metaShadow:  "0 0 8px rgba(192,132,252,0.8)",
    border:      "rgba(192,132,252,0.50)",
    badge:       "linear-gradient(90deg,#4c1d95,#9333ea)",
    badgeShadow: "0 0 12px rgba(168,85,247,0.80)",
    trackDot:    "#a855f7",
    trackGlow:   "rgba(168,85,247,0.70)",
    number:      "rgba(168,85,247,0.15)",
    cardBg:      "rgba(10,2,18,0.90)",
    tagColor:    "#d8b4fe",
    tagBorder:   "rgba(168,85,247,0.35)",
    metaBg:      "rgba(50,0,80,0.30)",
    metaBorder:  "rgba(168,85,247,0.28)",
    topLine:     "linear-gradient(90deg,transparent,rgba(168,85,247,0.9),rgba(192,132,252,1.0),rgba(255,255,255,0.6),rgba(192,132,252,1.0),rgba(168,85,247,0.9),transparent)",
    leftBar:     "linear-gradient(180deg,transparent,rgba(192,132,252,0.9),rgba(168,85,247,0.6),transparent)",
    iconGlow:    "drop-shadow(0 0 5px rgba(192,132,252,0.9))",
  },
  live: {
    primary:     "#fb923c",
    glow:        "rgba(251,146,60,0.98)",
    soft:        "rgba(251,146,60,0.20)",
    titleColor:  "#fff7ed",
    titleShadow: "0 0 10px rgba(251,146,60,1.0),0 0 28px rgba(239,68,68,0.75)",
    metaColor:   "#fed7aa",
    metaShadow:  "0 0 8px rgba(251,146,60,0.92)",
    border:      "rgba(251,146,60,0.65)",
    badge:       "linear-gradient(90deg,#7c2d12,#ea580c)",
    badgeShadow: "0 0 16px rgba(251,146,60,0.90)",
    trackDot:    "#f97316",
    trackGlow:   "rgba(249,115,22,0.85)",
    number:      "rgba(251,146,60,0.15)",
    cardBg:      "rgba(16,4,0,0.92)",
    tagColor:    "#fdba74",
    tagBorder:   "rgba(251,146,60,0.40)",
    metaBg:      "rgba(80,20,0,0.35)",
    metaBorder:  "rgba(251,146,60,0.35)",
    topLine:     "linear-gradient(90deg,transparent,rgba(239,68,68,0.8),rgba(251,146,60,1.0),rgba(255,255,255,0.7),rgba(251,146,60,1.0),rgba(239,68,68,0.8),transparent)",
    leftBar:     "linear-gradient(180deg,transparent,rgba(251,146,60,0.95),rgba(239,68,68,0.7),transparent)",
    iconGlow:    "drop-shadow(0 0 5px rgba(251,146,60,0.95))",
  },
  upcoming: {
    primary:     "#ef4444",
    glow:        "rgba(239,68,68,0.75)",
    soft:        "rgba(239,68,68,0.12)",
    titleColor:  "#ffe4e4",
    titleShadow: "0 0 8px rgba(239,68,68,0.65)",
    metaColor:   "#fca5a5",
    metaShadow:  "0 0 6px rgba(239,68,68,0.60)",
    border:      "rgba(239,68,68,0.28)",
    badge:       "linear-gradient(90deg,#7f1d1d,#dc2626)",
    badgeShadow: "0 0 8px rgba(239,68,68,0.55)",
    trackDot:    "rgba(239,68,68,0.45)",
    trackGlow:   "rgba(239,68,68,0.50)",
    number:      "rgba(239,68,68,0.10)",
    cardBg:      "rgba(8,0,0,0.72)",
    tagColor:    "#f87171",
    tagBorder:   "rgba(239,68,68,0.22)",
    metaBg:      "rgba(50,0,0,0.28)",
    metaBorder:  "rgba(239,68,68,0.18)",
    topLine:     "linear-gradient(90deg,transparent,rgba(185,28,28,0.7),rgba(239,68,68,0.9),rgba(185,28,28,0.7),transparent)",
    leftBar:     "linear-gradient(180deg,transparent,rgba(239,68,68,0.75),transparent)",
    iconGlow:    "drop-shadow(0 0 4px rgba(239,68,68,0.65))",
  },
} as const;

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */
const fmtTime = (d: Date) =>
  d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
const fmtDate = (d: Date) =>
  d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });

/* ─────────────────────────────────────────
   Card — memoised to prevent cascade re-renders
───────────────────────────────────────── */
const TimelineCard = React.memo(function TimelineCard({
  item, index, now,
}: { item: TimelineItem; index: number; now: Date }) {
  const done  = isCompleted(item.endTime, now);
  const live  = isLive(item.startTime, item.endTime, now);
  const t     = done ? THEME.done : live ? THEME.live : THEME.upcoming;
  const start = new Date(item.startTime);
  const end   = new Date(item.endTime);

  return (
    <motion.div
      variants={{
        hidden:  { opacity: 0, y: 20, scale: 0.97 },
        visible: { opacity: 1, y: 0,  scale: 1,
          transition: { type: "spring", stiffness: 180, damping: 24 } },
      }}
      className="relative min-w-0 h-full"
    >
      {/* Card */}
      <div
        className="relative overflow-hidden rounded-2xl min-w-0 h-full flex flex-col"
        style={{
          background: t.cardBg,
          border: `1px solid ${t.border}`,
          boxShadow: live
            ? `0 0 0 1px ${t.soft},0 0 40px ${t.soft},0 8px 32px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.04)`
            : done ? `0 0 0 1px ${t.soft},0 0 28px ${t.soft},0 4px 20px rgba(0,0,0,0.4)`
            : `0 0 18px rgba(239,68,68,0.07),0 4px 20px rgba(0,0,0,0.35)`,
          /* extra left padding makes room for the in-card node */
          padding: "18px 20px 20px 52px",
        }}
      >
        {/* ── Track node — lives inside the card, never bleeds into siblings ── */}
        <div
          className="absolute z-10 flex items-center justify-center rounded-full"
          style={{
            left: 16, top: 18, width: 22, height: 22,
            background: done
              ? "linear-gradient(135deg,#4c1d95,#9333ea)"
              : live ? "linear-gradient(135deg,#7c2d12,#ea580c)"
              : "rgba(10,0,0,0.92)",
            border: `2px solid ${t.trackDot}`,
            boxShadow: live
              ? `0 0 0 5px rgba(251,146,60,0.12),0 0 22px ${t.trackGlow}`
              : done ? `0 0 14px ${t.trackGlow}` : "none",
            animation: live ? "tl-node-fire 1.6s ease-in-out infinite" : "none",
          }}
        >
          {done ? (
            <Check size={11} color="#fff" strokeWidth={3} />
          ) : live ? (
            <>
              <div className="rounded-full"
                style={{ width: 7, height: 7, background: "#fff", boxShadow: `0 0 8px ${t.glow}` }} />
              <div className="absolute rounded-full"
                style={{ inset: -5, border: `2px solid rgba(251,146,60,0.55)`,
                  animation: "tl-ping 1.2s ease-out infinite" }} />
            </>
          ) : (
            <div className="rounded-full"
              style={{ width: 6, height: 6, background: "rgba(239,68,68,0.35)" }} />
          )}
        </div>
        {/* Top bar */}
        <div className="absolute inset-x-0 top-0 h-0.5"
          style={{ background: t.topLine,
            boxShadow: `0 0 18px ${t.glow},0 0 35px ${t.soft}`,
            animation: live ? "tl-topbar-flicker 2.8s ease-in-out infinite" : "none" }} />
        {/* Left bar — starts at 46px to sit right of the node */}
        <div className="absolute rounded-r"
          style={{ left: 46, top: "12%", bottom: "12%", width: 3,
            background: t.leftBar, boxShadow: `2px 0 12px ${t.glow}` }} />
        {/* Bottom bar */}
        <div className="absolute inset-x-0 bottom-0 h-0.5"
          style={{ background: `linear-gradient(90deg,${t.glow},${t.primary},rgba(255,255,255,0.4),${t.primary},transparent)`,
            boxShadow: `0 0 12px ${t.glow}` }} />
        {/* Corner TL */}
        <div className="absolute top-0 left-0 w-5 h-5 rounded-tl-2xl"
          style={{ borderTop: `2px solid ${t.border}`, borderLeft: `2px solid ${t.border}` }} />
        {/* Corner BR */}
        <div className="absolute bottom-0 right-0 w-7 h-7 rounded-br-2xl"
          style={{ borderBottom: `2px solid ${t.border}`, borderRight: `2px solid ${t.border}` }} />

        {/* Ghost number */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 select-none pointer-events-none font-black leading-none"
          style={{
            fontFamily: "'Orbitron',monospace",
            fontSize: "clamp(2.2rem,3.5vw,3.2rem)",
            color: t.number, textShadow: `0 0 40px ${t.glow}`,
          }}>
          {String(index + 1).padStart(2, "0")}
        </div>

        {/* Title + badge */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="uppercase font-bold leading-snug m-0"
            style={{
              fontFamily: "'Orbitron',monospace",
              fontSize: "clamp(0.65rem,1.3vw,0.85rem)",
              letterSpacing: "0.07em",
              color: t.titleColor, textShadow: t.titleShadow,
              maxWidth: "68%",
              animation: live ? "tl-title-fire 2.4s ease-in-out infinite" : "none",
            }}>
            {item.title}
          </h3>
          <div className="shrink-0 uppercase font-bold text-white rounded"
            style={{
              fontFamily: "'Orbitron',monospace",
              fontSize: 7, letterSpacing: "0.14em",
              padding: "3px 8px",
              background: t.badge, boxShadow: t.badgeShadow,
              textShadow: "0 0 8px rgba(255,255,255,0.5)",
              animation: live ? "tl-badge-blink 1.8s ease-in-out infinite" : "none",
            }}>
            {done ? "✓ DONE" : live ? "🔥 LIVE" : "SOON"}
          </div>
        </div>

        {/* Tag */}
        {item.tag && (
          <div className="inline-flex items-center uppercase font-bold rounded mb-2"
            style={{
              fontFamily: "'Rajdhani',sans-serif",
              fontSize: 9, letterSpacing: "0.14em",
              padding: "2px 8px",
              background: "rgba(0,0,0,0.30)",
              border: `1px solid ${t.tagBorder}`,
              color: t.tagColor, textShadow: `0 0 8px ${t.glow}`,
            }}>
            {item.tag}
          </div>
        )}

        {/* Description */}
        {item.description && (
          <p className="mb-3 leading-relaxed m-0"
            style={{
              fontFamily: "'Rajdhani',sans-serif",
              fontSize: 12, fontWeight: 500,
              color: "rgba(255,220,220,0.60)",
            }}>
            {item.description}
          </p>
        )}

        {/* Meta */}
        <div className="flex flex-col gap-1.5 rounded-xl mt-auto pt-2"
          style={{
            padding: "9px 12px",
            background: t.metaBg,
            border: `1px solid ${t.metaBorder}`,
            boxShadow: "inset 0 0 22px rgba(0,0,0,0.45)",
          }}>
          <div className="flex items-center gap-2">
            <span className="flex shrink-0" style={{ color: t.glow, filter: t.iconGlow }}>
              <Clock size={12} />
            </span>
            <span className="font-bold truncate"
              style={{
                fontFamily: "'Rajdhani',sans-serif",
                fontSize: 13, letterSpacing: "0.04em",
                color: t.metaColor, textShadow: t.metaShadow,
                animation: live ? "tl-meta-fire 3.2s ease-in-out infinite" : "none",
              }}>
              {fmtDate(start)}&nbsp;·&nbsp;{fmtTime(start)}–{fmtTime(end)}
            </span>
          </div>
          <div className="h-px"
            style={{ background: `linear-gradient(90deg,transparent,${t.metaBorder},transparent)` }} />
          <div className="flex items-center gap-2">
            <span className="flex shrink-0" style={{ color: t.glow, filter: t.iconGlow }}>
              <MapPin size={12} />
            </span>
            <span className="font-bold truncate"
              style={{
                fontFamily: "'Rajdhani',sans-serif",
                fontSize: 13, letterSpacing: "0.04em",
                color: t.metaColor, textShadow: t.metaShadow,
                animation: live ? "tl-meta-fire 3.6s ease-in-out infinite" : "none",
              }}>
              {item.venue}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

/* ─────────────────────────────────────────
   Main
───────────────────────────────────────── */
export default function GlowingTimeline({ items }: TimelineProps) {
  const [now, setNow] = useState(() => new Date());
  const containerRef  = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const bgY1 = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const bgY2 = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  /* Tick every 60 s — avoids 60 redundant renders per minute */
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  /* Group by day — memoised */
  const grouped = React.useMemo(() =>
    items.reduce<Record<string, TimelineItem[]>>((acc, item) => {
      const day = new Date(item.startTime).toLocaleDateString("en-IN", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
      });
      (acc[day] ??= []).push(item);
      return acc;
    }, {}),
  [items]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;600;700&display=swap');

        @keyframes tl-ping { 0%{transform:scale(1);opacity:.85} 100%{transform:scale(2.5);opacity:0} }
        @keyframes tl-node-fire {
          0%,100%{ box-shadow:0 0 0 4px rgba(251,146,60,.10),0 0 14px rgba(251,146,60,.65) }
          50%    { box-shadow:0 0 0 8px rgba(251,146,60,.06),0 0 36px rgba(251,146,60,1.0)  }
        }
        @keyframes tl-badge-blink { 0%,100%{opacity:1} 50%{opacity:.42} }
        @keyframes tl-title-fire {
          0%,100%{ text-shadow:0 0 10px rgba(251,146,60,1),0 0 28px rgba(239,68,68,.80) }
          50%    { text-shadow:0 0 18px rgba(253,186,116,.9),0 0 40px rgba(251,146,60,.90);filter:brightness(1.1) }
        }
        @keyframes tl-meta-fire {
          0%,100%{ text-shadow:0 0 7px rgba(251,146,60,.88)   }
          50%    { text-shadow:0 0 14px rgba(253,186,116,.85)  }
        }
        @keyframes tl-topbar-flicker { 0%,100%{opacity:1} 45%{opacity:.68} 58%{opacity:.94} }
        @keyframes tl-glitch {
          0%,93%,100%{transform:none;opacity:1}
          94%{transform:translateX(5px);opacity:.70}
          95%{transform:translateX(-3px)}
          96%{transform:none}
        }
        @keyframes tl-header-fire {
          0%,100%{filter:drop-shadow(0 0 18px rgba(239,68,68,.55)) drop-shadow(0 0 40px rgba(168,85,247,.28))}
          50%    {filter:drop-shadow(0 0 28px rgba(251,146,60,.70)) drop-shadow(0 0 55px rgba(192,132,252,.38))}
        }
        @keyframes tl-underline-flame {
          0%,100%{ background-position:0%   50%; box-shadow:0 0 14px rgba(249,115,22,.50),0 0 28px rgba(147,51,234,.30) }
          50%    { background-position:100% 50%; box-shadow:0 0 24px rgba(249,115,22,.75),0 0 44px rgba(147,51,234,.50) }
        }
        @keyframes tl-pill-flicker {
          0%,100%{ color:rgba(216,180,254,.75);text-shadow:0 0 10px rgba(168,85,247,.50) }
          50%    { color:rgba(240,160,255,.90);text-shadow:0 0 18px rgba(192,132,252,.78) }
        }
        @keyframes tl-dot-blink  { 0%,100%{opacity:1} 50%{opacity:.15} }
        @keyframes tl-clock-glow {
          0%,100%{ text-shadow:0 0 8px rgba(168,85,247,.50)  }
          50%    { text-shadow:0 0 14px rgba(192,132,252,.75) }
        }
        @keyframes tl-scanline   { 0%{transform:translateY(-100%)} 100%{transform:translateY(320%)} }
        @keyframes tl-day-glow {
          0%,100%{ color:rgba(210,150,255,.72);text-shadow:0 0 12px rgba(168,85,247,.55) }
          50%    { color:rgba(230,175,255,.88);text-shadow:0 0 20px rgba(192,132,252,.80) }
        }
        @keyframes tl-legend-pulse { 0%,100%{opacity:.65} 50%{opacity:1} }
        @keyframes tl-track-glow {
          0%,100%{ box-shadow:0 0 10px rgba(168,85,247,.45) }
          50%    { box-shadow:0 0 16px rgba(192,132,252,.65) }
        }
        .tl-underline-bar {
          width:210px; height:3px; margin:16px auto 0;
          background:linear-gradient(90deg,#7e22ce,#dc2626,#ea580c,#dc2626,#7e22ce);
          background-size:200% 100%; border-radius:2px;
          animation:tl-underline-flame 3.2s ease-in-out infinite;
        }
      `}</style>

      <section ref={containerRef} className="relative overflow-hidden py-16"
        style={{ background: "transparent" }}>

        {/* Parallax blobs */}
        <motion.div
          style={{ y: bgY1, willChange: "transform", position: "absolute", pointerEvents: "none",
            borderRadius: "50%", top: "12%", right: "-6%", width: "38vw", height: "38vw",
            background: "radial-gradient(circle,rgba(120,0,200,.08) 0%,rgba(200,0,0,.05) 50%,transparent 70%)",
          }} />
        <motion.div
          style={{ y: bgY2, willChange: "transform", position: "absolute", pointerEvents: "none",
            borderRadius: "50%", bottom: "15%", left: "-4%", width: "28vw", height: "28vw",
            background: "radial-gradient(circle,rgba(168,85,247,.07) 0%,transparent 70%)",
          }} />

        <div className="relative mx-auto px-5" style={{ maxWidth: 1020 }}>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -22 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-5"
          >
            <div className="inline-flex items-center gap-2 rounded mb-4 uppercase font-bold"
              style={{
                fontFamily: "'Rajdhani',sans-serif", fontSize: 11, letterSpacing: "0.22em",
                backgroundColor: "rgba(100,0,160,.16)",
                border: "1px solid rgba(168,85,247,.38)",
                padding: "5px 18px",
                animation: "tl-pill-flicker 3s ease-in-out infinite",
              }}>
              <Radio size={10} color="#a855f7"
                style={{ filter: "drop-shadow(0 0 4px rgba(168,85,247,.8))" }} />
              Live Schedule Tracker
            </div>

            <h2 className="m-0 leading-tight uppercase font-black"
              style={{
                fontFamily: "'Orbitron',monospace",
                fontSize: "clamp(1.9rem,5vw,3.4rem)", letterSpacing: "0.1em",
                backgroundImage: "linear-gradient(135deg,#fff 0%,#fde8ff 14%,#ff3333 42%,#c026d3 68%,#7e22ce 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                animation: "tl-glitch 8s ease-in-out infinite,tl-header-fire 4s ease-in-out infinite",
              }}>
              EVENT SCHEDULE
            </h2>

            <div className="tl-underline-bar" />

            <div className="inline-flex items-center gap-2 mt-4 rounded-lg font-bold uppercase"
              style={{
                fontFamily: "'Orbitron',monospace", fontSize: 10.5, letterSpacing: "0.12em",
                backgroundColor: "rgba(0,0,0,.62)",
                border: "1px solid rgba(168,85,247,.20)",
                padding: "7px 20px",
                animation: "tl-clock-glow 4s ease-in-out infinite",
                color: "rgba(220,170,255,.70)",
              }}>
              <span className="inline-block rounded-full"
                style={{
                  width: 7, height: 7, backgroundColor: "#f97316",
                  boxShadow: "0 0 9px rgba(249,115,22,.90)",
                  animation: "tl-dot-blink 1.4s ease-in-out infinite",
                }} />
              {now.toLocaleString("en-IN", {
                month: "short", day: "numeric", year: "numeric",
                hour: "2-digit", minute: "2-digit",
              })}
            </div>
          </motion.div>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {([
              { dot:"#c084fc", glow:"rgba(192,132,252,.72)", label:"Completed",
                bg:"rgba(100,0,180,.10)", border:"rgba(168,85,247,.28)", ts:"0 0 8px rgba(192,132,252,.5)" },
              { dot:"#fb923c", glow:"rgba(251,146,60,.78)",  label:"Live Now",
                bg:"rgba(100,30,0,.14)",  border:"rgba(251,146,60,.36)", ts:"0 0 8px rgba(251,146,60,.6)" },
              { dot:"#ef4444", glow:"rgba(239,68,68,.62)",   label:"Upcoming",
                bg:"rgba(60,0,0,.11)",    border:"rgba(239,68,68,.20)",  ts:"0 0 8px rgba(239,68,68,.4)" },
            ] as const).map(s => (
              <div key={s.label}
                className="inline-flex items-center gap-2 rounded-full px-4 py-1 uppercase font-bold"
                style={{
                  fontFamily: "'Rajdhani',sans-serif", fontSize: 11, letterSpacing: "0.14em",
                  backgroundColor: s.bg, border: `1px solid ${s.border}`,
                  color: "rgba(255,255,255,.72)", textShadow: s.ts,
                  animation: "tl-legend-pulse 3.5s ease-in-out infinite",
                }}>
                <span className="inline-block rounded-full"
                  style={{ width: 8, height: 8, backgroundColor: s.dot, boxShadow: `0 0 7px ${s.glow}` }} />
                {s.label}
              </div>
            ))}
          </div>

          {/* Day groups */}
          <div className="flex flex-col gap-14">
            {Object.entries(grouped).map(([day, dayItems], groupIdx) => (
              <div key={day}>

                {/* Day label */}
                <motion.div
                  initial={{ opacity: 0, x: -26 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ type: "spring", stiffness: 220, damping: 26, delay: groupIdx * 0.06 }}
                  className="flex items-center gap-3 mb-8"
                >
                  <div className="uppercase font-bold whitespace-nowrap"
                    style={{
                      fontFamily: "'Orbitron',monospace",
                      fontSize: "clamp(0.65rem,1.6vw,0.82rem)", letterSpacing: "0.14em",
                      animation: "tl-day-glow 4s ease-in-out infinite",
                    }}>
                    {day}
                  </div>
                  <div className="flex-1 h-px"
                    style={{ background: "linear-gradient(90deg,rgba(147,51,234,.40),rgba(239,68,68,.22),transparent)" }} />
                  <ChevronRight size={13} color="rgba(168,85,247,.42)" />
                </motion.div>

                {/* Cards grid — no external track; node lives inside each card */}
                <motion.div
                  initial="hidden" whileInView="visible"
                  viewport={{ once: true, margin: "-30px" }}
                  variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
                  className="grid gap-3 items-stretch"
                  style={{
                    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
                  }}
                >
                  {dayItems.map((item, i) => (
                    <TimelineCard key={item.id} item={item} index={i} now={now} />
                  ))}
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ─────────────────────────────────────────
   Demo — dates fully consistent, no month mismatch
───────────────────────────────────────── */
function TimelineDemo() {
  const D1 = "2026-04-02";
  const D2 = "2026-04-03";
  const t  = (date: string, h: number, m = 0) =>
    new Date(`${date}T${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:00`).toISOString();

const items: TimelineItem[] = [
    { id:"1",  title:"Inauguration Ceremony",  startTime:t(D1,10,15),    endTime:t(D1,11,15),    venue:"Dr. Triguna Sen Auditorium", tag:"Opening",      description:"Official inauguration of Metallix 2026." },
    { id:"2",  title:"Keynote Address",        startTime:t(D1,11,15),    endTime:t(D1,12),        venue:"Dr. Triguna Sen Auditorium", tag:"Seminar"   },
    { id:"3",  title:"Tea Break",              startTime:t(D1,12),        endTime:t(D1,12,20),     venue:"Dr. Triguna Sen Auditorium", tag:"Break"     },
    { id:"4",  title:"Technical Session 1",    startTime:t(D1,12,20),     endTime:t(D1,13,30),     venue:"Dr. Triguna Sen Auditorium", tag:"Seminar"   },
    { id:"5",  title:"Lunch",                  startTime:t(D1,13,30),     endTime:t(D1,14,30),     venue:"JU Guest House", tag:"Break"     },
    { id:"6",  title:"Technical Session 2",    startTime:t(D1,14,30),     endTime:t(D1,15,40),     venue:"Dr. Triguna Sen Auditorium",             tag:"Seminar"   },
    { id:"7",  title:"Valedictory Session",    startTime:t(D1,15,40),     endTime:t(D1,16),        venue:"Dr. Triguna Sen Auditorium", tag:"Closing"   },
    { id:"8",  title:"Codemet",    startTime:t(D1,21),     endTime:t(D1,22,30),        venue:"Dr. Triguna Sen Auditorium", tag:"Closing"   },
  
   
    { id:"8", title:"Specio",                 startTime:t(D2,11),        endTime:t(D2,13),     venue:"Met & Mat Engg Dept",                 tag:"Event"     },
    { id:"9", title:"Scroll",                 startTime:t(D2,11),        endTime:t(D2,13),     venue:"Met & Mat Engg Dept",                 tag:"Event"     },
    { id:"10", title:"Wall Street",            startTime:t(D2,11,30),     endTime:t(D2,16),     venue:"Met & Mat Engg Seminar Hall",     tag:"Event"     },
    { id:"11", title:"Scribe",                 startTime:t(D2,12,30),     endTime:t(D2,13,30),     venue:"Met & Mat Engg Seminar Hall",     tag:"Event"     },
    { id:"12", title:"Lunch",                  startTime:t(D2,13,0),      endTime:t(D2,14),     venue:"JU Guest House",             tag:"Break"     },
     { id:"13", title:"Golazo",       startTime:t(D2,15,30),        endTime:t(D2,18),     venue:"Online",     tag:"Event"   },
    { id:"14", title:"Gnosis",                 startTime:t(D2,16),     endTime:t(D2,18),     venue:"K.P Basu Memorial Hall",     tag:"Event"     },
    { id:"1509j", title:"Talaash",                startTime:t(D2,16),     endTime:t(D2,18),      venue:"K.P Basu Memorial Hall",     tag:"Event"     },
   
];
  return <GlowingTimeline items={items} />;
}

export { TimelineDemo };