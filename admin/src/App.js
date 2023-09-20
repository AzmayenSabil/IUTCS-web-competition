import LoginFormPage from "./pages/authentication/LoginFormPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminDashboard from "./pages/dashboard/AdminDashboard";

import ProfilePage from "./pages/profile/ProfilePage";
import RegistrationPage from "./pages/authentication/RegisterFormPage";
import PasswordConfirmationPage from "./pages/notifcation/PasswordConfirmationPage";
import ResetPasswordByEmailPage from "./pages/authentication/ResetPasswordByEmailPage";
import UsersPage from "./pages/users/UsersPage";
import PackagesPage from "./pages/package/PackagesPage";
import MenuPage from "./pages/menu/MenusPage";
import PastMenuPage from "./pages/pastMenu/PastMenuPage";
import SettingsPage from "./pages/settings/SettingsPage";
import PrivateOutlet from "./routes/PrivateOutlet";
import ResetPasswordFromAdminProfilePage from "./pages/authentication/ResetPasswordFromAdminProfilePage";
import AdminPage from "./pages/admins/AdminPage";
import HolidayPage from "./pages/holiday/HolidayPage"
import ErrorPageForNonExistingURL from "./pages/error/ErrorPageForNonExistingURL";

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* User Pages */}
          <Route path="/" element={<LoginFormPage />} />
          <Route path="/login" element={<LoginFormPage />} />

          {/* Routes under PrivateOutlet */}
          <Route path="/admin/*" element={<PrivateOutlet />}>
            <Route path="profile" element={<ProfilePage />} />
            <Route
              path="reset-password"
              element={<ResetPasswordFromAdminProfilePage />}
            />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="packages" element={<PackagesPage />} />
            <Route path="menus" element={<MenuPage />} />
            <Route path="pastmenus" element={<PastMenuPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="admins" element={<AdminPage />} />
            <Route path="holidays" element={<HolidayPage />} />
            <Route path="*" element={<ErrorPageForNonExistingURL />} />
          </Route>

          {/* Other Routes */}
          <Route path="/registration" element={<RegistrationPage />} />
          <Route
            path="/password-recovery"
            element={<ResetPasswordByEmailPage />}
          />
          <Route
            path="/password-recovery-confirmation"
            element={
              <PasswordConfirmationPage redirectLinkAfterPasswordConfirmation="/login" />
            }
          />
          <Route path="*" element={<ErrorPageForNonExistingURL />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
