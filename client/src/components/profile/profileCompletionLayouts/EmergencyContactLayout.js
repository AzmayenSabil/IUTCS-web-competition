import React, { useEffect, useState } from "react";
import axios from "axios";
import { debounce } from "lodash";
import EmployeeProfileInformationLoaderLayout from "../../screenLoader/EmployeeProfileInformationLoaderLayout";
import {
  Modal as AntDModal,
  Button,
  FloatButton,
  Progress,
  Spin,
  theme,
} from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { ExclamationCircleOutlined, LoadingOutlined } from "@ant-design/icons";
var CryptoJS = require("crypto-js");

export default function EmergencyContactLayout() {
  const [emergencyContactOne, setEmergencyContactOne] = useState("");
  const [emergencyContactTwo, setEmergencyContactTwo] = useState("");

  const [emergencyContactOneTemp, setEmergencyContactOneTemp] = useState("");
  const [emergencyContactTwoTemp, setEmergencyContactTwoTemp] = useState("");
  const [emergencyContactData, setEmergencyContactData] = useState({
    emergency_contact_one: "", // Initialize with default value
    emergency_contact_two: "", // Initialize with default value
  });
  const [emergencyContactOneError, setEmergencyContactOneError] = useState("");
  const [emergencyContactTwoError, setEmergencyContactTwoError] = useState("");
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
  const [progress, setProgress] = useState("");
  const [prevProgress, setPrevProgress] = useState("");

  const { token } = theme.useToken();
  const base_url = process.env.REACT_APP_BASE_URL;
  const secret_key = process.env.REACT_APP_MY_SECRET_KEY;

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

        if (data.dataForEmergencyContacts) {
          if (data.dataForEmergencyContacts.emergency_contact_one) {
            var bytes = CryptoJS.AES.decrypt(
              data.dataForEmergencyContacts.emergency_contact_one,
              `${secret_key}`
            );
            var decryptedEmergencyContactOne = JSON.parse(
              bytes.toString(CryptoJS.enc.Utf8)
            );
          }
          if (data.dataForEmergencyContacts.emergency_contact_two) {
            var bytes = CryptoJS.AES.decrypt(
              data.dataForEmergencyContacts.emergency_contact_two,
              `${secret_key}`
            );
            var decryptedEmergencyContactTwo = JSON.parse(
              bytes.toString(CryptoJS.enc.Utf8)
            );
          }

          setEmergencyContactData(data.dataForEmergencyContacts);
          setEmergencyContactOneTemp(decryptedEmergencyContactOne);
          setEmergencyContactTwoTemp(decryptedEmergencyContactTwo);
        }
        setProfileCompletionProgressPercentageTemp(
          data.profileCompletionProgressPercentage
        );
        setProgress(profileCompletionProgressPercentageTemp);

        setTimeout(() => {
          setLoading(false);
        }, 600);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }, 200);

    const debouncedFetchData = debounce(fetchData, 200); // Adjust the debounce delay as needed
    debouncedFetchData();
    return () => {
      debouncedFetchData.cancel();
    };
  }, [profileCompletionProgressPercentageTemp]);

  const handleUpdateEmergencyContactInformation = async (e) => {
    setProfileCompletionProgressPercentage("");

    if (validateForm()) {
      setEmergencyContactOne("");
      setEmergencyContactTwo("");

      var encryptedEmergencyContactOne = "";
      var encryptedEmergencyContactTwo = "";

      if (emergencyContactOneTemp) {
        encryptedEmergencyContactOne = CryptoJS.AES.encrypt(
          JSON.stringify(emergencyContactOneTemp),
          `${secret_key}`
        ).toString();
      }

      if (emergencyContactTwoTemp) {
        encryptedEmergencyContactTwo = CryptoJS.AES.encrypt(
          JSON.stringify(emergencyContactTwoTemp),
          `${secret_key}`
        ).toString();
      }

      try {
        // setLoading(true);
        const accessToken = sessionStorage.getItem("accessToken");
        const user_id = sessionStorage.getItem("userData");

        const response = await axios.put(
          `${base_url}/api/v1/client/profile-completion/emergency-contact-information/${user_id}`,
          {
            emergency_contact_one: encryptedEmergencyContactOne,
            emergency_contact_two: encryptedEmergencyContactTwo,
          },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        const { data } = response;

        setEmergencyContactData((prevData) => {
          const newData = {
            emergencyContactOne: emergencyContactOneTemp,
            emergencyContactTwo: emergencyContactTwoTemp,
          };

          if (
            prevData.emergencyContactOne !== newData.emergencyContactOne ||
            prevData.emergencyContactTwo !== newData.emergencyContactTwo
          ) {
            setTimeout(() => {
              setShowSuccessModal(true);
            }, 1000);
          }

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
        // setLoading(false);
      }
    }
  };

  const validateForm = () => {
    let isValid = true;

    if (
      emergencyContactOneTemp &&
      emergencyContactOneTemp.toString().length !== 0
    ) {
      if (emergencyContactOneTemp.toString().length !== 11) {
        setEmergencyContactOneError("Contact must be exactly 11 digits");
        isValid = false;
      } else {
        setEmergencyContactOneError("");
      }
    } else {
      setEmergencyContactOneError("");
    }

    if (
      emergencyContactTwoTemp &&
      emergencyContactTwoTemp.toString().length !== 0
    ) {
      if (emergencyContactTwoTemp.toString().length !== 11) {
        setEmergencyContactTwoError("Contact must be exactly 11 digits");
        isValid = false;
      } else {
        setEmergencyContactTwoError("");
      }
    } else {
      setEmergencyContactTwoError("");
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
          <div style={contentStyle}>
            <h4 className="text-muted mb-3" style={{ fontSize: "17px" }}>
              Emergency Contacts
            </h4>
            <form className="row g-3 " style={{ fontSize: "14px" }}>
              <div className="col-md-6">
                <label for="emergency_contact_one" className="form-label">
                  Contact No.1
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={emergencyContactOneTemp}
                  onChange={(e) => {
                    setEmergencyContactOneTemp(e.target.value);
                    setEmergencyContactOneError("");
                  }}
                  id="emergency_contact_one"
                />
                {emergencyContactOneError && (
                  <div className="text-danger" style={{ fontSize: "12px" }}>
                    {emergencyContactOneError}
                  </div>
                )}
              </div>
              <div className="col-md-6">
                <label for="emergency_contact_two" className="form-label">
                  Contact No.2
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={emergencyContactTwoTemp}
                  onChange={(e) => {
                    setEmergencyContactTwoTemp(e.target.value);
                    setEmergencyContactTwoError("");
                  }}
                  id="emergency_contact_two"
                />
                {emergencyContactTwoError && (
                  <div className="text-danger" style={{ fontSize: "12px" }}>
                    {emergencyContactTwoError}
                  </div>
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={handleUpdateEmergencyContactInformation}
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
