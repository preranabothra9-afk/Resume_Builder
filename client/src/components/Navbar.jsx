import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {Link, useNavigate } from 'react-router-dom'
import { logout } from '../app/features/authSlice.js'

const Navbar = () => {
  const {user} = useSelector(state => state.auth)
  const dispatch = useDispatch()

  const navigate = useNavigate()

  const logoutUser = () =>{
    navigate('/')
    dispatch(logout())
  }

  return (
    <div className='sticky top-0 z-40 glass shadow-sm'>
      <nav className='flex items-center justify-between max-w-7xl mx-auto py-3 px-4 text-slate-800'>
        <Link to='/' className='hover:opacity-80 transition-opacity'>
            <img src="/logo.svg" alt="logo" className='h-10 w-auto' />
        </Link>
        <div className='flex items-center gap-5 text-sm'>
          <p className='max-sm:hidden text-slate-600 font-medium'>Hi, <span className='text-slate-800'>{user?.name}</span></p>
          <button onClick={logoutUser} className='bg-white hover:bg-red-50 hover:text-red-600 border border-gray-200 hover:border-red-200 px-6 py-2 rounded-full active:scale-95 transition-all duration-200 font-medium shadow-sm'>Logout</button>
        </div>
      </nav>
    </div>
  )
}

export default Navbar