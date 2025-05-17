import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../Css/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar small-navbar navbar-expand-sm navbar-light bg-light">
      <div className="container-fluid d-flex justify-content-between align-items-center px-3">
        {/* Logo */}
        <Link className="navbar-brand" to="#">
          <i className="bi bi-bank fs-4 text-primary"></i>
        </Link>

        {/* Toggle button for mobile view */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation */}
        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">    
          <h5 className="mb-0 fw-bold text-primary">Dixit Bank</h5>
          <div className="d-flex ms-auto">
            <Link to="/login" className="btn btn-primary me-2 btn-sm">Login</Link>
            <Link to="/register" className="btn btn-primary me-2 btn-sm">Register</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
