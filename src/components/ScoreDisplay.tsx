import { AnimatePresence, motion } from 'framer-motion'

interface Props { score: number }

export function ScoreDisplay({ score }: Props) {
  return (
    <div className="score-display">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={score}
          className="score-value"
          initial={{ y: -18, opacity: 0 }}
          animate={{ y: 0,   opacity: 1 }}
          exit={{    y:  18, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 28 }}
        >
          {score}
        </motion.div>
      </AnimatePresence>
      <div className="score-label">score</div>
    </div>
  )
}
