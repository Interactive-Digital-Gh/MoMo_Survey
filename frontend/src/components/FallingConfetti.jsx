import { useMemo } from 'react'
import './FallingConfetti.css'

// Confetti-piece colours drawn from the MoMo palette (yellow / white / blues).
const CONFETTI_COLORS = ['#FFCB05', '#FFFFFF', '#FFE7A0', '#4D849C', '#B0C8D3']

/**
 * Decorative layer of randomised confetti pieces falling from the top. Meant to
 * sit behind page content (absolute, z-index 0). Disabled under reduced-motion.
 */
export default function FallingConfetti({ count = 28, className = '' }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, () => {
        const dur = 2.6 + Math.random() * 2
        return {
          left: Math.random() * 100,
          w: 4 + Math.random() * 4,
          h: 7 + Math.random() * 7,
          color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
          dur,
          delay: -Math.random() * dur, // negative → the sky is already full at load
          dist: 300 + Math.random() * 200,
          dx: (Math.random() - 0.5) * 70,
          r0: Math.random() * 360,
          r1: Math.random() * 720 - 360,
          round: Math.random() > 0.82,
        }
      }),
    [count],
  )

  return (
    <div className={`falling-confetti ${className}`.trim()} aria-hidden="true">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="falling-confetti__piece"
          style={{
            left: `${p.left}%`,
            width: `${p.w}px`,
            height: `${p.h}px`,
            background: p.color,
            borderRadius: p.round ? '50%' : '1px',
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
            '--dist': `${p.dist}px`,
            '--dx': `${p.dx}px`,
            '--r0': `${p.r0}deg`,
            '--r1': `${p.r1}deg`,
          }}
        />
      ))}
    </div>
  )
}
