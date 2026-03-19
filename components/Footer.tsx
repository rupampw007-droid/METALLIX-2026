"use client";
import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Instagram, Facebook, Linkedin } from "lucide-react";
import { cn } from "@/lib/utils";

type Ember = {
  id: number; x: number; startY: number; size: number;
  duration: number; delay: number; drift: number; color: string;
};

function generateEmbers(count: number): Ember[] {
  const colors = ["rgba(220,30,10,0.9)","rgba(255,80,20,0.8)","rgba(180,20,180,0.7)","rgba(255,140,0,0.85)","rgba(255,60,10,0.75)"];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 5 + Math.random() * 90,
    startY: 60 + Math.random() * 30,
    size: 1.5 + Math.random() * 3,
    duration: 2.5 + Math.random() * 3,
    delay: Math.random() * 4,
    drift: (Math.random() - 0.5) * 40,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));
}

function useEmbers(count = 18) {
  const [embers, setEmbers] = useState<Ember[]>([]);
  useEffect(() => { setEmbers(generateEmbers(count)); }, [count]);
  return embers;
}

/*
  ✅ FIX: TextHoverEffect
  - Removed useState for hovered → replaced with CSS :hover on the SVG
  - Gradient fill on hover handled via CSS filter trick on a <text> with CSS class
  - mousemove still uses direct DOM mutation (already correct)
  - No JS state changes on hover/unhover = zero React re-renders during interaction
*/
export const TextHoverEffect = ({
  text,
  duration,
  className,
}: {
  text: string;
  duration?: number;
  className?: string;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const embers = useEmbers(22);
  const gradientRef = useRef<SVGRadialGradientElement>(null);
  const strokeTextRef = useRef<SVGTextElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || !gradientRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    gradientRef.current.setAttribute('cx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
    gradientRef.current.setAttribute('cy', `${((e.clientY - rect.top) / rect.height) * 100}%`);
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* Ambient glows */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 51 }}>
        <div style={{ position: "absolute", left: "15%", bottom: "20%", width: 320, height: 120, background: "radial-gradient(ellipse, rgba(220,30,10,0.22) 0%, transparent 70%)", filter: "blur(18px)", animation: "ftGlowPulse 3.5s ease-in-out infinite" }} />
        <div style={{ position: "absolute", right: "12%", bottom: "25%", width: 260, height: 100, background: "radial-gradient(ellipse, rgba(140,20,200,0.18) 0%, transparent 70%)", filter: "blur(22px)", animation: "ftGlowPulse 4.2s ease-in-out infinite 0.8s" }} />
        <div style={{ position: "absolute", left: "50%", bottom: "28%", transform: "translateX(-50%)", width: 400, height: 60, background: "radial-gradient(ellipse, rgba(255,100,40,0.10) 0%, transparent 70%)", filter: "blur(12px)", animation: "ftGlowPulse 2.8s ease-in-out infinite 0.3s" }} />
      </div>

      {/* Embers */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 52 }}>
        {embers.map((e) => (
          <div key={e.id} style={{
            position: "absolute", left: `${e.x}%`, bottom: `${e.startY - 55}%`,
            width: e.size, height: e.size, borderRadius: "50%",
            background: e.color, boxShadow: `0 0 ${e.size * 3}px ${e.color}`,
            animation: `ftEmberRise ${e.duration}s ease-out ${e.delay}s infinite`,
            ["--drift" as string]: `${e.drift}px`,
          }} />
        ))}
      </div>

      {/* Scan line */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 53 }}>
        <div style={{ position: "absolute", left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent 0%, rgba(220,30,10,0.0) 20%, rgba(220,30,10,0.55) 50%, rgba(220,30,10,0.0) 80%, transparent 100%)", filter: "blur(1px)", animation: "ftScanLine 4s linear infinite", bottom: "38%" }} />
      </div>

      {/*
        ✅ KEY FIX: All hover behavior handled by CSS classes, zero useState.
        - .ft-svg-hover-shadow becomes visible on svg:hover via CSS
        - .ft-svg-hover-fill stroke becomes visible on svg:hover via CSS
        The SVG radialGradient is still mutated directly on mousemove (already correct).
      */}
      <style>{`
        @keyframes ftGlowPulse { 0%, 100% { opacity: 0.6; transform: scaleX(1) scaleY(1); } 50% { opacity: 1.0; transform: scaleX(1.12) scaleY(1.2); } }
        @keyframes ftEmberRise { 0% { opacity: 0; transform: translateY(0px) translateX(0px) scale(1); } 15% { opacity: 1; } 80% { opacity: 0.6; } 100% { opacity: 0; transform: translateY(-120px) translateX(var(--drift)) scale(0.3); } }
        @keyframes ftScanLine { 0% { bottom: 10%; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 0.7; } 100% { bottom: 90%; opacity: 0; } }
        @keyframes ftFlicker { 0%, 100% { opacity: 1; } 92% { opacity: 1; } 93% { opacity: 0.4; } 94% { opacity: 1; } 97% { opacity: 0.7; } 98% { opacity: 1; } }

        /* ✅ CSS hover — zero JS re-renders */
        .ft-hover-svg .ft-svg-hover-shadow { opacity: 0; transition: opacity 0.3s; }
        .ft-hover-svg:hover .ft-svg-hover-shadow { opacity: 0.7; }
        .ft-hover-svg .ft-svg-hover-fill { stroke: url(#ftTextGrad); opacity: 0; transition: opacity 0.3s; }
        .ft-hover-svg:hover .ft-svg-hover-fill { opacity: 1; }
      `}</style>

      <svg
        ref={svgRef}
        width="100%" height="100%" viewBox="0 0 300 100"
        xmlns="http://www.w3.org/2000/svg"
        onMouseMove={handleMouseMove}
        className={cn("ft-hover-svg select-none uppercase cursor-pointer", className)}
        style={{ position: "relative", zIndex: 54, animation: "ftFlicker 6s ease-in-out infinite" }}
      >
        <defs>
          {/* ✅ Gradient always present — CSS controls visibility of elements using it */}
          <linearGradient id="ftTextGrad" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ff2010" />
            <stop offset="35%" stopColor="#cc1000" />
            <stop offset="65%" stopColor="#9010cc" />
            <stop offset="100%" stopColor="#6000aa" />
          </linearGradient>

          <radialGradient
            ref={gradientRef}
            id="ftRevealMask"
            gradientUnits="userSpaceOnUse"
            r="22%"
            cx="50%"
            cy="50%"
          >
            <stop offset="0%" stopColor="white" />
            <stop offset="100%" stopColor="black" />
          </radialGradient>

          <mask id="ftTextMask">
            <rect x="0" y="0" width="100%" height="100%" fill="url(#ftRevealMask)" />
          </mask>
          <filter id="ftGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Shadow layer — shown on CSS :hover */}
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" strokeWidth="0.3"
          className="ft-svg-hover-shadow"
          style={{ fill: "transparent", stroke: "rgba(255,40,10,0.18)", fontFamily: "'Orbitron', monospace", fontSize: "4rem", fontWeight: 900 }}
        >{text}</text>

        {/* Draw-on stroke (always visible, animates in) */}
        <motion.text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" strokeWidth="0.3" filter="url(#ftGlow)"
          style={{ fill: "transparent", stroke: "rgba(220,30,10,0.55)", fontFamily: "'Orbitron', monospace", fontSize: "4rem", fontWeight: 900 }}
          initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
          animate={{ strokeDashoffset: 0, strokeDasharray: 1000 }}
          transition={{ duration: 4, ease: "easeInOut" }}
        >{text}</motion.text>

        {/* Hover reveal fill — shown on CSS :hover */}
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" strokeWidth="0.3"
          mask="url(#ftTextMask)"
          className="ft-svg-hover-fill"
          style={{ fill: "transparent", fontFamily: "'Orbitron', monospace", fontSize: "4rem", fontWeight: 900 }}
        >{text}</text>
      </svg>
    </div>
  );
};

