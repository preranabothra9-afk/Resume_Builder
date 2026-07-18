import { FolderIcon, Plus, Trash2 } from 'lucide-react';
import React from 'react'

const ProjectForm = ({ data, onChange }) => {
  const addProject = () => {
    onChange([...data, { name: "", type: "", description: "" }])
  }

  const removeProject = (index) => {
    onChange(data.filter((_, i) => i !== index))
  }

  const updateProject = (index, field, value) => {
    const updated = [...data]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <p className='text-sm text-subtle'>Add your projects.</p>
        <button onClick={addProject}
          className='flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-violet-500/15 text-violet-300 hover:bg-violet-500/25 transition-colors border border-violet-500/20'>
          <Plus className='size-3.5' /> Add
        </button>
      </div>

      {data.length === 0 ? (
        <div className='text-center py-10 text-hidden'>
          <FolderIcon className='size-10 mx-auto mb-3 text-hidden' />
          <p className='text-sm font-medium text-faint'>No projects added</p>
          <p className='text-xs mt-1'>Click "Add" to get started.</p>
        </div>
      ) : (
        <div className='space-y-3'>
          {data.map((project, index) => (
            <div key={index} className='p-4 rounded-xl bg-glass-3 border border-theme-light space-y-3'>
              <div className='flex items-center justify-between'>
                <span className='text-xs font-medium text-hidden'>#{index + 1}</span>
                <button onClick={() => removeProject(index)}
                  className='text-rose-400/60 hover:text-rose-400 transition-colors p-1 hover:bg-rose-500/10 rounded-lg'>
                  <Trash2 className='size-3.5' />
                </button>
              </div>

              <div className='grid gap-3'>
                <input value={project.name || ""} onChange={(e) => updateProject(index, "name", e.target.value)} type="text" placeholder='Project Name' />
                <input value={project.type || ""} onChange={(e) => updateProject(index, "type", e.target.value)} type="text" placeholder="Project Type" />
                <textarea value={project.description || ""} onChange={(e) => updateProject(index, "description", e.target.value)} rows={4}
                  className='w-full resize-none bg-glass-2' placeholder='Describe your project...' />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProjectForm
