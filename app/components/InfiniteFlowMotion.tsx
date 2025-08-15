// components/InfiniteFlowMotion.tsx
'use client'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import React, { useEffect, useRef } from 'react'

export const InfiniteFlowMotion: React.FC<{ children: React.ReactNode[]; duration?: number }> = ({
  children,
  duration = 20,
}) => {
  const x = useMotionValue(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const width = containerRef.current.scrollWidth / 2
    const controls = animate(x, -width, {
      duration,
      ease: 'linear',
      repeat: Infinity,
    })
    return () => controls.stop()
  }, [x, duration])

  // duplicate children to loop
  const items = [...children, ...children]

  return (
    <div ref={containerRef} className="overflow-hidden">
      <motion.div style={{ x }} className="flex">
        {items.map((child, i) => (
          <div key={i} className="flex-shrink-0 mr-8">
            {child}
          </div>
        ))}
      </motion.div>
    </div>
  )
}
