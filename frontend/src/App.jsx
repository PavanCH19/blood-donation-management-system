import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home"
import DonarRegistration from "./components/donarRegistration";
import BloodBankRegistration from "./components/bloodbankRegistration";
import ResetPassword from "./components/resetPassword";
import BloodRequest from "./components/bloodRequest"
import Login from "./components/login";
import UserDashboard from "./components/userDashBoard";
import Certificate from "./components/certificate";
import Admin from "./components/admin/adminDashboard";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/blood-donation-management-system" />} />
        <Route path="/blood-donation-management-system" element={<Home />} />
        <Route path="blood-donation-management-system/donar-registration" element={<DonarRegistration />} />
        <Route path="blood-donation-management-system/bloodbank-registration" element={<BloodBankRegistration />} />
        <Route path="blood-donation-management-system/login" element={<Login />} />
        <Route path="blood-donation-management-system/login/reset-password" element={<ResetPassword />} />
        <Route path="blood-donation-management-system/blood-request" element={<BloodRequest />} />
        <Route path="blood-donation-management-system/user-dashboard" element={<UserDashboard />} />
        <Route path="blood-donation-management-system/admin-dashboard" element={<Admin />} />
        <Route path="blood-donation-management-system/certificates" element={<Certificate />} />
      </Routes>
    </Router>
  );
}

export default App;
