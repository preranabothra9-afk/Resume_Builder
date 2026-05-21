import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useSelector } from 'react-redux';

import Loader from '../components/Loader';
import Login from './Login';

const Layout = () => {

  const {user, loading} = useSelector(state => state.auth)

  if(loading){
    return <Loader />
  }

  return (
    <div>
        {
          user ? (
            <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50'>
              <Navbar />
              <Outlet />
            </div>
          ) : <Login />
        }
        
    </div>
  )
}

export default Layout