import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios library
import AuthFormHeadLine from "../common/AuthFormHeadLine";
import LoginFooterMessage from "../common/LoginFooterMessage";
import ScreenLoaderLayout from "../../screenLoader/ScreenLoaderLayout";

export default function ResetPasswordLayoutByEmailLayout() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const base_url = process.env.REACT_APP_BASE_URL;

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

    //console.log(email);

    if (emailError === "") {
      setIsLoading(true);

      try {
        const response = await axios.post(
          `${base_url}/api/v1/admin/auth/password-recovery`,
          {
            email: email,
          }
        );

        setIsLoading(false);
        navigate("/password-recovery-confirmation"); // Navigate to the provided URL passed as prop
      } catch (error) {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      {isLoading && (
        <div className="overlay">
          <ScreenLoaderLayout screenLoaderText="Please wait..." />
        </div>
      )}
      <section className={`h-100 ${isLoading ? "d-none" : ""}`}>
        <div className="container h-100">
          <div className="row justify-content-center align-items-center h-100">
            <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
              <div className="card shadow" style={{ marginTop: "6rem" }}>
                <div className="card-body p-5">
                  <AuthFormHeadLine headlineText="Portal" />
                  <form
                    method="POST"
                    onSubmit={(e) => handleSubmit(e)} // Desired URL as a parameter
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
                          // maxWidth: "300px",
                          margin: "0 auto",
                          display: "block",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                        }}
                        type="submit"
                      >
                        Request Password
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              <LoginFooterMessage messageText="Powered by &copy; DreamOnline Ltd.  " />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
