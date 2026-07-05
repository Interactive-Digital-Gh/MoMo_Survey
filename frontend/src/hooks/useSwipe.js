import { useRef } from 'react'

/**
 * Detect horizontal swipe gestures via Pointer Events (works for touch + mouse).
 * Returns handlers to spread onto the element you want to be swipeable.
 *
 * A swipe only fires when the horizontal travel clears `threshold` and clearly
 * dominates the vertical travel, so it never interferes with vertical scrolling.
 */
export default function useSwipe({ onSwipeRight, onSwipeLeft, threshold = 60 } = {}) {
  const start = useRef(null)

  const onPointerDown = (e) => {
    start.current = { x: e.clientX, y: e.clientY }
  }

  const onPointerUp = (e) => {
    const s = start.current
    start.current = null
    if (!s) return

    const dx = e.clientX - s.x
    const dy = e.clientY - s.y
    if (Math.abs(dx) < threshold || Math.abs(dx) <= Math.abs(dy) * 1.5) return

    if (dx > 0) onSwipeRight?.()
    else onSwipeLeft?.()
  }

  const onPointerCancel = () => {
    start.current = null
  }

  return { onPointerDown, onPointerUp, onPointerCancel }
}
