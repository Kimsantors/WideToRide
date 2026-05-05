import { useEffect } from 'react'

const W = 400
const H = 680

export function useViewportScale(rootId: string) {
  useEffect(() => {
    const el = document.getElementById(rootId)
    if (!el) return

    function update() {
      const scale = Math.min(window.innerWidth / W, window.innerHeight / H)
      const left  = (window.innerWidth  - W * scale) / 2
      const top   = (window.innerHeight - H * scale) / 2
      el!.style.width     = `${W}px`
      el!.style.height    = `${H}px`
      el!.style.transform = `scale(${scale})`
      el!.style.transformOrigin = 'top left'
      el!.style.left      = `${left}px`
      el!.style.top       = `${top}px`
      el!.style.position  = 'fixed'
    }

    update()
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
    }
  }, [rootId])
}
