import { BrowserRouter, Routes, Route } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { AuthGuard } from './components/auth/AuthGuard';

// Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { ProfilePage } from './pages/ProfilePage';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile/:username" element={<ProfilePage />} />
            <Route path="/dashboard" element={
              <AuthGuard>
                <DashboardPage />
              </AuthGuard>
            } />
            <Route path="/admin" element={
              <AuthGuard requiredRole="admin">
                <AdminDashboard />
              </AuthGuard>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
