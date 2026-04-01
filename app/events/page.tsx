'use client'

import { EventCountdownCard } from '@/components/event-countdown-card'
import { SmoothCursor } from '@/components/ui/smooth-cursor'
import React from 'react'

const D1 = new Date(2026, 3, 1)  // April 1, 2026
const D2 = new Date(2026, 3, 3)  // April 3, 2026

const t = (base: Date, h: number, m = 0) => {
  const d = new Date(base)
  d.setHours(h, m, 0, 0)
  return d
}

// ✅ Also at module level — stable references, no re-creation on render
const events = [
  { href: '/events/codemet',  image: '/codemet.png',  title: 'CODEMET',  date: t(D1, 21,  0) },
  { href: '/events/hackmet',  image: '/hackemet.png', title: 'HACKMET',  date: t(D1, 10,  0) },
  { href: '/events/scribe',   image: '/scribe.png',   title: 'SCRIBE',   date: t(D2, 12, 30) },
  { href: '/events/specio',   image: '/specio.png',   title: 'SPECIO',   date: t(D2, 11) },
  { href: '/events/scroll',   image: '/scroll.png',   title: 'SCROLL',   date: t(D2, 11) },
  { href: '/events/talaash',  image: '/talaash.png',  title: 'TALAASH',  date: t(D2, 13) },
  { href: '/events/gnosis',   image: '/gnosis.png',   title: 'GNOSIS',   date: t(D2, 16) },
  { href: '/events/wallst',   image: '/wallst.png',   title: 'WALLST',   date: t(D2, 11, 30) },
  { href: '/events/golazo',   image: '/golazo.png',   title: 'GOLAZO',   date: t(D2, 15,  30) },
]

export default function Event() {
  return (
    <>
      <SmoothCursor/>
      <div
        className="relative min-h-screen overflow-x-hidden bg-black"
        style={{ background: 'linear-gradient(160deg, #0a0015 0%, #050008 40%, #0d0000 100%)' }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Rajdhani:wght@500;700&display=swap');

          @keyframes titleGlow {
            0%,100% { text-shadow: 0 0 24px rgba(220,30,10,0.8), 0 0 48px rgba(180,10,0,0.35); }
            50%      { text-shadow: 0 0 36px rgba(255,40,10,1),  0 0 72px rgba(200,10,0,0.55); }
          }
          @keyframes ticker {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }
          @keyframes cardIn {
            from { opacity: 0; transform: translateY(18px); }
            to   { opacity: 1; transform: translateY(0); }
          }

          .ev-card { animation: cardIn 0.4s ease both; }
          .ev-card:nth-child(1) { animation-delay: 0.03s }
          .ev-card:nth-child(2) { animation-delay: 0.07s }
          .ev-card:nth-child(3) { animation-delay: 0.11s }
          .ev-card:nth-child(4) { animation-delay: 0.15s }
          .ev-card:nth-child(5) { animation-delay: 0.19s }
          .ev-card:nth-child(6) { animation-delay: 0.23s }
          .ev-card:nth-child(7) { animation-delay: 0.27s }
          .ev-card:nth-child(8) { animation-delay: 0.31s }
          .ev-card:nth-child(9) { animation-delay: 0.35s }

          .ev-link:hover .ecc-btn {
            background-image: linear-gradient(135deg, #b01200, #ee220e) !important;
            box-shadow: 0 0 18px rgba(238,34,14,0.6) !important;
            border-color: rgba(238,34,14,0.55) !important;
          }

          .ev-ticker {
            display: flex;
            white-space: nowrap;
            animation: ticker 32s linear infinite;
            transform: translateZ(0);
          }
        `}</style>

        {/* Top neon line */}
        <div
          className="fixed top-0 inset-x-0 h-[2px] z-50 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(120,8,185,0.7) 25%, rgba(220,30,10,0.9) 50%, rgba(120,8,185,0.7) 75%, transparent)',
            boxShadow: '0 0 10px rgba(220,30,10,0.4)',
          }}
        />

        {/* Ticker */}
        <div
          className="fixed top-[2px] inset-x-0 h-5 z-40 overflow-hidden pointer-events-none"
          style={{ background: '#050008', borderBottom: '1px solid rgba(120,8,185,0.10)' }}
        >
          <div
            className="ev-ticker pt-[4px]"
            style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.24em', color: 'rgba(140,10,185,0.32)' }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="mr-10">
                ◆ CODEMET ◆ HACKMET ◆ SCRIBE ◆ SPECIO ◆ SCROLL ◆ TALAASH ◆ GNOSIS ◆ WALLST ◆ GOLAZO ◆ METALLIX&nbsp;2026
              </span>
            ))}
          </div>
        </div>

        {/* Main content */}
        <main className="relative z-10 px-4 sm:px-8 md:px-14 lg:px-20 pt-12 pb-16">

          {/* Header */}
          <header className="text-center pt-8 sm:pt-12 pb-10 sm:pb-14">
            <p
              className="uppercase tracking-[0.24em] mb-4"
              style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 10, fontWeight: 700, color: 'rgba(140,10,185,0.55)' }}
            >
              METALLIX 2026 &nbsp;·&nbsp; JADAVPUR UNIVERSITY
            </p>

            <h1
              className="m-0 text-white uppercase"
              style={{
                fontFamily: "'Orbitron',monospace",
                fontWeight: 900,
                fontSize: 'clamp(2.2rem, 8vw, 5rem)',
                letterSpacing: '0.2em',
                animation: 'titleGlow 4s ease-in-out infinite',
              }}
            >
              EVENTS
            </h1>

            <p
              className="mt-3 uppercase tracking-widest"
              style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 'clamp(0.65rem, 2vw, 0.85rem)', fontWeight: 500, color: 'rgba(255,255,255,0.2)' }}
            >
              Forge your legacy — select your arena
            </p>

            <div className="flex items-center justify-center gap-3 mt-5 opacity-60">
              <div className="h-px w-10 sm:w-20" style={{ background: 'rgba(120,8,185,0.5)' }} />
              <div className="w-1 h-1 rounded-full" style={{ background: 'rgba(220,30,10,0.9)', boxShadow: '0 0 5px rgba(220,30,10,0.7)' }} />
              <div className="h-px w-20 sm:w-36" style={{ background: 'linear-gradient(90deg,rgba(220,30,10,0.6),rgba(120,8,185,0.5))' }} />
              <div className="w-1 h-1 rounded-full" style={{ background: 'rgba(120,8,185,0.9)', boxShadow: '0 0 5px rgba(120,8,185,0.7)' }} />
              <div className="h-px w-10 sm:w-20" style={{ background: 'rgba(120,8,185,0.5)' }} />
            </div>

            <p
              className="mt-4 uppercase tracking-[0.2em]"
              style={{ fontFamily: "'Orbitron',monospace", fontSize: 8, fontWeight: 700, color: 'rgba(220,30,10,0.38)' }}
            >
              {String(events.length).padStart(2, '0')} events listed
            </p>
          </header>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 justify-items-center">
            {events.map((ev) => (
              <a
                key={ev.title}
                href={ev.href}
                className="ev-card ev-link block w-full max-w-[360px] no-underline"
              >
                <EventCountdownCard
                  image={ev.image}
                  title={ev.title}
                  date={ev.date}        
                  attendees={0}
                />
              </a>
            ))}
          </div>

          {/* Footer */}
          <footer className="mt-12 text-center">
            <p
              className="uppercase tracking-[0.22em]"
              style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 9, fontWeight: 600, color: 'rgba(120,8,185,0.28)' }}
            >
            </p>
          </footer>
        </main>
      </div>
    </>
  )
}