
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const ContactUs = () => {
  return (
    <div className="container mt-5 pt-4" style={{ maxWidth: '800px' }}>
      <h2 className="text-primary mb-4">Contact Us</h2>

      <div className="card shadow-sm p-4">
        <p className="mb-3"><strong>Email:</strong> support@dixitbank.com</p>
        <p className="mb-3"><strong>Phone:</strong> +91-9876543210</p>
        <p className="mb-3"><strong>Customer Support Hours:</strong> Mon–Sat, 9:00 AM – 6:00 PM</p>
        <p className="mb-3"><strong>Head Office:</strong> 123 Finance Street, Mumbai, India - 400001</p>
        
        <p className="mb-0"><strong>Follow Us:</strong>
          <span className="ms-2">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-decoration-none text-primary">Facebook</a> | 
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-decoration-none text-primary ms-2">Twitter</a> | 
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-decoration-none text-primary ms-2">LinkedIn</a>
          </span>
        </p>
      </div>
    </div>
  );
};

export default ContactUs;
