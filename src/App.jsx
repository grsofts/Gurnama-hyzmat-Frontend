import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/AppLayout';

// import { useAuth } from './auth/useAuth'


//pages
import Login from './auth/Login';
import Banners from './pages/banners/Banners';
import Services from './pages/services/Services';
import Certificates from './pages/certifikat/Certificates';
import Users from './pages/users/Users';
import Partners from './pages/partners/Partners';
import Projects from './pages/projects/Projects';
import Settings from './pages/settings/Setting';

import ProtectedRoute from './auth/ProtectedRoute';

function App() {
  
  return (
     <Routes>
      {/* PUBLIC */}
      <Route path="/login" element={<Login />} />

      {/* PROTECTED */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/banners" replace />} />
        <Route path="banners" element={<Banners />} />
        <Route path="services" element={<Services />} />
        <Route path="certificates" element={<Certificates />} />
        <Route path="users" element={<Users />} />
        <Route path="partners" element={<Partners />} />
        <Route path="projects" element={<Projects />} />
        <Route path="others" element={<Settings />} />
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