export const FooterBg = () => (
  <div className="absolute inset-0" style={{ zIndex: 51, background: "radial-gradient(120% 120% at 50% 0%, rgba(15,0,0,0.85) 40%, rgba(80,10,140,0.25) 100%)", pointerEvents: "none" }} />
);

function SectionHead({ num, title }: { num: string; title: string }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
        <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 10, fontWeight: 700, color: "rgba(220,30,10,0.75)", letterSpacing: "0.1em" }}>{num}/</span>
        <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#fff" }}>{title}</span>
      </div>
      <div style={{ height: 1, background: "linear-gradient(90deg, rgba(220,30,10,0.6), rgba(140,20,200,0.3), transparent)" }} />
    </div>
  );
}

/*
  ✅ FIX: SocialBtn — removed useState hover entirely.
  CSS class .ft-social-btn handles all hover styles.
  whileHover/whileTap framer-motion props are CSS-compatible and don't cause re-renders.
*/
function SocialBtn({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) {
  return (
    <motion.a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.14, y: -3 }}
      whileTap={{ scale: 0.91 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className="ft-social-btn"
      style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        width: 36, height: 36, borderRadius: "50%",
        cursor: "pointer", textDecoration: "none",
        position: "relative", zIndex: 65,
      }}
    >{icon}</motion.a>
  );
}

