import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Login from './Login';
import { Sparkles } from 'lucide-react';

const Layout = () => {
  const { user, loading } = useSelector(state => state.auth)

  if (loading) {
    return <Loader />
  }

  return (
    <div>
      {user ? (
        <div className='min-h-screen bg-[#08080f]'>
          <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-500/5 via-transparent to-transparent pointer-events-none" />
          <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-cyan-500/5 via-transparent to-transparent pointer-events-none" />
          <Navbar />
          <main className="relative">
            <Outlet />
          </main>
        </div>
      ) : <Login />
      }
    </div>
  )
}

export default Layout
