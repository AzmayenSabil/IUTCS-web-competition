import React, { useState, useEffect } from "react";
import axios from "axios";
import { debounce } from "lodash";
import { Button, FloatButton, Form, Input, Progress, Spin, theme } from "antd";
import { Modal as AntDModal } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import EmployeeProfileInformationLoaderLayout from "../../screenLoader/EmployeeProfileInformationLoaderLayout";
import { ExclamationCircleOutlined, LoadingOutlined } from "@ant-design/icons";
var CryptoJS = require("crypto-js");

export default function GeneralInformationLayout() {
  const [profileData, setProfileData] = useState({});
  const [designation, setDesignation] = useState("");
  const [department, setDepartment] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [type, setType] = useState("");
  const [nameInNID, setNameInNID] = useState("");
  const [nameInNIDTemp, setNameInNIDTemp] = useState("");
  const [religion, setReligion] = useState("");
  const [religionTemp, setReligionTemp] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [bloodGroupTemp, setBloodGroupTemp] = useState("");
  const [personalEmail, setPersonalEmail] = useState("");
  const [personalEmailTemp, setPersonalEmailTemp] = useState("");
  const [contact, setContact] = useState("");
  const [contactTemp, setContactTemp] = useState("");
  const [nameInNIDError, setNameInNIDError] = useState("");
  const [religionError, setReligionError] = useState("");
  const [bloodGroupError, setBloodGroupError] = useState("");
  const [personalEmailError, setPersonalEmailError] = useState("");
  const [contactError, setContactError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showWarningModal, setWarningModal] = useState(false);
  const [
    profileCompletionProgressPercentage,
    setProfileCompletionProgressPercentage,
  ] = useState();
  const [
    profileCompletionProgressPercentageTemp,
    setProfileCompletionProgressPercentageTemp,
  ] = useState("");
  const [prevProgress, setPrevProgress] = useState("");
  const [progress, setProgress] = useState("");
  const base_url = process.env.REACT_APP_BASE_URL;
  const secret_key = process.env.REACT_APP_MY_SECRET_KEY;

  const { token } = theme.useToken();
  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 36,
      }}
      spin
    />
  );
  const contentStyle = {
    // lineHeight: '260px',
    // textAlign: 'center',
    // color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `2px dashed ${token.colorBorder}`,
    marginTop: 25,
    padding: "12px",
  };

  useEffect(() => {
    const fetchData = debounce(async () => {
      try {
        setLoading(true);
        const accessToken = sessionStorage.getItem("accessToken");
        const user_id = sessionStorage.getItem("userData");

        const response = await axios.get(
          `${base_url}/api/v1/client/client-profile/${user_id}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        const { data } = response;

        setPrevProgress(data.profileCompletionProgressPercentage);

        if (data.data.userProfileData.name_in_nid) {
          var bytes = CryptoJS.AES.decrypt(
            data.data.userProfileData.name_in_nid,
            `${secret_key}`
          );
          var decryptedNameInNID = JSON.parse(
            bytes.toString(CryptoJS.enc.Utf8)
          );
        }

        setDesignation(data.data.userProfileData.designation);
        setDepartment(data.data.userProfileData.department);
        setJoiningDate(data.data.userProfileData.joining_date);
        setType(data.data.userProfileData.type);

        setBloodGroupTemp(data.data.userProfileData.blood_group);
        setContactTemp(data.data.userProfileData.contact);
        setPersonalEmailTemp(data.data.userProfileData.personal_email);
        setNameInNIDTemp(decryptedNameInNID);
        setReligionTemp(data.data.userProfileData.religion);
        setProfileCompletionProgressPercentageTemp(
          data.profileCompletionProgressPercentage
        );
        setProgress(profileCompletionProgressPercentageTemp);

        setTimeout(() => {
          setLoading(false);
        }, 600);
      } catch (error) {
        console.error(error);
        // Handle error state or display an error message
        setLoading(false);
      }
    }, 200);

    const debouncedFetchData = debounce(fetchData, 200); // Adjust the debounce delay as needed
    debouncedFetchData();
    return () => {
      debouncedFetchData.cancel();
    };
  }, [profileCompletionProgressPercentageTemp]);

  const handleUpdateGeneralInformation = async (e) => {
    // console.log(nameInNIDTemp)
    setProfileCompletionProgressPercentage("");

    if (validateForm()) {
      setContact("");
      setNameInNID("");
      setPersonalEmail("");
      setReligion("");
      setBloodGroup("");

      var encryptedNameInNID = "";
      // console.log(typeof nameInNIDTemp, nameInNIDTemp, encryptedNameInNID)
      if (nameInNIDTemp || nameInNIDTemp !== "") {
        encryptedNameInNID = CryptoJS.AES.encrypt(
          JSON.stringify(nameInNIDTemp),
          `${secret_key}`
        ).toString();
      }
      // console.log(encryptedNameInNID)

      try {
        // setLoading(true);
        const accessToken = sessionStorage.getItem("accessToken");
        const user_id = sessionStorage.getItem("userData");

        const response = await axios.put(
          `${base_url}/api/v1/client/profile-completion/general-information/${user_id}`,
          {
            name_in_nid: encryptedNameInNID,
            religion: religionTemp,
            blood_group: bloodGroupTemp,
            personal_email: personalEmailTemp,
            contact: contactTemp,
          },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        const { data } = response;
        // console.log(data);

        setProfileData((prevData) => {
          const newData = {
            nameInNID: nameInNIDTemp,
            religion: religionTemp,
            bloodGroup: bloodGroupTemp,
            personalEmail: personalEmailTemp,
            contact: contactTemp,
          };

          if (
            prevData.nameInNID !== newData.nameInNID ||
            prevData.religion !== newData.religion ||
            prevData.bloodGroup !== newData.bloodGroup ||
            prevData.personalEmail !== newData.personalEmail ||
            prevData.contact !== newData.contact
          ) {
            setTimeout(() => {
              setShowSuccessModal(true);
            }, 1000);
          }
          // else if (
          //     prevData.nameInNID === newData.nameInNID ||
          //     prevData.religion === newData.religion ||
          //     prevData.bloodGroup === newData.bloodGroup ||
          //     prevData.personalEmail === newData.personalEmail ||
          //     prevData.contact === newData.contact) {
          //     setWarningModal(true)
          // }

          return {
            ...prevData,
            ...newData,
          };
        });

        setProfileCompletionProgressPercentageTemp(
          data.profileCompletionProgressPercentage
        );

        // setTimeout(() => {
        //     setLoading(false);
        // }, 1200);
      } catch (error) {
        console.error("General Information update error:", error);
        // Handle error state or display an error message
        setLoading(false);
      }
    }
  };

  const validateForm = () => {
    let isValid = true;

    if (nameInNIDTemp) {
      if (!/^[A-Za-z\s]+$/.test(nameInNIDTemp)) {
        setNameInNIDError("NID Name must only contain letters and spaces");
        isValid = false;
      } else {
        setNameInNIDError("");
      }
    }

    if (
      contactTemp &&
      (contactTemp.toString().length !== 11 ||
        contactTemp.toString().charAt(0) === "-")
    ) {
      setContactError("Contact must contain exactly 11 digits");
      isValid = false;
    } else {
      setContactError("");
    }

    if (personalEmailTemp) {
      if (!personalEmailTemp.includes("@")) {
        setPersonalEmailError("Personal Email must contain the '@' character");
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(personalEmailTemp)) {
        setPersonalEmailError("Invalid email format");
        isValid = false;
      } else {
        setPersonalEmailError("");
      }
    } else {
      setPersonalEmailError("");
    }

    return isValid;
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
  };
  // const handleWarningModal = () => {
  //     setWarningModal(false);
  // };

  return (
    <>
      <>
        {profileCompletionProgressPercentageTemp === undefined ||
          profileCompletionProgressPercentage === undefined ? (
          <Progress
            percent={prevProgress}
            status="active"
            strokeColor={{
              from: "#87CEFA",
              to: "#1E90FF",
            }}
            style={{ marginBottom: "30px", marginTop: "20px" }}
          />
        ) : (
          <Progress
            percent={profileCompletionProgressPercentageTemp}
            status="active"
            strokeColor={{
              from: "#87CEFA",
              to: "#1E90FF",
            }}
            style={{ marginBottom: "30px", marginTop: "20px" }}
          />
        )}
      </>

      <>
        {!loading && (
          <AntDModal
            title={
              <div style={{ display: "flex", alignItems: "center" }}>
                <CheckCircleOutlined
                  style={{
                    fontSize: "20px",
                    marginRight: "10px",
                    color: "#52c41a",
                  }}
                />
                <span>Update Successful!</span>
              </div>
            }
            open={showSuccessModal}
            footer={null}
            closable={false}
            style={{ top: 20 }}
          >
            <p>
              &nbsp;&nbsp;&nbsp; Your Changes has been updated successfully.{" "}
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "15px",
              }}
            >
              <Button
                style={{ background: "rgb(0,176,240)", color: "white" }}
                onClick={handleSuccessModalClose}
              >
                OK
              </Button>
            </div>
          </AntDModal>
        )}
      </>

      <>
        {loading ? (
          <div className="overlay">
            <EmployeeProfileInformationLoaderLayout screenLoaderText="Loading Data..." />
          </div>
        ) : (
          // <div style={{ margin: "30px" }}>
          <div style={contentStyle}>
            <h4 className="text-muted mb-3" style={{ fontSize: "17px" }}>
              General Information
            </h4>
            <form className="row g-3">
              <div className="col-md-6" style={{ fontSize: "14px" }}>
                <label for="nid_name" className="form-label">
                  NID Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={nameInNIDTemp}
                  onChange={(e) => {
                    setNameInNIDTemp(e.target.value);
                    setNameInNIDError("");
                  }}
                  id="nid_name"
                />
                {nameInNIDError && (
                  <div className="text-danger" style={{ fontSize: "12px" }}>
                    {nameInNIDError}
                  </div>
                )}
              </div>
              <div className="col-md-3">
                <label for="religion" className="form-label">
                  Religion
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={religionTemp}
                  onChange={(e) => {
                    setReligionTemp(e.target.value);
                    setReligionError("");
                  }}
                  id="religion"
                />
              </div>
              <div className="col-md-3">
                <label for="blood_group" className="form-label">
                  Blood Group
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={bloodGroupTemp}
                  onChange={(e) => {
                    setBloodGroupTemp(e.target.value);
                    setBloodGroupError("");
                  }}
                  id="blood_group"
                />
              </div>
              <div className="col-md-4">
                <label for="personal_email" className="form-label">
                  Personal Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  value={personalEmailTemp}
                  onChange={(e) => {
                    setPersonalEmailTemp(e.target.value);
                    setPersonalEmailError("");
                  }}
                  id="personal_email"
                />
                {personalEmailError && (
                  <div className="text-danger" style={{ fontSize: "12px" }}>
                    {personalEmailError}
                  </div>
                )}
              </div>
              <div className="col-md-4">
                <label for="normal_contact" className="form-label">
                  Contact No
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={contactTemp}
                  onChange={(e) => {
                    setContactTemp(e.target.value);
                    setContactError("");
                  }}
                  id="normal_contact"
                />
                {contactError && (
                  <div className="text-danger" style={{ fontSize: "12px" }}>
                    {contactError}
                  </div>
                )}
              </div>
              <div className="col-md-4">
                <label for="joining_date" className="form-label">
                  Joining Date
                </label>
                {joiningDate ? (
                  <input
                    type="text"
                    className="form-control"
                    id="joining_date"
                    value={joiningDate}
                    style={{ cursor: "not-allowed" }}
                    disabled
                  />
                ) : (
                  <input
                    type="text"
                    className="form-control"
                    id="joining_date"
                    value="* Admin will update it soon"
                    style={{ cursor: "not-allowed", fontWeight: "lighter" }}
                    disabled
                  />
                )}

              </div>
              <div className="col-md-4">
                <label for="designation" className="form-label">
                  Designation
                </label>
                {designation ? (
                  <input
                    type="text"
                    className="form-control"
                    id="designation"
                    value={designation}
                    style={{ cursor: "not-allowed" }}
                    disabled
                  />
                ) : (
                  <input
                    type="text"
                    className="form-control"
                    id="designation"
                    value="* Admin will update it soon"
                    style={{ cursor: "not-allowed", fontWeight: "lighter" }}
                    disabled
                  />)}

              </div>
              <div className="col-md-5">
                <label for="department" className="form-label">
                  Department
                </label>
                {department ? (
                  <input
                    type="text"
                    className="form-control"
                    id="department"
                    value={department}
                    style={{ cursor: "not-allowed" }}
                    disabled
                  />
                ) : (
                  <input
                    type="text"
                    className="form-control"
                    id="department"
                    value="* Admin will update it soon"
                    style={{ cursor: "not-allowed", fontWeight: "lighter" }}
                    disabled
                  />
                )}

              </div>
              <div className="col-md-3">
                <label for="type " className="form-label">
                  Type
                </label>
                {type ? (
                  <input
                    type="text"
                    className="form-control"
                    id="type"
                    value={type}
                    style={{ cursor: "not-allowed" }}
                    disabled
                  />
                ) : (
                  <input
                    type="text"
                    className="form-control"
                    id="type"
                    value="* Admin will update it soon"
                    style={{ cursor: "not-allowed", fontWeight: "lighter" }}
                    disabled
                  />
                )}

              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={handleUpdateGeneralInformation}
                  class="text-gray-900 hover:text-white border border-gray-900 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-3 py-2.5 text-center mr-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-900"
                >
                  <i class="fa-solid fa-pen-to-square"></i> &nbsp; Update
                </button>
              </div>
            </form>
          </div>
        )}
      </>
      <FloatButton.BackTop tooltip="Move Up" />
    </>
  );
}
