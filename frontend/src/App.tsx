// src/App.tsx

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

import AdminDashboard from './components/admin/AdminDashboard';
import AdminLogin from './components/admin/AdminLogin';
import ProtectedRoute from './components/common/ProtectedRoute';

import PilgrimPortal from './components/pilgrim/PilgrimPortal';
import PilgrimLogin from './components/pilgrim/PilgrimLogin';
import PilgrimRegister from './components/pilgrim/PilgrimRegister';

import PilgrimHome from './components/pilgrim/PilgrimHome';
import BookDarshan from './components/pilgrim/BookDarshan';
import MyYatraPlan from './components/pilgrim/MyYatraPlan';
import TempleMap from './components/pilgrim/TempleMap';

import LandingPage from './components/common/LandingPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Pilgrim Authentication */}
          <Route path="/pilgrim/login" element={<PilgrimLogin />} />
          <Route path="/pilgrim/register" element={<PilgrimRegister />} />

          {/* Pilgrim Portal with nested routes */}
          <Route path="/pilgrim" element={<PilgrimPortal />}>
            <Route index element={<PilgrimHome />} />              {/* Default /pilgrim */}
            <Route path="home" element={<PilgrimHome />} />
            <Route path="book-darshan" element={<BookDarshan />} />
            <Route path="my-yatra" element={<MyYatraPlan />} />
            <Route path="map" element={<TempleMap />} />
            <Route path="*" element={<PilgrimHome />} />            {/* Fallback */}
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
