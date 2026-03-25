import React, { useState } from "react";
import api from "../configs/api";
import toast from "react-hot-toast";

const ForgotPassword = () => {

  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      await api.post("/api/users/forgot-password", {
        email
      });

      toast.success("Reset link sent to your email");

    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">

      <form onSubmit={handleSubmit} className="p-8 border rounded-xl w-96">

        <h2 className="text-2xl font-semibold mb-4">
          Forgot Password
        </h2>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full mb-4"
          required
        />

        <button className="bg-green-500 text-white px-4 py-2 w-full rounded">
          Send Reset Link
        </button>

      </form>

    </div>
  );
};

export default ForgotPassword;