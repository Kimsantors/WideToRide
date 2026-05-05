let ctx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function playTone(freqStart: number, freqEnd: number, duration: number, type: OscillatorType = 'sine') {
  const ac  = getCtx()
  const osc = ac.createOscillator()
  const gain = ac.createGain()

  osc.type = type
  osc.frequency.setValueAtTime(freqStart, ac.currentTime)
  osc.frequency.exponentialRampToValueAtTime(freqEnd, ac.currentTime + duration)

  gain.gain.setValueAtTime(0.18, ac.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration)

  osc.connect(gain)
  gain.connect(ac.destination)

  osc.start(ac.currentTime)
  osc.stop(ac.currentTime + duration)
}

export function playGrow() {
  playTone(300, 620, 0.12, 'triangle')
}

export function playShrink() {
  playTone(620, 260, 0.12, 'triangle')
}
