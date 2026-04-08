import { useState, useEffect } from 'react'

/**
 * Returns { days, hours, mins, secs } counting down to `targetDate`.
 * Pass a Date object or ISO string.
 */
export function useCountdown(targetDate) {
  const target = new Date(targetDate).getTime()

  const calc = () => {
    const diff = Math.max(0, target - Date.now())
    return {
      days:  Math.floor(diff / 86_400_000),
      hours: Math.floor((diff % 86_400_000) / 3_600_000),
      mins:  Math.floor((diff % 3_600_000) / 60_000),
      secs:  Math.floor((diff % 60_000) / 1_000),
      done:  diff === 0,
    }
  }

  const [time, setTime] = useState(calc)

  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000)
    return () => clearInterval(id)
  }, [target])

  return time
}
