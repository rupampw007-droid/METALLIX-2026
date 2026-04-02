"use client";

import Image from "next/image";
import { useRef, useEffect, useState } from "react";

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
export interface EventSponsor {
  name: string;
  image: string;
  url: string;
}

interface EventSponsorsProps {
  sponsors: EventSponsor[];
  /** Section heading — defaults to "Event Sponsors" */
  heading?: string;
}

/* ─────────────────────────────────────────────
   SINGLE SPONSOR CARD
───────────────────────────────────────────── */
function SponsorCard({ sponsor, index }: { sponsor: EventSponsor; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  /* Intersection Observer — staggered reveal */
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const content = (
    <div
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0px",
        padding: "20px 18px",
        borderRadius: "4px",
        cursor: "pointer",
        overflow: "visible",
        /* entry animation */
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateY(0) scale(1)"
          : "translateY(40px) scale(0.96)",
        transition: `opacity 0.65s ease ${index * 0.08}s, transform 0.65s ease ${index * 0.08}s`,
        /* border — animated glow on hover */
        border: `1px solid ${hovered ? "rgba(220,60,20,0.70)" : "rgba(180,20,20,0.22)"}`,
        boxShadow: hovered
          ? "0 0 28px rgba(200,40,10,0.35), 0 0 8px rgba(168,85,247,0.22), inset 0 0 24px rgba(120,0,0,0.18)"
          : "0 0 0px transparent, inset 0 0 12px rgba(60,0,0,0.12)",
        background: hovered
          ? "linear-gradient(135deg, rgba(30,0,0,0.82) 0%, rgba(20,0,20,0.78) 100%)"
          : "linear-gradient(135deg, rgba(14,0,0,0.70) 0%, rgba(10,0,14,0.65) 100%)",
        backdropFilter: "blur(6px)",
        minWidth: 180,
        maxWidth: 220,
        flex: "1 1 180px",
      }}
    >
      {/* Corner accent lines */}
      <CornerAccents hovered={hovered} />

      {/* Logo — intentionally larger than the card so it bleeds out */}
      <div style={{
        position: "relative",
        width: 260,
        height: 160,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        filter: hovered
          ? "drop-shadow(0 0 16px rgba(220,60,20,0.75)) brightness(1.15)"
          : "brightness(0.88) grayscale(0.15)",
        transition: "filter 0.4s ease, transform 0.4s ease",
        transform: hovered ? "scale(1.06)" : "scale(1)",
      }}>
        <Image
          src={sponsor.image}
          alt={sponsor.name}
          fill
          style={{ objectFit: "contain" }}
          sizes="260px"
        />
      </div>

      {/* Hover bottom bar */}
      <div style={{
        position: "absolute",
        bottom: 0, left: "10%", right: "10%",
        height: "2px",
        background: "linear-gradient(90deg, transparent, rgba(220,80,20,0.90), rgba(168,85,247,0.70), transparent)",
        opacity: hovered ? 1 : 0,
        transition: "opacity 0.35s ease",
        borderRadius: "2px",
      }} />
    </div>
  );

  return (
    <a href={sponsor.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
      {content}
    </a>
  );
}

/* ─────────────────────────────────────────────
   CORNER ACCENT SVG LINES
───────────────────────────────────────────── */
function CornerAccents({ hovered }: { hovered: boolean }) {
  const color = hovered ? "rgba(220,80,20,0.80)" : "rgba(180,30,10,0.30)";
  const size = 16;
  const style: React.CSSProperties = {
    position: "absolute",
    width: size,
    height: size,
    transition: "opacity 0.35s ease, border-color 0.35s ease",
    borderColor: color,
  };
  return (
    <>
      <div style={{ ...style, top: 8, left: 8, borderTop: `1px solid ${color}`, borderLeft: `1px solid ${color}` }} />
      <div style={{ ...style, top: 8, right: 8, borderTop: `1px solid ${color}`, borderRight: `1px solid ${color}` }} />
      <div style={{ ...style, bottom: 8, left: 8, borderBottom: `1px solid ${color}`, borderLeft: `1px solid ${color}` }} />
      <div style={{ ...style, bottom: 8, right: 8, borderBottom: `1px solid ${color}`, borderRight: `1px solid ${color}` }} />
    </>
  );
}

/* ─────────────────────────────────────────────
   DECORATIVE DIVIDER
───────────────────────────────────────────── */
function FireDivider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", maxWidth: 600, margin: "0 auto 48px" }}>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(185,28,28,0.55))" }} />
      {/* Diamond icon */}
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 1 L17 9 L9 17 L1 9 Z" stroke="rgba(220,80,20,0.80)" strokeWidth="1" fill="rgba(100,0,0,0.35)" />
        <path d="M9 4 L14 9 L9 14 L4 9 Z" fill="rgba(220,80,20,0.50)" />
      </svg>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(168,85,247,0.55), transparent)" }} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function EventSponsors({ sponsors, heading = "Event Sponsors" }: EventSponsorsProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [headVisible, setHeadVisible] = useState(false);

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setHeadVisible(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section style={{
      width: "100%",
      padding: "72px 20px 80px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      position: "relative",
    }}>

      {/* ── Ambient glow behind section ── */}
      <div style={{
        position: "absolute",
        top: "20%", left: "50%",
        transform: "translateX(-50%)",
        width: "60vw", height: "40vw",
        borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(100,0,0,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* ── Heading ── */}
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        {/* Eyebrow label */}
        <p
          ref={headingRef}
          style={{
            fontFamily: "var(--font-rajdhani), sans-serif",
            fontWeight: 500,
            fontSize: "0.70rem",
            letterSpacing: "0.38em",
            textTransform: "uppercase",
            color: "rgba(220,80,20,0.75)",
            marginBottom: 14,
            opacity: headVisible ? 1 : 0,
            transform: headVisible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          ◈ &nbsp; Presented By &nbsp; ◈
        </p>

        {/* Main title */}
        <h2 style={{
          fontFamily: "var(--font-orbitron), sans-serif",
          fontWeight: 900,
          fontSize: "clamp(1.6rem, 4vw, 2.8rem)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          lineHeight: 1.05,
          margin: 0,
          background: "linear-gradient(135deg, #ffffff 0%, #ff9060 38%, #c0392b 62%, #9b59b6 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          opacity: headVisible ? 1 : 0,
          transform: headVisible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s",
        }}>
          {heading}
        </h2>

        {/* Subtitle underline glow */}
        <div style={{
          margin: "16px auto 0",
          width: headVisible ? "180px" : "0px",
          height: "2px",
          background: "linear-gradient(90deg, rgba(168,85,247,0.80), rgba(220,60,20,0.90), rgba(168,85,247,0.80))",
          boxShadow: "0 0 14px rgba(220,60,20,0.50)",
          transition: "width 0.9s ease 0.3s",
          borderRadius: "2px",
        }} />
      </div>

      {/* ── Divider ── */}
      <div style={{ height: 40 }} />
      <FireDivider />

      {/* ── Grid of sponsor cards ── */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        justifyContent: "center",
        alignItems: "stretch",
        width: "100%",
        maxWidth: 1100,
      }}>
        {sponsors.map((sponsor, i) => (
          <SponsorCard key={sponsor.name} sponsor={sponsor} index={i} />
        ))}
      </div>

      {/* ── Bottom border glow ── */}
      <div style={{
        marginTop: 64,
        width: "65%",
        maxWidth: 500,
        height: 1,
        background: "linear-gradient(90deg, transparent, rgba(185,28,28,0.45), rgba(168,85,247,0.45), transparent)",
      }} />
    </section>
  );
}