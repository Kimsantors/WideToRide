import { useMemo } from 'react'

const COLORS = ['#ffa602', '#e21b3c', '#1368ce', '#26890c', '#46178f', '#20b2aa', '#ffffff']
const COUNT  = 22

export function BackgroundDots() {
  const dots = useMemo(() => Array.from({ length: COUNT }, (_, i) => ({
    id:       i,
    x:        Math.random() * 100,
    y:        Math.random() * 100,
    size:     5 + Math.random() * 11,
    color:    COLORS[Math.floor(Math.random() * COLORS.length)],
    delay:    Math.random() * 4,
    duration: 1.6 + Math.random() * 2.4,
  })), [])

  return (
    <div className="bg-dots" aria-hidden="true">
      {dots.map(d => (
        <div
          key={d.id}
          className="bg-dot"
          style={{
            left:              `${d.x}%`,
            top:               `${d.y}%`,
            width:             d.size,
            height:            d.size,
            background:        d.color,
            animationDelay:    `${d.delay}s`,
            animationDuration: `${d.duration}s`,
          }}
        />
      ))}
    </div>
  )
}
