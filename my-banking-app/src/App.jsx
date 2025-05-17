import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';
import UserRegister from "./Pages/UserRegister";

import AdminRegister from "./Pages/AdminRegister";
import UserDashboard from "./Pages/UserDashboard";
import UpdateProfile from "./Pages/UpdateProfile";
import AdminDashboard from "./Pages/AdminDashboard";
import UnifiedLogin from "./Pages/UnifiedLogin";
import ForgotPassword from "./Pages/ForgotPassword";
import AddBeneficiary from "./Pages/AddBeneficiary";
import LandingPage from "./Pages/LandingPage";
import ViewProfile from "./Pages/ViewProfile";
import ListBeneficiary from "./Pages/ListBeneficiary";
import TransferMoney from "./Pages/TransferMoney";
import ViewTransactions from "./Pages/ViewTransactios";
import AdminViewCustomers from "./Pages/AdminViewCustomers";
import AdminViewTransactions from "./Pages/AdminViewTransactions";
import ContactUs from "./Pages/ContactUs";
import PrivacyPolicy from "./Pages/PrivacyPolicy";

function App() {
  return (
    <Router>
      <div className="container mt-5">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<UnifiedLogin />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />


          {/* <Route path="/login" element={<LoginPage />} /> */}
          <Route path="/register" element={<UserRegister />} />

          <Route path="/adminreg" element={<AdminRegister />} />
          {/* <Route path="/adminlog" element={<AdminLogin />} /> */}

          <Route path="/updateprofile" element={<UpdateProfile />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/admdash" element={<AdminDashboard />} />

          <Route path="/beni" element={<AddBeneficiary />} />
          <Route path="/benilist" element={<ListBeneficiary />} />
          <Route path="/transfer" element={<TransferMoney />} />
          <Route path="/transactions" element={<ViewTransactions />} />
          <Route path="/viewprofile" element={<ViewProfile />} />
          
          <Route path="/adminview" element={<AdminViewCustomers />} />
          <Route path="/adviewTrans" element={<AdminViewTransactions />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          


        </Routes>
      </div>
    </Router>
  );
}

export default App;
