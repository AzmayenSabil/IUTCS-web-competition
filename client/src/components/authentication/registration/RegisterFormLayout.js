import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import AuthFormHeadLine from "../common/AuthFormHeadLine";
import RegisterFooterMessage from "../common/RegisterFooterMessage";
import RegisterFormFooter from "./RegisterFormFooter";
import { NavLink, Navigate, useNavigate } from "react-router-dom";
import { Modal } from "antd";
import axios from "axios";
import alertIcon from "../../../assets/alert.png";
import registrationSuccessIcon from "../../../assets/registrationSuccess.png";
import redirectionPageLoader from "../../../assets/successLoader3.gif";

var CryptoJS = require("crypto-js");

export default function RegisterFormLayout() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [gender, setGender] = useState("male");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [employeeIdError, setEmployeeIdError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [selectedGender, setSelectedGender] = useState("");
  const [genderWarning, setGenderWarning] = useState("");
  const navigate = useNavigate();
  const base_url = process.env.REACT_APP_BASE_URL;
  const my_secret_key = process.env.REACT_APP_MY_SECRET_KEY;

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

    // Employee ID validation
    const employeeIdPattern = /^\d{5}$/;
    const specialCharactersPattern = /[^\d]/;

    if (
      employeeId.toString().length !== 5 ||
      specialCharactersPattern.test(employeeId)
    ) {
      setEmployeeIdError("Provide your valid employee ID");
      return;
    } else {
      setEmployeeIdError("");
    }

    if (!selectedGender) {
      setGenderWarning("Please choose your gender");
      return;
    } else {
      setGenderWarning("");
    }
    // Password validation
    // const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[A-Za-z\d]{6,}$/;
    const passwordPattern = /^(?=.*[A-Z])(?=.*[0-9]).{6,15}$/;

    if (!passwordPattern.test(password)) {
      setPasswordError(
        "Password must contain at least 6 characters, including at least one uppercase letter and one numeric digit, and must not exceed 15 characters"
      );
      return;
    } else {
      setPasswordError("");
    }
    // Matching passwords validation
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    } else {
      setConfirmPasswordError("");
    }

    if (
      emailError === "" &&
      passwordError === "" &&
      employeeIdError === "" &&
      confirmPasswordError === ""
    ) {
      var encryptedPassword = CryptoJS.AES.encrypt(
        JSON.stringify(password),
        my_secret_key
      ).toString();

      axios
        .post(`${base_url}/api/v1/client/auth/registration`, {
          name: name,
          employee_id: employeeId,
          email: email,
          active: "pending",
          gender: gender,
          password: encryptedPassword,
        })
        .then((response) => {
          if (
            response.data.code === 200 &&
            response.data.message === "User registered successfully"
          ) {
            setModalVisible(true);
            setModalMessage("Registration successful !");
            setRegistrationSuccess(true);

            setTimeout(() => {
              setModalVisible(false);
              navigate("/login");
            }, 3000);
          } else if (response.status === 409) {
            setModalVisible(true);
            setModalMessage("User already exists");
          }
        })
        .catch((error) => {
          setModalVisible(true);
          setModalMessage("User already exists");
          console.log(error);
        });
    }
  };
  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const handleEmployeeIdChange = (e) => {
    setEmployeeId(e.target.value);
    setEmployeeIdError("");
  };
  const handleGenderChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedGender(selectedValue);
    setGenderWarning("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setConfirmPasswordError("");
  };
  const handleModalClose = () => {
    setModalVisible(false);
  };
  return (
    <section className="h-100">
      <div className="container h-100">
        <div className="row justify-content-center align-items-center h-100">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
            <div
              className="card shadow"
              style={{ marginTop: "3rem", minHeight: "400px" }}
            >
              <div className="card-body p-5">
                <AuthFormHeadLine headlineText="Portal" />
                <form
                  method=""
                  className="my-4"
                  autoComplete="off"
                  onSubmit={handleSubmit}
                >
                  <div className="mb-3">
                    <label className="mb-2 text-muted" htmlFor="name">
                      Full name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={handleNameChange}
                      className="form-control"
                      name="name"
                      autoFocus
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="mb-2 text-muted" htmlFor="gender">
                      Gender
                    </label>
                    <select
                      className={`form-select ${
                        genderWarning ? "is-invalid" : ""
                      }`}
                      value={selectedGender}
                      onChange={handleGenderChange}
                    >
                      <option value="">Select your gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                    {genderWarning && (
                      <div className="invalid-feedback">{genderWarning}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="mb-2 text-muted" htmlFor="employeeid">
                      Employee ID
                    </label>
                    <input
                      id="employeeId"
                      type="number"
                      className={`form-control ${
                        employeeIdError ? "is-invalid" : ""
                      }`}
                      name="employeeId"
                      required
                      value={employeeId}
                      onChange={handleEmployeeIdChange}
                    />
                    {employeeIdError && (
                      <div className="invalid-feedback">{employeeIdError}</div>
                    )}
                  </div>
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
                      onChange={handlePasswordChange}
                      required
                    />
                    {passwordError && (
                      <div className="invalid-feedback">{passwordError}</div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="text-muted" htmlFor="retyped_password">
                      Retype Password
                    </label>
                    <input
                      id="retyped_password"
                      type="password"
                      className={`form-control ${
                        confirmPasswordError ? "is-invalid" : ""
                      }`}
                      name="confirmPassword"
                      required
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                    />
                    {confirmPasswordError && (
                      <div className="invalid-feedback">
                        {confirmPasswordError}
                      </div>
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
                      Register
                    </button>
                  </div>
                </form>
              </div>
              <RegisterFormFooter redirectLink="/login" />
            </div>
          </div>
        </div>
      </div>
      <RegisterFooterMessage messageText="Powered by &copy; DreamOnline Ltd.  " />
      <Modal
        open={modalVisible}
        onCancel={handleModalClose}
        footer={null}
        className="custom-modal "
      >
        <div className="modal-header d-flex align-items-center">
          {modalMessage === "Wrong Email and Password Combination" ||
          modalMessage === "User already exists" ? (
            <img src={alertIcon} alt="Alert Icon" className="modal-icon" />
          ) : (
            <img
              src={registrationSuccessIcon}
              alt="Success Icon"
              className="modal-icon"
            />
          )}
          <h5 className="modal-title">&nbsp;{modalMessage}</h5>
          <div style={{ flex: 1 }}></div>
        </div>

        <div className="modal-body m-3">
          {modalMessage === "User already exists" && (
            <>
              <p style={{ textAlign: "justify", lineHeight: "1.5" }}>
                The specified user already exist. Please use different
                credentials.
              </p>
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
            </>
          )}
          {modalMessage === "Wrong Email and Password Combination" && (
            <>
              <p style={{ textAlign: "justify", lineHeight: "1.5" }}>
                Invalid email and password combination. Use your valid mail and
                password,
              </p>

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
            </>
          )}
          {modalMessage === "Registration successful !" && (
            <>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <p
                  style={{
                    textAlign: "center",
                    lineHeight: "1.6",
                    marginRight: "10px",
                  }}
                >
                  Redirecting to the login page! Please wait for a moment.
                </p>
                <img
                  src={redirectionPageLoader}
                  alt="Redirection Page Loader"
                  style={{ alignSelf: "flex-end", marginTop: "15px" }}
                />
              </div>
            </>
          )}
        </div>
      </Modal>
    </section>
  );
}
