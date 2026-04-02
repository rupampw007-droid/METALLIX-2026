"use client";
export const runtime = 'edge'

import { useEffect, useRef } from "react";
import { ImageTrailDemo } from "./About";
import { TimelineDemo } from "./Timeline";
import FAQs from "./Faq";
import SplashCursor from "@/components/SplashCursor";
import Sponsors from "@/components/sponsors";
import { HeroVideoDemo } from "./Hero";
import Navbar from "@/components/Navbar";
import MetallixFooter from "@/components/Footer";
import ContactUsSection from "@/components/contactSection";
import LoadingGate from "./LoadingGate";
import EventSponsors from "@/components/EventSponsors";

/* ══════════════════════════════════════════════════════
   FIRE SPRINKLES CANVAS
   — Full-page fixed canvas, always behind everything.
   — Embers rise from bottom edges & occasional mid-page
     columns. Hues: deep crimson → orange → purple.
   — Each particle has: position, velocity, size, hue,
     life, turbulence seed.
   — requestAnimationFrame loop, ResizeObserver aware.
══════════════════════════════════════════════════════ */
function FireSprinkles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    /* ── sizing ── */
    const setSize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();
    window.addEventListener("resize", setSize);

    /* ── particle pool ── */
    type P = {
      x: number; y: number;
      vx: number; vy: number;
      size: number;
      hue: number; sat: number; lit: number;
      life: number; maxLife: number;
      turbSeed: number; wobble: number;
    };

    const pool: P[] = [];
    const MAX = window.navigator.hardwareConcurrency > 4 ? 180 : 80 // max simultaneous embers

    const spawnEmber = () => {
      if (pool.length >= MAX) return;

      // bias toward left/right edges and occasional center columns
      const band = Math.random();
      let x: number;
      if (band < 0.25)       x = Math.random() * canvas.width * 0.18;          // far left
      else if (band < 0.50)  x = canvas.width - Math.random() * canvas.width * 0.18; // far right
      else if (band < 0.72)  x = canvas.width * (0.25 + Math.random() * 0.50); // mid spread
      else                   x = Math.random() * canvas.width;                  // random

      // hue: crimson (0-15), orange (16-30), purple (270-310)
      const hueRoll = Math.random();
      const hue = hueRoll < 0.45
        ? Math.random() * 16           // crimson-red
        : hueRoll < 0.72
        ? 16 + Math.random() * 18      // orange
        : 268 + Math.random() * 44;    // purple

      const maxLife = 110 + Math.random() * 160;

      pool.push({
        x,
        y: canvas.height + 6,
        vx: (Math.random() - 0.5) * 0.9,
        vy: -(1.2 + Math.random() * 2.6),
        size: 1.0 + Math.random() * 2.8,
        hue, sat: 88 + Math.random() * 12, lit: 55 + Math.random() * 20,
        life: 0, maxLife,
        turbSeed: Math.random() * 1000,
        wobble: Math.random() * Math.PI * 2,
      });
    };

    /* ── draw loop ── */
    let frame = 0;
    let raf: number;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      frame++;

      // Spawn rate: 2-3 new embers every frame
      const spawnCount = 2 + (frame % 3 === 0 ? 1 : 0);
      for (let s = 0; s < spawnCount; s++) spawnEmber();

      // Clear with very subtle trail (no motion-blur: clean)
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = pool.length - 1; i >= 0; i--) {
        const p = pool[i];
        p.life++;

        if (p.life > p.maxLife || p.y < -20) {
          pool.splice(i, 1);
          continue;
        }

        // Physics
        p.wobble += 0.048;
        p.x  += p.vx + Math.sin(p.wobble + p.turbSeed) * 0.32;
        p.y  += p.vy;
        p.vy *= 0.998; // very slight deceleration

        // Opacity: fade in, hold, fade out
        const progress = p.life / p.maxLife;
        const alpha    = Math.sin(progress * Math.PI) * 0.82;

        // Size shrink as it rises
        const r = p.size * (1 - progress * 0.45);

        // Radial gradient glow
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 3.5);
        grad.addColorStop(0,   `hsla(${p.hue},${p.sat}%,${p.lit + 18}%,${alpha})`);
        grad.addColorStop(0.35,`hsla(${p.hue},${p.sat}%,${p.lit}%,${alpha * 0.65})`);
        grad.addColorStop(1,   `hsla(${p.hue},${p.sat}%,30%,0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Tiny bright core dot for sharpness
        if (r > 1.2) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, r * 0.55, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue + 20},100%,85%,${alpha * 0.55})`;
          ctx.fill();
        }
      }
    };

    tick();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", setSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 1,           // above bg layer, below all content
        opacity: 0.55,
      }}
    />
  );
}

