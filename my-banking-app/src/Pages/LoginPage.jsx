import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; 
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../Css/LoginPage.css";


const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  
  // Define the function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState); // Toggle between true/false
  };

  // Validate inputs
  const validateInputs = () => {
    let isValid = true;

    // Email validation (must end with @gmail.com)
    if (!/^[\w.%+-]+@gmail\.com$/.test(email)) {
      setError("Email must be a valid Gmail address (@gmail.com).");
      isValid = false;
    } 
    // Password validation (at least one uppercase letter, one special character, and alphanumeric)
    else if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z0-9]).{6,}$/.test(password)) {
      setError("Password must include at least one uppercase letter, one special character, and be alphanumeric.");
      isValid = false;
    } else {
      setError(""); // Clear errors if both fields are valid
    }

    return isValid;
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();

    if (validateInputs()) {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/auth/login", 
          { email, password }, 
          { withCredentials: true } // Enable cookies for session handling
        );
        if (response.status === 200) {
          alert("Login successful!");
          navigate("/dashboard"); // Redirect to dashboard
        }
      } catch (error) {
        setError("Invalid credentials or server error.");
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="text-center mb-4">Bank Login</h2>

              {/* Error Alert */}
              {error && <div className="alert alert-danger">{error}</div>}

              {/* Login Form */}
              <form onSubmit={handleLogin}>
                {/* Email Input */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                {/* Password Input with Show/Hide Feature */}
                <div className="mb-3 position-relative">
                  <label htmlFor="password" className="form-label">Password</label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                    />
                    {/* Eye Icon for Show/Hide Password */}

                    <div
                    onClick={togglePasswordVisibility}
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: "10px",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                    }}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </div>
                    {/* <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button> */}
                  </div>
                </div>

                {/* Login Button */}
                <button type="submit" className="btn btn-primary w-100">
                  Login
                </button>
              </form>

              {/* Forgot Password Link */}
              <p className="text-center mt-3">
                <Link to="/forgot-password">Forgot Password?</Link>
              </p>

              {/* Register Link */}
              <p className="text-center mt-2">
                Not registered? <Link to="/register">Register here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
