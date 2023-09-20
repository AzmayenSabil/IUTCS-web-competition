import React from "react";
import "../../../styles/LoginFooterMessageStyle.css";

export default function LoginFooterMessage({ messageText }) {
  return <div className="login-footer-message">{messageText}</div>;
}
