// components/Input.tsx
'use client'
import React, { InputHTMLAttributes, useState, FocusEvent } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder: string
  className?: string
}

export const Input: React.FC<InputProps> = ({
  placeholder,
  className = '',
  ...props
}) => {
  const [focused, setFocused] = useState(false)
  const [hasValue, setHasValue] = useState(!!props.value)

  const onFocus = () => setFocused(true)
  const onBlur = (e: FocusEvent<HTMLInputElement>) => {
    setFocused(false)
    setHasValue(!!e.target.value)
  }

  return (
    <div className={`relative my-4 ${className}`}>
      <input
        {...props}
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={e => {
          setHasValue(!!e.target.value)
          props.onChange?.(e)
        }}
        className={`
          peer w-full border border-gray-300 rounded px-3 py-2
          text-gray-800 placeholder-gray-400
          focus:outline-none focus:border-blue-500 transition
        `}
        placeholder={placeholder}
      />
      <label
        className={`
          absolute left-3 top-1/2 transform -translate-y-1/2
          pointer-events-none transition-all
          ${focused || hasValue
            ? '-translate-y-6 text-sm text-blue-500'
            : 'text-gray-500'}
        `}
      >
        {placeholder}
      </label>
    </div>
  )
}