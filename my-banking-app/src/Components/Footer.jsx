import React from "react";
import "../Css/Footer.css"; // Import CSS for styling

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>&copy; {new Date().getFullYear()} Dixit Bank. All rights reserved.</p>
                <ul className="footer-links">
                    <li><a href="/privacy">Privacy Policy</a></li>
                    
                    <li><a href="/contactus">Contact Us</a></li>
                </ul>
                
            </div>
        </footer>
    );
};

export default Footer;
