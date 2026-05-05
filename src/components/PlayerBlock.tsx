import { motion } from 'framer-motion'

const TILE     = 40
const PLAYER_Y = 490
const BLOCK_H  = TILE

export type Hint = 'neutral' | 'match' | 'over' | 'under'

const BG: Record<Hint, string>     = {
  neutral: 'rgba(255, 166,   2, 0.10)',
  match:   'rgba( 76, 175, 118, 0.10)',
  over:    'rgba(226,  27,  60, 0.10)',
  under:   'rgba(255, 166,   2, 0.10)',
}
const BORDER: Record<Hint, string> = {
  neutral: 'rgba(201, 127,   0, 0.45)',
  match:   'rgba( 46, 125,  82, 0.45)',
  over:    'rgba(160,  16,  40, 0.45)',
  under:   'rgba(201, 127,   0, 0.45)',
}

interface Props {
  width: number
  hint: Hint
}

export function PlayerBlock({ width, hint }: Props) {
  return (
    <motion.div
      className="player-block"
      animate={{ width: width * TILE }}
      transition={{ type: 'spring', stiffness: 600, damping: 32 }}
      style={{
        top: PLAYER_Y - BLOCK_H / 2,
        height: BLOCK_H,
        background: BG[hint],
        borderBottomColor: BORDER[hint],
        overflow: 'hidden',
      }}
    >
      <img
        src={`${import.meta.env.BASE_URL}visuals/${width}.png`}
        alt={String(width)}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }}
      />
    </motion.div>
  )
}
