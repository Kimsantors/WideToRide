import type { Equation } from '../types/game'

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function generateEquation(): Equation {
  const isPlus = Math.random() < 0.5

  if (isPlus) {
    // a + b = answer  (answer ∈ [2,10], a,b ≥ 1)
    const answer = rand(2, 10)
    const left   = rand(1, answer - 1)
    const right  = answer - left
    return { left, operator: '+', right, answer }
  }

  // a − b = answer  (answer ∈ [1,9], b ∈ [1,5], a = answer + b ≤ 14)
  const answer = rand(1, 9)
  const right  = rand(1, 5)
  const left   = answer + right
  return { left, operator: '-', right, answer }
}
