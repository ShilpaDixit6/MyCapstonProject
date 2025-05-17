import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const PrivacyPolicy = () => {
    
  return (
    <div className="container mt-5 pt-4" style={{ maxWidth: '900px' }}>
      <h2 className="text-primary mb-4">Privacy Policy</h2>

      <p><strong>Last Updated:</strong> May 15, 2025</p>

      <p>
        At <strong>Dixit Bank</strong>, your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information.
      </p>

      <h5 className="mt-4">1. Information We Collect</h5>
      <ul>
        <li>Personal details such as name, email, phone, and address</li>
        <li>Bank account details, transaction history</li>
        <li>Device and browser information</li>
      </ul>

      <h5 className="mt-4">2. How We Use Your Information</h5>
      <ul>
        <li>To provide banking services and process transactions</li>
        <li>To improve user experience and security</li>
        <li>To comply with legal obligations</li>
      </ul>

      <h5 className="mt-4">3. Data Protection</h5>
      <p>
        We use industry-standard encryption and security protocols to protect your data.
      </p>

      <h5 className="mt-4">4. Third-Party Disclosure</h5>
      <p>
        We do not share your personal data with third parties except as required by law or with trusted service providers bound by confidentiality.
      </p>

      <h5 className="mt-4">5. Your Rights</h5>
      <p>
        You have the right to access, correct, or delete your personal data by contacting our support team at <a href="mailto:support@dixitbank.com">support@dixitbank.com</a>.
      </p>

      <h5 className="mt-4">6. Updates</h5>
      <p>
        We may update this policy from time to time. Changes will be posted on this page with a revised date.
      </p>

      <p className="mt-4">If you have questions about our Privacy Policy, please contact us at <strong>support@dixitbank.com</strong>.</p>

    </div>
  );
};

export default PrivacyPolicy;
