import { useEffect, useRef, useState } from 'react'

const TILE      = 40
const PLAYER_Y  = 490
const BLOCK_H   = 40
const COLORS    = ['#ffffff', '#ffa602', '#46178f', '#1368ce', '#20b2aa']

interface Particle {
  id:       number
  x:        number   // px offset from center
  w:        number   // streak width
  h:        number   // streak height
  color:    string
  duration: number
}

let pid = 0

export function SpeedParticles({ blockWidth, playing }: { blockWidth: number; playing: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([])
  const widthRef = useRef(blockWidth)
  widthRef.current = blockWidth

  useEffect(() => {
    if (!playing) return
    const interval = setInterval(() => {
      const halfW = (widthRef.current * TILE) / 2
      const x     = (Math.random() * 2 - 1) * halfW * 0.9
      setParticles(ps => [
        ...ps.slice(-24),
        {
          id:       pid++,
          x,
          w:        1.5 + Math.random() * 2,
          h:        8 + Math.random() * 14,
          color:    COLORS[Math.floor(Math.random() * COLORS.length)],
          duration: 0.35 + Math.random() * 0.25,
        },
      ])
    }, 55)
    return () => clearInterval(interval)
  }, [playing])

  const top = PLAYER_Y + BLOCK_H / 2

  return (
    <div
      className="speed-particles"
      style={{ top, left: '50%' }}
    >
      {particles.map(p => (
        <div
          key={p.id}
          className="speed-particle"
          style={{
            left:              p.x,
            width:             p.w,
            height:            p.h,
            background:        p.color,
            animationDuration: `${p.duration}s`,
          }}
          onAnimationEnd={() => setParticles(ps => ps.filter(q => q.id !== p.id))}
        />
      ))}
    </div>
  )
}
