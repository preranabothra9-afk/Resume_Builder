import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../configs/api";
import { CheckCircle2, LoaderCircle, XCircle } from "lucide-react";

const VerifyEmail = () => {

  const { token } = useParams();
  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    api.get(`/api/users/verify-email/${token}`)
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, []);

  return (
    <div className="app-bg flex items-center justify-center min-h-screen p-4">
      <div className="bg-glass-4 backdrop-blur-xl border border-theme-light rounded-2xl p-8 text-center max-w-sm w-full shadow-2xl shadow-black/30">
        {status === "verifying" && (
          <div className="flex flex-col items-center gap-4">
            <LoaderCircle className="size-12 animate-spin text-violet-500" />
            <p className="text-muted font-medium">Verifying your email...</p>
          </div>
        )}
        {status === "success" && (
          <div className="flex flex-col items-center gap-4">
            <div className="size-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <CheckCircle2 className="size-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-primary">Email Verified!</h2>
            <p className="text-sm text-subtle">Your email has been successfully verified.</p>
            <Link to="/?state=login"
              className="mt-2 gradient-btn rounded-xl px-6 py-2.5 text-sm glow">
              Sign in now
            </Link>
          </div>
        )}
        {status === "error" && (
          <div className="flex flex-col items-center gap-4">
            <div className="size-14 rounded-2xl bg-gradient-to-br from-rose-600 to-pink-600 flex items-center justify-center">
              <XCircle className="size-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-primary">Verification Failed</h2>
            <p className="text-sm text-subtle">The verification link is invalid or expired.</p>
            <Link to="/" className="mt-2 gradient-btn rounded-xl px-6 py-2.5 text-sm glow">
              Go home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
