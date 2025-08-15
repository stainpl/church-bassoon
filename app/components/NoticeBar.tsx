// components/NoticeBar.tsx
'use client'

import React, { useEffect, useRef, useState } from 'react'

interface NoticeBarProps {
  text: string
  speed?: number   // pixels per frame increment
}

/**
 * A thin horizontal ticker that scrolls a notice message forever.
 * Usage: <NoticeBar text="Your notice here" speed={1} />
 */
export const NoticeBar: React.FC<NoticeBarProps> = ({
  text,
  speed = 1,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    let animationFrameId: number

    const tick = () => {
      if (containerRef.current && contentRef.current) {
        const containerWidth = containerRef.current.offsetWidth
        const contentWidth = contentRef.current.offsetWidth
        setOffset((prev) => {
          const next = prev + speed
          // reset once content has fully scrolled past
          return next >= contentWidth ? -containerWidth : next
        })
      }
      animationFrameId = requestAnimationFrame(tick)
    }

    animationFrameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animationFrameId)
  }, [speed])

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden bg-gray-900 text-white text-sm h-6 flex items-center"
    >
      <div
        ref={contentRef}
        className="inline-block whitespace-nowrap"
        style={{ transform: `translateX(${-offset}px)` }}
      >
        {text}
      </div>
    </div>
  )
}
