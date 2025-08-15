'use client'
import React, { ChangeEvent } from 'react'
import { Input } from './Input'

interface DatePickerProps {
  name: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  placeholder: string
  required?: boolean
}

export const DatePicker: React.FC<DatePickerProps> = ({
  name,
  value,
  onChange,
  placeholder,
  required = false,
}) => (
  <Input
    name={name}
    type="date"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    required={required}
  />
)
