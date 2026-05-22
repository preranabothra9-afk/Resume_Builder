import { FilePenLineIcon, LoaderCircleIcon, PencilIcon, PlusIcon, TrashIcon, UploadCloud, UploadCloudIcon, XIcon, BarChart3, Sparkles } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import api from '../configs/api.js'
import toast from 'react-hot-toast'
import pdfToText from 'react-pdftotext'

const Dashboard = () => {

  const { token } = useSelector(state => state.auth);
  const gradients = [
    'from-violet-600/20 via-fuchsia-600/10 to-transparent',
    'from-cyan-600/20 via-blue-600/10 to-transparent',
    'from-amber-600/20 via-orange-600/10 to-transparent',
    'from-emerald-600/20 via-teal-600/10 to-transparent',
    'from-rose-600/20 via-pink-600/10 to-transparent',
  ]
  const borderColors = ['border-violet-500/30', 'border-cyan-500/30', 'border-amber-500/30', 'border-emerald-500/30', 'border-rose-500/30']
  const iconGradients = ['from-violet-500 to-fuchsia-500', 'from-cyan-500 to-blue-500', 'from-amber-500 to-orange-500', 'from-emerald-500 to-teal-500', 'from-rose-500 to-pink-500']

  const [allResumes, setallResumes] = useState([]);
  const [showCreateResume, setShowCreateResume] = useState(false);
  const [showUploadResume, setShowUploadResume] = useState(false);
  const [title, setTitle] = useState('');
  const [resume, setResume] = useState(null);
  const [editResumeId, setEditResumeId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate()

  const loadAllResumes = async () => {
    try {
      const { data } = await api.get('/api/users/resumes', { headers: { Authorization: token } })
      setallResumes(data.resumes)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  }

  const createResume = async (event) => {
    try {
      event.preventDefault()
      const { data } = await api.post('/api/resumes/create', { title }, { headers: { Authorization: token } })
      setallResumes([...allResumes, data.resume])
      setTitle('')
      setShowCreateResume(false)
      navigate(`/app/builder/${data.resume._id}`)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  const uploadResume = async (event) => {
    event.preventDefault()
    setIsLoading(true);
    try {
      const resumeText = await pdfToText(resume)
      const { data } = await api.post('/api/ai/upload-resume', { title, resumeText }, { headers: { Authorization: token } });
      setTitle('')
      setResume(null)
      setShowUploadResume(false)
      navigate(`/app/builder/${data.resumeId}`)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
    setIsLoading(false);
  }

  const editResume = async (event) => {
    try {
      event.preventDefault();
      const { data } = await api.put(`/api/resumes/update`, { resumeId: editResumeId, resumeData: { title } }, { headers: { Authorization: token } });
      setallResumes(allResumes.map(resume => resume._id === editResumeId ? { ...resume, title } : resume));
      setTitle('');
      setEditResumeId('')
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  }

  const deleteResume = async (resumeId) => {
    try {
      const confirm = window.confirm('Are you sure you want to delete this resume?')
      if (confirm) {
        const { data } = await api.delete(`/api/resumes/delete/${resumeId}`, { headers: { Authorization: token } })
        setallResumes(allResumes.filter(resume => resume._id !== resumeId))
        toast.success(data.message)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAllResumes();
  }, [])

  return (
    <div className='app-bg min-h-screen'>
      <div className='max-w-7xl mx-auto px-4 py-8'>
        {/* Header */}
        <div className='flex items-center justify-between mb-10'>
          <div>
            <h1 className='text-3xl font-bold text-white'>My Resumes</h1>
            <p className='text-white/40 text-sm mt-1'>Manage your resume collection</p>
          </div>
          <div className='hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06]'>
            <div className='size-2 rounded-full bg-emerald-500 animate-pulse' />
            <span className='text-white/40 text-xs'>{allResumes.length} resume{allResumes.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12'>
          <button onClick={() => setShowCreateResume(true)}
            className='relative group overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-violet-500/10 via-fuchsia-500/5 to-transparent p-6 text-left hover:from-violet-500/20 hover:via-fuchsia-500/10 hover:to-transparent transition-all duration-500 card-hover'>
            <div className='absolute top-0 right-0 size-32 bg-violet-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-violet-500/20 transition-all duration-500' />
            <div className='relative flex items-center gap-5'>
              <div className='size-14 rounded-2xl gradient-btn flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:scale-110 transition-transform duration-300'>
                <PlusIcon className='size-7' />
              </div>
              <div>
                <p className='text-white font-semibold text-lg'>Create Resume</p>
                <p className='text-white/40 text-sm mt-0.5'>Start from scratch with AI assistance</p>
              </div>
            </div>
          </button>

          <button onClick={() => setShowUploadResume(true)}
            className='relative group overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent p-6 text-left hover:from-cyan-500/20 hover:via-blue-500/10 hover:to-transparent transition-all duration-500 card-hover'>
            <div className='absolute top-0 right-0 size-32 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-cyan-500/20 transition-all duration-500' />
            <div className='relative flex items-center gap-5'>
              <div className='size-14 rounded-2xl gradient-btn-cyan flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition-transform duration-300'>
                <UploadCloudIcon className='size-7' />
              </div>
              <div>
                <p className='text-white font-semibold text-lg'>Upload Resume</p>
                <p className='text-white/40 text-sm mt-0.5'>Parse existing PDF with AI</p>
              </div>
            </div>
          </button>
        </div>

        {/* Resume Grid */}
        {allResumes.length > 0 && (
          <div className='mb-6'>
            <h2 className='text-sm font-medium text-white/30 uppercase tracking-widest mb-4'>All Resumes</h2>
          </div>
        )}

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
          {allResumes?.map((resume, index) => {
            if (!resume) return null;
            const gi = index % gradients.length;

            return (
              <button
                key={resume._id}
                onClick={() => navigate(`/app/builder/${resume._id}`)}
                className={`relative group rounded-2xl border ${borderColors[gi]} bg-gradient-to-br ${gradients[gi]} p-5 text-left transition-all duration-300 card-hover overflow-hidden`}
              >
                <div className='absolute top-0 right-0 size-24 bg-white/[0.02] rounded-full blur-2xl' />

                <div className='relative'>
                  {/* Action buttons */}
                  <div className='absolute top-0 right-0 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                    <span className='p-2 rounded-lg bg-white/[0.08] hover:bg-white/20 transition-colors border border-white/[0.06]'
                      onClick={(e) => { e.stopPropagation(); setEditResumeId(resume._id); setTitle(resume.title); }}>
                      <PencilIcon className='size-3.5 text-white/70' />
                    </span>
                    <span className='p-2 rounded-lg bg-white/[0.08] hover:bg-rose-500/20 transition-colors border border-white/[0.06]'
                      onClick={(e) => { e.stopPropagation(); deleteResume(resume._id); }}>
                      <TrashIcon className='size-3.5 text-rose-400' />
                    </span>
                  </div>

                  {/* Icon */}
                  <div className={`size-12 rounded-xl bg-gradient-to-br ${iconGradients[gi]} flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <FilePenLineIcon className='size-6 text-white' />
                  </div>

                  {/* Title */}
                  <p className='text-white font-semibold text-base mb-1 line-clamp-1 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/60 group-hover:bg-clip-text transition-all'>
                    {resume.title}
                  </p>

                  {/* Date */}
                  <p className='text-white/30 text-xs'>{new Date(resume.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>

                  {/* Analytics link */}
                  <span className='inline-flex items-center gap-1.5 mt-3 text-xs text-white/30 hover:text-white/60 transition-colors'
                    onClick={(e) => { e.stopPropagation(); navigate(`/app/builder/${resume._id}#analytics`); }}>
                    <BarChart3 className='size-3' />
                    Analytics
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        {allResumes.length === 0 && (
          <div className='text-center py-20'>
            <div className='inline-flex size-16 rounded-2xl bg-white/[0.04] border border-white/[0.06] items-center justify-center mb-4'>
              <Sparkles className='size-7 text-white/20' />
            </div>
            <p className='text-white/40 font-medium'>No resumes yet</p>
            <p className='text-white/20 text-sm mt-1'>Create or upload your first resume to get started</p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateResume && (
        <form onSubmit={createResume} onClick={() => setShowCreateResume(false)}
          className='fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
          <div onClick={e => e.stopPropagation()}
            className='relative bg-[#12121a] border border-white/[0.08] rounded-2xl w-full max-w-sm p-6 shadow-2xl shadow-black/50'>
            <h2 className='text-lg font-semibold text-white mb-1'>Create a resume</h2>
            <p className='text-white/30 text-sm mb-5'>Give your resume a name to get started</p>
            <input onChange={(e) => setTitle(e.target.value)} value={title}
              type="text" placeholder='e.g. Software Engineer Resume' className='w-full mb-4' required autoFocus />
            <button className='w-full py-2.5 gradient-btn rounded-xl text-sm'>Create</button>
            <XIcon className='absolute top-4 right-4 text-white/30 hover:text-white/60 cursor-pointer transition-colors size-5'
              onClick={() => { setShowCreateResume(false); setTitle(''); }} />
          </div>
        </form>
      )}

      {/* Upload Modal */}
      {showUploadResume && (
        <form onSubmit={uploadResume} onClick={() => setShowUploadResume(false)}
          className='fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
          <div onClick={e => e.stopPropagation()}
            className='relative bg-[#12121a] border border-white/[0.08] rounded-2xl w-full max-w-sm p-6 shadow-2xl shadow-black/50'>
            <h2 className='text-lg font-semibold text-white mb-1'>Upload resume</h2>
            <p className='text-white/30 text-sm mb-5'>AI will extract content from your PDF</p>
            <input onChange={(e) => setTitle(e.target.value)} value={title}
              type="text" placeholder='Resume title' className='w-full mb-4' required />
            <div>
              <label htmlFor="resume-input" className='block text-sm text-white/50 font-medium'>
                Select File
                <div className='flex flex-col items-center justify-center gap-2 border-2 border-dashed border-white/10 rounded-xl p-5 my-3 hover:border-violet-500/40 hover:bg-violet-500/5 cursor-pointer transition-all duration-200'>
                  {resume ? (
                    <p className='text-violet-400 font-medium text-sm'>{resume.name}</p>
                  ) : (
                    <>
                      <UploadCloud className='size-10 stroke-1 text-white/20' />
                      <p className='text-xs text-white/30'>Click to upload PDF</p>
                    </>
                  )}
                </div>
              </label>
              <input type="file" id='resume-input' accept='.pdf' hidden onChange={(e) => setResume(e.target.files[0])} />
            </div>
            <button disabled={isLoading}
              className='w-full py-2.5 gradient-btn-cyan rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-50'>
              {isLoading && <LoaderCircleIcon className='animate-spin size-4' />}
              {isLoading ? 'Analyzing...' : 'Upload & Parse'}
            </button>
            <XIcon className='absolute top-4 right-4 text-white/30 hover:text-white/60 cursor-pointer transition-colors size-5'
              onClick={() => { setShowUploadResume(false); setTitle(''); setResume(null); }} />
          </div>
        </form>
      )}

      {/* Edit Title Modal */}
      {editResumeId && (
        <form onSubmit={editResume} onClick={() => setEditResumeId('')}
          className='fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
          <div onClick={e => e.stopPropagation()}
            className='relative bg-[#12121a] border border-white/[0.08] rounded-2xl w-full max-w-sm p-6 shadow-2xl shadow-black/50'>
            <h2 className='text-lg font-semibold text-white mb-1'>Edit title</h2>
            <p className='text-white/30 text-sm mb-5'>Update your resume name</p>
            <input onChange={(e) => setTitle(e.target.value)} value={title}
              type="text" placeholder='Enter resume title' className='w-full mb-4' required autoFocus />
            <button className='w-full py-2.5 gradient-btn-amber rounded-xl text-sm'>Update</button>
            <XIcon className='absolute top-4 right-4 text-white/30 hover:text-white/60 cursor-pointer transition-colors size-5'
              onClick={() => { setEditResumeId(''); setTitle(''); }} />
          </div>
        </form>
      )}
    </div>
  )
}

export default Dashboard
