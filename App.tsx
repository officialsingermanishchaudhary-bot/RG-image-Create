
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { AdminProvider } from './contexts/AdminContext';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import GeneratorPage from './pages/GeneratorPage';
import PricingPage from './pages/PricingPage';
import AuthPage from './pages/AuthPage';
import ProtectedRoute from './routing/ProtectedRoute';
import AdminRoute from './routing/AdminRoute';
import AdminLayout from './pages/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import UsersPage from './pages/admin/UsersPage';
import PlansPage from './pages/admin/PlansPage';
import RequestsPage from './pages/admin/RequestsPage';
import SettingsPage from './pages/admin/SettingsPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AdminProvider>
          <HashRouter>
            <div className="transition-colors duration-300">
              <div className="flex flex-col min-h-screen font-sans">
                <Routes>
                  <Route path="/*" element={<MainApp />} />
                  <Route 
                    path="/admin/*"
                    element={
                      <AdminRoute>
                        <AdminLayout>
                          <Routes>
                            <Route path="dashboard" element={<DashboardPage />} />
                            <Route path="users" element={<UsersPage />} />
                            <Route path="plans" element={<PlansPage />} />
                            <Route path="requests" element={<RequestsPage />} />
                            <Route path="settings" element={<SettingsPage />} />
                            <Route path="*" element={<Navigate to="dashboard" />} />
                          </Routes>
                        </AdminLayout>
                      </AdminRoute>
                    }
                  />
                </Routes>
              </div>
            </div>
          </HashRouter>
        </AdminProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

// Separate component for the main app layout to avoid rendering Header/Footer on admin pages
const MainApp = () => (
  <>
    <Header />
    <main className="flex-grow container mx-auto px-4 py-8">
       <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route 
            path="/generator" 
            element={
              <ProtectedRoute>
                <GeneratorPage />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    </main>
    <Footer />
  </>
);


export default App;