import { Plus, Sparkles, X } from 'lucide-react'
import React, { useState } from 'react'

const SkillsForm = ({ data, onChange }) => {
  const [newSkill, setNewSkill] = useState("")

  const addSkill = () => {
    if (newSkill.trim && !data.includes(newSkill.trim)) {
      onChange([...data, newSkill])
      setNewSkill("")
    }
  }

  const removeSkill = (indexToRemove) => {
    onChange(data.filter((_, index) => index !== indexToRemove))
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") { e.preventDefault(); addSkill() }
  }

  return (
    <div className='space-y-4'>
      <p className='text-sm text-subtle'>Add your technical and soft skills.</p>

      <div className='flex gap-2'>
        <input type="text" placeholder='Enter a skill...' className='flex-1'
          onChange={(e) => setNewSkill(e.target.value)} value={newSkill} onKeyDown={handleKeyPress} />
        <button onClick={addSkill} disabled={!newSkill.trim}
          className='flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed'>
          <Plus className='size-4' /> Add
        </button>
      </div>

      {data.length > 0 ? (
        <div className='flex flex-wrap gap-2'>
          {data.map((skill, index) => (
            <span key={index}
              className='flex items-center gap-1 px-3 py-1.5 bg-violet-500/10 text-violet-300 rounded-lg text-sm border border-violet-500/20'>
              {skill}
              <button onClick={() => removeSkill(index)} className='hover:bg-violet-500/20 rounded-md p-0.5 transition-colors'>
                <X className='size-3' />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <div className='text-center py-8 text-hidden'>
          <Sparkles className='size-8 mx-auto mb-2 text-hidden' />
          <p className='text-sm font-medium text-faint'>No skills added</p>
          <p className='text-xs mt-1'>Add your skills above.</p>
        </div>
      )}

      <div className='bg-violet-500/5 border border-violet-500/10 p-3 rounded-xl'>
        <p className='text-xs text-violet-300/70'><strong>Tip:</strong> Add 8-12 relevant skills including technical and soft skills.</p>
      </div>
    </div>
  )
}

export default SkillsForm
