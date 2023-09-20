import LoginFormPage from "./pages/authentication/LoginFormPage";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import RegisterFormPage from "./pages/authentication/RegisterFormPage";
import instructionDirection from "./assets/direction.png";
import PasswordConfirmationPage from "./pages/notifcation/PasswordConfirmationPage";
import ClientHistoryPage from "./pages/dashboard/ClientHistoryPage";
import ClientProfilePage from "./pages/dashboard/ClientProfilePage";
import ClientHomePage from "./pages/dashboard/ClientHomePage";
import ResetPasswordByEmailPage from "./pages/authentication/ResetPasswordByEmailPage";
import ResetPasswordFromProfilePage from "./pages/authentication/ResetPasswordFromProfilePage";
import PrivateOutlet from "./routes/PrivateOutlet";
import { useEffect } from "react";
import EmployeeInformationPage from "./pages/information/EmployeeInformationPage";
import NotFoundPage from "./pages/error/ErrorPageForNonExistingURL";
import ErrorPageForNonExistingURL from "./pages/error/ErrorPageForNonExistingURL";
import ClientProfileLayoutV2 from "./components/profile/ClientProfileCompletionLayout";
import ClientProfileCompletionPage from "./pages/dashboard/ClientProfileCompletionPage";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LoginFormPage />} />
          <Route path="/login" element={<LoginFormPage />} />
          <Route path="/registration" element={<RegisterFormPage />} />

          <Route
            path="password-recovery"
            element={<ResetPasswordByEmailPage />}
          />
          <Route
            path="/password-recovery-confirmation"
            element={
              <PasswordConfirmationPage redirectLinkAfterPasswordConfirmation="/login" />
            }
          />

          <Route path="/*" element={<PrivateOutlet />}>
            <Route path="home" element={<ClientHomePage />} />

            <Route
              path="reset-password"
              element={<ResetPasswordFromProfilePage />}
            />

            <Route path="client-profile" element={<ClientProfilePage />} />
            <Route
              path="profile-completion"
              element={<ClientProfileCompletionPage />}
            />
            <Route
              path="employee-information"
              element={<EmployeeInformationPage />}
            />
            <Route path="client-history" element={<ClientHistoryPage />} />
            {/* <Route path="*" element={<ErrorPageForNonExistingURL />} /> */}
            <Route path="*" element={<ErrorPageForNonExistingURL />} />
          </Route>
          <Route path="*" element={<ErrorPageForNonExistingURL />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
