'use client'

import React, { useState, useEffect, useRef, useSyncExternalStore } from 'react'
import ReactDOM from 'react-dom'
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from 'framer-motion'

const CONTACTS = [
  { id: '01', name: 'Srinjoy Paul',     position: 'General Secretary',    gmail: 'srinjoypaulofficial17@gmail.com', phone: '+91 8972977686', image: '/srinjoy.jpeg' },
  { id: '02', name: 'Anubhab Kundu',    position: 'Treasurer',             gmail: 'anubhabkundu564@gmail.com',       phone: '+91 7585978804', image: '/anubhab.jpeg' },
  { id: '03', name: 'Saklin Haque',     position: 'Joint Secretary',       gmail: 'iamsaklin19@gmail.com',           phone: '+91 6290449275', image: '/saklin.jpeg' },
  { id: '04', name: 'Madanmohan Rana',  position: 'Joint Treasurer',       gmail: 'madanmohanrana2003@gmail.com',    phone: '+91 8670493369', image: '/madanmohan.jpeg' },
  { id: '05', name: 'Swarnendu Saha',   position: 'Assistant Secretary',   gmail: 'sahaswarnendu439@gmail.com',      phone: '+91 6296344273', image: '/swarnendu.jpeg' },
  { id: '06', name: 'Bapan Saha',       position: 'Assistant Treasurer',   gmail: 'bapansahaindian@gmail.com',       phone: '+91 7439686232', image: '/djabapan.jpeg' },
]

const CSS = `
@keyframes cuGreenPulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
.cu-row { border-top: 1px solid rgba(180,20,0,0.15); position: relative; overflow: visible; }
.cu-row:last-child { border-bottom: 1px solid rgba(180,20,0,0.15); }
.cu-row-bg {
  position: absolute; inset: 0;
  background: linear-gradient(105deg, rgba(180,10,0,0.0), rgba(180,10,0,0.04) 40%, rgba(100,20,160,0.04) 70%, transparent);
  opacity: 0; transition: opacity 0.35s ease; pointer-events: none;
}
.cu-row:hover .cu-row-bg, .cu-row.is-active .cu-row-bg { opacity: 1; }
.cu-name { transition: color 0.3s ease, transform 0.45s cubic-bezier(0.22,1,0.36,1); color: rgba(255,255,255,0.62); }
.cu-row:hover .cu-name, .cu-row.is-active .cu-name { color: #ffffff !important; transform: translateX(12px); }
.cu-index { transition: color 0.3s ease; color: rgba(255,255,255,0.38); }
.cu-row:hover .cu-index, .cu-row.is-active .cu-index { color: rgba(200,30,10,0.9) !important; }
.cu-role { transition: color 0.3s ease; color: rgba(255,255,255,0.42); }
.cu-row:hover .cu-role, .cu-row.is-active .cu-role { color: rgba(180,100,240,0.85) !important; }
.cu-chip { transition: background 0.22s, border-color 0.22s, transform 0.18s; text-decoration: none; display: block; }
.cu-chip:hover { background: rgba(120,20,160,0.12) !important; border-color: rgba(140,50,220,0.45) !important; transform: translateX(4px); }
`

let stylesInjected = false
function injectStyles() {
  if (stylesInjected || typeof document === 'undefined') return
  stylesInjected = true
  const s = document.createElement('style')
  s.textContent = CSS
  document.head.appendChild(s)
}

const T = {
  red:    { glow: 'rgba(200,25,5,0.9)',   border: 'rgba(200,25,5,0.45)',  text: '#ff6a45' },
  purple: { glow: 'rgba(130,40,210,0.8)', border: 'rgba(130,40,210,0.4)', text: '#b070e8' },
}

const GmailSVG  = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
const PhoneSVG  = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
const ZapSVG    = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
const ArrowSVG  = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
const PlusSVG   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
const MinusSVG  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>

type Contact = typeof CONTACTS[number]