/*
  ✅ FIX: EventLink — removed useState hover.
  CSS class .ft-event-link handles color transition.
  whileHover on motion.a is handled by framer-motion internally (no setState).
*/
function EventLink({ label, href }: { label: string; href: string }) {
  return (
    <motion.a
      href={href}
      whileHover={{ x: 5 }}
      transition={{ type: "spring", stiffness: 420, damping: 26 }}
      className="ft-event-link"
      style={{
        fontFamily: "'Rajdhani', sans-serif", fontSize: 14, fontWeight: 600,
        letterSpacing: "0.06em", cursor: "pointer", textDecoration: "none",
        padding: "4px 0", display: "block",
        position: "relative", zIndex: 65,
      }}
    >{label}</motion.a>
  );
}

/*
  ✅ FIX: ContactLink — removed useState hover.
  CSS class .ft-contact-link handles color transition.
*/
function ContactLink({ children, href }: { children: React.ReactNode; href: string }) {
  return (
    <a
      href={href}
      className="ft-contact-link"
      style={{
        fontFamily: "'Rajdhani', sans-serif", fontSize: 14, fontWeight: 500,
        letterSpacing: "0.04em", cursor: "pointer", textDecoration: "none",
        display: "block", position: "relative", zIndex: 65,
      }}
    >{children}</a>
  );
}

