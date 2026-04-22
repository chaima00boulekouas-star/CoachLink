import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import MainLayout from './components/MainLayout';

// ── Public pages (use MainLayout with Navbar + Footer) ──
import Home from './pages/Home';
import JoinCoachLink from './pages/JoinCoachLink';
import LoginRoleSelection from './pages/LoginRoleSelection';
import AthleteLogin from './pages/AthleteLogin';
import TrainerLogin from './pages/TrainerLogin';
import AthleteSignUp from './pages/AthleteSignUp';
import TrainerSignUp from './pages/TrainerSignUp';
import ForgotPassword from './pages/ForgotPassword';

// ── Dashboard pages (use DashboardLayout with Sidebar + Topbar) ──
import TrainerDashboard from './pages/TrainerDashboard';
import TrainerProfile from './pages/TrainerProfile';
import MyStore from './pages/MyStore';
import TrainingProgramDetail from './pages/TrainingProgramDetail';
import MyTrainerRequests from './pages/MyTrainerRequests';
import AthletesPage from './pages/AthletesPage';
import SessionsPage from './pages/SessionsPage';
import FavoritesPage from './pages/FavoritesPage';
import NotificationsPage from './pages/NotificationsPage';
import SettingsPage from './pages/SettingsPage';
import AddProductPage from './pages/AddProductPage';
import SearchPage from './pages/SearchPage';
import AthleteDashboard from './pages/AthleteDashboard';
import CoachesPage from './pages/CoachesPage';
import AthleteProfile from './pages/AthleteProfile';
import CoachProfile from './pages/CoachProfile';
import AthleteHome from './pages/AthleteHome';
import AthleteNotificationsPage from './pages/AthleteNotificationsPage';
import AthleteSettings from './pages/AthleteSettings';
import AthleteStorePage from './pages/AthleteStorePage';
import AthleteProfilePage from './pages/AthleteProfilePage';
import AthleteSessionsPage from './pages/AthleteSessionsPage';
import CartPage from './pages/CartPage';
// ── Admin module ──
import AdminGuard from './components/AdminGuard';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTrainers from './pages/admin/AdminTrainers';
import AdminAthletes from './pages/admin/AdminAthletes';
import AdminReports from './pages/admin/AdminReports';
import AdminFeedback from './pages/admin/AdminFeedback';
import AdminProducts from './pages/admin/AdminProducts';

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Router>
          <Routes>
            {/* ── Public Routes ── */}
            <Route
              path="/"
              element={
                <MainLayout>
                  <Home />
                </MainLayout>
              }
            />
            <Route
              path="/join"
              element={
                <MainLayout>
                  <JoinCoachLink />
                </MainLayout>
              }
            />
            <Route
              path="/login"
              element={
                <MainLayout>
                  <LoginRoleSelection />
                </MainLayout>
              }
            />
            <Route
              path="/login/athlete"
              element={
                <MainLayout>
                  <AthleteLogin />
                </MainLayout>
              }
            />
            <Route
              path="/login/trainer"
              element={
                <MainLayout>
                  <TrainerLogin />
                </MainLayout>
              }
            />
            <Route
              path="/signup/athlete"
              element={
                <MainLayout>
                  <AthleteSignUp />
                </MainLayout>
              }
            />
            <Route
              path="/signup/trainer"
              element={
                <MainLayout>
                  <TrainerSignUp />
                </MainLayout>
              }
            />
            <Route
              path="/login/admin"
              element={<AdminLoginPage />}
            />
            <Route
              path="/forgot-password"
              element={
                <MainLayout>
                  <ForgotPassword />
                </MainLayout>
              }
            />

            {/* ── Dashboard Routes (authenticated) ── */}
            {/* Dashboard pages use their own DashboardLayout internally */}
            <Route path="/dashboard" element={<TrainerDashboard />} />
            <Route path="/athlete/dashboard" element={<AthleteDashboard />} />
            <Route path="/athlete/home" element={<AthleteHome />} />
            <Route path="/athlete/notifications" element={<AthleteNotificationsPage />} />
            <Route path="/athlete/settings" element={<AthleteSettings />} />
            <Route path="/athlete/store" element={<AthleteStorePage />} />
            <Route path="/athlete/profile" element={<AthleteProfilePage />} />
            <Route path="/athlete/profile/edit" element={<AthleteProfile />} />
            <Route path="/athlete/sessions" element={<AthleteSessionsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/coaches" element={<CoachesPage />} />
            <Route path="/trainer/:id" element={<CoachProfile />} />
            <Route path="/profile/me" element={<TrainerProfile />} />
            <Route path="/store" element={<MyStore />} />
            <Route path="/store/product/:id" element={<TrainingProgramDetail />} />
            <Route path="/store/product/:id/edit" element={<AddProductPage />} />
            <Route path="/store/new-product" element={<AddProductPage />} />
            <Route path="/programs/new" element={<AddProductPage />} />
            <Route path="/requests" element={<MyTrainerRequests />} />
            <Route path="/athletes" element={<AthletesPage />} />
            <Route path="/sessions" element={<SessionsPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/orders" element={<TrainerDashboard />} />

            {/* ── Admin Routes (role-protected) ── */}
            <Route path="/admin/dashboard" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
            <Route path="/admin/trainers"  element={<AdminGuard><AdminTrainers  /></AdminGuard>} />
            <Route path="/admin/athletes"  element={<AdminGuard><AdminAthletes  /></AdminGuard>} />
            <Route path="/admin/reports"   element={<AdminGuard><AdminReports   /></AdminGuard>} />
            <Route path="/admin/feedback"  element={<AdminGuard><AdminFeedback  /></AdminGuard>} />
            <Route path="/admin/products"  element={<AdminGuard><AdminProducts  /></AdminGuard>} />

            {/* ── Fallback ── */}
            <Route
              path="*"
              element={
                <MainLayout>
                  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                    <h1 className="text-6xl font-black text-slate-900 dark:text-white mb-4">404</h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400 mb-8">Page not found</p>
                    <a href="/" className="bg-primary-blue text-white font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity">
                      Go Home
                    </a>
                  </div>
                </MainLayout>
              }
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
