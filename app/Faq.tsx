'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Link from 'next/link'
import { Zap, MessageSquare } from 'lucide-react'

const faqItems = [
  {
    id: 'item-1',
    question: 'When is the Last day to register for Metallix 2026?',
    answer: 'The last date to register for Metallix 2026 is 31st March, 2026.',
  },
  {
    id: 'item-2',
    question: 'Who all can participate in Metallix 2026?',
    answer: 'Students from any college/university can participate in Metallix 2026.',
  },
  {
    id: 'item-3',
    question: 'On which day will the events be conducted?',
    answer: 'The events are distributed across both days — 3rd April, 2026.',
  },
  {
    id: 'item-6',
    question: 'How and when can I reach the venue for the event?',
    answer: "Kindly visit the 'Contact' section of our website, which has the location and schedule of the events.",
  },
  {
    id: 'item-8',
    question: 'Is there any registration fee for participating in the events?',
    answer: 'There are no registration fees for any of the events of Metallix 2026 for both JU/Non-JU students.',
  },
  {
    id: 'item-9',
    question: 'Can students of other departments participate?',
    answer: 'Absolutely! Students of any department can participate in any event.',
  },
  {
    id: 'item-10',
    question: 'Would students from other colleges get accommodation?',
    answer: 'Accommodation will be provided to selected students only. Team Metallix will contact them shortly after registrations.',
  },
  {
    id: 'item-11',
    question: 'Will there be an arrangement for food?',
    answer: 'Food facilities will be provided to Non-JU students. However they will need to pay Rs. 150 for each day.',
  },
]

