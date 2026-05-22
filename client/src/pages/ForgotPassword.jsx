import React, { useState } from "react";
import api from "../configs/api";
import toast from "react-hot-toast";
import { ArrowLeft, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {

  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/users/forgot-password", { email });
      toast.success("Reset link sent to your email");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="app-bg flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex size-16 rounded-2xl gradient-btn items-center justify-center text-2xl font-bold mb-4 glow">RB</Link>
          <h1 className="text-2xl font-bold text-white">Forgot Password</h1>
          <p className="text-white/40 text-sm mt-1">We'll send you a reset link</p>
        </div>

        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6 shadow-2xl shadow-black/30">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center w-full bg-white/5 border border-white/10 h-12 rounded-xl overflow-hidden pl-4 gap-2.5 focus-within:border-violet-500/50 focus-within:ring-2 focus-within:ring-violet-500/20 transition-all">
              <Mail size={16} className='text-white/30 shrink-0' />
              <input type="email" placeholder="Enter your email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-none outline-none ring-0 bg-transparent w-full text-white/90 placeholder:text-white/30" required />
            </div>
            <button className="w-full h-11 rounded-xl gradient-btn text-sm glow">Send Reset Link</button>
          </form>

          <Link to="/" className="flex items-center justify-center gap-2 mt-4 text-sm text-white/40 hover:text-violet-400 transition-colors font-medium">
            <ArrowLeft className="size-4" /> Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
