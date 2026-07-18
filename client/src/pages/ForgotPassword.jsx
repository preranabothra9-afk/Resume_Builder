import React, { useState, useEffect, useRef } from "react";
import api from "../configs/api";
import toast from "react-hot-toast";
import { ArrowLeft, Mail, Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const pollingRef = useRef(null);

  useEffect(() => {
    if (!sent || !email) return;
    pollingRef.current = setInterval(async () => {
      try {
        const { data } = await api.post("/api/users/check-reset-status", { email });
        if (data.reset) {
          clearInterval(pollingRef.current);
          toast.success("Password reset detected! Redirecting to login...");
          navigate("/login");
        }
      } catch {}
    }, 3000);
    return () => clearInterval(pollingRef.current);
  }, [sent, email]);

  useEffect(() => {
    try {
      const channel = new BroadcastChannel("password-reset");
      channel.onmessage = () => navigate("/login");
      return () => channel.close();
    } catch {}
    try {
      if (localStorage.getItem("password-reset")) navigate("/login");
    } catch {}
    const handler = (e) => { if (e.key === "password-reset") navigate("/login"); };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/users/forgot-password", { email });
      setSent(true);
      toast.success("Reset link sent! This page will auto-detect when you reset.");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="app-bg flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex size-16 rounded-2xl gradient-btn items-center justify-center text-2xl font-bold mb-4 glow">RB</Link>
          <h1 className="text-2xl font-bold text-primary">Forgot Password</h1>
          <p className="text-subtle text-sm mt-1">We'll send you a reset link</p>
        </div>

        <div className="bg-glass-4 backdrop-blur-xl border border-theme-light rounded-2xl p-6 shadow-2xl shadow-black/30">
          {sent ? (
            <div className="text-center py-6 space-y-4">
              <Loader className="size-10 text-violet-400 animate-spin mx-auto" />
              <p className="text-body font-medium">Waiting for password reset...</p>
              <p className="text-subtle text-sm">Reset your password on any device and this page will auto-redirect to login.</p>
              <button onClick={() => navigate("/login")} className="w-full h-11 rounded-xl gradient-btn text-sm glow">Go to Login</button>
            </div>
          ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center w-full bg-glass-5 border border-theme h-12 rounded-xl overflow-hidden pl-4 gap-2.5 focus-within:border-violet-500/50 focus-within:ring-2 focus-within:ring-violet-500/20 transition-all">
              <Mail size={16} className='text-faint shrink-0' />
              <input type="email" placeholder="Enter your email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-none outline-none ring-0 bg-transparent w-full text-body" required />
            </div>
            <button className="w-full h-11 rounded-xl gradient-btn text-sm glow">Send Reset Link</button>
          </form>
          )}

          <Link to="/" className="flex items-center justify-center gap-2 mt-4 text-sm text-subtle hover:text-violet-400 transition-colors font-medium">
            <ArrowLeft className="size-4" /> Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
