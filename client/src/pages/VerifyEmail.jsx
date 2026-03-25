import { useParams } from "react-router-dom";
import { useEffect } from "react";
import api from "../configs/api";

const VerifyEmail = () => {

  const { token } = useParams();

  useEffect(() => {
    api.get(`/api/users/verify-email/${token}`);
  }, []);

  return <div>Email verified successfully!</div>;
};

export default VerifyEmail;