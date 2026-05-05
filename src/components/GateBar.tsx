import type { GateState } from '../types/game'

const TILE     = 40
const ROAD_W   = 400
const GATE_H   = 30

interface Props { gate: GateState }

export function GateBar({ gate }: Props) {
  const openingPx = gate.opening * TILE
  const wallPx    = (ROAD_W - openingPx) / 2

  return (
    <>
      {wallPx > 0 && (
        <div
          className="gate-bar"
          style={{ top: gate.y, left: 0, width: wallPx, height: GATE_H }}
        />
      )}
{wallPx > 0 && (
        <div
          className="gate-bar"
          style={{ top: gate.y, right: 0, width: wallPx, height: GATE_H }}
        />
      )}
    </>
  )
}
