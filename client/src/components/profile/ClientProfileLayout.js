import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import CheckAuth from "../authentication/common/hooks/CheckAuth";
import axios from "axios";
import { debounce } from "lodash";
import { Modal as AntDModal, Button, Progress, FloatButton, Badge } from "antd";
import ProfileLoaderLayout from "../screenLoader/ProfileLoaderLayout";
import "../../styles/ClientProfileStyle.css";

var CryptoJS = require("crypto-js");

export default function ClientProfileLayout() {
  const [loading, setLoading] = useState(true);
  const base_url = process.env.REACT_APP_BASE_URL;
  const secret_key = process.env.REACT_APP_MY_SECRET_KEY;

  const [
    profileCompletionPercentage,
    setProfileCompletionProgressPercentageTemp,
  ] = useState("");
  const [employeeUserId, setEmployeeUserId] = useState("");
  const [employeeID, setEmployeeID] = useState("");
  const [employeeName, setEmployeename] = useState("");
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [employeeImage, setEmployeeImage] = useState("");
  const [employeeReligion, setEmployeeReligion] = useState("");
  const [employeeContact, setEmployeeContact] = useState("");
  const [employeeType, setEmployeeType] = useState("");
  const [employeeDesignation, setEmployeeDesignation] = useState("");
  const [emplyeeDepartment, setEmployeeDepartment] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [employeeJoiningDate, setEmployeeJoiningDate] = useState("");
  const [employeeNIDName, setEmployeeNIDName] = useState("");
  const [employeeNIDNumber, setEmployeeNIDNumber] = useState("");
  const [employeeBankAccountNumber, setEmployeeBankAccountNumber] =
    useState("");
  const [employeeBankAccountName, setEmployeeBankAccountName] = useState("");
  const [employeeETIN, setEmployeeETIN] = useState("");
  const [employeeETINName, setEmployeeETINName] = useState("");
  const [employeePresentAddress, setEmployeePresentAddress] = useState("");
  const [employeePermanentAddress, setEmployeePermanentAddress] = useState("");
  const [employeeEmergencyContactOne, setEmployeeEmergencyContactOne] =
    useState("");
  const [employeeEmergencyContactTwo, setEmployeeEmergencyContactTwo] =
    useState("");
  const notUpdatedText = "Not Updated Yet";

  CheckAuth();

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
        // console.log(data)

        if (data.data.userProfileData.name_in_nid) {
          var bytes = CryptoJS.AES.decrypt(
            data.data.userProfileData.name_in_nid,
            `${secret_key}`
          );
          var decryptedNameInNID = JSON.parse(
            bytes.toString(CryptoJS.enc.Utf8)
          );
        }

        // confidential

        if (data.data.userProfileData.nid_number) {
          var bytes = CryptoJS.AES.decrypt(
            data.data.userProfileData.nid_number,
            `${secret_key}`
          );
          var decryptedNIDNUmber = JSON.parse(
            bytes.toString(CryptoJS.enc.Utf8)
          );
        }
        if (data.data.userProfileData.bank_account_number) {
          var bytes = CryptoJS.AES.decrypt(
            data.data.userProfileData.bank_account_number,
            `${secret_key}`
          );
          var decryptedBankAccountNumber = JSON.parse(
            bytes.toString(CryptoJS.enc.Utf8)
          );
        }
        if (data.data.userProfileData.bank_account_name) {
          var bytes = CryptoJS.AES.decrypt(
            data.data.userProfileData.bank_account_name,
            `${secret_key}`
          );
          var decryptedBankAccountName = JSON.parse(
            bytes.toString(CryptoJS.enc.Utf8)
          );
        }
        if (data.data.userProfileData.etin) {
          var bytes = CryptoJS.AES.decrypt(
            data.data.userProfileData.etin,
            `${secret_key}`
          );
          var decryptedeTIN = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        }
        if (data.data.userProfileData.name_in_etin) {
          var bytes = CryptoJS.AES.decrypt(
            data.data.userProfileData.name_in_etin,
            `${secret_key}`
          );
          var decryptedNameIneTIN = JSON.parse(
            bytes.toString(CryptoJS.enc.Utf8)
          );
        }
        if (data.data.userProfileData.present_address) {
          var bytes = CryptoJS.AES.decrypt(
            data.data.userProfileData.present_address,
            `${secret_key}`
          );
          var decryptedPresentAddress = JSON.parse(
            bytes.toString(CryptoJS.enc.Utf8)
          );
        }
        if (data.data.userProfileData.permanent_address) {
          var bytes = CryptoJS.AES.decrypt(
            data.data.userProfileData.permanent_address,
            `${secret_key}`
          );
          var decryptedPermanentAddress = JSON.parse(
            bytes.toString(CryptoJS.enc.Utf8)
          );
        }

        //emergency contact

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

          // setEmergencyContactData(data.dataForEmergencyContacts);
          setEmployeeEmergencyContactOne(decryptedEmergencyContactOne);
          setEmployeeEmergencyContactTwo(decryptedEmergencyContactTwo);
        }

        setProfileCompletionProgressPercentageTemp(
          data.profileCompletionProgressPercentage
        );
        setEmployeeID(data.data.userProfileData.employee_id);
        setEmployeename(data.data.userProfileData.name);
        setEmployeeEmail(data.data.userProfileData.email);
        setEmployeeImage(data.data.userProfileData.passport_size_photo);
        setEmployeeUserId(data.data.userProfileData.user_id);
        setEmployeeReligion(data.data.userProfileData.religion);
        setEmployeeDepartment(data.data.userProfileData.department);
        setEmployeeDesignation(data.data.userProfileData.designation);
        setBloodGroup(data.data.userProfileData.blood_group);
        setEmployeeContact(data.data.userProfileData.contact);
        setEmployeeJoiningDate(data.data.userProfileData.joining_date);
        setEmployeeNIDName(decryptedNameInNID);
        setEmployeeNIDNumber(decryptedNIDNUmber);
        setEmployeeBankAccountNumber(decryptedBankAccountNumber);
        setEmployeeBankAccountName(decryptedBankAccountName);
        setEmployeeETIN(decryptedeTIN);
        setEmployeeETINName(decryptedNameIneTIN);
        setEmployeePresentAddress(decryptedPresentAddress);
        setEmployeePermanentAddress(decryptedPermanentAddress);
        setEmployeeType(data.data.userProfileData.type);

        // console.log(data.data)
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error(error);
        // Handle error state or display an error message
        setLoading(false);
      }
    }, 200);

    const debouncedFetchData = debounce(fetchData, 200); // Adjust the debounce delay as needed
    debouncedFetchData();
    return () => {
      // Cancel the debounced function when the component unmounts
      debouncedFetchData.cancel();
    };
  }, []);

  // console.log(typeof profileCompletionPercentage)
  // console.log(employeeType)

  return (
    <>
      {loading ? (
        <div className="overlay">
          <ProfileLoaderLayout screenLoaderText="Loading Profile..." />
        </div>
      ) : (
        <div
          className="container"
          style={{ marginTop: "30px", marginBottom: "30px" }}
        >
          <div className="main-body" style={{ justifyContent: "center" }}>
            <div className="row" style={{ justifyContent: "center" }}>
              <div className="col-lg-8">
                <div
                  className="card"
                  style={{
                    border: "0 solid transparent",
                    borderRadius: "0.25rem",
                    marginBottom: "1.5rem",
                    boxShadow:
                      "0 2px 6px 0 rgb(218, 218, 253, 65%), 0 2px 6px 0 rgb(206, 206, 238, 54%)",
                  }}
                >
                  <div className="card-body">
                    <div className="d-flex flex-column ">
                      <div className="profile-block">
                        {employeeImage === null ? (
                          <img
                            src={`${base_url}/client/default/clientProfileImage.png`}
                            style={{
                              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                            }}
                            alt="EmployeeImage"
                            className="rounded-circle p-1"
                            width="120"
                          />
                        ) : (
                          <img
                            src={
                              `${base_url}/client/${employeeUserId}/` +
                              employeeImage
                            }
                            style={{
                              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                            }}
                            alt="EmployeeImage"
                            className="rounded-circle p-1"
                            width="120"
                          />
                        )}
                        <div>
                          <NavLink
                            to="/profile-completion"
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                              textDecoration: "none",
                            }}
                          >
                            <Button
                              type="primary"
                              style={{
                                backgroundColor: "rgb(0,176,240)",
                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                              }}
                            >
                              <i class="fas fa-edit"></i>&nbsp; Update Profile
                            </Button>
                          </NavLink>
                        </div>
                      </div>

                      <div className="mt-3 ml-3">
                        <div>
                          <h4>{employeeName}</h4>
                          <p className="text-secondary mb-1">
                            Employee ID : {employeeID}
                          </p>
                          <p className="text-muted font-size-sm">
                            {" "}
                            Email : {employeeEmail}{" "}
                          </p>

                          {/* === 97 */}
                          {profileCompletionPercentage !== "100" ? (
                            <p className="text-muted font-size-sm">
                              {" "}
                              <Badge
                                size="large"
                                status="processing"
                                text="Progress"
                              />
                              <Progress
                                percent={profileCompletionPercentage}
                                status="active"
                                strokeColor={{
                                  from: "#87CEFA",
                                  to: "#1E90FF",
                                }}
                                // style={{ marginBottom: "30px", marginTop: "20px" }}
                              />
                            </p>
                          ) : (
                            <p className="text-muted font-size-sm">
                              {" "}
                              <Badge
                                size="large"
                                status="success"
                                text="Complete"
                              />
                              <Progress
                                percent={100}
                                // status="active"
                                // strokeColor={{
                                //     from: "#87CEFA",
                                //     to: "#1E90FF",
                                // }}
                                // style={{ marginBottom: "30px", marginTop: "20px" }}
                              />
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-8">
                <div className="client-profile-card">
                  <div className="card-body " style={{ padding: "12px" }}>
                    <h5 className="d-flex align-items-center mb-3 ">
                      General Information
                    </h5>
                    {employeeNIDName ? (
                      <div className="row mb-3 text-muted">
                        <div className="col-sm-3">
                          <h6 className="mb-0">NID Name </h6>
                        </div>

                        <div className="col-sm-9 text-secondary mt-1">
                          <input
                            type="text"
                            className="form-control"
                            value={employeeNIDName}
                            disabled
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="row mb-3 text-muted">
                        <div className="col-sm-3">
                          <h6 className="mb-0">NID Name *</h6>
                        </div>
                        <div className="col-sm-9 text-secondary mt-1">
                          <input
                            type="text"
                            className="form-control"
                            value={notUpdatedText}
                            disabled
                          />
                        </div>
                      </div>
                    )}
                    {employeeDesignation ? (
                      <div className="row mb-3 text-muted">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Designation </h6>
                        </div>

                        <div className="col-sm-9 text-secondary mt-1">
                          <input
                            type="text"
                            className="form-control"
                            value={employeeDesignation}
                            disabled
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="row mb-3 text-muted">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Designation *</h6>
                        </div>
                        <div className="col-sm-9 text-secondary mt-1">
                          <input
                            type="text"
                            className="form-control"
                            value={notUpdatedText}
                            disabled
                          />
                        </div>
                      </div>
                    )}
                    {emplyeeDepartment ? (
                      <div className="row mb-3 text-muted">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Department </h6>
                        </div>

                        <div className="col-sm-9 text-secondary mt-1">
                          <input
                            type="text"
                            className="form-control"
                            value={emplyeeDepartment}
                            disabled
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="row mb-3 text-muted">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Department *</h6>
                        </div>
                        <div className="col-sm-9 text-secondary mt-1">
                          <input
                            type="text"
                            className="form-control"
                            value={notUpdatedText}
                            disabled
                          />
                        </div>
                      </div>
                    )}
                    {employeeType ? (
                      <div className="row mb-3 text-muted">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Type </h6>
                        </div>

                        <div className="col-sm-9 text-secondary mt-1">
                          <input
                            type="text"
                            className="form-control"
                            value={employeeType}
                            disabled
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="row mb-3 text-muted">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Type *</h6>
                        </div>
                        <div className="col-sm-9 text-secondary mt-1">
                          <input
                            type="text"
                            className="form-control"
                            value={notUpdatedText}
                            disabled
                          />
                        </div>
                      </div>
                    )}

                    {employeeJoiningDate ? (
                      <div className="row mb-3 text-muted">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Joining Date </h6>
                        </div>

                        <div className="col-sm-9 text-secondary mt-1">
                          <input
                            type="text"
                            className="form-control"
                            value={employeeJoiningDate}
                            disabled
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="row mb-3 text-muted">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Joining Date *</h6>
                        </div>
                        <div className="col-sm-9 text-secondary mt-1">
                          <input
                            type="text"
                            className="form-control"
                            value={notUpdatedText}
                            disabled
                          />
                        </div>
                      </div>
                    )}
                    {employeeContact ? (
                      <div className="row mb-3 text-muted">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Contact </h6>
                        </div>

                        <div className="col-sm-9 text-secondary mt-1">
                          <input
                            type="text"
                            className="form-control"
                            value={employeeContact}
                            disabled
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="row mb-3 text-muted">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Contact *</h6>
                        </div>
                        <div className="col-sm-9 text-secondary mt-1">
                          <input
                            type="text"
                            className="form-control"
                            value={notUpdatedText}
                            disabled
                          />
                        </div>
                      </div>
                    )}
                    {bloodGroup ? (
                      <div className="row mb-3 text-muted">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Blood Group </h6>
                        </div>

                        <div className="col-sm-9 text-secondary mt-1">
                          <input
                            type="text"
                            className="form-control"
                            value={bloodGroup}
                            disabled
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="row mb-3 text-muted">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Blood Group *</h6>
                        </div>
                        <div className="col-sm-9 text-secondary mt-1">
                          <input
                            type="text"
                            className="form-control"
                            value={notUpdatedText}
                            disabled
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="client-profile-card">
                  <div className="card-body" style={{ padding: "12px" }}>
                    <h5 className="d-flex align-items-center mb-3">
                      Confidential Information
                    </h5>
                    {employeeNIDNumber ? (
                      <div className="row mb-3 text-muted">
                        <div className="col-sm-3">
                          <h6 className="mb-0">NID Number </h6>
                        </div>

                        <div className="col-sm-9 text-secondary mt-1">
                          <input
                            type="text"
                            className="form-control"
                            value={employeeNIDNumber}
                            disabled
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="row mb-3 text-muted">
                        <div className="col-sm-3">
                          <h6 className="mb-0">NID Number *</h6>
                        </div>
                        <div className="col-sm-9 text-secondary mt-1">
                          <input
                            type="text"
                            className="form-control"
                            value={notUpdatedText}
                            disabled
                          />
                        </div>
                      </div>
                    )}
                    {employeeBankAccountName ? (
                      <div className="row mb-3 text-muted">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Bank Account Name </h6>
                        </div>

                        <div className="col-sm-9 text-secondary mt-1">
                          <input
                            type="text"
                            className="form-control"
                            value={employeeBankAccountName}
                            disabled
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="row mb-3 text-muted">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Bank Account Name *</h6>
                        </div>
                        <div className="col-sm-9 text-secondary mt-1">
                          <input
                            type="text"
                            className="form-control"
                            value={notUpdatedText}
                            disabled
                          />
                        </div>
                      </div>
                    )}
                    {employeeBankAccountNumber ? (
                      <div className="row mb-3 text-muted">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Bank Account Number </h6>
                        </div>

                        <div className="col-sm-9 text-secondary mt-1">
                          <input
                            type="text"
                            className="form-control"
                            value={employeeBankAccountNumber}
                            disabled
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="row mb-3 text-muted">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Bank Account Number *</h6>
                        </div>
                        <div className="col-sm-9 text-secondary mt-1">
                          <input
                            type="text"
                            className="form-control"
                            value={notUpdatedText}
                            disabled
                          />
                        </div>
                      </div>
                    )}
                    {employeeETIN ? (
                      <div className="row mb-3 text-muted">
                        <div className="col-sm-3">
                          <h6 className="mb-0">ETIN </h6>
                        </div>

                        <div className="col-sm-9 text-secondary mt-1">
                          <input
                            type="text"
                            className="form-control"
                            value={employeeETIN}
                            disabled
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="row mb-3 text-muted">
                        <div className="col-sm-3">
                          <h6 className="mb-0">ETIN *</h6>
                        </div>
                        <div className="col-sm-9 text-secondary mt-1">
                          <input
                            type="text"
                            className="form-control"
                            value={notUpdatedText}
                            disabled
                          />
                        </div>
                      </div>
                    )}
                    {employeeETINName ? (
                      <div className="row mb-3 text-muted">
                        <div className="col-sm-3">
                          <h6 className="mb-0">ETIN Name </h6>
                        </div>

                        <div className="col-sm-9 text-secondary mt-1">
                          <input
                            type="text"
                            className="form-control"
                            value={employeeETINName}
                            disabled
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="row mb-3 text-muted">
                        <div className="col-sm-3">
                          <h6 className="mb-0">ETIN Name *</h6>
                        </div>
                        <div className="col-sm-9 text-secondary mt-1">
                          <input
                            type="text"
                            className="form-control"
                            value={notUpdatedText}
                            disabled
                          />
                        </div>
                      </div>
                    )}

                    {employeePresentAddress ? (
                      <div className="row mb-3 text-muted">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Present Address </h6>
                        </div>

                        <div className="col-sm-9 text-secondary mt-1">
                          <input
                            type="text"
                            className="form-control"
                            value={employeePresentAddress}
                            disabled
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="row mb-3 text-muted">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Present Address*</h6>
                        </div>
                        <div className="col-sm-9 text-secondary mt-1">
                          <input
                            type="text"
                            className="form-control"
                            value={notUpdatedText}
                            disabled
                          />
                        </div>
                      </div>
                    )}
                    {employeePermanentAddress ? (
                      <div className="row mb-3 text-muted">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Permanent Address</h6>
                        </div>

                        <div className="col-sm-9 text-secondary mt-1">
                          <input
                            type="text"
                            className="form-control"
                            value={employeePermanentAddress}
                            disabled
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="row mb-3 text-muted">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Permanent Address *</h6>
                        </div>
                        <div className="col-sm-9 text-secondary mt-1">
                          <input
                            type="text"
                            className="form-control"
                            value={notUpdatedText}
                            disabled
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="client-profile-card">
                  <div className="card-body" style={{ padding: "12px" }}>
                    <h5 className="d-flex align-items-center mb-3">
                      Emergency Contact{" "}
                    </h5>
                    {employeeEmergencyContactOne ? (
                      <div className="row mb-3 text-muted">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Contact One </h6>
                        </div>

                        <div className="col-sm-9 text-secondary mt-1">
                          <input
                            type="text"
                            className="form-control"
                            value={employeeEmergencyContactOne}
                            disabled
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="row mb-3 text-muted">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Contact One *</h6>
                        </div>
                        <div className="col-sm-9 text-secondary mt-1">
                          <input
                            type="text"
                            className="form-control"
                            value={notUpdatedText}
                            disabled
                          />
                        </div>
                      </div>
                    )}
                    {employeeEmergencyContactTwo ? (
                      <div className="row mb-3 text-muted">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Contact Two </h6>
                        </div>

                        <div className="col-sm-9 text-secondary mt-1">
                          <input
                            type="text"
                            className="form-control"
                            value={employeeEmergencyContactTwo}
                            disabled
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="row mb-3 text-muted">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Contact Two *</h6>
                        </div>
                        <div className="col-sm-9 text-secondary mt-1">
                          <input
                            type="text"
                            className="form-control"
                            value={notUpdatedText}
                            disabled
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <FloatButton.BackTop tooltip="Move Up" />
    </>
  );
}
