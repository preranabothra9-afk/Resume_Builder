import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import ResumeBuilder from './pages/ResumeBuilder'
import Preview from './pages/Preview'
import Login from './pages/Login'
import { useDispatch, useSelector } from 'react-redux'
import api from './configs/api.js'
import { login, setLoading } from './app/features/authSlice.js'
import { Toaster } from 'react-hot-toast';
import Loader from "./components/Loader";
import VerifyEmail from './pages/VerifyEmail.jsx'
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ManageTestimonials from "./pages/ManageTestimonials";
import { store } from './app/store.js'
import { injectStore } from './configs/api.js'

injectStore(store);

const App = () => {
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.auth);

  const getUserData = async () => {
    try {
      const { data } = await api.post('/api/users/refresh');
      if (data.user) {
        dispatch(login({ token: data.accessToken, user: data.user }));
      }
    } catch {
      // Not logged in
    } finally {
      dispatch(setLoading(false));
    }
  }

  useEffect(() => {
    getUserData();
  }, [])

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Toaster />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/app' element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path='builder/:resumeId' element={<ResumeBuilder />} />
          <Route path='testimonials' element={<ManageTestimonials />} />
        </Route>
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path='view/:resumeId' element={<Preview />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </>
  )
}

export default App