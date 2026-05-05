import { motion } from 'framer-motion'

interface Props { onStart: () => void }

export function StartScreen({ onStart }: Props) {
  return (
    <motion.div
      className="overlay start-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="overlay-title"
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ type: 'spring', stiffness: 320, damping: 24, delay: 0.1 }}
      >
        You have to be this WIDE to RIDE
      </motion.div>

      <p className="overlay-subtitle">
        Solve the equation — then resize your block to fit through the gap.
        <br /><br />
        Tap <strong>−</strong> to shrink &nbsp;·&nbsp; Tap <strong>+</strong> to grow
      </p>

      <motion.button
        className="overlay-btn"
        onClick={onStart}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0,  opacity: 1 }}
        transition={{ delay: 0.25 }}
        whileTap={{ scale: 0.95 }}
      >
        Start
      </motion.button>
    </motion.div>
  )
}
