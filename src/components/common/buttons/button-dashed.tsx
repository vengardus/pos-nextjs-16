"use client"

import { PlusCircle } from 'lucide-react'

interface ButtonDashedProps {
    label: string
    handleClick: () => void
}
export const ButtonDashed = ({label, handleClick}: ButtonDashedProps) => {
  return (
    <button className='border border-dashed border-foreground py-3 px-7 flex gap-3 items-center' onClick={handleClick}>
        <PlusCircle className="mr-2 h-4 w-4" />
        <span>{label}</span>
    </button>
  )
}
