import { Check, Layout } from 'lucide-react'
import React, { useState } from 'react'

const TemplateSelector = ({ selectedTemplate, onChange }) => {

  const [isOpen, setIsOpen] = useState(false)
  const templates = [
    { id: 'classic', name: 'Classic', preview: 'A clean, traditional format with clear sections and professional typography.' },
    { id: 'modern', name: 'Modern', preview: 'Sleek design with strategic colors and modern font choices.' },
    { id: 'minimal', name: 'Minimal', preview: 'Ultra clean design that puts your content front and center.' },
    { id: 'minimal-image', name: 'Minimal Image', preview: 'Minimal design with a profile image and clean typography.' },
  ]

  return (
    <div className='relative'>
      <button onClick={() => setIsOpen(!isOpen)}
        className='flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl border border-white/10 text-white/50 hover:text-violet-300 hover:border-violet-500/30 hover:bg-violet-500/10 transition-all'>
        <Layout size={14} /> Template
      </button>

      {isOpen && (
        <div className='absolute top-full left-0 w-64 p-2 mt-1.5 space-y-1.5 z-50 bg-[#12121a] border border-white/[0.08] rounded-xl shadow-2xl shadow-black/50'>
          {templates.map((template) => (
            <div key={template.id}
              onClick={() => { onChange(template.id); setIsOpen(false) }}
              className={`relative p-3 rounded-lg cursor-pointer transition-all ${selectedTemplate === template.id
                ? "bg-violet-500/10 border border-violet-500/30"
                : "border border-transparent hover:bg-white/[0.04]"
                }`}>

              {selectedTemplate === template.id && (
                <div className='absolute top-2 right-2'>
                  <div className='size-5 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center'>
                    <Check className='size-3 text-white' />
                  </div>
                </div>
              )}

              <h4 className='text-sm font-medium text-white/80'>{template.name}</h4>
              <p className='mt-1 text-xs text-white/30 leading-relaxed'>{template.preview}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TemplateSelector
