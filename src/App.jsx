import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { useEffect } from 'react'
import AppLayout from './components/AppLayout';

// import signalRService from './api/signalRService'
// import { useAuth } from './auth/useAuth'


//pages
import Login from './auth/Login';
import Banners from './pages/banners/Banners';
// import OrderDetail from './pages/orders/OrderDetail';
// import Dashboard from './pages/dashboard/Dashboard';
// import Returns from './pages/returns/Returns';
// import Payments from './pages/payments/Payments';
import Users from './pages/users/Users';

import ProtectedRoute from './auth/ProtectedRoute';

function App() {
  // const { token } = useAuth()

  // useEffect(() => {
  //   if (token) {
  //     signalRService.start(token)
  //   }

  //   return () => {
  //     signalRService.stop()
  //   }
  // }, [token])
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
        <Route path="users" element={<Users />} />
        {/* <Route path="orders/:id" element={<OrderDetail />} /> */}
        {/* <Route path="payments" element={<Payments />} /> */}
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
