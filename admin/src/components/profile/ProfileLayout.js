import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import { Modal as AntDModal, Button } from "antd";
import adminProfileImage from "../../assets/adminProfileImage.png";
import { debounce } from "lodash";
import { Modal } from "react-bootstrap";

export default function ProfileLayout() {
  // const [showModal, setShowModal] = useState(false);
  // const [passwordShowModal, setPasswordShowModal] = useState(false);
  const [showProfileUpdateModal, setShowProfileUpdateModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  // const [showPsswordUpdateModal, setPasswordUpdateModal]= useState(false)
  const [name, setName] = useState("");
  const [userId, setUserId] = useState();
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [admin_id, setAdminID] = useState("");
  const [adminIDError, setAdminIDError] = useState("");
  const [nameError, setNameError] = useState("");
  // const [accessToken, setAccessToken] = useState("");
  const [profileData, setProfileData] = useState({});
  const [genderTemp, setGenderTemp] = useState("");
  const [nameTemp, setNameTemp] = useState("");
  const [adminIdTemp, setAdminIdTemp] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const base_url = process.env.REACT_APP_BASE_URL;

  // const handleCloseModal = () => {
  //   setShowModal(false);
  //   setPasswordShowModal(false);
  // };

  useEffect(() => {
    //console.log("Inside fetch", currentPage, pageSize);

    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        // console.log(token)

        const clientInfo = JSON.parse(sessionStorage.getItem("clientInfo"));
        // console.log(clientInfo.user_id)
        // setUserId(clientInfo.user_id)
        // console.log(userId)

        const response = await axios.get(
          `${base_url}/api/v1/admin/admins/getAdmin/${clientInfo.user_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const { data } = response.data;
        //console.log(data);
        setUserId(data.user_id);
        setName(data.name);
        setNameTemp(data.name);
        setGender(data.gender);
        setGenderTemp(data.gender);
        setAdminID(data.admin_id);
        setAdminIdTemp(data.admin_id);
        setEmail(data.email);

        setProfileData((prevData) => {
          const newData = {
            name: name,
            gender: gender,
            admin_id: admin_id,
            email: email,
          };
          return {
            ...prevData,
            ...newData,
          };
        });
      } catch (error) {
        console.error(error);
        // Handle error state or display an error message
      }
    };

    const debouncedFetchData = debounce(fetchData, 500); // Debounce fetchData function

    debouncedFetchData(); // Call the debounced function

    return () => {
      // Clean up the debounced function when the component unmounts
      debouncedFetchData.cancel();
    };
  }, [userId]);

  const handleProfileUpdateModalClose = () => {
    setAdminIdTemp(admin_id);
    setGenderTemp(gender);
    setNameTemp(name);
    setShowProfileUpdateModal(false);
  };

  const handleUpdateModalSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setShowProfileUpdateModal(false);
      // setName("");
      // setStatus("");
      // setGender("");
      // setAdminID("");
      // setShowSuccessModal(true);

      try {
        setLoading(true);
        const accessToken = sessionStorage.getItem("token");

        const response = await axios.post(
          `${base_url}/api/v1/admin/admins/update/${userId}`,
          {
            name: nameTemp,
            gender: genderTemp,
            admin_id: adminIdTemp,
          },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        // console.log(response.data.data);
        setName(response.data.data.name);
        setGender(response.data.data.gender);
        setAdminID(response.data.data.admin_id);

        const newClientInfo = {
          auth: true,
          user_id: userId,
        };

        sessionStorage.setItem("clientInfo", JSON.stringify(newClientInfo));

        setProfileData((prevData) => ({
          ...prevData,
          name: nameTemp,
          gender: genderTemp,
          admin_id: adminIdTemp,
        }));

        // //window reload was here

        setProfileData((prevData) => {
          const newData = {
            name: nameTemp,
            gender: genderTemp,
            admin_id: adminIdTemp,
            email: email,
          };

          if (
            prevData.name !== newData.name ||
            prevData.gender !== newData.gender ||
            prevData.admin_id !== newData.admin_id
          ) {
            setShowSuccessModal(true);
          }

          return {
            ...prevData,
            ...newData,
          };
        });
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      } catch (error) {
        setLoading(false);
        console.error("Profile update error:", error);
        if (error.response && error.response.status === 409) {
          // User already exists, display an error message
          setModalVisible(true);
          setModalMessage("User already exists");
        } else {
          // setModalVisible(true);
          // setModalMessage("An error occurred during profile update");
          console.error("An error occurred during profile update");
        }
      }
    }
  };

  // const handleSuccessModalClose = () => {
  //   setShowSuccessModal(false);
  // };

  const validateForm = () => {
    let isValid = true;

    if (
      adminIdTemp.toString().length !== 5 ||
      adminIdTemp.toString().charAt(0) === "-"
    ) {
      setAdminIDError("Employee ID must contain exactly 5 digits");
      isValid = false;
    } else {
      setAdminIDError("");
    }
    // if (nameTemp.trim() === "") {
    //   setNameError("Name is required");
    //   isValid = false;
    // } else {
    //   setNameError("");
    // }

    return isValid;
  };

  // const handleModalClose = () => {
  //   setShowModal(false);
  //   setPasswordShowModal(false);
  //   setModalVisible(false);
  //   setModalMessage("");

  //   setAdminIdTemp(profileData.admin_id);
  //   setNameTemp(profileData.name);
  //   setGenderTemp(profileData.gender);
  // };

  return (
    <>
      <Modal
        show={showProfileUpdateModal}
        onHide={handleProfileUpdateModalClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form method="POST">
            <div className="form-group mb-2">
              <label className="mb-2" htmlFor="formName ">
                Admin ID
              </label>
              <input
                type="number"
                className="form-control"
                id="formName"
                value={adminIdTemp}
                onChange={(e) => {
                  // setAdminID(e.target.value);
                  setAdminIdTemp(e.target.value);
                  setAdminIDError(""); // Clear the error message when the value changes
                }}
                // required
              />
              {adminIDError && (
                <div className="text-danger">{adminIDError}</div>
              )}
            </div>
            <div className="form-group mb-2">
              <label className="mb-2" htmlFor="formName">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="formName"
                value={nameTemp}
                onChange={(e) => {
                  // setName(e.target.value);
                  setNameTemp(e.target.value);
                  setNameError("");
                }}
                // required
              />
              {nameError && <div className="text-danger">{nameError}</div>}
            </div>

            <div className="form-group mb-2">
              <label className="mb-2" htmlFor="formGender">
                Gender
              </label>
              <select
                className="form-control"
                id="gender"
                value={genderTemp}
                onChange={(e) => {
                  setGenderTemp(e.target.value); // Update the temporary value
                  // setGender(e.target.value); // Update the actual value
                }}
                // required
              >
                {!gender && <option value="default">Select your gender</option>}
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="primary"
            style={{
              background: "#F05252",
              color: "white",
              height: "50px",
              width: "100px",
              border: "none",
              borderRadius: "10px",
            }}
            onClick={handleProfileUpdateModalClose}
          >
            <i className="fa fa-times-circle" aria-hidden="true"></i>&nbsp;
            Cancel
          </button>

          <button
            type="primary"
            style={{
              background: "#0E9F6E",
              color: "white",
              height: "50px",
              width: "100px",
              border: "none",
              borderRadius: "10px",
            }}
            onClick={handleUpdateModalSubmit}
          >
            <i className="fa fa-arrow-circle-right" aria-hidden="true"></i>
            &nbsp; Update
          </button>
        </Modal.Footer>
      </Modal>

      {/* profile data */}
      <div className="container" style={{ marginTop: "40px" }}>
        <div
          className="card mb-3"
          style={{ maxWidth: "540px", border: "none" }}
        >
          <div className="row g-0">
            <div className="col-md-4">
              <img
                src={adminProfileImage}
                className="img-fluid rounded-start"
                style={{ height: "150px" }}
                alt="clientProfileImage"
              />
            </div>
            <div className="col-md-8">
              <div className="card-body">
                <h5 className="card-title">{name}</h5>
                <small className="text-muted">Admin ID : {admin_id}</small>
                <br />
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div className="profileInformation" style={{ marginTop: "40px" }}>
          {/* Profile information fields */}
          <div className="row mb-7 mb-3">
            <label htmlFor="inputEmail3" className="col-sm-1 col-form-label">
              Email
            </label>
            <div className="col-sm-5">
              <input
                type="email"
                className="form-control"
                value={email}
                id="inputEmail3"
                disabled
              />
            </div>
          </div>
          <div className="row mb-7 mb-3">
            <label htmlFor="inputEmail3" className="col-sm-1 col-form-label">
              Gender
            </label>
            <div className="col-sm-5">
              <input
                type="text"
                className="form-control"
                value={gender}
                disabled
              />
            </div>
          </div>

          <NavLink to="/admin/reset-password">
            <Button
              type="primary"
              style={{
                marginRight: "12px",
                background: "#0E9F6E",
                height: "40px",
              }}
            >
              <i className="fa fa-key" aria-hidden="true"></i>&nbsp; Change
              Password
            </Button>
          </NavLink>
          <Button
            type="primary"
            style={{ background: "#3F83F8", height: "40px" }}
            onClick={() => setShowProfileUpdateModal(true)}
          >
            <i className="fas fa-user-cog" aria-hidden="true"></i>&nbsp; Update
            Profile
          </Button>
        </div>
      </div>
    </>
  );
}
