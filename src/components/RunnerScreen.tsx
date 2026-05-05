import { useState, useEffect, useCallback, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import type { GameState, GateState } from '../types/game'
import { generateEquation } from '../utils/generateEquation'
import { playGrow, playShrink } from '../utils/sounds'
import { BackgroundDots } from './BackgroundDots'
import { GateBar } from './GateBar'
import { PlayerBlock, type Hint } from './PlayerBlock'
import { EquationDisplay } from './EquationDisplay'
import { ScoreDisplay } from './ScoreDisplay'
import { ControlButtons } from './ControlButtons'
import { GameOverScreen } from './GameOverScreen'
import { StartScreen } from './StartScreen'

// ── Constants ────────────────────────────────────────────────────────────────
const TILE          = 40
const VIEW_H        = 680
const PLAYER_Y      = 490   // center Y of player block
const BLOCK_H       = TILE
const GATE_H        = 30
const GATE_SPAWN_Y  = -50   // just above the viewport

// px/s speed settings
const INITIAL_SPEED = 70
const SPEED_INC     = 3     // per gate cleared
const MAX_SPEED     = 180

// Distance thresholds for equation reveal (dist = COLLISION_Y - gate.y)
const COLLISION_Y   = PLAYER_Y - BLOCK_H / 2 - GATE_H  // 440
const REVEAL_1      = 490   // show left operand  (almost immediately on spawn)
const REVEAL_2      = 475   // show operator
const REVEAL_3      = 460   // show right operand (full eq visible right away)

let nextId = 1

function makeGate(): GateState {
  const eq = generateEquation()
  return {
    id:          nextId++,
    y:           GATE_SPAWN_Y,
    opening:     eq.answer,
    equation:    eq,
    revealPhase: 0,
    checked:     false,
  }
}

function updateGame(s: GameState, dt: number): GameState {
  const dy          = s.speed * dt
  let { score, gatesCleared, speed, blockWidth } = s
  let gameOver      = false

  let gates = s.gates.map(gate => {
    const y = gate.y + dy

    if (gate.checked) return { ...gate, y }

    const dist = COLLISION_Y - y

    // Progressive equation reveal
    let rp = gate.revealPhase
    if (dist < REVEAL_1 && rp < 1) rp = 1 as 1
    if (dist < REVEAL_2 && rp < 2) rp = 2 as 2
    if (dist < REVEAL_3 && rp < 3) rp = 3 as 3

    // Collision
    if (dist <= 0) {
      if (gate.opening === blockWidth) {
        score += gate.opening
        gatesCleared++
      } else {
        gameOver = true
      }
      return { ...gate, y, revealPhase: rp, checked: true }
    }

    return { ...gate, y, revealPhase: rp }
  })

  if (gameOver) return { ...s, gates, phase: 'gameover' }

  speed = Math.min(MAX_SPEED, INITIAL_SPEED + score * SPEED_INC)

  // Spawn next gate once the cleared gate has scrolled 200 px below the player
  const hasUnchecked  = gates.some(g => !g.checked)
  const lastChecked   = gates.filter(g => g.checked).at(-1)
  const readyToSpawn  = !lastChecked || lastChecked.y > PLAYER_Y + 200
  if (!hasUnchecked && readyToSpawn) gates = [...gates, makeGate()]

  // Discard gates well below screen
  gates = gates.filter(g => g.y < VIEW_H + 60)

  return { ...s, gates, score, gatesCleared, speed }
}

// ── Component ─────────────────────────────────────────────────────────────────
const IDLE_STATE: GameState = {
  phase:        'idle',
  score:        0,
  gatesCleared: 0,
  blockWidth:   5,
  gates:        [],
  speed:        INITIAL_SPEED,
}

export function RunnerScreen() {
  const [gs, setGs]         = useState<GameState>(IDLE_STATE)
  const [shake, setShake]   = useState(false)
  const [flash, setFlash]   = useState(false)
  const lastTimeRef         = useRef<number>(0)
  const prevScoreRef        = useRef<number>(0)

  // Trigger shake on game-over
  useEffect(() => {
    if (gs.phase !== 'gameover') return
    setShake(true)
    const t = setTimeout(() => setShake(false), 500)
    return () => clearTimeout(t)
  }, [gs.phase])

  // Trigger green flash when score increases
  useEffect(() => {
    if (gs.score > prevScoreRef.current) {
      prevScoreRef.current = gs.score
      setFlash(true)
      const t = setTimeout(() => setFlash(false), 420)
      return () => clearTimeout(t)
    }
  }, [gs.score])

  // RAF game loop — runs for the lifetime of the component
  useEffect(() => {
    let animId: number

    function tick(time: number) {
      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.05)
      lastTimeRef.current = time

      setGs(s => (s.phase === 'playing' ? updateGame(s, dt) : s))
      animId = requestAnimationFrame(tick)
    }

    animId = requestAnimationFrame(t => {
      lastTimeRef.current = t
      animId = requestAnimationFrame(tick)
    })

    return () => cancelAnimationFrame(animId)
  }, [])

  const adjustWidth = useCallback((delta: number) => {
    setGs(s => {
      if (s.phase !== 'playing') return s
      const next = Math.max(1, Math.min(10, s.blockWidth + delta))
      if (next === s.blockWidth) return s
      if (delta > 0) playGrow(); else playShrink()
      return { ...s, blockWidth: next }
    })
  }, [])

  const startGame = useCallback(() => {
    nextId = 1
    prevScoreRef.current = 0
    setGs({
      phase:        'playing',
      score:        0,
      gatesCleared: 0,
      blockWidth:   5,
      gates:        [makeGate()],
      speed:        INITIAL_SPEED,
    })
  }, [])

  // Keyboard controls
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft')                              adjustWidth(-1)
      if (e.key === 'ArrowRight')                             adjustWidth(+1)
      if ((e.key === ' ' || e.key === 'Enter') && gs.phase !== 'playing') startGame()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [adjustWidth, startGame, gs.phase])

  // Tap left / right half of road to resize
  function handleRoadPointerDown(e: React.PointerEvent) {
    if (gs.phase !== 'playing') return
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const x    = e.clientX - rect.left
    adjustWidth(x < rect.width / 2 ? -1 : +1)
  }

  const { phase, score, gatesCleared, blockWidth, gates } = gs

  // Active gate = first unchecked gate that is close enough to show its equation
  const activeGate = gates.find(g => !g.checked && g.revealPhase > 0) ?? null

  // Block color hint (only once full equation is visible)
  const hint: Hint = activeGate?.revealPhase === 3
    ? blockWidth === activeGate.opening ? 'match'
      : blockWidth > activeGate.opening ? 'over' : 'under'
    : 'neutral'

  return (
    <div id="runner-root" className={`runner-root${shake ? ' runner-shake' : ''}`}>
      {/* Background dots */}
      <BackgroundDots />

      {/* Decorative road elements */}
      <div className="wall-strip wall-strip-left" />
      <div className="wall-strip wall-strip-right" />
      <div className="road-center-line" />

      {/* Score */}
      <ScoreDisplay score={score} />

      {/* Gates */}
      {gates.map(gate => <GateBar key={gate.id} gate={gate} />)}

      {/* Equation */}
      <EquationDisplay gate={activeGate} />

      {/* Player */}
      <PlayerBlock width={blockWidth} hint={hint} />

      {/* Block size indicator below player */}
      <div className="block-size-label">{blockWidth}</div>

      {/* Green flash on correct pass */}
      {flash && <div className="correct-flash" />}

      {/* Tap zone covers the road above controls */}
      <div className="tap-zone" onPointerDown={handleRoadPointerDown} />

      {/* Buttons */}
      <ControlButtons phase={phase} onShrink={() => adjustWidth(-1)} onGrow={() => adjustWidth(+1)} />

      {/* Screens */}
      <AnimatePresence>
        {phase === 'idle'     && <StartScreen   key="start"    onStart={startGame} />}
        {phase === 'gameover' && <GameOverScreen key="gameover" score={score} gatesCleared={gatesCleared} onRestart={startGame} />}
      </AnimatePresence>
    </div>
  )
}
