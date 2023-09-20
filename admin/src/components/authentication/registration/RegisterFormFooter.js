import React from "react";
import { NavLink } from "react-router-dom";

export default function RegisterFormFooter({ redirectLink }) {
  return (
    <div
      className="card-footer py-1  border-0 text-center"
      style={{ height: "3rem" }}
    >
      Already have an account?{" "}
      <NavLink to={redirectLink} style={{ color: "rgb(0, 176, 240)" }}>
        Login
      </NavLink>
    </div>
  );
}
