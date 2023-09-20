import React from "react";

export default function AuthFormHeadLine({ headlineText }) {
  return (
    <div className="text-center " style={{ marginTop: "0.5rem" }}>
      <h3
        style={{
          fontSize: "2.2rem", // Adjust the font size for smaller screens
          fontWeight: "lighter",
          color: "rgb(0, 176, 240)",
        }}
      >
        {headlineText}
      </h3>
    </div>
  );
}
