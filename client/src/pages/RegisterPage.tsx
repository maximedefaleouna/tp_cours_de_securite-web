import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the new multi-step registration page
    navigate("/register");
  }, [navigate]);

  return null; // Render nothing since we're redirecting
};

export default RegisterPage;