function MetallixFooter() {
  const eventLinks = [
    { label: "Codemet",     href: "/events/codemet" },
    { label: "Hackmet",     href: "/events/hackmet" },
    { label: "Scribe",      href: "/events/scribe" },
    { label: "Specio",      href: "/events/specio" },
    { label: "Scroll",      href: "/events/scroll" },
    { label: "Talaash",     href: "/events/talaash" },
    { label: "Gnosis",      href: "/events/gnosis" },
    { label: "Wall Street", href: "/events/wallst" },
    { label: "Golazo",      href: "/events/golazo" },
  ];

  const eventsCol1 = eventLinks.slice(0, 4);
  const eventsCol2 = eventLinks.slice(4);

  const socialLinks = [
    { icon: <Instagram size={16} />, label: "Instagram", href: "https://www.instagram.com/metallix2026/" },
    { icon: <Facebook  size={16} />, label: "Facebook",  href: "https://www.facebook.com/metallixju" },
    { icon: <Linkedin  size={16} />, label: "LinkedIn",  href: "https://www.linkedin.com/company/metallix2024" },
  ];

  const contactItems = [
    { icon: <Mail size={16} />,   label: "Email",   lines: ["official.metallixju@gmail.com"], href: "mailto:official.metallixju@gmail.com" },
    { icon: <MapPin size={16} />, label: "Address", lines: ["Dept. of Metallurgical & Material Engineering,", "Jadavpur University"], href: null },
    { icon: <Phone size={16} />,  label: "Phone",   lines: ["+91 89729 77686", "+91 75859 78804"], href: null },
  ];

  return (
    <div style={{ zIndex: 55, position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;600;700&display=swap');

        /* ✅ All hover styles in pure CSS — zero JS overhead */
        .ft-social-btn {
          border: 1px solid rgba(220,30,10,0.30);
          background: rgba(220,30,10,0.06);
          color: rgba(255,255,255,0.50);
          box-shadow: none;
          transition: border 0.20s ease, background 0.20s ease, color 0.20s ease, box-shadow 0.20s ease;
        }
        .ft-social-btn:hover {
          border-color: rgba(220,30,10,0.90);
          background: rgba(220,30,10,0.18);
          color: #ffffff;
          box-shadow: 0 0 18px rgba(220,30,10,0.50), 0 0 36px rgba(220,30,10,0.18);
        }
        .ft-event-link { color: rgba(255,255,255,0.50); transition: color 0.20s ease; }
        .ft-event-link:hover { color: #ff5030; }
        .ft-contact-link { color: rgba(255,255,255,0.50); transition: color 0.20s ease; }
        .ft-contact-link:hover { color: #ff5030; }

        @media (max-width: 768px) {
          .ft-main-grid { grid-template-columns: 1fr !important; gap: 40px 0 !important; }
          .ft-outer-pad { padding: 40px 22px 0 !important; }
          .ft-brand-desc { max-width: 100% !important; }
          .ft-bottom-bar { justify-content: center !important; text-align: center !important; }
          .ft-section-divider-section { margin-top: 8px !important; }
        }
      `}</style>

      <footer style={{ position: "relative", overflow: "hidden", margin: "0", background: "#030000", borderTop: "1px solid rgba(220,30,10,0.25)" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, rgba(220,30,10,0.8) 30%, #fff 50%, rgba(140,20,200,0.6) 70%, transparent)", boxShadow: "0 0 18px rgba(220,30,10,0.5)", zIndex: 60, pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 51, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)" }} />
        <FooterBg />

        <div className="ft-outer-pad" style={{ position: "relative", zIndex: 62, maxWidth: 1200, margin: "0 auto", padding: "56px 48px 0" }}>
          <div className="ft-main-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr 0.9fr", gap: "0 52px", paddingBottom: 48, alignItems: "start", position: "relative", zIndex: 63 }}>

            {/* COL 1: Brand */}
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <h2 style={{ fontFamily: "'Orbitron', monospace", fontSize: 26, fontWeight: 900, letterSpacing: "0.1em", color: "#fff", margin: 0, textShadow: "0 0 28px rgba(220,30,10,0.8)", textTransform: "uppercase", lineHeight: 1.1 }}>
                  METALLIX<span style={{ color: "rgba(220,30,10,0.9)" }}>`26</span>
                </h2>
                <div style={{ marginTop: 10, height: 2, width: 72, background: "linear-gradient(90deg, rgba(220,30,10,0.9), rgba(140,20,200,0.5))", boxShadow: "0 0 8px rgba(220,30,10,0.5)" }} />
              </div>
              <p style={{ fontFamily: "'Orbitron', monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(220,30,10,0.75)", margin: 0 }}>FORGE. FUSE. FLOURISH.</p>
              <p className="ft-brand-desc" style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 13, fontWeight: 500, lineHeight: 1.65, color: "rgba(255,255,255,0.42)", margin: 0, maxWidth: 240 }}>
                Annual techno-cultural fest of the Department of Metallurgical and Material Engineering, Jadavpur University.
              </p>
              <div style={{ display: "flex", gap: 10, marginTop: 4, position: "relative", zIndex: 65 }}>
                {socialLinks.map((s) => <SocialBtn key={s.label} icon={s.icon} label={s.label} href={s.href} />)}
              </div>
            </div>

            {/* COL 2: Contact */}
            <div className="ft-section-divider-section">
              <SectionHead num="001" title="Let's Connect" />
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {contactItems.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 20, flexShrink: 0, marginTop: 2, color: "rgba(220,30,10,0.8)" }}>{item.icon}</span>
                    <div>
                      <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "rgba(220,30,10,0.85)", marginBottom: 3, textTransform: "uppercase" }}>{item.label}</div>
                      {item.lines.map((line, j) =>
                        item.href
                          ? <ContactLink key={j} href={item.href}>{line}</ContactLink>
                          : <div key={j} style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 13, fontWeight: 500, lineHeight: 1.5, color: "rgba(255,255,255,0.48)" }}>{line}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* COL 3: Events */}
            <div className="ft-section-divider-section">
              <SectionHead num="002" title="Events" />
              <div style={{ display: "flex", gap: 32 }}>
                <nav style={{ display: "flex", flexDirection: "column" }}>{eventsCol1.map((l) => <EventLink key={l.label} label={l.label} href={l.href} />)}</nav>
                <nav style={{ display: "flex", flexDirection: "column" }}>{eventsCol2.map((l) => <EventLink key={l.label} label={l.label} href={l.href} />)}</nav>
              </div>
            </div>
          </div>

          <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(220,30,10,0.4) 30%, rgba(140,20,200,0.22) 70%, transparent)", boxShadow: "0 0 6px rgba(140,20,200,0.08)", position: "relative", zIndex: 63 }} />

          <div className="ft-bottom-bar" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", padding: "18px 0 20px", gap: 12, position: "relative", zIndex: 63 }}>
            <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.28)", margin: 0, letterSpacing: "0.06em" }}>
              © {new Date().getFullYear()} CREATED BY TEAM METALLIX.
            </p>
          </div>

          <div className="lg:flex hidden" style={{ height: "28rem", marginTop: "-10rem", marginBottom: "-8rem", pointerEvents: "none", zIndex: 58, position: "relative" }}>
            <div style={{ width: "100%", height: "100%", pointerEvents: "auto" }}>
              <TextHoverEffect text="METALLIX" className="z-50" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MetallixFooter;