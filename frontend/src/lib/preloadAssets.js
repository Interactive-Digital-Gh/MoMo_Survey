// Warms the browser cache (and pre-decodes) the images used on later survey
// screens. Kicked off from the landing page while the user is reading it, so by
// the time they move forward every page's artwork is already loaded — no lag.

import momoLogo from '../assets/momo-logo.png'
import questionEmblem from '../assets/question-emblem.png'
import momoMark from '../assets/momo-mark-yellow.png'
import halfwayEmblem from '../assets/halfway-emblem.png'
import halfwayConfetti from '../assets/halfway-confetti.svg'
import thankyouConfetti from '../assets/thankyou-confetti.svg'

// Every image rendered across the survey flow (landing → phone → questions →
// halfway → thank you). The landing's own images are already loading, but
// listing them here is harmless (they resolve instantly from cache).
const IMAGE_ASSETS = [
  momoLogo,
  questionEmblem,
  momoMark,
  halfwayEmblem,
  halfwayConfetti,
  thankyouConfetti,
]

let started = false

export function preloadSurveyImages() {
  if (started || typeof window === 'undefined') return
  started = true

  const warm = () => {
    for (const url of IMAGE_ASSETS) {
      const img = new Image()
      img.src = url
      // Pre-decode where supported so the first paint on later pages is
      // instant, not just fetched-but-still-decoding.
      if (typeof img.decode === 'function') img.decode().catch(() => {})
    }
  }

  // Defer to idle so preloading never competes with the landing page's own
  // first paint; the timeout guarantees it still starts promptly.
  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(warm, { timeout: 1500 })
  } else {
    setTimeout(warm, 200)
  }
}
