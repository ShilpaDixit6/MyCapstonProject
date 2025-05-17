import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const UnifiedLogin = () => {
  const [userType, setUserType] = useState("customer"); // Default to "customer"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  // Validate inputs
  const validateInputs = () => {
    let isValid = true;

    if (!/^[\w.%+-]+@gmail\.com$/.test(email)) {
      setError("Email must be a valid Gmail address (@gmail.com).");
      isValid = false;
    } else if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z0-9]).{6,}$/.test(password)) {
      setError("Password must include at least one uppercase letter, one special character, and be alphanumeric.");
      isValid = false;
    } else {
      setError("");
    }

    return isValid;
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();

    if (validateInputs()) {
      try {
        const endpoint =
          userType === "admin"
            ? "http://localhost:8080/api/admin/auth/login"
            : "http://localhost:8080/api/auth/login";

        const response = await axios.post(
          endpoint,
          { email, password },
          { withCredentials: true } // For session handling
        );

        if (response.status === 200) {
          setMessage("Login successful!");
          if (userType === "admin") {
            navigate("/admdash");
          } else {
            navigate("/dashboard");
          }
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
              <h2 className="text-center mb-4">Login</h2>

              {/* Success or Error Alert */}
              {error && <div className="alert alert-danger">{error}</div>}
              {message && <div className="alert alert-success">{message}</div>}

              {/* User Type Selection */}
              <div className="mb-3">
                <label htmlFor="userType" className="form-label">
                  Login As:
                </label>
                <select
                  id="userType"
                  className="form-select"
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

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

                {/* Password Input */}
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
                  </div>
                </div>

                {/* Login Button */}
                <button type="submit" className="btn btn-primary w-100">Login</button>
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

export default UnifiedLogin;
