export type Phase = 'idle' | 'playing' | 'gameover'

export interface Equation {
  left: number
  operator: '+' | '-'
  right: number
  answer: number
}

export interface GateState {
  id: number
  y: number                   // top-Y of the gate bar in screen px (moves downward)
  opening: number             // gap width in tiles  (= equation.answer)
  equation: Equation
  revealPhase: 0 | 1 | 2 | 3 // 0 = hidden, 1 = left, 2 = +op, 3 = full
  checked: boolean            // true once the gate has been passed or crashed
}

export interface GameState {
  phase: Phase
  score: number
  gatesCleared: number
  blockWidth: number   // 1–10 tiles
  gates: GateState[]
  speed: number        // px / s — increases with score
}
