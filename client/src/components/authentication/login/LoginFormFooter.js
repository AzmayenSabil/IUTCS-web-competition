import React from "react";
import { NavLink } from "react-router-dom";

export default function LoginFormFooter({ redirectLink }) {
  return (
    <div className="card-footer py-3 border-0">
      <div className="text-center">
        Don't have an account?{" "}
        <NavLink to={redirectLink} style={{ color: "rgb(0, 176, 240)" }}>
          Create an account
        </NavLink>
      </div>
    </div>
  );
}
