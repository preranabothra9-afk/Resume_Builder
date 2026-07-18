import { Mail, User2Icon, Lock, Eye, EyeOff } from 'lucide-react'
import React from 'react'
import { useDispatch } from 'react-redux'
import api from '../configs/api.js';
import { login } from '../app/features/authSlice.js';
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import ThemeToggle from '../components/ThemeToggle';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const query = new URLSearchParams(window.location.search)
  const urlState = query.get('state')

  const [state, setState] = React.useState(urlState || "login");
  const [rememberMe, setRememberMe] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await api.post(`/api/users/${state}`,
        state === "login" ? { ...formData, rememberMe } : formData
      );

      if (state === "login") {
        if (rememberMe) {
          const payload = JSON.stringify({
            email: formData.email,
            expires: Date.now() + 30 * 24 * 60 * 60 * 1000
          });
          localStorage.setItem("rememberedEmail", payload);
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("rememberedEmail");
          localStorage.removeItem("rememberMe");
        }
        dispatch(login({ token: data.accessToken, user: data.user }));
      }

      toast.success(data.message)
      navigate("/app");
    } catch (error) {
      toast(error?.response?.data?.message || error.message);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    if (state !== "login") return;
    try {
      const raw = localStorage.getItem("rememberedEmail");
      const remember = localStorage.getItem("rememberMe");
      if (raw && remember === "true") {
        const saved = JSON.parse(raw);
        if (saved.expires > Date.now()) {
          setFormData(prev => ({ ...prev, email: saved.email }));
          setRememberMe(true);
        } else {
          localStorage.removeItem("rememberedEmail");
          localStorage.removeItem("rememberMe");
        }
      }
    } catch { }
  }, [state]);

  return (
    <div className='app-bg flex items-center justify-center min-h-screen p-4'>
      <div className="w-full max-w-md">
        <div className='text-center mb-8'>
          <div className='inline-flex size-16 rounded-2xl gradient-btn items-center justify-center text-2xl font-bold mb-4 glow'>RB</div>
          <h1 className="text-3xl font-bold text-primary">
            {state === "login" ? "Welcome back" : "Create account"}
          </h1>
          <p className="text-subtle text-sm mt-1">
            {state === "login" ? "Sign in to continue building" : "Start your journey"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className='bg-glass-4 backdrop-blur-xl border border-theme-light rounded-2xl p-6 space-y-4 shadow-2xl shadow-black/30'>
          {state !== "login" && (
            <div className="flex items-center w-full bg-glass-5 border border-theme h-12 rounded-xl overflow-hidden pl-4 gap-2.5 focus-within:border-violet-500/50 focus-within:ring-2 focus-within:ring-violet-500/20 transition-all">
              <User2Icon size={16} className='text-faint shrink-0' />
              <input type="text" name="name" placeholder="Name"
                className="border-none outline-none ring-0 bg-transparent w-full text-body"
                value={formData.name} onChange={handleChange} required />
            </div>
          )}
          <div className="flex items-center w-full bg-glass-5 border border-theme h-12 rounded-xl overflow-hidden pl-4 gap-2.5 focus-within:border-violet-500/50 focus-within:ring-2 focus-within:ring-violet-500/20 transition-all">
            <Mail size={16} className='text-faint shrink-0' />
            <input type="email" name="email" placeholder="Email address"
              className="border-none outline-none ring-0 bg-transparent w-full text-body"
              value={formData.email} onChange={handleChange} required />
          </div>
          <div className="flex items-center w-full bg-glass-5 border border-theme h-12 rounded-xl overflow-hidden px-4 gap-2.5 focus-within:border-violet-500/50 focus-within:ring-2 focus-within:ring-violet-500/20 transition-all">
            <Lock size={16} className='text-faint shrink-0' />
            <input type={showPassword ? "text" : "password"} name="password" placeholder="Password"
              className="border-none outline-none ring-0 bg-transparent w-full text-body"
              value={formData.password} onChange={handleChange} required />
            <button type="button" onClick={() => setShowPassword(prev => !prev)}
              className="text-faint hover-text-primary cursor-pointer transition-colors shrink-0">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="flex items-center justify-between text-sm">
            {state === "login" && (
              <label className="flex items-center gap-2 text-dim cursor-pointer">
                <input type="checkbox" checked={rememberMe}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setRememberMe(checked);
                    if (!checked) {
                      localStorage.removeItem("rememberedEmail");
                      localStorage.removeItem("rememberMe");
                    }
                  }}
                  className="rounded border-theme bg-glass-5 text-violet-600 focus:ring-violet-500 size-4" />
                Remember me
              </label>
            )}
            {state === "login" && (
              <button type="button" onClick={() => navigate("/forgot-password")}
                className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                Forgot password?
              </button>
            )}
          </div>

          <button type="submit" className="w-full h-12 rounded-xl gradient-btn text-sm glow">
            {state === "login" ? "Sign in" : "Create account"}
          </button>

          <p onClick={() => setState(prev => prev === "login" ? "register" : "login")}
            className="text-subtle text-sm text-center cursor-pointer">
            {state === "login" ? "Don't have an account?" : "Already have an account?"}{' '}
            <span className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
              {state === "login" ? "Sign up" : "Sign in"}
            </span>
          </p>
        </form>
      </div>
      <div className='fixed bottom-6 right-6'>
        <ThemeToggle className='border border-theme bg-glass-4' />
      </div>
    </div>
  )
}

export default Login
