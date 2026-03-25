import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../configs/api";
import toast from "react-hot-toast";

const ResetPassword = () => {

  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            await api.post(`/api/users/reset-password/${token}`, {
            password
            });

            toast.success("Password updated successfully");

            // wait 1.5 seconds so user sees success message
            setTimeout(() => {
            navigate("/?state=login");
            }, 1500);

        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    };

  return (
    <div className="flex items-center justify-center min-h-screen">

      <form onSubmit={handleSubmit} className="p-8 border rounded-xl w-96">

        <h2 className="text-2xl font-semibold mb-4">
          Reset Password
        </h2>

        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full mb-4"
          required
        />

        <button className="bg-green-500 text-white px-4 py-2 w-full rounded">
          Update Password
        </button>

      </form>

    </div>
  );
};

export default ResetPassword;