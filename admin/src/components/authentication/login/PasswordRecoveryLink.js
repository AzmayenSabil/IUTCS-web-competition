import React from "react";
import { NavLink } from "react-router-dom";

export default function PasswordRecoveryLink({
  redirectLink,
  redirectionText,
}) {
  return (
    <div class="mb-1 w-100 mt-2" style={{ textAlign: "center" }}>
      <NavLink to={redirectLink} style={{ color: "rgb(0, 176, 240)" }}>
        {redirectionText}
      </NavLink>
    </div>
  );
}
