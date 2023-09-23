import React, { useEffect, useState } from "react";

const Form = () => {
  const [formResponse, setFormResponse] = useState(null);

  useEffect(() => {
    const receiveMessage = (event) => {
      if (event.origin !== "https://docs.google.com") return;
      if (event.data.type === "form-response") {
        console.log("Form Response Received:", event.data.response);
        setFormResponse(event.data.response);
      }
    };

    window.addEventListener("message", receiveMessage);

    return () => {
      window.removeEventListener("message", receiveMessage);
    };
  }, []);

  useEffect(() => {
    // Send form data to Google Apps Script when the component mounts
    const name = "Azmayen Sabil "; // Replace with the actual form field values.
    const email = "azmayensabil@gmail.com";

    const formData = {
      name: name,
      email: email,
    };

    // Replace 'YOUR_DEPLOYED_WEB_APP_URL' with the actual URL of your deployed Google Apps Script web app.
    fetch(
      "https://script.google.com/macros/s/AKfycbx43J2HAekdM0y1jQt13MZA0loewsRN__cFkG1EAfsAVpuGe1hT7Li9tlyBYUMFAtg/exec",
      {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.text())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <div>
      <h2>Competition Registration</h2>
      {formResponse ? (
        <div>
          <p>Form Response Received:</p>
          <pre>{JSON.stringify(formResponse, null, 2)}</pre>
        </div>
      ) : (
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSffnklaqSJqpR3vW16YOjZvHYnvusA_rzPaRpVc-gCj63mF0g/viewform?embedded=true"
          width="640"
          height="509"
          frameBorder="0"
          marginHeight="0"
          marginWidth="0"
        >
          Loading…
        </iframe>
      )}
    </div>
  );
};

export default Form;
