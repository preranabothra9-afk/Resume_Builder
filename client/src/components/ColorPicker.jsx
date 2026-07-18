import { Check, Palette } from 'lucide-react'
import React, { useState } from 'react'

const ColorPicker = ({ selectedColor, onChange }) => {

  const [isOpen, setIsOpen] = useState(false)

  const colors = [
    { name: "Violet", value: "#8B5CF6" },
    { name: "Indigo", value: "#6366F1" },
    { name: "Blue", value: "#3B82F6" },
    { name: "Cyan", value: "#06B6D4" },
    { name: "Emerald", value: "#10B981" },
    { name: "Amber", value: "#F59E0B" },
    { name: "Orange", value: "#F97316" },
    { name: "Rose", value: "#F43F5E" },
    { name: "Pink", value: "#EC4899" },
    { name: "Slate", value: "#64748B" },
  ]

  return (
    <div className='relative'>
      <button onClick={() => setIsOpen(!isOpen)}
        className='flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl border border-theme text-dim transition-all'>
        <Palette size={14} /> Accent
      </button>

      {isOpen && (
        <div className='absolute top-full right-0 grid grid-cols-5 gap-1.5 w-56 p-2.5 mt-1.5 z-50 bg-elevated border border-theme-medium rounded-xl shadow-2xl' style={{ boxShadow: '0 25px 50px -12px var(--shadow-modal)' }}>
          {colors.map((color) => (
            <div key={color.value}
              className='relative cursor-pointer group flex flex-col items-center'
              onClick={() => { onChange(color.value); setIsOpen(false) }}>
              <div className='size-9 rounded-lg border-2 border-transparent group-hover:border-white/30 transition-all'
                style={{ background: color.value }} />
              {selectedColor === color.value && (
                <div className='absolute inset-0 flex items-center justify-center'>
                  <Check className='size-5 text-white drop-shadow-lg' />
                </div>
              )}
              <p className='text-[10px] text-center mt-1 text-subtle'>{color.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ColorPicker
