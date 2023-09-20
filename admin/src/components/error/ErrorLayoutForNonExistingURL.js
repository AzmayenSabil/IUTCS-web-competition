import React from "react";
import { Button, Result } from "antd";
import { NavLink } from "react-router-dom";

const ErrorLayoutForNonExistingURL = () => (
  <>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <Result
        status="404"
        title="Page Not Found"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <NavLink to="/admin/dashboard">
            <Button style={{ background: "rgb(0,176,240)", color: "white" }}>
              Back Home
            </Button>
          </NavLink>
        }
      />
    </div>
  </>
);
export default ErrorLayoutForNonExistingURL;