function CursorCard({ active, cursorX, cursorY }: {
  active: Contact | undefined
  cursorX: ReturnType<typeof useSpring>
  cursorY: ReturnType<typeof useSpring>
}) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )
  if (!mounted) return null

  return ReactDOM.createPortal(
    <div style={{ position: 'fixed', left: 0, top: 0, zIndex: 999999, pointerEvents: 'none' }}>
      <motion.div style={{ x: cursorX, y: cursorY }}>
        <AnimatePresence>
          {active && (
            <motion.div
              key="cursor-card"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.12, ease: 'easeOut' }}
              style={{
                width: 210, height: 270, borderRadius: 10, overflow: 'hidden',
                border: '1px solid rgba(200,25,5,0.35)',
                boxShadow: '0 0 0 1px rgba(130,40,210,0.12), 0 20px 50px rgba(0,0,0,0.85)',
                background: '#050000', position: 'relative',
              }}
            >
              <div style={{
                position: 'absolute', inset: 0, zIndex: 0,
                backgroundImage: `url(${active.image})`,
                backgroundSize: 'cover', backgroundPosition: 'center',
                filter: 'blur(18px) brightness(0.18) saturate(1.3)',
                transform: 'scale(1.12)',
              }} />
              <img src={active.image} alt={active.name} style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                objectFit: 'cover', objectPosition: 'center top',
                zIndex: 1, display: 'block', filter: 'brightness(0.82) saturate(1.05)',
              }} />
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 2, zIndex: 4,
                background: `linear-gradient(90deg, transparent, ${T.red.glow} 40%, ${T.purple.glow} 70%, transparent)`,
                boxShadow: `0 0 8px ${T.red.glow}`,
              }} />
              <div style={{
                position: 'absolute', top: 0, left: 0, bottom: 0, width: 2, zIndex: 4,
                background: `linear-gradient(180deg, transparent, ${T.red.glow}, transparent)`,
                boxShadow: `0 0 6px ${T.red.glow}`,
              }} />
              <div style={{
                position: 'absolute', inset: 0, zIndex: 2,
                background: 'linear-gradient(180deg, transparent 35%, rgba(3,0,0,0.97) 100%)',
              }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 5, padding: '10px 12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e', animation: 'cuGreenPulse 2s ease-in-out infinite' }} />
                  <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>Available</span>
                </div>
                <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 11, fontWeight: 900, letterSpacing: '0.05em', color: '#fff', marginBottom: 2, textShadow: '0 0 8px rgba(200,25,5,0.6)' }}>{active.name}</div>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: T.purple.text, marginBottom: 7 }}>{active.position}</div>
                <div style={{ borderTop: '1px solid rgba(200,25,5,0.18)', paddingTop: 6, display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ color: T.purple.text, display: 'flex', flexShrink: 0 }}><GmailSVG /></span>
                    <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.65)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{active.gmail}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ color: T.red.text, display: 'flex', flexShrink: 0 }}><PhoneSVG /></span>
                    <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.65)' }}>{active.phone}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>,
    document.body
  )
}

