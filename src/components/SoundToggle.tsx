interface Props {
  enabled: boolean
  onToggle: () => void
}

export function SoundToggle({ enabled, onToggle }: Props) {
  return (
    <button
      className={`sound-toggle${enabled ? ' sound-toggle--on' : ''}`}
      onPointerDown={onToggle}
      aria-label={enabled ? 'Mute sound' : 'Unmute sound'}
    >
      <span className="sound-toggle-icon">♪</span>
      <span className="sound-toggle-track">
        <span className="sound-toggle-knob" />
      </span>
    </button>
  )
}
