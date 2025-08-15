// components/Loader.tsx
'use client'

import React from 'react'
import clsx from 'clsx'

type LoaderProps = {
  /** Diameter in px */
  size?: number
  /** Stroke width in px */
  strokeWidth?: number
  /** Tailwind (or hex) color of active arc */
  color?: string
  /** Additional tailwind classes for wrapper <svg> */
  className?: string
}

export const Loader: React.FC<LoaderProps> = ({
  size = 40,
  strokeWidth = 4,
  color = '#3b82f6', // Tailwind blue-500
  className = '',
}) => {
  const radius = (size - strokeWidth) / 2
  const center = size / 2
  const circumference = 2 * Math.PI * radius
  const dash = circumference / 2

  return (
    <svg
      role="status"
      aria-label="Loading"
      className={clsx('animate-spin', className)}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
    >
      {/* Track */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="rgba(0,0,0,0.1)"
        strokeWidth={strokeWidth}
      />
      {/* Animated Arc */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={`${dash} ${dash}`}
        strokeDashoffset={dash * 0.25}
      />
    </svg>
  )
}
