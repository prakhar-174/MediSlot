import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Auth from './pages/Auth';
import ProtectedRoute from './components/ProtectedRoute';
import PatientDashboard from './pages/PatientDashboard';
import FindDoctors from './pages/FindDoctors';
import PatientProfile from './pages/PatientProfile';
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorRequests from './pages/DoctorRequests';
import DoctorSchedule from './pages/DoctorSchedule';
import DoctorSlots from './pages/DoctorSlots';
import { ToastProvider } from './components/Toast';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  // Scroll restoration fix for history
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  return (
    <ToastProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="login" element={<Auth />} />
            <Route path="signup" element={<Auth />} />
          </Route>
          <Route element={<ProtectedRoute allowedRole="patient" />}>
            <Route path="/dashboard/patient" element={<PatientDashboard />} />
            <Route path="/dashboard/patient/find-doctors" element={<FindDoctors />} />
            <Route path="/dashboard/patient/profile" element={<PatientProfile />} />
          </Route>
          <Route element={<ProtectedRoute allowedRole="doctor" />}>
            <Route path="/dashboard/doctor" element={<DoctorDashboard />} />
            <Route path="/dashboard/doctor/requests" element={<DoctorRequests />} />
            <Route path="/dashboard/doctor/schedule" element={<DoctorSchedule />} />
            <Route path="/dashboard/doctor/slots" element={<DoctorSlots />} />
          </Route>
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
