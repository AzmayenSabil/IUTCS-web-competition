import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import AuthFormHeadLine from "../authentication/common/AuthFormHeadLine";
import LoginFooterMessage from "../authentication/common/LoginFooterMessage";
import { NavLink } from "react-router-dom";
import { Button, Result } from "antd";

export default function PasswordConfirmationLayout({
  redirectLinkAfterPasswordConfirmation,
}) {
  const handleOkButtonClick = () => {
    // Set the passwordRecovered boolean to "yes" in sessionStorage
    sessionStorage.setItem("passwordRecovered", "yes");
  };

  return (
    <section className="h-100">
      <div className="container h-100">
        <div className="row justify-content-center align-items-center h-100">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
            <div className="card shadow" style={{ marginTop: "6rem" }}>
              <div className="card-body p-5">
                <AuthFormHeadLine headlineText="Portal" />

                <Result
                  status="success"
                  title="Password Recovery Confirmation!"
                  subTitle="A code has been sent to your registered Email"
                  extra={[
                    <NavLink to={redirectLinkAfterPasswordConfirmation}>
                      <Button
                        type="primary"
                        key="console"
                        style={{
                          backgroundColor: "rgb(0, 176, 240)",
                          width: "30%",
                        }}
                        onClick={handleOkButtonClick} // Add onClick event handler here
                      >
                        OK
                      </Button>
                    </NavLink>,
                  ]}
                />
              </div>
            </div>

            <LoginFooterMessage messageText="Powered by &copy; DreamOnline Ltd.  " />
          </div>
        </div>
      </div>
    </section>
  );
}
