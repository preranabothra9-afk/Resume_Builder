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
    <div className='flex items-center justify-center min-h-screen bg-gray-50'>
        <form onSubmit={handleSubmit} className="w-full max-w-md text-center border border-gray-300/60 rounded-2xl px-8 bg-white">
        {welcomeUser ? (
            <>
                <h1 className="text-gray-900 text-3xl mt-10 font-medium">
                Welcome back 👋
                </h1>

                <p className="text-gray-500 text-sm mt-2">
                {formData.email}
                </p>
            </>
            ) : (
            <>
                <h1 className="text-gray-900 text-3xl mt-10 font-medium">
                {state === "login" ? "Login" : "Sign up"}
                </h1>

                <p className="text-gray-500 text-sm mt-2">
                Please {state} to continue
                </p>
            </>
            )}
                {state !== "login" && (
                    <div className="flex items-center mt-6 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                        <User2Icon size={16} color='#6B7280' />
                        <input type="text" name="name" placeholder="Name" className="border-none outline-none ring-0" value={formData.name} onChange={handleChange} required />
                    </div>
                )}
                <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                    <Mail size={16} color='#6B7280' />
                    <input type="email" name="email" placeholder="Email id" className="border-none outline-none ring-0" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden px-6 gap-2 ">
                    <Lock size={16} color='#6B7280' className='mr-0' />
                    <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" className="border-none outline-none ring-0 mr-7 " value={formData.password} onChange={handleChange} required />
                    
                    <button type="button" onClick={() => setShowPassword(prev => !prev)}className="text-gray-500 hover:text-gray-700 cursor-pointer">
                        {showPassword ?  <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                <div className="mt-4 text-left text-green-500">
                    <button
                        type="button"
                        onClick={() => navigate("/forgot-password")}
                        className="text-sm text-green-500"
                        >
                        Forgot password?
                    </button>
                </div>
                {state === "login" && (
                    <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">
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
                        />
                        <label>Remember Me</label>
                    </div>
                )}
                <button type="submit" className="mt-2 w-full h-11 rounded-full text-white bg-green-500 hover:opacity-90 transition-opacity">
                    {state === "login" ? "Login" : "Sign up"}
                </button>
                <p onClick={() => setState(prev => prev === "login" ? "register" : "login")} className="text-gray-500 text-sm mt-3 mb-11">{state === "login" ? "Don't have an account?" : "Already have an account?"} <a href="#" className="text-green-500 hover:underline">click here</a></p>
            </form>
    </div>
  )
}

export default Login