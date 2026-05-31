import { Briefcase, Loader2, Plus, Sparkles, Trash2 } from 'lucide-react'
import React from 'react'
import { useState } from 'react'
import api from '../configs/api';
import toast from 'react-hot-toast';

const ExperienceForm = ({ data, onChange }) => {

  const [generatingIndex, setGeneratingIndex] = useState(-1);

  const addExperience = () => {
    onChange([...data, { company: "", position: "", start_date: "", end_date: "", description: "", is_current: false }])
  }

  const removeExperience = (index) => {
    onChange(data.filter((_, i) => i !== index));
  }

  const updateExperience = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  const generateDescription = async (index) => {
    setGeneratingIndex(index);
    const experience = data[index];
    const prompt = `Improve the following job description for a resume.\n\nRole: ${experience.position}\nCompany: ${experience.company}\n\nCurrent Description:\n${experience.description}\n\nMake it professional, concise and achievement oriented.`;
    try {
      const response = await api.post('/api/ai/enhance-job-desc', { userContent: prompt });
      updateExperience(index, "description", response.data.enhancedContent);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setGeneratingIndex(-1);
    }
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <p className='text-sm text-white/40'>Add your work experience.</p>
        <button onClick={addExperience}
          className='flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-violet-500/15 text-violet-300 hover:bg-violet-500/25 transition-colors border border-violet-500/20'>
          <Plus className='size-3.5' /> Add
        </button>
      </div>

      {data.length === 0 ? (
        <div className='text-center py-10 text-white/20'>
          <Briefcase className='size-10 mx-auto mb-3 text-white/10' />
          <p className='text-sm font-medium text-white/30'>No experience added</p>
          <p className='text-xs mt-1'>Click "Add" to get started.</p>
        </div>
      ) : (
        <div className='space-y-3'>
          {data.map((experience, index) => (
            <div key={index} className='p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-3'>
              <div className='flex items-center justify-between'>
                <span className='text-xs font-medium text-white/20'>#{index + 1}</span>
                <button onClick={() => removeExperience(index)}
                  className='text-rose-400/60 hover:text-rose-400 transition-colors p-1 hover:bg-rose-500/10 rounded-lg'>
                  <Trash2 className='size-3.5' />
                </button>
              </div>

              <div className='grid md:grid-cols-2 gap-3'>
                <input value={experience.company || ""} onChange={(e) => updateExperience(index, "company", e.target.value)} type="text" placeholder='Company' />
                <input value={experience.position || ""} onChange={(e) => updateExperience(index, "position", e.target.value)} type="text" placeholder='Job Title' />
                <input value={experience.start_date || ""} onChange={(e) => updateExperience(index, "start_date", e.target.value)} type="month" />
                <input value={experience.end_date || ""} onChange={(e) => updateExperience(index, "end_date", e.target.value)} type="month" disabled={experience.is_current} />
              </div>

              <label className='flex items-center gap-2 cursor-pointer'>
                <input type="checkbox" checked={experience.is_current || false}
                  onChange={(e) => { updateExperience(index, "is_current", e.target.checked); }}
                  className='rounded border-white/20 bg-white/5 text-violet-600 focus:ring-violet-500 size-4' />
                <span className='text-xs text-white/50'>Currently working here</span>
              </label>

              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <label className='text-xs font-medium text-white/50'>Description</label>
                  <button onClick={() => generateDescription(index)}
                    disabled={generatingIndex === index || !experience.position || !experience.company || !experience.description}
                    className='flex items-center gap-1 px-2 py-1 text-xs rounded-lg bg-violet-500/15 text-violet-300 hover:bg-violet-500/25 transition-colors disabled:opacity-50 border border-violet-500/20'>
                    {generatingIndex === index ? <Loader2 className='size-3 animate-spin' /> : <Sparkles className='size-3' />}
                    AI Enhance
                  </button>
                </div>
                <textarea value={experience.description || ""} onChange={(e) => updateExperience(index, "description", e.target.value)} rows={4}
                  className='w-full resize-none bg-white/[0.02]' placeholder='Describe your responsibilities...' />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ExperienceForm
