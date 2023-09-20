import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import { Button, Result } from "antd";
import { NavLink, Navigate, useNavigate } from "react-router-dom";
import AuthFormHeadLine from "../common/AuthFormHeadLine";
import LoginFooterMessage from "../common/LoginFooterMessage";
import EmailSendingScreenLoaderLayout from "../../screenLoader/EmailSendingScreenLoaderLayout";
import axios from "axios";
import emailNotFoundErrorIcon from "../../../assets/errorEmailNotFoundIcon.gif";
export default function ResetPasswordLayoutByEmailLayout() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorOccurred, setErrorOccurred] = useState(false);
  const navigate = useNavigate();
  const base_url = process.env.REACT_APP_BASE_URL;

  const handleSubmit = async (e, url) => {
    e.preventDefault();

    // Email validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@dreamonline\.co\.jp$/;
    if (!emailPattern.test(email)) {
      setEmailError("Please provide your organization email");
      return;
    } else {
      setEmailError("");
    }

    if (emailError === "") {
      setIsLoading(true);

      try {
        const response = await axios.post(
          `${base_url}/api/v1/client/auth/password-recovery`,
          {
            to: email,
          }
        );

        setTimeout(() => {
          setIsLoading(false);
          navigate(url); // Navigate to the provided URL passed as prop
        }, 3000);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        setErrorOccurred(true);
      }
    }
  };

  return (
    <>
      {isLoading && (
        <div className="overlay">
          <EmailSendingScreenLoaderLayout screenLoaderText="Please wait..." />
        </div>
      )}
      {errorOccurred ? (
        <Result
          status="warning"
          title="404: Email Not Found"
          // icon={emailNotFoundErrorIcon}
          subTitle="Sorry, something went wrong. Please check if your provided email is valid or not."
          extra={
            <>
              <NavLink to="/login">
                <Button type="primary" style={{ background: "#4096FF" }}>
                  Go Back
                </Button>
              </NavLink>
              <img src={emailNotFoundErrorIcon} />
            </>
          }
        />
      ) : (
        <section className={`h-100 ${isLoading ? "d-none" : ""}`}>
          <div className="container h-100">
            <div className="row justify-content-center align-items-center h-100">
              <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
                <div className="card shadow" style={{ marginTop: "6rem" }}>
                  <div className="card-body p-5">
                    <AuthFormHeadLine headlineText="Portal" />
                    <form
                      method="POST"
                      onSubmit={(e) =>
                        handleSubmit(e, "/password-recovery-confirmation")
                      }
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
      )}
    </>
  );
}
