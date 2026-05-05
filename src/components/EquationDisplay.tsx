import { AnimatePresence, motion } from 'framer-motion'
import type { GateState } from '../types/game'

interface Props {
  gate: GateState | null
}

const pop = {
  initial:    { opacity: 0, scale: 0.4, y: -10 },
  animate:    { opacity: 1, scale: 1,   y: 0 },
  exit:       { opacity: 0, scale: 0.6, y: 10 },
  transition: { type: 'spring' as const, stiffness: 480, damping: 24 },
}

export function EquationDisplay({ gate }: Props) {
  const rp = gate?.revealPhase ?? 0

  return (
    <div className="equation-display">
      <div className="equation-row">
        <AnimatePresence mode="wait">
          {rp >= 1 && gate && (
            <motion.span key={`l-${gate.id}`} className="eq-num" {...pop}>
              {gate.equation.left}
            </motion.span>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {rp >= 2 && gate && (
            <motion.span key={`op-${gate.id}`} className="eq-op" {...pop}>
              {gate.equation.operator}
            </motion.span>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {rp >= 3 && gate && (
            <motion.span key={`r-${gate.id}`} className="eq-num" {...pop}>
              {gate.equation.right}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

    </div>
  )
}
