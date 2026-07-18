import React, { useEffect, useState } from 'react'
import Title from './Title'
import { BookUserIcon, Quote, Star, Send, Loader } from 'lucide-react'
import api from '../../configs/api.js'
import toast from 'react-hot-toast'

const initials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

const colors = ['#8B5CF6', '#EC4899', '#06B6D4', '#F59E0B', '#10B981', '#F97316', '#6366F1', '#14B8A6']

const avatarBg = (name) => colors[name.charCodeAt(0) % colors.length]

const CreateCard = ({ card }) => (
  <div className="p-6 rounded-2xl mx-3 border border-theme-light bg-glass-3 backdrop-blur-xl hover-bg-glass-6 hover:-translate-y-1 transition-all duration-300 w-80 shrink-0">
    <Quote className="size-5 text-violet-400 mb-4 opacity-60" />
    <p className="text-sm text-muted leading-relaxed mb-5">{card.text}</p>
    <div className="flex items-center gap-3 pt-4 border-t border-theme-light">
      <div
        className="size-10 rounded-full flex items-center justify-center text-xs font-bold text-white ring-2 ring-white/10 shrink-0"
        style={{ backgroundColor: avatarBg(card.name) }}
      >
        {initials(card.name)}
      </div>
      <div>
        <p className="text-sm font-semibold text-body">{card.name}</p>
        <div className="flex items-center gap-0.5 mt-0.5">
          {Array.from({ length: card.rating || 5 }).map((_, i) => (
            <Star key={i} className="size-3 fill-violet-500 text-violet-500" />
          ))}
        </div>
      </div>
    </div>
  </div>
)

const Testimonial = () => {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', email: '', text: '', rating: 5 })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    api.get('/api/testimonials')
      .then(({ data }) => setTestimonials(data.testimonials))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.text) return
    setSubmitting(true)
    try {
      await api.post('/api/testimonials', form)
      toast.success('Thank you! Your testimonial is pending approval.')
      setForm({ name: '', email: '', text: '', rating: 5 })
    } catch (error) {
      toast(error?.response?.data?.message || error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const cardsData = testimonials.length > 0 ? testimonials : []

  return (
    <>
      <div id='wall-of-love' className='relative bg-body py-28 px-4 scroll-mt-12 overflow-hidden'>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[60%] bg-gradient-to-br from-fuchsia-600/5 via-violet-600/5 to-transparent rounded-full blur-[150px]" />
        <div className="relative flex flex-col items-center">
          <div className="flex items-center gap-2 text-sm text-violet-300 bg-violet-500/10 border border-violet-500/20 rounded-full px-5 py-2 font-medium">
            <BookUserIcon className='size-4' />
            <span>Testimonials</span>
          </div>
          <Title title="Loved by thousands" description="See what our users have to say about their experience." />
        </div>
      </div>

      {loading ? (
        <div className="bg-body flex items-center justify-center pb-28">
          <Loader className="size-6 text-faint animate-spin" />
        </div>
      ) : cardsData.length > 0 ? (
        <div className="relative bg-body pb-28">
          <div className="marquee-row w-full mx-auto max-w-6xl overflow-hidden relative">
            <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-[var(--bg-body)] to-transparent" />
            <div className="marquee-inner flex transform-gpu min-w-[200%] pt-5 pb-5">
              {[...cardsData, ...cardsData].map((card, index) => (
                <CreateCard key={index} card={card} />
              ))}
            </div>
            <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-[var(--bg-body)] to-transparent" />
          </div>
          <div className="marquee-row w-full mx-auto max-w-6xl overflow-hidden relative">
            <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-[var(--bg-body)] to-transparent" />
            <div className="marquee-inner marquee-reverse flex transform-gpu min-w-[200%] pt-5 pb-5">
              {[...cardsData, ...cardsData].map((card, index) => (
                <CreateCard key={index} card={card} />
              ))}
            </div>
            <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-[var(--bg-body)] to-transparent" />
          </div>
        </div>
      ) : (
        <div className="bg-body pb-28">
          <p className="text-center text-faint text-sm">No testimonials yet. Be the first!</p>
        </div>
      )}

      <div className="bg-body pb-28 px-4">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-2 text-sm text-violet-300 bg-violet-500/10 border border-violet-500/20 rounded-full px-5 py-2 font-medium w-fit mx-auto mb-6">
            <Send className='size-4' />
            <span>Share your experience</span>
          </div>
          <form onSubmit={handleSubmit} className="bg-glass-4 backdrop-blur-xl border border-theme-light rounded-2xl p-6 space-y-4">
            <div className="flex items-center w-full bg-glass-5 border border-theme h-12 rounded-xl overflow-hidden pl-4 gap-2.5 focus-within:border-violet-500/50 focus-within:ring-2 focus-within:ring-violet-500/20 transition-all">
              <input type="text" name="name" placeholder="Your name" required
                className="border-none outline-none ring-0 bg-transparent w-full text-body placeholder:text-faint"
                value={form.name}
                onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div className="flex items-center w-full bg-glass-5 border border-theme h-12 rounded-xl overflow-hidden pl-4 gap-2.5 focus-within:border-violet-500/50 focus-within:ring-2 focus-within:ring-violet-500/20 transition-all">
              <input type="email" name="email" placeholder="Email (optional)"
                className="border-none outline-none ring-0 bg-transparent w-full text-body placeholder:text-faint"
                value={form.email}
                onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
              />
            </div>
            <div className="w-full bg-glass-5 border border-theme rounded-xl overflow-hidden pl-4 pt-3 gap-2.5 focus-within:border-violet-500/50 focus-within:ring-2 focus-within:ring-violet-500/20 transition-all">
              <textarea name="text" placeholder="Your testimonial..." required maxLength={500} rows={4}
                className="border-none outline-none ring-0 bg-transparent w-full text-body placeholder:text-faint resize-none"
                value={form.text}
                onChange={(e) => setForm(p => ({ ...p, text: e.target.value }))}
              />
              <div className="text-right text-xs text-hidden pb-2 pr-4">{form.text.length}/500</div>
            </div>
            <div className="flex items-center gap-2 text-sm text-dim">
              <span>Rating:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button type="button" key={star} onClick={() => setForm(p => ({ ...p, rating: star }))}
                  className="focus:outline-none"
                >
                  <Star className={`size-5 ${star <= form.rating ? 'fill-violet-500 text-violet-500' : 'text-hidden'}`} />
                </button>
              ))}
            </div>
            <button type="submit" disabled={submitting}
              className="w-full h-12 rounded-xl gradient-btn text-sm glow flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? <Loader className="size-4 animate-spin" /> : <Send className="size-4" />}
              {submitting ? 'Submitting...' : 'Submit testimonial'}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes marqueeScroll { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }
        .marquee-inner { animation: marqueeScroll 30s linear infinite; }
        .marquee-reverse { animation-direction: reverse; }
      `}</style>
    </>
  )
}

export default Testimonial
