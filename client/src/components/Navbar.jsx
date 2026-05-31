import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../app/features/authSlice.js'
import api from '../configs/api.js'
import { LogOut, MessageSquare } from 'lucide-react'

const Navbar = () => {
  const { user } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const logoutUser = async () => {
    try {
      await api.post('/api/users/logout')
    } catch {
      // Proceed with local logout even if API fails
    }
    navigate('/')
    dispatch(logout())
  }

  return (
    <div className='sticky top-0 z-40 bg-[#0e0e1a]/90 backdrop-blur-xl border-b border-white/[0.06]'>
      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-transparent to-cyan-500/10 pointer-events-none" />
      <nav className='relative flex items-center justify-between max-w-7xl mx-auto py-3.5 px-4'>
        <Link to='/' className='flex items-center gap-2.5 group'>
          <div className='size-9 rounded-xl gradient-btn flex items-center justify-center text-sm font-bold shadow-lg shadow-violet-500/30 group-hover:scale-105 transition-transform'>
            RB
          </div>
          <span className='text-white font-semibold text-sm'>ResumeBuilder</span>
        </Link>
        <div className='flex items-center gap-3 text-sm'>
          {user?.email === 'preranabothra9@gmail.com' && (
            <Link to='/app/testimonials' className='flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 text-white/50 hover:text-violet-400 hover:border-violet-500/30 hover:bg-violet-500/10 active:scale-95 transition-all'>
              <MessageSquare className='size-4' />
              <span className='max-sm:hidden'>Testimonials</span>
            </Link>
          )}
          <div className='flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/10 border border-white/[0.08]'>
            <div className='size-6 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-[10px] font-bold text-white'>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <span className='text-white font-medium'>{user?.name}</span>
          </div>
          <button onClick={logoutUser} className='flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/10 text-white/70 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 active:scale-95 transition-all'>
            <LogOut className='size-4' />
            <span className='max-sm:hidden'>Logout</span>
          </button>
        </div>
      </nav>
    </div>
  )
}

export default Navbar