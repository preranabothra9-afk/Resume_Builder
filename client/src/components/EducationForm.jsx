import { GraduationCap, Plus, Trash2 } from 'lucide-react';
import React from 'react'

const EducationForm = ({ data, onChange }) => {
  const addEducation = () => {
    onChange([...data, { institution: "", degree: "", field: "", graduation_date: "", gpa: "" }])
  }

  const removeEducation = (index) => {
    onChange(data.filter((_, i) => i !== index))
  }

  const updateEducation = (index, field, value) => {
    const updated = [...data]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <p className='text-sm text-white/40'>Add your education details.</p>
        <button onClick={addEducation}
          className='flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-violet-500/15 text-violet-300 hover:bg-violet-500/25 transition-colors border border-violet-500/20'>
          <Plus className='size-3.5' /> Add
        </button>
      </div>

      {data.length === 0 ? (
        <div className='text-center py-10 text-white/20'>
          <GraduationCap className='size-10 mx-auto mb-3 text-white/10' />
          <p className='text-sm font-medium text-white/30'>No education added</p>
          <p className='text-xs mt-1'>Click "Add" to get started.</p>
        </div>
      ) : (
        <div className='space-y-3'>
          {data.map((education, index) => (
            <div key={index} className='p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-3'>
              <div className='flex items-center justify-between'>
                <span className='text-xs font-medium text-white/20'>#{index + 1}</span>
                <button onClick={() => removeEducation(index)}
                  className='text-rose-400/60 hover:text-rose-400 transition-colors p-1 hover:bg-rose-500/10 rounded-lg'>
                  <Trash2 className='size-3.5' />
                </button>
              </div>

              <div className='grid md:grid-cols-2 gap-3'>
                <input value={education.institution || ""} onChange={(e) => updateEducation(index, "institution", e.target.value)} type="text" placeholder='Institution' />
                <input value={education.degree || ""} onChange={(e) => updateEducation(index, "degree", e.target.value)} type="text" placeholder="Degree" />
                <input value={education.field || ""} onChange={(e) => updateEducation(index, "field", e.target.value)} type="text" placeholder='Field of Study' />
                <input value={education.graduation_date || ""} onChange={(e) => updateEducation(index, "graduation_date", e.target.value)} type="month" />
              </div>
              <input value={education.gpa || ""} onChange={(e) => updateEducation(index, "gpa", e.target.value)} type="text" placeholder='GPA (optional)' />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default EducationForm