export default function FAQs() {
  return (
    <div id="faq" style={{ position: 'relative', zIndex: 51 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;600;700&display=swap');

        /* Red-primary accordion borders */
        .faq-accordion-item {
          border-bottom: 1px solid rgba(255, 26, 26, 0.15) !important;
          transition: background-color 0.2s ease;
          position: relative;
          z-index: 53;
        }
        .faq-accordion-item:first-child {
          border-top: 1px solid rgba(255, 26, 26, 0.15);
        }

        .faq-trigger {
          font-family: 'Rajdhani', sans-serif !important;
          font-size: 15px !important;
          font-weight: 600 !important;
          letter-spacing: 0.03em !important;
          color: rgba(255, 220, 220, 0.75) !important;
          text-align: left !important;
          padding: 18px 0 !important;
          transition: color 0.2s ease !important;
          text-decoration: none !important;
          position: relative;
          z-index: 54;
        }
        .faq-trigger:hover {
          color: #ffffff !important;
          text-decoration: none !important;
        }
        .faq-trigger[data-state='open'] {
          color: #ffffff !important;
        }
        /* Chevron: red resting, brighter red open, violet on hover (minor accent) */
        .faq-trigger svg {
          color: rgba(238, 34, 14, 0.45) !important;
          transition: color 0.2s ease, transform 0.2s ease !important;
          flex-shrink: 0 !important;
        }
        .faq-trigger[data-state='open'] svg {
          color: #ff4040 !important;
        }
        .faq-trigger:hover svg {
          color: rgba(160, 80, 220, 0.70) !important;
        }

        .faq-content {
          font-family: 'Rajdhani', sans-serif !important;
          font-size: 14px !important;
          font-weight: 500 !important;
          line-height: 1.7 !important;
          color: rgba(255, 200, 200, 0.50) !important;
          letter-spacing: 0.02em !important;
          padding-bottom: 18px !important;
          position: relative;
          z-index: 54;
        }

        .faq-stat-divider {
          border-bottom: 1px solid rgba(255, 26, 26, 0.12);
        }
        .faq-stat-divider:last-child {
          border-bottom: none;
        }
      `}</style>

      <section className="py-20 md:py-28" style={{ position: 'relative', zIndex: 51 }}>

        {/* Background glows — kept below content */}
        <div style={{
          position: 'absolute', top: '10%', left: '50%',
          transform: 'translateX(-50%)',
          width: '60vw', height: '40vw',
          background: 'radial-gradient(ellipse, rgba(180,0,0,0.11) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 51,
        }} />
        <div style={{
          position: 'absolute', bottom: '5%', right: '-5%',
          width: '25vw', height: '25vw',
          background: 'radial-gradient(circle, rgba(100,30,160,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 51,
        }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 52 }}>

          {/* ── Header ── */}
          <div style={{ textAlign: 'center', marginBottom: 64, position: 'relative', zIndex: 53 }}>
            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              backgroundColor: 'rgba(255,26,26,0.08)',
              border: '1px solid rgba(255,26,26,0.28)',
              borderRadius: 6, padding: '5px 14px', marginBottom: 20,
              fontFamily: "'Rajdhani', sans-serif", fontSize: 11, fontWeight: 700,
              letterSpacing: '0.2em', color: '#ffb3b3', textTransform: 'uppercase',
              position: 'relative', zIndex: 54,
            }}>
              <Zap size={10} /> Support Hub
            </div>

            {/* Title */}
            <h2 style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: 'clamp(2rem, 5.5vw, 3.5rem)',
              fontWeight: 900, letterSpacing: '0.1em',
              backgroundImage: 'linear-gradient(135deg, #fff 0%, #ffffff 18%, #ff2020 52%, #990000 78%, #6b1fa0 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              textShadow: 'none',
              margin: 0, lineHeight: 1.1,
              position: 'relative', zIndex: 54,
            }}>
              FREQUENTLY ASKED<br />QUESTIONS
            </h2>

            {/* Rule */}
            <div style={{
              width: 180, height: 2, margin: '18px auto 0',
              background: 'linear-gradient(90deg, transparent, #ff1a1a, #cc0000, rgba(110,30,160,0.35), transparent)',
              boxShadow: '0 0 14px rgba(238,34,14,0.55)',
              borderRadius: 2,
              position: 'relative', zIndex: 54,
            }} />

            <p style={{
              fontFamily: "'Rajdhani', sans-serif", fontSize: 15, fontWeight: 500,
              letterSpacing: '0.04em', color: 'rgba(255,200,200,0.38)', marginTop: 14,
              position: 'relative', zIndex: 54,
            }}>
              Everything you need to know before showing up
            </p>
          </div>

          {/* ── Body ── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '48px 64px',
            alignItems: 'start',
            position: 'relative', zIndex: 52,
          }}>

            {/* Left panel */}
            <div style={{ position: 'sticky', top: 100, zIndex: 53 }}>
              <div style={{
                background: 'rgba(10,0,0,0.88)',
                border: '1px solid rgba(255,26,26,0.20)',
                borderRadius: 16, padding: '28px 24px',
                boxShadow: '0 0 40px rgba(180,0,0,0.10)',
                position: 'relative', overflow: 'hidden',
                zIndex: 53,
              }}>
                {/* Top accent */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                  background: 'linear-gradient(90deg, transparent, rgba(238,34,14,0.85), #fff, rgba(238,34,14,0.80), rgba(110,30,160,0.22), transparent)',
                  boxShadow: '0 0 14px rgba(238,34,14,0.60)',
                  zIndex: 54,
                }} />

                {/* Violet corner orb */}
                <div style={{
                  position: 'absolute', bottom: -30, right: -30,
                  width: 90, height: 90, borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(100,30,160,0.10) 0%, transparent 70%)',
                  pointerEvents: 'none',
                  zIndex: 53,
                }} />

                <MessageSquare
                  size={26} color="#ff4040"
                  style={{ marginBottom: 14, filter: 'drop-shadow(0 0 6px rgba(238,34,14,0.55))', position: 'relative', zIndex: 54 }}
                />

                <h3 style={{
                  fontFamily: "'Orbitron', monospace", fontSize: 18, fontWeight: 700,
                  letterSpacing: '0.08em', color: '#fff',
                  textShadow: '0 0 18px rgba(238,34,14,0.45)', margin: '0 0 10px',
                  position: 'relative', zIndex: 54,
                }}>
                  GOT MORE<br />QUESTIONS?
                </h3>

                <p style={{
                  fontFamily: "'Rajdhani', sans-serif", fontSize: 14, fontWeight: 500,
                  lineHeight: 1.65, color: 'rgba(255,200,200,0.38)', margin: '0 0 22px',
                  position: 'relative', zIndex: 54,
                }}>
                  Can&apos;t find what you&apos;re looking for? Our team is standing by.
                </p>

                {[
                  { num: '9',    label: 'Unique Events' },
                  { num: '₹1L',  label: 'Prize Pool' },
                  { num: 'FREE', label: 'Registration' },
                ].map((s) => (
                  <div key={s.label} className="faq-stat-divider" style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '9px 0',
                    position: 'relative', zIndex: 54,
                  }}>
                    <span style={{
                      fontFamily: "'Orbitron', monospace", fontSize: 17, fontWeight: 900,
                      color: '#ff4040', textShadow: '0 0 12px rgba(238,34,14,0.55)',
                    }}>{s.num}</span>
                    <span style={{
                      fontFamily: "'Rajdhani', sans-serif", fontSize: 11, fontWeight: 600,
                      letterSpacing: '0.1em', color: 'rgba(255,180,180,0.35)', textTransform: 'uppercase',
                    }}>{s.label}</span>
                  </div>
                ))}

                {/* Contact button */}
                <Link
                  href="mailto:official.metallixju@gmail.com"
                  style={{ textDecoration: 'none', display: 'block', marginTop: 24, position: 'relative', zIndex: 55 }}
                >
                  <div style={{
                    width: '100%', padding: '11px 0', borderRadius: 9,
                    background: 'linear-gradient(135deg, #990000, #ff1a1a)',
                    border: '1px solid rgba(255,26,26,0.45)', color: '#fff',
                    fontFamily: "'Orbitron', monospace", fontSize: 9, fontWeight: 700,
                    letterSpacing: '0.14em', textAlign: 'center', textTransform: 'uppercase',
                    boxShadow: '0 0 20px rgba(238,34,14,0.28)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    transition: 'opacity 0.18s ease, box-shadow 0.18s ease',
                    cursor: 'pointer',
                  }}>
                    <Zap size={11} /> Contact Team
                  </div>
                </Link>
              </div>
            </div>

            {/* Right panel — Accordion */}
            <div style={{ minWidth: 0, position: 'relative', zIndex: 53 }}>
              <Accordion type="single" collapsible>
                {faqItems.map((item, index) => (
                  <AccordionItem key={item.id} value={item.id} className="faq-accordion-item">
                    <AccordionTrigger className="faq-trigger hover:no-underline">
                      <span style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative', zIndex: 54 }}>
                        <span style={{
                          fontFamily: "'Orbitron', monospace",
                          fontSize: 9, fontWeight: 700,
                          color: 'rgba(238,34,14,0.35)',
                          letterSpacing: '0.08em',
                          flexShrink: 0,
                        }}>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        {item.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="faq-content" style={{ paddingLeft: 28 }}>
                        {item.answer}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}