import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import alertIcon from "../../../assets/alert.png";
import { CheckCircleOutlined } from "@ant-design/icons";

import { Modal, Button } from "antd";
import adminProfileImage from "../../../assets/adminProfileImage.png";
import { debounce } from "lodash";
// import { Modal } from "react-bootstrap";
import ResetPasswordLoaderLayout from "../../screenLoader/ResetPasswordLoaderLayout";

var CryptoJS = require("crypto-js");

export default function ResetPasswordLayoutFromAdminProfile() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitFlag, setSubmitFlag] = useState(false);
  const [profileData, setProfileData] = useState();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [oldPasswordError, setOldPasswordError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const base_url = process.env.REACT_APP_BASE_URL;
  const my_secret_key = process.env.REACT_APP_MY_SECRET_KEY;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const accessToken = sessionStorage.getItem("token");
        const clientInfo = JSON.parse(sessionStorage.getItem("clientInfo"));

        const response = await axios.get(
          `${base_url}/api/v1/admin/admins/getAdmin/${clientInfo.user_id}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        const { data } = response;
        //console.log(data.data);
        setProfileData(data.data);
        //console.log(profileData);

        setTimeout(() => {
          setLoading(false);
        }, 1500);
      } catch (error) {
        console.error(error);
        // Handle error state or display an error message
        setLoading(false);
      }
    };

    const debouncedFetchData = debounce(fetchData, 500); // Adjust the debounce delay as needed
    debouncedFetchData();
    return () => {
      // Cancel the debounced function when the component unmounts
      debouncedFetchData.cancel();
    };
  }, []);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    // CheckAuth()

    e.preventDefault();
    setSubmitFlag(true);

    // Password validation
    const passwordPattern = /^(?=.*[A-Z])(?=.*[0-9]).{6,15}$/;

    if (!passwordPattern.test(newPassword)) {
      setPasswordError(
        "Password must contain at least 6 characters, including at least one uppercase letter and one numeric digit, and must not exceed 15 characters"
      );
      return;
    } else {
      setPasswordError("");
    }

    // Matching passwords validation
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    } else {
      setConfirmPasswordError("");
    }

    //same password error
    if (newPassword === oldPassword) {
      setPasswordError(
        "Your new password should not match the old password. Try with a different one."
      );
      return;
    } else {
      setPasswordError("");
    }

    setIsLoading(true); // Show loader

    setTimeout(() => {
      setIsLoading(false); // Hide loader
      if (formIsValid()) {
        const accessToken = sessionStorage.getItem("token");
        const id = JSON.parse(sessionStorage.getItem("clientInfo")).user_id;

        var encryptedOldPassword = CryptoJS.AES.encrypt(
          JSON.stringify(oldPassword),
          my_secret_key
          // process.env.REACT_APP_MY_SECRET_KEY
        ).toString();
        var encryptedNewPassword = CryptoJS.AES.encrypt(
          JSON.stringify(newPassword),
          my_secret_key
          // process.env.REACT_APP_MY_SECRET_KEY
        ).toString();

        axios
          .put(
            `${base_url}/api/v1/admin/auth/reset-password/${id}`,
            {
              oldPassword: encryptedOldPassword,
              newPassword: encryptedNewPassword,
            },
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          )
          .then((response) => {
            // Handle successful response
            // console.log(response.data.code);

            setShowSuccessModal(true);

            setTimeout(() => {
              navigate("/admin/profile");
            }, 2000);
          })

          .catch((error) => {
            // Handle error
            if (error.response && error.response.status === 401) {
              const errorMessage =
                "Invalid old password ! Please provide your correct old password.";
              console.error("Unauthorized:", errorMessage);
              setOldPasswordError("Try with the correct old password");
              setModalMessage(errorMessage);
              setShowModal(true);
            } else {
              console.error("Error:", error);
            }
          });
      }
    }, 3000);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };
  const formIsValid = () => {
    return (
      newPassword.length > 0 &&
      confirmPassword.length > 0 &&
      !passwordError &&
      !confirmPasswordError
    );
  };

  return (
    <>
      {loading ? (
        <div className="overlay">
          <ResetPasswordLoaderLayout screenLoaderText="Please wait..." />
        </div>
      ) : (
        <div className="container" style={{ marginTop: "40px" }}>
          <div
            className="card mb-3"
            style={{ maxWidth: "540px", border: "none" }}
          >
            <div className="row g-0">
              <div className="col-md-4">
                <img
                  src={adminProfileImage}
                  className="img-fluid rounded-start"
                  style={{ height: "150px" }}
                  alt="clientProfileImage"
                />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  {profileData && (
                    <>
                      <h5 className="card-title">{profileData.name}</h5>
                    </>
                  )}
                  {profileData && (
                    <>
                      <small className="text-muted">
                        Admin ID : {profileData.admin_id}
                      </small>
                    </>
                  )}
                  <br />
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div className="profileInformation " style={{ marginTop: "40px" }}>
            <form onSubmit={handleSubmit}>
              <div className="row mb-7 mb-3">
                <label
                  htmlFor="oldPassword"
                  className="col-sm-2 col-form-label"
                >
                  Old Password
                </label>
                <div className="col-sm-5">
                  <input
                    type="password"
                    className={`form-control ${
                      (submitFlag && !oldPassword) || oldPasswordError
                        ? "is-invalid"
                        : ""
                    }`}
                    id="oldPassword"
                    name="oldPassword"
                    required
                    value={oldPassword}
                    onChange={(e) => {
                      setOldPassword(e.target.value);
                      setOldPasswordError("");
                    }}
                  />
                  {submitFlag && !oldPassword && (
                    <div className="invalid-feedback">
                      Old Password is required
                    </div>
                  )}
                  {oldPasswordError && (
                    <div className="invalid-feedback">
                      <p>{oldPasswordError}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="row mb-7 mb-3">
                <label
                  htmlFor="newPassword"
                  className="col-sm-2 col-form-label"
                >
                  New Password
                </label>
                <div className="col-sm-5">
                  <input
                    type="password"
                    className={`form-control ${
                      (submitFlag && !newPassword) || passwordError
                        ? "is-invalid"
                        : ""
                    }`}
                    id="newPassword"
                    name="newPassword"
                    required
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setPasswordError("");
                    }}
                  />
                  {submitFlag && !newPassword && (
                    <div className="invalid-feedback">
                      New Password is required
                    </div>
                  )}
                  {passwordError && (
                    <div className="invalid-feedback">{passwordError}</div>
                  )}
                </div>
              </div>
              <div className="row mb-7">
                <label
                  htmlFor="confirmPassword"
                  className="col-sm-2 col-form-label"
                >
                  Retype Password
                </label>
                <div className="col-sm-5">
                  <input
                    type="password"
                    className={`form-control ${
                      (submitFlag && !confirmPassword) || confirmPasswordError
                        ? "is-invalid"
                        : ""
                    }`}
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setConfirmPasswordError("");
                    }}
                  />
                  {submitFlag && !confirmPassword && (
                    <div className="invalid-feedback">
                      Confirm Password is required
                    </div>
                  )}
                  {confirmPasswordError && (
                    <div className="invalid-feedback">
                      {confirmPasswordError}
                    </div>
                  )}
                </div>
              </div>
              <NavLink to="/admin/profile">
                <button
                  type="primary"
                  className="mt-3"
                  style={{
                    background: "#F05252",
                    color: "white",
                    height: "50px",
                    width: "140px",
                    border: "none",
                    borderRadius: "10px",
                    marginRight: "12px",
                  }}
                >
                  <i className="fa-solid fa-arrow-left"></i>&nbsp; Go Back
                </button>
              </NavLink>
              <button
                type="submit"
                style={{
                  background: "#3F83F8",
                  color: "white",
                  height: "50px",
                  width: "150px",
                  border: "none",
                  borderRadius: "10px",
                  marginRight: "12px",
                }}
                disabled={isLoading || !formIsValid()}
              >
                {isLoading ? (
                  <>
                    <span className="mr-2">Loading...</span>
                    <i className="fa fa-spinner fa-spin"></i>
                  </>
                ) : (
                  <>
                    <i className="fa fa-refresh" aria-hidden="true"></i>&nbsp;
                    Confirm Reset
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
      {/* modal for invalid password */}
      <div
        className={`modal fade ${showModal ? "show" : ""}`}
        style={{ display: showModal ? "block" : "none" }}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden={!showModal}
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title d-flex" id="exampleModalCenterTitle">
                <img src={alertIcon} alt="Alert Icon" className="modal-icon" />
                &nbsp; Password Update Failed !
              </h5>
            </div>
            <div className="modal-body">
              <p>{modalMessage}</p>
            </div>

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
                onClick={closeModal}
              >
                Try Again !
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <CheckCircleOutlined
              style={{
                fontSize: "20px",
                marginRight: "10px",
                color: "#52c41a",
              }}
            />
            <span>Password Update Successful</span>
          </div>
        }
        open={showSuccessModal}
        cancelButtonProps={{ style: { display: "none" } }}
        okButtonProps={{ style: { display: "none" } }}
        footer={null}
        closable={false}
      >
        <p>
          {" "}
          Your password has been successfully reset. Please use the new password
          to log in for future access.
        </p>
      </Modal>
    </>
  );
}
