let ctx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

// ── Global mute ────────────────────────────────────────────────────────────────
let soundOn = true

export function setSoundEnabled(on: boolean) {
  soundOn = on
  if (!on) stopAmbience()
}

// ── SFX ────────────────────────────────────────────────────────────────────────
function playTone(freqStart: number, freqEnd: number, duration: number, type: OscillatorType = 'sine') {
  if (!soundOn) return
  const ac   = getCtx()
  const osc  = ac.createOscillator()
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

export function playGrow()   { playTone(300, 620, 0.12, 'triangle') }
export function playShrink() { playTone(620, 260, 0.12, 'triangle') }

// ── Ambient music ──────────────────────────────────────────────────────────────
// G major pentatonic arpegio — upbeat and bright
const ARPEGGIO = [196, 220, 247, 294, 330, 392, 440, 494, 587]

let ambiMaster:      GainNode        | null = null
let ambiOscillators: OscillatorNode[]       = []
let ambiInterval:    ReturnType<typeof setInterval> | null = null
let arpIdx = 0

export function startAmbience() {
  if (!soundOn || ambiMaster) return
  const ac = getCtx()

  const master = ac.createGain()
  master.gain.setValueAtTime(0, ac.currentTime)
  master.gain.linearRampToValueAtTime(0.10, ac.currentTime + 2)
  master.connect(ac.destination)
  ambiMaster = master

  // Low bass drone
  const bassOsc  = ac.createOscillator()
  const bassGain = ac.createGain()
  bassOsc.type           = 'sine'
  bassOsc.frequency.value = 55
  bassGain.gain.value     = 0.55
  bassOsc.connect(bassGain)
  bassGain.connect(master)
  bassOsc.start()
  ambiOscillators.push(bassOsc)

  // LFO that pulses the bass like a heartbeat
  const lfo     = ac.createOscillator()
  const lfoGain = ac.createGain()
  lfo.type           = 'sine'
  lfo.frequency.value = 1.8
  lfoGain.gain.value  = 0.45
  lfo.connect(lfoGain)
  lfoGain.connect(bassGain.gain)
  lfo.start()
  ambiOscillators.push(lfo)

  // Bright pad chord (root + 5th + octave)
  for (const freq of [196, 294, 392]) {
    const padOsc  = ac.createOscillator()
    const padGain = ac.createGain()
    padOsc.type           = 'triangle'
    padOsc.frequency.value = freq
    padGain.gain.value     = 0.04
    padOsc.connect(padGain)
    padGain.connect(master)
    padOsc.start()
    ambiOscillators.push(padOsc)
  }

  // Arpeggio melody
  arpIdx = 0
  ambiInterval = setInterval(() => {
    if (!ambiMaster) return
    const ac2  = getCtx()
    const freq = ARPEGGIO[arpIdx % ARPEGGIO.length]
    arpIdx++
    const osc = ac2.createOscillator()
    const g   = ac2.createGain()
    osc.type           = 'triangle'
    osc.frequency.value = freq
    g.gain.setValueAtTime(0.11, ac2.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ac2.currentTime + 0.42)
    osc.connect(g)
    g.connect(ambiMaster)
    osc.start()
    osc.stop(ac2.currentTime + 0.42)
  }, 300)
}

export function stopAmbience() {
  if (ambiInterval) { clearInterval(ambiInterval); ambiInterval = null }
  if (!ambiMaster) return
  const ac = getCtx()
  const m  = ambiMaster
  ambiMaster = null
  m.gain.setValueAtTime(m.gain.value, ac.currentTime)
  m.gain.linearRampToValueAtTime(0, ac.currentTime + 0.7)
  const toStop = [...ambiOscillators]
  ambiOscillators = []
  setTimeout(() => {
    toStop.forEach(o => { try { o.stop() } catch { /* already stopped */ } })
    try { m.disconnect() } catch { /* already disconnected */ }
  }, 800)
}