const ContactRow = React.memo(function ContactRow({ data, index, isActive, onEnter, onLeave, onToggle, isMobile, isAnyActive }: {
  data: Contact; index: number; isActive: boolean
  onEnter: () => void
  onLeave: () => void
  onToggle: () => void
  isMobile: boolean; isAnyActive: boolean
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: isAnyActive && !isActive ? 0.18 : 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      onMouseEnter={!isMobile ? onEnter : undefined}
      onMouseLeave={!isMobile ? onLeave : undefined}
      onClick={isMobile ? onToggle : undefined}
      className={`cu-row${isActive ? ' is-active' : ''}`}
      style={{ cursor: isMobile ? 'pointer' : 'default' }}
    >
      <div className="cu-row-bg" />
      <div style={{ position: 'relative', zIndex: 1, padding: isMobile ? '18px 16px' : '22px 0', display: 'flex', flexDirection: 'column', gap: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: isMobile ? 12 : 22 }}>
            <span className="cu-index" style={{ fontFamily: "'Orbitron', monospace", fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', flexShrink: 0 }}>{data.id}</span>
            <h2 className="cu-name" style={{ fontFamily: "'Orbitron', monospace", fontSize: isMobile ? 18 : 'clamp(1.5rem, 2.8vw, 2.7rem)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', margin: 0, lineHeight: 1 }}>{data.name}</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {!isMobile && <span className="cu-role" style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>{data.position}</span>}
            {isMobile
              ? <span style={{ color: T.purple.text }}>{isActive ? <MinusSVG /> : <PlusSVG />}</span>
              : <motion.div animate={{ x: isActive ? 0 : -10, opacity: isActive ? 1 : 0 }} transition={{ duration: 0.25 }} style={{ color: T.red.text, filter: `drop-shadow(0 0 6px ${T.red.glow})` }}><ArrowSVG /></motion.div>
            }
          </div>
        </div>

        {!isMobile && (
          <motion.div
            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : -4 }}
            transition={{ duration: 0.25 }}
            style={{ display: 'flex', alignItems: 'center', gap: 24, paddingLeft: 'clamp(34px, 3.5vw, 60px)', marginTop: 8, pointerEvents: isActive ? 'auto' : 'none' }}
          >
            <a href={`mailto:${data.gmail}`} style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
              <span style={{ color: T.purple.text, display: 'flex' }}><GmailSVG /></span>
              <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: '0.04em', color: 'rgba(255,255,255,0.55)' }}>{data.gmail}</span>
            </a>
            <span style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.1)' }} />
            <a href={`tel:${data.phone}`} style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
              <span style={{ color: T.red.text, display: 'flex' }}><PhoneSVG /></span>
              <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: '0.04em', color: 'rgba(255,255,255,0.55)' }}>{data.phone}</span>
            </a>
          </motion.div>
        )}

        {isMobile && <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginTop: 4, paddingLeft: 28 }}>{data.position}</div>}
      </div>

      <AnimatePresence>
        {isMobile && isActive && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28, ease: 'easeInOut' }} style={{ overflow: 'hidden' }}>
            <div style={{ padding: '0 16px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(200,25,5,0.25)' }}>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${data.image})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(16px) brightness(0.2)', transform: 'scale(1.1)' }} />
                <img src={data.image} alt={data.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.7) 100%)' }} />
                <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 2, background: `linear-gradient(180deg, transparent, ${T.red.glow}, transparent)` }} />
              </div>
              <a href={`mailto:${data.gmail}`} className="cu-chip" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 7, border: '1px solid rgba(130,40,210,0.2)', background: 'rgba(255,255,255,0.02)' }}>
                <span style={{ color: T.purple.text, display: 'flex' }}><GmailSVG /></span>
                <div>
                  <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', marginBottom: 1 }}>Gmail</div>
                  <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 13, fontWeight: 600, color: '#fff' }}>{data.gmail}</div>
                </div>
              </a>
              <a href={`tel:${data.phone}`} className="cu-chip" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 7, border: '1px solid rgba(130,40,210,0.2)', background: 'rgba(255,255,255,0.02)' }}>
                <span style={{ color: T.red.text, display: 'flex' }}><PhoneSVG /></span>
                <div>
                  <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', marginBottom: 1 }}>Phone</div>
                  <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 13, fontWeight: 600, color: '#fff' }}>{data.phone}</div>
                </div>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
})