/* ══════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════ */
export default function Home() {
  return (
    <LoadingGate>
      <div className="bg-black">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
          html { scroll-behavior: auto; }
        `}</style>

        <Navbar />

        <section id="home"><HeroVideoDemo /></section>
        <SplashCursor />
      

        <div
          className="relative min-h-screen font-sans overflow-x-hidden"
          style={{ backgroundColor: "#000000" }}
        >

          {/* ══ LAYER 0 — Deep background (z:0) ══ */}
          <div style={{
            position: "fixed", inset: 0, zIndex: 0,
            overflow: "hidden", pointerEvents: "none",
          }}>
            {/* Base gradient: near-black with deep purple top, deep crimson mid, void bottom */}
            <div style={{
              position: "absolute", inset: 0,
              background: [
                "radial-gradient(ellipse 110% 55% at 50% 0%,   #130010 0%,  #000000 62%)",
                "radial-gradient(ellipse 80%  45% at 15% 40%,  #120000 0%,  transparent 65%)",
                "radial-gradient(ellipse 70%  50% at 85% 55%,  #0d000d 0%,  transparent 65%)",
                "radial-gradient(ellipse 60%  40% at 50% 100%, #0a0000 0%,  transparent 70%)",
              ].join(", "),
            }} />

            {/* Large drifting blobs — red-purple-crimson */}
            <div style={{
              position: "absolute", top: "-20%", left: "-14%",
              width: "75vw", height: "75vw", borderRadius: "50%",
              background: "radial-gradient(circle, rgba(140,0,180,0.14) 0%, rgba(100,0,0,0.07) 42%, transparent 70%)",
            }} />
            <div style={{
              position: "absolute", top: "6%", right: "-18%",
              width: "68vw", height: "68vw", borderRadius: "50%",
              background: "radial-gradient(circle, rgba(180,10,10,0.12) 0%, rgba(90,0,0,0.05) 42%, transparent 70%)",
            }} />
            <div style={{
              position: "absolute", top: "38%", left: "20%",
              width: "58vw", height: "58vw", borderRadius: "50%",
              background: "radial-gradient(circle, rgba(100,0,140,0.10) 0%, transparent 65%)",
            }} />
            <div style={{
              position: "absolute", bottom: "-24%", right: "6%",
              width: "65vw", height: "65vw", borderRadius: "50%",
              background: "radial-gradient(circle, rgba(120,0,0,0.13) 0%, transparent 65%)",
            }} />
            <div style={{
              position: "absolute", top: "60%", left: "-14%",
              width: "48vw", height: "48vw", borderRadius: "50%",
              background: "radial-gradient(circle, rgba(160,0,180,0.08) 0%, transparent 65%)",
            }} />
            <div style={{
              position: "absolute", top: "20%", left: "40%",
              width: "35vw", height: "35vw", borderRadius: "50%",
              background: "radial-gradient(circle, rgba(90,0,90,0.09) 0%, transparent 65%)",
            }} />

            {/* Fine grid — red tint */}
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: [
                "linear-gradient(rgba(255,20,20,0.038) 1px, transparent 1px)",
                "linear-gradient(90deg, rgba(255,20,20,0.038) 1px, transparent 1px)",
              ].join(", "),
              backgroundSize: "64px 64px",
            }} />

            {/* Diagonal hatching — purple tint */}
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: "repeating-linear-gradient(-45deg, transparent, transparent 130px, rgba(150,0,200,0.018) 130px, rgba(150,0,200,0.018) 131px)",
            }} />

            {/* Corner accent glows */}
            <div style={{
              position: "absolute", top: 0, left: 0, width: 340, height: 340,
              background: "radial-gradient(circle at top left, rgba(180,0,180,0.16) 0%, transparent 70%)",
            }} />
            <div style={{
              position: "absolute", bottom: 0, right: 0, width: 440, height: 440,
              background: "radial-gradient(circle at bottom right, rgba(180,20,0,0.14) 0%, transparent 70%)",
            }} />
            <div style={{
              position: "absolute", bottom: 0, left: 0, width: 280, height: 280,
              background: "radial-gradient(circle at bottom left, rgba(100,0,140,0.10) 0%, transparent 70%)",
            }} />
            <div style={{
              position: "absolute", top: 0, right: 0, width: 300, height: 300,
              background: "radial-gradient(circle at top right, rgba(180,0,0,0.10) 0%, transparent 70%)",
            }} />

            {/* Top edge neon line — purple to crimson to purple */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 2,
              background: "linear-gradient(90deg, transparent, rgba(168,85,247,0.80), rgba(185,28,28,0.90), rgba(255,60,60,0.75), rgba(185,28,28,0.90), rgba(168,85,247,0.80), transparent)",
              boxShadow: "0 0 24px rgba(168,85,247,0.55), 0 0 50px rgba(185,28,28,0.25)",
            }} />

            {/* Vignette */}
            <div style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.68) 100%)",
            }} />
          </div>

          {/* ══ LAYER 1 — Fire sprinkles canvas (z:1) ══ */}
          <FireSprinkles />

          {/* ══ LAYER 100 — All page content ══ */}
          <div style={{ position: "relative", zIndex: 100 }}>

            <section id="about"><ImageTrailDemo /></section>

            <section id="events"><TimelineDemo /></section>

            <section id="sponsors">
              <div style={{
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                width: "100%",
                padding: "60px 20px",
              }}>
                <Sponsors
                  titleSponsor={{
                    name: "TATA STEEL",
                    image: "/tatasteel.jpg",
                    tagline: "Building the future",
                    url: "https://www.tatasteel.com/",
                  }}
                 
                />
              </div>
            </section>
            <section id="event-sponsors">
  <EventSponsors
    heading="Event Sponsors"
    sponsors={[
      { name: "Now Purchase",   image: "/nowpurchase.png",   url: "https://nowpurchase.com/" },
    
    ]}
  />
</section>

            <section id="faq"><FAQs /></section>
            <section id="contact"><ContactUsSection /></section>
          </div>
        </div>

        <div style={{ position: "relative", zIndex: 100 }}>
          <MetallixFooter />
        </div>
      </div>
    </LoadingGate>
  );
}