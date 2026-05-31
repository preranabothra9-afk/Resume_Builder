import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../configs/api.js'
import toast from 'react-hot-toast'
import { Check, Trash2, Loader, Star, MessageSquare, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const initials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
const colors = ['#8B5CF6', '#EC4899', '#06B6D4', '#F59E0B', '#10B981', '#F97316', '#6366F1', '#14B8A6']
const avatarBg = (name) => colors[name.charCodeAt(0) % colors.length]

const ADMIN_EMAIL = 'preranabothra9@gmail.com'

const ManageTestimonials = () => {
  const { user } = useSelector(state => state.auth)
  const navigate = useNavigate()
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)

  if (user?.email !== ADMIN_EMAIL) {
    return (
      <div className='app-bg min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <MessageSquare className='size-12 text-white/20 mx-auto mb-4' />
          <p className='text-white/40 font-medium'>Admin access required</p>
        </div>
      </div>
    )
  }

  const load = async () => {
    try {
      const { data } = await api.get('/api/testimonials/all')
      setTestimonials(data.testimonials)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleApprove = async (id) => {
    try {
      const { data } = await api.patch(`/api/testimonials/${id}/approve`)
      setTestimonials(prev => prev.map(t => t._id === id ? { ...t, isApproved: !t.isApproved } : t))
      toast.success(data.message)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return
    try {
      await api.delete(`/api/testimonials/${id}`)
      setTestimonials(prev => prev.filter(t => t._id !== id))
      toast.success('Testimonial deleted')
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div className='app-bg min-h-screen'>
      <div className='max-w-4xl mx-auto px-4 py-8'>
        <div className='flex items-center gap-3 mb-8'>
          <button onClick={() => navigate('/app')}
            className='size-12 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center hover:bg-white/[0.08] active:scale-95 transition-all shrink-0'>
            <ArrowLeft className='size-5 text-white/50' />
          </button>
          <div>
            <h1 className='text-2xl font-bold text-white'>Manage Testimonials</h1>
            <p className='text-white/40 text-sm mt-0.5'>Approve or remove user testimonials</p>
          </div>
        </div>

        {loading ? (
          <div className='flex items-center justify-center py-20'>
            <Loader className='size-6 text-white/30 animate-spin' />
          </div>
        ) : testimonials.length === 0 ? (
          <div className='text-center py-20'>
            <MessageSquare className='size-10 text-white/20 mx-auto mb-3' />
            <p className='text-white/40 font-medium'>No testimonials yet</p>
          </div>
        ) : (
          <div className='space-y-3'>
            {testimonials.map(t => (
              <div key={t._id} className={`rounded-2xl border p-5 backdrop-blur-xl transition-all ${
                t.isApproved ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-white/[0.06] bg-white/[0.03]'
              }`}>
                <div className='flex items-start justify-between gap-4'>
                  <div className='flex items-center gap-3 min-w-0'>
                    <div className='size-10 rounded-full flex items-center justify-center text-xs font-bold text-white ring-2 ring-white/10 shrink-0'
                      style={{ backgroundColor: avatarBg(t.name) }}>
                      {initials(t.name)}
                    </div>
                    <div className='min-w-0'>
                      <p className='text-sm font-semibold text-white/80 truncate'>{t.name}</p>
                      {t.email && <p className='text-xs text-white/30 truncate'>{t.email}</p>}
                      <div className='flex items-center gap-0.5 mt-0.5'>
                        {Array.from({ length: t.rating || 5 }).map((_, i) => (
                          <Star key={i} className='size-3 fill-violet-500 text-violet-500' />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center gap-2 shrink-0'>
                    {!t.isApproved && (
                      <button onClick={() => toggleApprove(t._id)}
                        className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-all'>
                        <Check className='size-3.5' />
                        Approve
                      </button>
                    )}
                    {t.isApproved && (
                      <span className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium'>
                        <Check className='size-3.5' />
                        Approved
                      </span>
                    )}
                    <button onClick={() => handleDelete(t._id)}
                      className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium hover:bg-rose-500/20 transition-all'>
                      <Trash2 className='size-3.5' />
                      Delete
                    </button>
                  </div>
                </div>
                <p className='text-sm text-white/60 mt-4 leading-relaxed'>{t.text}</p>
                <p className='text-[10px] text-white/20 mt-2'>{new Date(t.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageTestimonials