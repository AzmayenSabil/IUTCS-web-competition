import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import AuthFormHeadLine from "../common/AuthFormHeadLine";
import LoginFooterMessage from "../common/LoginFooterMessage";
import { NavLink, Navigate, useNavigate } from "react-router-dom";
import LoginFormFooter from "./LoginFormFooter";
import PasswordRecoveryLink from "./PasswordRecoveryLink";
import axios from "axios";
import { Modal } from "antd";
import bcrypt from "bcryptjs";
import alertIcon from "../../../assets/alert.png";

var CryptoJS = require("crypto-js");
const salt = bcrypt.genSaltSync(10);

export default function LoginFormLayout() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // const { setAuth, auth } = UseAuth();

  const base_url = process.env.REACT_APP_BASE_URL;
  const my_secret_key = process.env.REACT_APP_MY_SECRET_KEY;

  // const { setAuth, auth } = UseAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Email validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@dreamonline\.co\.jp$/;
    if (!emailPattern.test(email)) {
      setEmailError("Please provide your organization email");
      return;
    } else {
      setEmailError("");
    }

    if (emailError === "" && passwordError === "") {
      var encryptedPassword = CryptoJS.AES.encrypt(
        JSON.stringify(password),
        my_secret_key
      ).toString();

      //console.log(encryptedPassword);
      try {
        const response = await axios.post(
          `${base_url}/api/v1/admin/auth/login`,
          {
            email,
            password: encryptedPassword,
          }
        );

        const auth = true;

        // Assuming the API returns a token or authentication status
        const { data } = response.data;
        //console.log(data);

        const clientInfo = {
          auth: true,
          user_id: data.user_id,
        };

        sessionStorage.setItem("clientInfo", JSON.stringify(clientInfo));

        // Store the token or authentication status in localStorage
        sessionStorage.setItem("data", data.email);
        sessionStorage.setItem("token", data.token);

        navigate("/admin/dashboard");
      } catch (error) {
        // console.log(error)
        if (error.response.status === 401) {
          setModalVisible(true);
          setModalMessage("Admin Doesn't Exist");
        } else if (error.response.status === 400) {
          setModalVisible(true);
          setModalMessage("Wrong Email and Password Combination");
        } else if (error.response.status === 403) {
          setModalVisible(true);
          setModalMessage(
            "You are in inactive list. Please, contact super admin."
          );
        } else {
          console.error("Login failed:", error.response.data.error);
        }
      }
    }
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
                      onChange={(e) => setEmail(e.target.value)}
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
                      className={`form-control ${
                        passwordError ? "is-invalid" : ""
                      }`}
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    {passwordError && (
                      <div className="invalid-feedback">{passwordError}</div>
                    )}
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
              {/* <LoginFormFooter redirectLink="/registration" /> */}
            </div>
            <LoginFooterMessage messageText="Powered by &copy; DreamOnline Ltd.  " />
          </div>
        </div>
      </div>

      {/* login error modal */}
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
              The specified admin does not exist. Use your valid mail and
              password.
            </p>
          )}
          {modalMessage === "Wrong Email and Password Combination" && (
            <p style={{ textAlign: "justify", lineHeight: "1.5" }}>
              Invalid email and password combination. Use your valid mail and
              password,
            </p>
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
