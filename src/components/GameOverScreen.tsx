import { motion } from 'framer-motion'

interface Props {
  score: number
  gatesCleared: number
  onRestart: () => void
}

export function GameOverScreen({ score, gatesCleared, onRestart }: Props) {
  return (
    <motion.div
      className="overlay gameover-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <motion.div
        className="overlay-title"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1,   opacity: 1 }}
        transition={{ type: 'spring', stiffness: 380, damping: 22, delay: 0.1 }}
      >
        FINISHED
      </motion.div>

      <div className="overlay-score">
        <span>{score}</span>
        score
        <div style={{ fontSize: '1rem', marginTop: 6, color: 'rgba(255,255,255,0.55)', fontWeight: 600 }}>
          {gatesCleared} {gatesCleared === 1 ? 'gate' : 'gates'} cleared
        </div>
      </div>

      <motion.button
        className="overlay-btn"
        onClick={onRestart}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0,  opacity: 1 }}
        transition={{ delay: 0.22 }}
        whileTap={{ scale: 0.95 }}
      >
        Play Again
      </motion.button>
    </motion.div>
  )
}
