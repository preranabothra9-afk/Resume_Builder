import { Mail, User2Icon , Lock, Eye, EyeOff} from 'lucide-react'
import React from 'react'
import { useDispatch } from 'react-redux'
import api from '../configs/api.js';
import { login } from '../app/features/authSlice.js';
import toast from 'react-hot-toast';
import { useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';

const Login = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const query = new URLSearchParams(window.location.search)
    const urlState = query.get('state')


    const [state, setState] = React.useState(urlState || "login");
    const [rememberMe, setRememberMe] = React.useState(false);

    const [welcomeUser, setWelcomeUser] = React.useState(null);

    const [showPassword, setShowPassword] = React.useState(false);


    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        password: ''
    })


    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const { data } = await api.post(`/api/users/${state}`, formData);

            localStorage.setItem("token", data.token);

            dispatch(login({
                token: data.token,
                user: data.user
            }));

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

    // only apply remember-me for LOGIN page
    if (state !== "login") return;

    const savedEmail = localStorage.getItem("rememberedEmail");
    const remember = localStorage.getItem("rememberMe");

    if (savedEmail && remember === "true") {
        setFormData(prev => ({
        ...prev,
        email: savedEmail
        }));

        setRememberMe(true);
    }

    }, [state]);
  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30 p-4'>
        <form onSubmit={handleSubmit} className="w-full max-w-md text-center border border-gray-100 rounded-2xl px-8 py-10 bg-white shadow-xl shadow-gray-100/50">
        {welcomeUser ? (
            <>
                <h1 className="text-gray-900 text-3xl font-semibold">
                Welcome back 👋
                </h1>

                <p className="text-gray-500 text-sm mt-2">
                {formData.email}
                </p>
            </>
            ) : (
            <>
                <h1 className="text-gray-900 text-3xl font-semibold">
                {state === "login" ? "Welcome back" : "Create account"}
                </h1>

                <p className="text-gray-500 text-sm mt-2">
                Please {state} to continue
                </p>
            </>
            )}
                {state !== "login" && (
                    <div className="flex items-center mt-6 w-full bg-gray-50 border border-gray-200 h-12 rounded-lg overflow-hidden pl-4 gap-2 focus-within:border-green-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-green-500/20 transition-all">
                        <User2Icon size={16} className='text-gray-400' />
                        <input type="text" name="name" placeholder="Name" className="border-none outline-none ring-0 bg-transparent w-full" value={formData.name} onChange={handleChange} required />
                    </div>
                )}
                <div className="flex items-center w-full mt-4 bg-gray-50 border border-gray-200 h-12 rounded-lg overflow-hidden pl-4 gap-2 focus-within:border-green-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-green-500/20 transition-all">
                    <Mail size={16} className='text-gray-400' />
                    <input type="email" name="email" placeholder="Email address" className="border-none outline-none ring-0 bg-transparent w-full" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="flex items-center mt-4 w-full bg-gray-50 border border-gray-200 h-12 rounded-lg overflow-hidden px-4 gap-2 focus-within:border-green-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-green-500/20 transition-all">
                    <Lock size={16} className='text-gray-400' />
                    <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" className="border-none outline-none ring-0 bg-transparent w-full" value={formData.password} onChange={handleChange} required />
                    
                    <button type="button" onClick={() => setShowPassword(prev => !prev)}className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors">
                        {showPassword ?  <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                <div className="mt-4 text-right">
                    <button
                        type="button"
                        onClick={() => navigate("/forgot-password")}
                        className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
                        >
                        Forgot password?
                    </button>
                </div>
                {state === "login" && (
                    <div className="flex items-center gap-2 mt-4 text-sm text-gray-600">
                        <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => {
                            const checked = e.target.checked;
                            setRememberMe(checked);

                            if (!checked) {
                            localStorage.removeItem("rememberedEmail");
                            localStorage.removeItem("rememberMe");
                            }
                        }}
                        className="rounded border-gray-300 text-green-500 focus:ring-green-500"
                        />
                        <label>Remember me</label>
                    </div>
                )}
                <button type="submit" className="mt-6 w-full h-12 rounded-lg text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all font-medium shadow-md hover:shadow-lg">
                    {state === "login" ? "Login" : "Sign up"}
                </button>
                <p onClick={() => setState(prev => prev === "login" ? "register" : "login")} className="text-gray-500 text-sm mt-5 mb-2 cursor-pointer">{state === "login" ? "Don't have an account?" : "Already have an account?"} <span className="text-green-600 hover:text-green-700 font-medium transition-colors">{state === "login" ? "Sign up" : "Login"}</span></p>
            </form>
    </div>
  )
}

export default Login