export default function ContactUsSection() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const rafRef = useRef<number>(0)

  const mouseX = useMotionValue(-9999)
  const mouseY = useMotionValue(-9999)
  const cursorX = useSpring(mouseX, { damping: 40, stiffness: 400, mass: 0.15 })
  const cursorY = useSpring(mouseY, { damping: 40, stiffness: 400, mass: 0.15 })

  useEffect(() => {
    injectStyles()
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (isMobile) return
    const handleMove = (e: MouseEvent) => {
      if (rafRef.current) return
      rafRef.current = requestAnimationFrame(() => {
        mouseX.set(e.clientX + 20)
        mouseY.set(e.clientY + 20)
        rafRef.current = 0
      })
    }
    window.addEventListener('mousemove', handleMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [isMobile, mouseX, mouseY])

  const handlers = React.useMemo(() =>
    Object.fromEntries(CONTACTS.map(c => [
      c.id,
      {
        onEnter:  () => setActiveId(c.id),
        onLeave:  () => setActiveId(null),
        onToggle: () => setActiveId(prev => prev === c.id ? null : c.id),
      }
    ])),
  [])

  const active = CONTACTS.find(c => c.id === activeId)

  return (
    <div style={{
      position: 'relative', width: '100%',
      background: 'radial-gradient(ellipse at 5% 10%, rgba(160,8,0,0.22) 0%, transparent 40%), radial-gradient(ellipse at 95% 90%, rgba(100,5,0,0.18) 0%, transparent 40%), #050000',
      padding: 'clamp(40px, 5vw, 72px) clamp(20px, 6vw, 72px)',
      fontFamily: "'Rajdhani', sans-serif", cursor: 'default',
    }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.05) 3px, rgba(0,0,0,0.05) 4px)' }} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, zIndex: 10, background: `linear-gradient(90deg, transparent, ${T.red.glow} 30%, rgba(255,255,255,0.6) 50%, ${T.purple.glow} 70%, transparent)`, boxShadow: '0 0 12px rgba(200,25,5,0.5)' }} />
      <div style={{ position: 'absolute', top: -80, left: -80, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(180,8,0,0.14) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto' }}>
        <motion.header
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          style={{ marginBottom: 40, display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'flex-end', justifyContent: 'space-between', gap: 12 }}
        >
          <div>
            <div style={{ marginBottom: 8 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: "'Orbitron', monospace", fontSize: 8, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: T.red.text, border: `1px solid ${T.red.border}`, borderRadius: 3, padding: '3px 9px', background: 'rgba(200,25,5,0.06)' }}>
                <ZapSVG /> Contact Us
              </span>
            </div>
            <h1 style={{ fontFamily: "'Orbitron', monospace", fontSize: 'clamp(2rem, 5vw, 4.5rem)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#fff', margin: 0, textShadow: '0 0 28px rgba(200,25,5,0.5)' }}>
              Get In{' '}<span style={{ color: 'rgba(255,255,255,0.15)' }}>Touch</span>
            </h1>
          </div>
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 8 }}>
              <div style={{ width: 50, height: 1, background: 'linear-gradient(90deg, transparent, rgba(200,25,5,0.3))' }} />
              <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.14)' }}>Direct Line</span>
            </div>
          )}
        </motion.header>

        <motion.div initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }} transition={{ duration: 0.6, delay: 0.15 }} style={{ display: 'flex', alignItems: 'center', marginBottom: 2, transformOrigin: 'left' }}>
          <div style={{ width: 36, height: 2, background: `linear-gradient(90deg, ${T.red.glow}, transparent)`, boxShadow: `0 0 5px ${T.red.glow}` }} />
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#fff', boxShadow: `0 0 5px ${T.purple.glow}, 0 0 10px ${T.red.glow}`, margin: '0 4px' }} />
          <div style={{ width: 36, height: 2, background: `linear-gradient(90deg, transparent, ${T.purple.glow})`, boxShadow: `0 0 5px ${T.purple.glow}` }} />
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {CONTACTS.map((contact, index) => (
            <ContactRow
              key={contact.id}
              data={contact}
              index={index}
              isActive={activeId === contact.id}
              onEnter={handlers[contact.id].onEnter}
              onLeave={handlers[contact.id].onLeave}
              onToggle={handlers[contact.id].onToggle}
              isMobile={isMobile}
              isAnyActive={activeId !== null}
            />
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ marginTop: 24, height: 1, background: `linear-gradient(90deg, ${T.red.glow}, ${T.purple.glow}, transparent)`, opacity: 0.2 }} />
      </div>

      {!isMobile && <CursorCard active={active} cursorX={cursorX} cursorY={cursorY} />}
    </div>
  )
}