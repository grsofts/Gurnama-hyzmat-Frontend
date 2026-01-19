import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/AppLayout';

// import { useAuth } from './auth/useAuth'


//pages
import Login from './auth/Login';
import Banners from './pages/banners/Banners';
import Services from './pages/services/Services';
import Certificates from './pages/certifikat/Certificates';
import Users from './pages/users/Users';

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
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
