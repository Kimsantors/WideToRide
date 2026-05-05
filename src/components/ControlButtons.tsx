import type { Phase } from '../types/game'

interface Props {
  phase: Phase
  onShrink: () => void
  onGrow: () => void
}

export function ControlButtons({ phase, onShrink, onGrow }: Props) {
  const disabled = phase !== 'playing'
  return (
    <div className="controls">
      <button
        className="control-btn control-btn-shrink"
        onPointerDown={disabled ? undefined : onShrink}
        disabled={disabled}
        aria-label="Shrink block"
      >
        −
      </button>
      <button
        className="control-btn control-btn-grow"
        onPointerDown={disabled ? undefined : onGrow}
        disabled={disabled}
        aria-label="Grow block"
      >
        +
      </button>
    </div>
  )
}
