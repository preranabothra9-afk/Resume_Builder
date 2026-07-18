import React, { useEffect, lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login, setLoading } from './app/features/authSlice.js'
import { Toaster } from 'react-hot-toast';
import Loader from "./components/Loader";
import { store } from './app/store.js'
import { injectStore } from './configs/api.js'
import api from './configs/api.js'

injectStore(store);

const Home = lazy(() => import('./pages/Home'))
const Layout = lazy(() => import('./pages/Layout'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const ResumeBuilder = lazy(() => import('./pages/ResumeBuilder'))
const Preview = lazy(() => import('./pages/Preview'))
const Login = lazy(() => import('./pages/Login'))
const VerifyEmail = lazy(() => import('./pages/VerifyEmail.jsx'))
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"))
const ResetPassword = lazy(() => import("./pages/ResetPassword"))
const ManageTestimonials = lazy(() => import("./pages/ManageTestimonials"))
const ATSAnalysis = lazy(() => import("./pages/ATSAnalysis"))

const App = () => {
  const dispatch = useDispatch()

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

  return (
    <>
      <Toaster />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/ats-analysis' element={<ATSAnalysis />} />
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
      </Suspense>
    </>
  )
}

export default App
