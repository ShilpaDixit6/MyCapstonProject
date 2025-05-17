import React from "react";
import { Link } from "react-router-dom";
import "../Css/LandingPage.css"; // Import CSS for styling
import Navbar from "../Components/Navbar";  // ✅ Import Navbar
import Footer from "../Components/Footer";  // ✅ Import Footer

const LandingPage = () => {
    return (
        <div className="landing-container">
            <Navbar className="small-navbar" />  {/* ✅ Navbar with reduced height */}
            <header className="landing-header">
                <h1>Welcome to Dixit Bank</h1>
                <p>Your trusted partner for secure and seamless banking.</p>
            </header>
            <Footer />  {/* ✅ Footer at the Bottom */}
        </div>
    );
};

export default LandingPage;
