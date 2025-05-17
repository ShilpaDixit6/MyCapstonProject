import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "../Components/Footer"; // ✅ Import Footer component

const TransferMoney = () => {
  const [userDetails, setUserDetails] = useState(null); // Logged-in user details
  const [beneficiaries, setBeneficiaries] = useState([]); // List of beneficiaries
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null); // Selected beneficiary details
  const [transferAmount, setTransferAmount] = useState(""); // Transfer amount
  const [error, setError] = useState(""); // Error message
  const [successMessage, setSuccessMessage] = useState(""); // Success message
  const navigate = useNavigate();

  // Fetch logged-in user's details and beneficiaries when the component loads
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get("http://localhost:8080/users/profile", {
          withCredentials: true, // Include session details
        });
        setUserDetails(response.data); // Set user details

        // Fetch beneficiaries for the logged-in user
        const beneficiariesResponse = await axios.get(
          `http://localhost:8080/api/beneficiaries/${response.data.email}`,
          { withCredentials: true }
        );
        setBeneficiaries(beneficiariesResponse.data); // Set beneficiaries
      } catch (err) {
        if (err.response && err.response.status === 401) {
          navigate("/login"); // Redirect to login if session is invalid
        } else {
          setError("Error fetching data. Please try again later.");
        }
      }
    };

    fetchUserDetails();
  }, [navigate]);

  const handleBeneficiaryChange = (e) => {
    const beneficiaryId = e.target.value;
    const beneficiary = beneficiaries.find((b) => b.id.toString() === beneficiaryId);
    setSelectedBeneficiary(beneficiary);
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!userDetails || !selectedBeneficiary) {
      setError("Error: Please select a beneficiary and ensure you are logged in.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/transactions/transfer",
        {
          senderAccount: userDetails.accountNumber, // Sender's account fetched from session
          receiverAccount: selectedBeneficiary.accountNumber, // Beneficiary's account
          amount: parseFloat(transferAmount),
        },
        { withCredentials: true } // Include session details in the request
      );
      setSuccessMessage(response.data.message); // Set success message
      setError(""); // Clear error message
      setTransferAmount(""); // Clear transfer amount input
      setSelectedBeneficiary(null); // Clear selected beneficiary
    } catch (err) {
      setSuccessMessage(""); // Clear success message
      setError(
        err.response?.data || "Error transferring money. Please try again."
      );
    }
  };

  const handleBack = () => {
    navigate("/dashboard"); // Redirect to the user dashboard
  };

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
      <Navbar />

      <div className="container d-flex justify-content-center align-items-center flex-grow-1">
        <div className="card p-4 shadow" style={{ width: "400px" }}>
          <h1 className="text-center mb-4">Transfer Money</h1>

          {error && <div className="alert alert-danger">{error}</div>}
          {successMessage && <div className="alert alert-success">{successMessage}</div>}

          <form onSubmit={handleTransfer}>
            <div className="mb-3">
              <label htmlFor="beneficiarySelect" className="form-label">
                Select Beneficiary
              </label>
              <select
                className="form-control"
                id="beneficiarySelect"
                onChange={handleBeneficiaryChange}
                value={selectedBeneficiary?.id || ""}
                required
              >
                <option value="" disabled>
                  -- Choose a Beneficiary --
                </option>
                {beneficiaries.map((beneficiary) => (
                  <option key={beneficiary.id} value={beneficiary.id}>
                    {beneficiary.fullName} ({beneficiary.accountNumber})
                  </option>
                ))}
              </select>
            </div>

            {selectedBeneficiary && (
              <div className="card mb-3">
                <div className="card-body">
                  <h5 className="card-title">Beneficiary Details</h5>
                  <p><strong>Full Name:</strong> {selectedBeneficiary.fullName}</p>
                  <p><strong>Bank Name:</strong> {selectedBeneficiary.bankName}</p>
                  <p><strong>Account Number:</strong> {selectedBeneficiary.accountNumber}</p>
                  <p><strong>Max Transfer Limit:</strong> {selectedBeneficiary.maxTransferLimit}</p>
                </div>
              </div>
            )}

            <div className="mb-3">
              <label htmlFor="transferAmount" className="form-label">
                Transfer Amount
              </label>
              <input
                type="number"
                className="form-control"
                id="transferAmount"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                placeholder="Enter amount to transfer"
                required
              />
            </div>

            <button type="submit" className="btn btn-success w-100">
              Transfer Money
            </button>
          </form>

          <button onClick={handleBack} className="btn btn-secondary mt-3 w-100">
            Back to Dashboard
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TransferMoney;
