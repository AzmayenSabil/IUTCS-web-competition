import React, { useState, useEffect } from "react";
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
import { CheckCircleOutlined, LoadingOutlined } from "@ant-design/icons";

export default function BasicInformationLayout() {
  const [organizationMail, setOrganizationMail] = useState("");

  const [employeeID, setEmployeeID] = useState("");
  const [genderTemp, setGenderTemp] = useState("");
  const [nameTemp, setNameTemp] = useState("");
  const [profileData, setProfileData] = useState({});
  const [nameError, setNameError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
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
  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 36,
      }}
      spin
    />
  );
  const contentStyle = {
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

        setProfileData(data.data.userProfileData);
        setNameTemp(data.data.userProfileData.name);
        setGenderTemp(data.data.userProfileData.gender);
        setEmployeeID(data.data.userProfileData.employee_id);
        setOrganizationMail(data.data.userProfileData.email);
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

  const handleUpdateBasicInformation = async (e) => {
    setProfileCompletionProgressPercentage("");

    try {
      // setLoading(true);
      const accessToken = sessionStorage.getItem("accessToken");
      const user_id = sessionStorage.getItem("userData");

      const response = await axios.put(
        `${base_url}/api/v1/client/profile-completion/basic-information/${user_id}`,
        {
          name: nameTemp,
          gender: genderTemp,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const { data } = response;

      setProfileData((prevData) => {
        const newData = {
          name: nameTemp,
          gender: genderTemp,
        };

        if (
          prevData.name !== newData.name ||
          prevData.gender !== newData.gender
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
      console.error("Basic Information update error:", error);
      // Handle error state or display an error message
      setLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
  };

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
          //    <div style={{margin:"30px"}} >
          <div style={contentStyle}>
            <h4 className="text-muted mb-3" style={{ fontSize: "17px" }}>
              Basic Information
            </h4>
            <form className="row g-3" style={{ fontSize: "14px" }}>
              <div className="col-md-6">
                <label for="mail" className="form-label">
                  Organization Mail
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="mail"
                  value={organizationMail}
                  style={{ cursor: "not-allowed" }}
                  disabled
                />
              </div>
              <div className="col-md-6">
                <label for="name" className="form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={nameTemp}
                  onChange={(e) => {
                    setNameTemp(e.target.value);
                    setNameError("");
                  }}
                />
              </div>

              <div className="col-md-6">
                <label for="employee_id" className="form-label">
                  Employee ID
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="employee_id"
                  value={employeeID}
                  style={{ cursor: "not-allowed" }}
                  disabled
                />
              </div>
              <div className="col-md-6">
                <label for="gender" className="form-label">
                  Gender
                </label>
                <select
                  id="gender"
                  className="form-select"
                  value={genderTemp}
                  onChange={(e) => {
                    setGenderTemp(e.target.value);
                  }}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={handleUpdateBasicInformation}
                  class="text-gray-900 hover:text-white border border-gray-900 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-3 py-2.5 text-center mr-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-900"
                >
                  <i class="fa-solid fa-pen-to-square"></i> &nbsp; Update
                </button>
              </div>
            </form>
          </div>
          // </div>
        )}
      </>
      <FloatButton.BackTop tooltip="Move Up" />
    </>
  );
}
