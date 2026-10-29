import { useEffect, useRef, useState } from 'react'

/**
 * Scroll-reveal hook. Attach the returned ref to any element and it will
 * receive `visible = true` once it scrolls into view, so you can toggle
 * the `.reveal` / `.reveal in` classes from index.css.
 *
 * Usage:
 *   const [ref, visible] = useReveal()
 *   <div ref={ref} className={`reveal ${visible ? 'in' : ''}`}>...</div>
 */
export default function useReveal(threshold = 0.15) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            io.unobserve(entry.target)
          }
        })
      },
      { threshold }
    )

    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  return [ref, visible]
}
