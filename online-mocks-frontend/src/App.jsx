import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage2';
import HRLogin from './components/HRLogin';
import VolunteerLogin from './components/VolunteerLogin';
import VolunteerDashboard from './components/VolunteerDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import HRDashboard from './components/HRDashboard';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import HRFeedback from './components/HRFeedback';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/hr-login" element={<HRLogin />} />
        <Route path="/volunteer-login" element={<VolunteerLogin />} />
        <Route 
          path="/volunteer-dashboard" 
          element={
            // <ProtectedRoute>
              <VolunteerDashboard />
            // </ProtectedRoute>
          } 
        />
        <Route path="/hr-dashboard" element={<HRDashboard />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route 
          path="/admin-dashboard" 
          element={
            // <ProtectedRoute adminRoute={true}>
              <AdminDashboard />
            // </ProtectedRoute>
          } 
        />
        <Route path="/hr-feedback" element={<HRFeedback />} />
      </Routes>
    </Router>
  );
}

export default App;