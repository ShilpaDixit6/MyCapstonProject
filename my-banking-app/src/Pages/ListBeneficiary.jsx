import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "../Components/Footer"; // ✅ Import Footer component

const ListBeneficiary = () => {
  const [userDetails, setUserDetails] = useState(null); // Logged-in user details
  const [beneficiaries, setBeneficiaries] = useState([]); // List of beneficiaries
  const [error, setError] = useState(""); // Error message
  const [successMessage, setSuccessMessage] = useState(""); // Success message
  const [updateBeneficiaryId, setUpdateBeneficiaryId] = useState(null); // ID of beneficiary to update
  const [newMaxTransferLimit, setNewMaxTransferLimit] = useState(""); // New max transfer limit
  const navigate = useNavigate();

  // Fetch logged-in user's details and beneficiaries when the component loads
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get("http://localhost:8080/users/profile", {
          withCredentials: true,
        });
        setUserDetails(userResponse.data);

        const beneficiariesResponse = await axios.get(
          `http://localhost:8080/api/beneficiaries/${userResponse.data.email}`,
          { withCredentials: true }
        );
        setBeneficiaries(beneficiariesResponse.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          navigate("/login");
        } else {
          setError("Error fetching data. Please try again later.");
        }
      }
    };

    fetchData();
  }, [navigate]);

  // Handle beneficiary deletion
  const handleDelete = async (beneficiaryId) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/beneficiaries/delete/${beneficiaryId}`,
        { withCredentials: true }
      );
      setSuccessMessage("Beneficiary deleted successfully.");
      setError(""); // Clear error message
      setBeneficiaries((prev) => prev.filter((b) => b.id !== beneficiaryId)); // Remove deleted beneficiary from the list
    } catch (err) {
      setSuccessMessage("");
      setError(
        err.response?.data || "Error deleting beneficiary. Please try again."
      );
    }
  };

  // Handle beneficiary update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:8080/api/beneficiaries/update/${updateBeneficiaryId}`,
        { maxTransferLimit: parseFloat(newMaxTransferLimit) },
        { withCredentials: true }
      );
      setSuccessMessage(response.data.message); // Set success message
      setError(""); // Clear error message
      setBeneficiaries((prev) =>
        prev.map((b) =>
          b.id === updateBeneficiaryId ? { ...b, maxTransferLimit: newMaxTransferLimit } : b
        )
      ); // Update the beneficiary in the list
      setUpdateBeneficiaryId(null); // Clear update state
      setNewMaxTransferLimit(""); // Clear input field
    } catch (err) {
      setSuccessMessage("");
      setError(
        err.response?.data || "Error updating beneficiary. Please try again."
      );
    }
  };

  // Navbar Component
  const Navbar = () => (
    <nav className="navbar navbar-expand-lg navbar-light bg-light small-navbar">
       <div className="container-fluid d-flex justify-content-between align-items-center px-3">
        <a className="navbar-brand" href="#">
          <i className="bi bi-bank fs-2 text-primary">Dixit Bank</i>
        </a>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <a className="nav-link" href="/transactions">View Transactions</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/beni">Add Beneficiary</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/transfer">Transfer Money</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/updateprofile">Profile</a>
            </li>
          </ul>
          <div className="ms-auto d-flex align-items-center">
            <i
              className="bi bi-box-arrow-in-right mx-3 fs-4 text-primary"
              role="button"
              title="Login"
              onClick={() => navigate("/login")}
            ></i>
            <i
              className="bi bi-person-circle mx-3 fs-4 text-info"
              role="button"
              title="Profile"
              onClick={() => navigate("/viewprofile")}
            ></i>
            <i
              className="bi bi-box-arrow-right mx-3 fs-4 text-danger"
              role="button"
              title="Logout"
              onClick={() => navigate("/logout")}
            ></i>
          </div>
        </div>
      </div>
    </nav>
  );

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Include Navbar at the top */}
      <Navbar />

      <div className="container mt-5 flex-grow-1">
        <h1 className="text-center mb-4">Manage Beneficiaries</h1>

        {/* Display error and success messages */}
        {error && <div className="alert alert-danger">{error}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        {/* Beneficiary Table */}
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Bank Name</th>
              <th>Account Number</th>
              <th>Max Transfer Limit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {beneficiaries.map((beneficiary) => (
              <tr key={beneficiary.id}>
                <td>{beneficiary.fullName}</td>
                <td>{beneficiary.bankName}</td>
                <td>{beneficiary.accountNumber}</td>
                <td>{beneficiary.maxTransferLimit}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => {
                      setUpdateBeneficiaryId(beneficiary.id);
                      setNewMaxTransferLimit(beneficiary.maxTransferLimit);
                    }}
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-danger btn-sm ms-2"
                    onClick={() => handleDelete(beneficiary.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Update Form */}
        {updateBeneficiaryId && (
          <form onSubmit={handleUpdate} className="mt-4">
            <div className="mb-3">
              <label htmlFor="newMaxTransferLimit" className="form-label">
                New Max Transfer Limit
              </label>
              <input
                type="number"
                className="form-control"
                id="newMaxTransferLimit"
                value={newMaxTransferLimit}
                onChange={(e) => setNewMaxTransferLimit(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-success">
              Update Beneficiary
            </button>
          </form>
        )}
      </div>

      {/* Include Footer at the bottom */}
      <Footer />
    </div>
  );
};

export default ListBeneficiary;
