import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../configs/api";
import toast from "react-hot-toast";
import { ArrowLeft, Lock } from "lucide-react";

const ResetPassword = () => {

  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/api/users/reset-password/${token}`, { password });
      setDone(true);
      toast.success("Password updated successfully");
      try { new BroadcastChannel("password-reset").postMessage("done"); } catch {}
      try { localStorage.setItem("password-reset", Date.now()); } catch {}
      setTimeout(() => { navigate("/login"); }, 3000);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="app-bg flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex size-16 rounded-2xl gradient-btn items-center justify-center text-2xl font-bold mb-4 glow">RB</Link>
          <h1 className="text-2xl font-bold text-primary">Reset Password</h1>
          <p className="text-subtle text-sm mt-1">Enter your new password</p>
        </div>

        <div className="bg-glass-4 backdrop-blur-xl border border-theme-light rounded-2xl p-6 shadow-2xl shadow-black/30">
          {done ? (
            <div className="text-center py-8 space-y-4">
              <div className="size-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-3xl mx-auto glow">✓</div>
              <p className="text-body font-medium">Password updated successfully!</p>
              <button onClick={() => navigate("/login")} className="w-full h-11 rounded-xl gradient-btn text-sm glow">Go to Login</button>
            </div>
          ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center w-full bg-glass-5 border border-theme h-12 rounded-xl overflow-hidden px-4 gap-2.5 focus-within:border-violet-500/50 focus-within:ring-2 focus-within:ring-violet-500/20 transition-all">
              <Lock size={16} className='text-faint shrink-0' />
              <input type="password" placeholder="New password" value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-none outline-none ring-0 bg-transparent w-full text-body" required />
            </div>
            <button className="w-full h-11 rounded-xl gradient-btn text-sm glow">Update Password</button>
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

export default ResetPassword;
