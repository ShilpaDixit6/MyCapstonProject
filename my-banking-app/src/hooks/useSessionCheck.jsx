import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const useSessionCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Use the /dashboard endpoint to validate the session
        const response = await axios.get("http://localhost:8080/api/auth/dashboard", {
          withCredentials: true, // Include session cookies
        });
        if (response.status === 401) { // If unauthorized, redirect to login
          navigate("/login");
        }
      } catch (error) {
        navigate("/login"); // Redirect to login if there is an error
      }
    };

    checkSession();
  }, [navigate]);
};

export default useSessionCheck;