import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../Css/ForgotPassword.css"; // Import CSS

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [userDetails, setUserDetails] = useState(null); // Check if user is logged in
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/auth/user-details", {
          withCredentials: true, // Ensures session handling
        });
        setUserDetails(response.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          navigate("/login"); // Redirect unauthorized users to login
        } else {
          setError("Error fetching user details.");
        }
      }
    };

    fetchUserDetails();
  }, [navigate]);

  const validateInputs = () => {
    let isValid = true;

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New password and confirm password must match.");
      isValid = false;
    } else if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z0-9]).{6,}$/.test(formData.newPassword)) {
      setError("Password must include at least one uppercase letter, one special character, and be alphanumeric.");
      isValid = false;
    } else {
      setError("");
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateInputs()) {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/auth/forgot-password",
          formData,
          { withCredentials: true }
        );

        if (response.status === 200) {
          alert("Password updated successfully!");
          navigate("/login"); // Redirect to login page
        }
      } catch (error) {
        setError("Error updating password. Please try again.");
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="text-center mb-4">Forgot Password</h2>

              {error && <div className="alert alert-danger">{error}</div>}

              {userDetails ? (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="oldPassword" className="form-label">Old Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="oldPassword"
                      name="oldPassword"
                      value={formData.oldPassword}
                      onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
                      placeholder="Enter old password"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      placeholder="Enter new password"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="Confirm new password"
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary w-100">Submit</button>
                </form>
              ) : (
                <p className="text-center text-danger">You must be logged in to change your password.</p>
              )}

              <p className="text-center mt-3">
                <Link to="/login">Back to Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
