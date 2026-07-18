import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../app/features/authSlice.js'
import api from '../configs/api.js'
import { FileSearch, LogOut, MessageSquare } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

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
    <div className='sticky top-0 z-40 backdrop-blur-xl border-b' style={{ backgroundColor: 'var(--bg-nav)', borderColor: 'var(--border-light)' }}>
      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-transparent to-cyan-500/10 pointer-events-none" />
      <nav className='relative flex items-center justify-between max-w-7xl mx-auto py-3.5 px-4'>
        <Link to='/' className='flex items-center gap-2.5 group'>
          <div className='size-9 rounded-xl gradient-btn flex items-center justify-center text-sm font-bold shadow-lg shadow-violet-500/30 group-hover:scale-105 transition-transform'>
            RB
          </div>
          <span className='font-semibold text-sm' style={{ color: 'var(--text-primary)' }}>ResumeBuilder</span>
        </Link>
        <div className='flex items-center gap-3 text-sm'>
          <Link to='/ats-analysis' className='flex items-center gap-1.5 px-3 py-2 rounded-xl border active:scale-95 transition-all' style={{ borderColor: 'var(--border)', color: 'var(--text-dim)' }}>
            <FileSearch className='size-4' />
            <span className='max-sm:hidden'>ATS Analysis</span>
          </Link>
          {user?.email === 'preranabothra9@gmail.com' && (
            <Link to='/app/testimonials' className='flex items-center gap-1.5 px-3 py-2 rounded-xl border active:scale-95 transition-all' style={{ borderColor: 'var(--border)', color: 'var(--text-dim)' }}>
              <MessageSquare className='size-4' />
              <span className='max-sm:hidden'>Testimonials</span>
            </Link>
          )}
          <div className='flex items-center gap-2.5 px-3.5 py-2 rounded-xl' style={{ backgroundColor: 'var(--glass-10)', border: '1px solid var(--border-medium)' }}>
            <div className='size-6 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-[10px] font-bold text-white'>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <span className='font-medium' style={{ color: 'var(--text-primary)' }}>{user?.name}</span>
          </div>
          <ThemeToggle className='border' style={{ borderColor: 'var(--border)' }} />
          <button onClick={logoutUser} className='flex items-center gap-2 px-3.5 py-2 rounded-xl border active:scale-95 transition-all' style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
            <LogOut className='size-4' />
            <span className='max-sm:hidden'>Logout</span>
          </button>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
