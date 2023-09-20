import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import AuthFormHeadLine from "../common/AuthFormHeadLine";
import LoginFooterMessage from "../common/LoginFooterMessage";
import LoginFormFooter from "./LoginFormFooter";
import { NavLink, Navigate, useLocation, useNavigate } from "react-router-dom";
import PasswordRecoveryLink from "./PasswordRecoveryLink";
import { Modal } from "antd";
import axios from "axios";
import alertIcon from "../../../assets/alert.png";
import pendingUserIcon from "../../../assets/pendingUser.gif";
import "../../../styles/LoginFormStyle.css";
import ErrorPageForNonExistingURL from "../../../pages/error/ErrorPageForNonExistingURL";

var CryptoJS = require("crypto-js");

export default function LoginFormLayout() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState("");
  const location = useLocation();
  const base_url = process.env.REACT_APP_BASE_URL;
  const my_secret_key = process.env.REACT_APP_MY_SECRET_KEY;

  //remember-me
  useEffect(() => {
    const storedCredentials = localStorage.getItem("rememberedCredentials");

    if (
      (storedCredentials && location.pathname === "/login") ||
      (storedCredentials && location.pathname === "/")
    ) {
      const credentials = JSON.parse(storedCredentials);
      const { email, password, expirationDate } = credentials;

      if (expirationDate > Date.now()) {
        setEmail(email);

        try {
          var decryptedBytes = CryptoJS.AES.decrypt(password, my_secret_key);
          var decryptedPassword = JSON.parse(
            decryptedBytes.toString(CryptoJS.enc.Utf8)
          );
          setPassword(decryptedPassword);
        } catch (error) {
          console.error("Decryption error:", error);
        }
        handleSubmit({
          preventDefault: () => {
            setEmailError("");
          },
        });
      } else {
        //  remove from local storage after 1 month
        localStorage.removeItem("rememberedCredentials");
      }
    }
  }, [location.pathname, emailError]);

  const updateRememberedCredentials = (newEmail, newEncryptedPassword) => {
    if (
      rememberMe &&
      (location.pathname === "/login" || location.pathname === "/")
    ) {
      // expiration date 1 month from now
      const expirationDate = new Date();
      expirationDate.setMonth(expirationDate.getMonth() + 1);

      const credentials = {
        email: newEmail,
        password: newEncryptedPassword,
        expirationDate: expirationDate.getTime(),
      };

      localStorage.setItem(
        "rememberedCredentials",
        JSON.stringify(credentials)
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Email validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@dreamonline\.co\.jp$/;
    if (!emailPattern.test(email)) {
      setEmailError("Please provide your organization email");
      return;
    } else {
      setEmailError("");
    }

    // Password validation
    const passwordPattern = /^(?=.*[A-Z])(?=.*[0-9]).{6,}$/;

    if (emailError === "" && passwordError === "") {
      var encryptedPassword = CryptoJS.AES.encrypt(
        JSON.stringify(password),
        my_secret_key
      ).toString();

      // updateRememberedCredentials(email, password);
      updateRememberedCredentials(email, encryptedPassword);

      axios
        .post(`${base_url}/api/v1/client/auth/login`, {
          email,
          password: encryptedPassword,
        })
        .then((response) => {
          const { token, data, code, message } = response.data;
          const clientInfo = {
            auth: true,
          };

          sessionStorage.setItem("clientInfo", JSON.stringify(clientInfo));

          // Store the token and data in session storage
          sessionStorage.setItem("accessToken", token);
          sessionStorage.setItem("userData", JSON.stringify(data.user_id));

          // Redirect to the home page or any other protected route
          const passwordRecovered = sessionStorage.getItem("passwordRecovered");

          // If passwordRecovered is "yes", navigate to "/client-password", else navigate to "/home"
          if (passwordRecovered === "yes") {
            navigate("/reset-password");
            // Clear the value of passwordRecovered from sessionStorage since it's not needed anymore
            sessionStorage.removeItem("passwordRecovered");
          } else {
            navigate("/home");
          }
        })
        .catch((error) => {
          if (error.response.status === 401) {
            setModalVisible(true);
            setModalMessage("User Doesn't Exist");
          } else if (error.response.status === 400) {
            setModalVisible(true);
            setModalMessage("Wrong Email and Password Combination");
          } else if (error.response.status === 403) {
            setModalVisible(true);
            setModalMessage("Account Verification ");
          } else {
            console.error("Login failed:", error.response.data.error);
          }
        });
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
  };
  const handleModalClose = () => {
    setModalVisible(false);
  };

  return (
    <section className="h-100">
      <div className="container h-100">
        <div className="row justify-content-center align-items-center h-100">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
            <div className="card shadow" style={{ marginTop: "6rem" }}>
              <div className="card-body p-5">
                <AuthFormHeadLine headlineText="Portal" />
                <form
                  onSubmit={handleSubmit}
                  className="my-3"
                  autoComplete="off"
                >
                  <div className="mb-3">
                    <label className="mb-2 text-muted" htmlFor="email">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      className={`form-control ${
                        emailError ? "is-invalid" : ""
                      }`}
                      name="email"
                      value={email}
                      onChange={handleEmailChange}
                      required
                      autoFocus
                    />
                    {emailError && (
                      <div className="invalid-feedback">{emailError}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="text-muted" htmlFor="password">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      className="form-control "
                      name="password"
                      value={password}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>

                  <div className="mb-3  d-flex align-items-center justify-content-start">
                    <div className="form-check form-check-inline">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="rememberMe"
                        name="rememberMe"
                        style={{ cursor: "pointer" }}
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <label
                        className="form-check-label text-muted"
                        htmlFor="rememberMe"
                        style={{ cursor: "pointer" }}
                      >
                        Remember Me
                      </label>
                    </div>
                  </div>

                  <div className="d-grid gap-2">
                    <button
                      style={{
                        backgroundColor: "rgb(0, 176, 240)",
                        color: "white",
                        padding: "10px 20px",
                        fontSize: "16px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        width: "100%",
                        margin: "0 auto",
                        display: "block",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                      }}
                      type="submit"
                    >
                      Login
                    </button>
                  </div>
                </form>
                <PasswordRecoveryLink
                  redirectLink="/password-recovery"
                  redirectionText="Forgot Password?"
                />
              </div>
              <LoginFormFooter redirectLink="/registration" />
            </div>
            <LoginFooterMessage messageText="Powered by &copy; DreamOnline Ltd.  " />
          </div>
        </div>
      </div>
      <Modal
        open={modalVisible}
        onCancel={handleModalClose}
        footer={null}
        className="custom-modal "
      >
        <div className="modal-header d-flex align-items-center">
          <img src={alertIcon} alt="Alert Icon" className="modal-icon" />
          &nbsp;
          <h5 className="modal-title">&nbsp;{modalMessage}</h5>
          <div style={{ flex: 1 }}></div>
        </div>
        <div className="modal-body m-3">
          {modalMessage === "User Doesn't Exist" && (
            <p style={{ textAlign: "justify", lineHeight: "1.5" }}>
              The specified user does not exist. Use your valid mail and
              password.
            </p>
          )}
          {modalMessage === "Wrong Email and Password Combination" && (
            <p style={{ textAlign: "justify", lineHeight: "1.5" }}>
              Invalid email and password combination. Use your valid mail and
              password,
            </p>
          )}
          {modalMessage === "Account Verification " && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <p style={{ textAlign: "justify", lineHeight: "1.5", flex: 1 }}>
                Your account is pending approval or inactive ! Please wait for
                verification .
              </p>
              <img
                src={pendingUserIcon}
                alt=""
                style={{ alignSelf: "flex-end", marginTop: "20px" }}
              />
            </div>
          )}
        </div>
        {modalMessage !== "Account Verification " && (
          <div className="modal-footer d-flex justify-content-end">
            <button
              style={{
                backgroundColor: "rgb(0, 176, 240)",
                color: "white",
                padding: "5px 10px",
                fontSize: "16px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",

                display: "block",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
              }}
              onClick={handleModalClose}
            >
              Try Again!
            </button>
          </div>
        )}
      </Modal>
    </section>
  );
}
