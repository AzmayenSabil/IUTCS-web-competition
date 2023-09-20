import React, { useState, useEffect } from "react";
import axios from "axios";
import { debounce } from "lodash";
import { Button, FloatButton, Form, Input, Progress, Spin, theme } from "antd";
import { Modal as AntDModal } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import EmployeeProfileInformationLoaderLayout from "../../screenLoader/EmployeeProfileInformationLoaderLayout";
import TextArea from "antd/es/input/TextArea";
import { ExclamationCircleOutlined, LoadingOutlined } from "@ant-design/icons";

var CryptoJS = require("crypto-js");

export default function ConfidentialInformationLayout() {
  const [profileData, setProfileData] = useState({});
  const [NIDNumber, setNIDNumber] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [eTIN, seteTIN] = useState("");
  const [nameIneTIN, setNameIneTIN] = useState("");
  const [presentAddress, setPresentAddress] = useState("");
  const [permanentAddress, setPermanentAddress] = useState("");
  const [NIDNumberTemp, setNIDNumberTemp] = useState("");
  const [bankAccountNumberTemp, setBankAccountNumberTemp] = useState("");
  const [bankAccountNameTemp, setBankAccountNameTemp] = useState("");
  const [eTINTemp, seteTINTemp] = useState("");
  const [nameIneTINTemp, setNameIneTINTemp] = useState("");
  const [presentAddressTemp, setPresentAddressTemp] = useState("");
  const [permamentAddressTemp, setPermanentAddressTemp] = useState("");
  const [NIDNumberError, setNIDNumberError] = useState("");
  const [bankAccountNumberError, setBankAccountNumberError] = useState("");
  const [bankAccountNameError, setBankAccountNameError] = useState("");
  const [eTINError, seteTINError] = useState("");
  const [nameIneTINError, setNameIneTINError] = useState("");
  const [presentAddressError, setPresentAddressError] = useState("");
  const [permanentAddressError, setPermanentAddressError] = useState("");
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

        setNIDNumberTemp(decryptedNIDNUmber);
        setBankAccountNumberTemp(decryptedBankAccountNumber);
        setBankAccountNameTemp(decryptedBankAccountName);
        seteTINTemp(decryptedeTIN);
        setNameIneTINTemp(decryptedNameIneTIN);
        setPresentAddressTemp(decryptedPresentAddress);
        setPermanentAddressTemp(decryptedPermanentAddress);
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

  const handleUpdateConfidentialInformation = async (e) => {
    setProfileCompletionProgressPercentage("");

    if (validateForm()) {
      setNIDNumber("");
      setBankAccountName("");
      setBankAccountNumber("");
      setPermanentAddress("");
      setPresentAddress("");
      seteTIN("");
      setNameIneTIN("");

      var encryptedNIDNumber = "";
      var encryptedBankAccountName = "";
      var encryptedBankAccountNumber = "";
      var encryptedeTIN = "";
      var encryptedNameIneTIN = "";
      var encryptedPresentAddress = "";
      var encryptedPermanentAddress = "";

      if (NIDNumberTemp) {
        encryptedNIDNumber = CryptoJS.AES.encrypt(
          JSON.stringify(NIDNumberTemp),
          `${secret_key}`
        ).toString();
      }

      if (bankAccountNameTemp) {
        encryptedBankAccountName = CryptoJS.AES.encrypt(
          JSON.stringify(bankAccountNameTemp),
          `${secret_key}`
        ).toString();
      }

      if (bankAccountNumberTemp) {
        encryptedBankAccountNumber = CryptoJS.AES.encrypt(
          JSON.stringify(bankAccountNumberTemp),
          `${secret_key}`
        ).toString();
      }

      if (eTINTemp) {
        encryptedeTIN = CryptoJS.AES.encrypt(
          JSON.stringify(eTINTemp),
          `${secret_key}`
        ).toString();
      }

      if (nameIneTINTemp) {
        encryptedNameIneTIN = CryptoJS.AES.encrypt(
          JSON.stringify(nameIneTINTemp),
          `${secret_key}`
        ).toString();
      }

      if (presentAddressTemp) {
        encryptedPresentAddress = CryptoJS.AES.encrypt(
          JSON.stringify(presentAddressTemp),
          `${secret_key}`
        ).toString();
      }

      if (permamentAddressTemp) {
        encryptedPermanentAddress = CryptoJS.AES.encrypt(
          JSON.stringify(permamentAddressTemp),
          `${secret_key}`
        ).toString();
      }

      try {
        // setLoading(true);
        const accessToken = sessionStorage.getItem("accessToken");
        const user_id = sessionStorage.getItem("userData");

        const response = await axios.put(
          `${base_url}/api/v1/client/profile-completion/confidential-information/${user_id}`,
          {
            nid_number: encryptedNIDNumber,
            bank_account_number: encryptedBankAccountNumber,
            bank_account_name: encryptedBankAccountName,
            etin: encryptedeTIN,
            name_in_etin: encryptedNameIneTIN,
            present_address: encryptedPresentAddress,
            permanent_address: encryptedPermanentAddress,
          },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        const { data } = response;

        setProfileData((prevData) => {
          const newData = {
            NIDNumber: NIDNumberTemp,
            bankAccountNumber: bankAccountNumberTemp,
            bankAccountName: bankAccountNameTemp,
            eTIN: eTINTemp,
            nameIneTIN: nameIneTINTemp,
            presentAddress: presentAddressTemp,
            permanentAddress: permamentAddressTemp,
          };

          if (
            prevData.NIDNumber !== newData.NIDNumber ||
            prevData.bankAccountNumber !== newData.bankAccountNumber ||
            prevData.bankAccountName !== newData.bankAccountName ||
            prevData.eTIN !== newData.eTIN ||
            prevData.nameIneTIN !== newData.nameIneTIN ||
            prevData.presentAddress !== newData.presentAddress ||
            prevData.permanentAddress !== newData.permanentAddress
          ) {
            setTimeout(() => {
              setShowSuccessModal(true);
            }, 1000);
          }

          setProfileCompletionProgressPercentageTemp(
            data.profileCompletionProgressPercentage
          );

          setNIDNumberTemp("");
          setBankAccountNameTemp("");
          setBankAccountNumberTemp("");
          setPermanentAddressTemp("");
          setPresentAddressTemp("");
          seteTINTemp("");
          setNameIneTINTemp("");

          return {
            ...prevData,
            ...newData,
          };
        });
      } catch (error) {
        console.error("General Information update error:", error);
        // Handle error state or display an error message
        // setLoading(false);
      }
    }
  };
  const validateForm = () => {
    let isValid = true;

    if (NIDNumberTemp && !/^[0-9]{10,}$/.test(NIDNumberTemp)) {
      setNIDNumberError(
        "NID Number must be at least 10 digits long and contain only numbers"
      );
      isValid = false;
    } else {
      setNIDNumberError("");
    }

    if (
      bankAccountNumberTemp &&
      (bankAccountNumberTemp.toString().length > 12 ||
        bankAccountNumberTemp.toString().charAt(0) === "-")
    ) {
      setBankAccountNumberError("Bank Account Number must be within 12 digits");
      isValid = false;
    } else {
      setBankAccountNumberError("");
    }

    if (eTINTemp && !/^\d{12}$/.test(eTINTemp)) {
      seteTINError("ETIN must be 12 digits long and contain only numbers");
      isValid = false;
    } else {
      seteTINError("");
    }

    if (nameIneTINTemp && !/^[A-Za-z\s]+$/.test(nameIneTINTemp)) {
      setNameIneTINError("ETIN Name must only contain letters and spaces");
      isValid = false;
    } else {
      setNameIneTINError("");
    }
    if (bankAccountNameTemp) {
      if (!/^[A-Za-z\s\.,#-]+$/.test(bankAccountNameTemp)) {
        setBankAccountNameError("Bank Name can only contain letters");
        isValid = false;
      } else {
        setBankAccountNameError("");
      }
    } else {
      setBankAccountNameError("");
    }

    if (presentAddressTemp) {
      if (!/^[A-Za-z0-9\s\.,#-]+$/.test(presentAddressTemp)) {
        setPresentAddressError(
          "Present Address can only contain alphabets, numbers, spaces, '.', ',', '#', and '-'"
        );
        isValid = false;
      } else {
        setPresentAddressError("");
      }
    } else {
      setPresentAddressError("");
    }

    // Validate Permanent Address
    if (permamentAddressTemp) {
      if (!/^[A-Za-z0-9\s\.,#-]+$/.test(permamentAddressTemp)) {
        setPermanentAddressError(
          "Permanent Address can only contain alphabets, numbers, spaces, '.', ',', '#', and '-'"
        );
        isValid = false;
      } else {
        setPermanentAddressError("");
      }
    } else {
      setPermanentAddressError("");
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
              Confidential Information
            </h4>
            <form className="row g-3" style={{ fontSize: "14px" }}>
              <div className="col-md-4">
                <label for="nid_number" className="form-label">
                  NID No
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={NIDNumberTemp}
                  onChange={(e) => {
                    setNIDNumberTemp(e.target.value);
                    setNIDNumberError("");
                  }}
                  id="nid_number"
                />
                {NIDNumberError && (
                  <div className="text-danger" style={{ fontSize: "12px" }}>
                    {NIDNumberError}
                  </div>
                )}
              </div>

              <div className="col-md-4">
                <label for="bank_acc_number" className="form-label">
                  Bank Account No
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={bankAccountNumberTemp}
                  onChange={(e) => {
                    setBankAccountNumberTemp(e.target.value);
                    setBankAccountNumberError("");
                  }}
                  id="bank_acc_number"
                />
                {bankAccountNumberError && (
                  <div className="text-danger" style={{ fontSize: "12px" }}>
                    {bankAccountNumberError}
                  </div>
                )}
              </div>

              <div className="col-md-4">
                <label for="bank_acc_name" className="form-label">
                  Bank Account Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={bankAccountNameTemp}
                  onChange={(e) => {
                    setBankAccountNameTemp(e.target.value);
                    setBankAccountNumberError("");
                  }}
                  id="bank_acc_name"
                />
                {bankAccountNameError && (
                  <div className="text-danger" style={{ fontSize: "12px" }}>
                    {bankAccountNameError}
                  </div>
                )}
              </div>

              <div className="col-md-5">
                <label for="etin" className="form-label">
                  ETIN
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={eTINTemp}
                  onChange={(e) => {
                    seteTINTemp(e.target.value);
                    seteTINError("");
                  }}
                  id="etin"
                />
                {eTINError && (
                  <div className="text-danger" style={{ fontSize: "12px" }}>
                    {eTINError}
                  </div>
                )}
              </div>

              <div className="col-md-7">
                <label for="etin_name" className="form-label">
                  ETIN Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={nameIneTINTemp}
                  onChange={(e) => {
                    setNameIneTINTemp(e.target.value);
                    setNameIneTINError("");
                  }}
                  id="etin_name"
                />
                {nameIneTINError && (
                  <div className="text-danger" style={{ fontSize: "12px" }}>
                    {nameIneTINError}
                  </div>
                )}
              </div>

              <div className="col-md-6">
                <label for="present_address" className="form-label">
                  Present Address
                </label>
                <TextArea
                  type="text"
                  className="form-control"
                  value={presentAddressTemp}
                  onChange={(e) => {
                    setPresentAddressTemp(e.target.value);
                    setPresentAddressError("");
                  }}
                  id="present_address"
                  autoSize={{ minRows: 3, maxRows: 6 }} // This will make the TextArea auto-expand based on content
                  style={{ resize: "vertical" }} // Set the resize property
                />
                {presentAddressError && (
                  <div className="text-danger" style={{ fontSize: "12px" }}>
                    {presentAddressError}
                  </div>
                )}
              </div>

              <div className="col-md-6">
                <label for="permanent_address" className="form-label">
                  Permanent Address
                </label>
                <TextArea
                  type="text"
                  className="form-control"
                  value={permamentAddressTemp}
                  onChange={(e) => {
                    setPermanentAddressTemp(e.target.value);
                    setPermanentAddressError("");
                  }}
                  id="permanent_address"
                  autoSize={{ minRows: 3, maxRows: 6 }}
                  style={{ resize: "vertical" }}
                />
                {permanentAddressError && (
                  <div className="text-danger" style={{ fontSize: "12px" }}>
                    {permanentAddressError}
                  </div>
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={handleUpdateConfidentialInformation}
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
