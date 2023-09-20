import React, { useState, useEffect } from "react";
import {
  Button,
  FloatButton,
  Upload,
  theme,
  message,
  Progress,
  Space,
  Typography,
  Spin,
} from "antd";
import ImgCrop from "antd-img-crop";
import "../../../styles/ImageBoxStyle.css";
import {
  UploadOutlined,
  FileOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { debounce } from "lodash";
import "../../../styles/ScannedDocumentUploadStyle.css";
import EmployeeProfileInformationLoaderLayout from "../../screenLoader/EmployeeProfileInformationLoaderLayout";
export default function ScannedDocumentLayout() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { token } = theme.useToken();
  const base_url = process.env.REACT_APP_BASE_URL;

  const contentStyle = {
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `2px dashed ${token.colorBorder}`,
    marginTop: 25,
    padding: "12px",
  };
  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 34,
      }}
      spin
    />
  );

  const [passportImage, setPassportImage] = useState(null);
  const [fileListForPassportImage, setFileListForPassportImage] = useState([]);
  const [nidDoc, setNIDDoc] = useState(null);
  const [fileListForNIDDoc, setFileListForNIDDoc] = useState([]);
  const [tinDoc, setTinDoc] = useState(null);
  const [fileListForTinDoc, setFileListForTinDoc] = useState([]);
  const [passportDoc, setPassportDoc] = useState(null);
  const [fileListForPassPortDoc, setFileListForPassportDoc] = useState([]);

  const [taxReturnDoc, setTaxReturnDoc] = useState(null);
  const [fileListForTaxReturnDoc, setFileListForTaxReturnDoc] = useState(null);
  const [sscDoc, setSSCDoc] = useState(null);
  const [fileListForSSCDoc, setFileListForSSCDoc] = useState(null);
  const [hscDoc, setHSCDoc] = useState(null);
  const [fileListForHSCDoc, setFileListForHSCDoc] = useState(null);
  const [honsDoc, setHonsDoc] = useState(null);
  const [fileListForHonsDoc, setFileListForHonsDoc] = useState(null);
  const [lastOfficeClearanceDoc, setLastOfficeClearanceDoc] = useState(null);
  const [
    fileListForLastOfficeClearanceDoc,
    setFileListForLastOfficeClearanceDoc,
  ] = useState(null);
  const [officeSalaryCertificateDoc, setOfficeSalaryCertificaeDoc] =
    useState(null);
  const [
    fileListForOfficeSalaryCertificateDoc,
    setFileListForOfficeSalaryCertificateDoc,
  ] = useState(null);
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
  const [passportImageOfLoggedInUser, setPassportImageOfLoggedInUser] =
    useState("");
  const [userIdOfLoggedInUser, setUserIdOfLoggedInUser] = useState("");
  const [loading, setLoading] = useState(true);
  const accessToken = sessionStorage.getItem("accessToken");
  const user_id = sessionStorage.getItem("userData");

  const [state, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  const onChangeWindow = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleWindowResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  const [fileList, setFileList] = useState([
    {
      status: "done",
      url: `${base_url}/client/${user_id}/${passportImageOfLoggedInUser}`,
      // // time: new Date(),
    },
  ]);
  // const [fileList, setFileList] = useState(null);
  // console.log(fileList.url);

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    setFileListForPassportImage(newFileList);
  };

  const onPreview = async (file) => {
    let src = file.url;
    // console.log("src", src);
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  // Progress-Info
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
        // console.log(data.data);

        setPassportImageOfLoggedInUser(
          data.data.userProfileData.passport_size_photo
        );
        setNIDDoc(response.data.data.userProfileData.nid);
        setTinDoc(response.data.data.userProfileData.tin);
        setPassportDoc(response.data.data.userProfileData.passport);
        setSSCDoc(response.data.data.userProfileData.ssc_certificate);
        setHSCDoc(response.data.data.userProfileData.hsc_certificate);
        setHonsDoc(response.data.data.userProfileData.hons_certificate);
        setTaxReturnDoc(
          response.data.data.userProfileData.tax_return_documents
        );
        setLastOfficeClearanceDoc(
          response.data.data.userProfileData.last_office_clearance
        );
        setOfficeSalaryCertificaeDoc(
          response.data.data.userProfileData.last_office_salary_certificate
        );

        if (passportImageOfLoggedInUser === null) {
          const updatedFileList = [
            {
              status: "done",
              url: `${base_url}/client/default/clientProfileImage.png`,
              // time: new Date(),
            },
          ];
          // console.log(updatedFileList);
          setFileList(updatedFileList);
        }
        // console.log(passportImageOfLoggedInUser);

        if (passportImageOfLoggedInUser !== null) {
          const updatedFileList = [
            {
              status: "done",
              url: `${base_url}/client/${user_id}/${passportImageOfLoggedInUser}`,
              // time: new Date(),
            },
          ];
          // console.log(updatedFileList);
          setFileList(updatedFileList);
        }

        // setFileList(updatedFileList);

        if (nidDoc) {
          const updatedFileList = [
            {
              status: "done",
              url: `${base_url}/client/${user_id}/${nidDoc}`,
            },
          ];
          setFileListForNIDDoc(updatedFileList);
        }
        if (tinDoc) {
          const updatedFileList = [
            {
              status: "done",
              url: `${base_url}/client/${user_id}/${tinDoc}`,
            },
          ];
          setFileListForTinDoc(updatedFileList);
        }
        if (passportDoc) {
          const updatedFileList = [
            {
              status: "done",
              url: `${base_url}/client/${user_id}/${passportDoc}`,
            },
          ];
          setFileListForPassportDoc(updatedFileList);
        }
        if (taxReturnDoc) {
          const updatedFileList = [
            {
              status: "done",
              url: `${base_url}/client/${user_id}/${taxReturnDoc}`,
            },
          ];
          setFileListForTaxReturnDoc(updatedFileList);
        }
        if (lastOfficeClearanceDoc) {
          const updatedFileList = [
            {
              status: "done",
              url: `${base_url}/client/${user_id}/${lastOfficeClearanceDoc}`,
            },
          ];
          setFileListForLastOfficeClearanceDoc(updatedFileList);
        }
        if (officeSalaryCertificateDoc) {
          const updatedFileList = [
            {
              status: "done",
              url: `${base_url}/client/${user_id}/${officeSalaryCertificateDoc}`,
            },
          ];
          setFileListForOfficeSalaryCertificateDoc(updatedFileList);
        }
        if (sscDoc) {
          const updatedFileList = [
            {
              status: "done",
              url: `${base_url}/client/${user_id}/${sscDoc}`,
            },
          ];
          setFileListForSSCDoc(updatedFileList);
        }
        if (hscDoc) {
          const updatedFileList = [
            {
              status: "done",
              url: `${base_url}/client/${user_id}/${hscDoc}`,
            },
          ];
          setFileListForHSCDoc(updatedFileList);
        }
        if (honsDoc) {
          const updatedFileList = [
            {
              status: "done",
              url: `${base_url}/client/${user_id}/${honsDoc}`,
            },
          ];
          setFileListForHonsDoc(updatedFileList);
        }

        setUserIdOfLoggedInUser(data.data.userProfileData.user_id);
        setPrevProgress(data.profileCompletionProgressPercentage);
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
  // console.log(passportImageOfLoggedInUser);

  const handleNIDDocChange = ({ file }) => {
    const formData = new FormData();
    formData.append("nid", file);
    const isPDF = file.type === "application/pdf";
    const isFileSizeOk = file.size <= "1000000";
    const isFileNameLengthOk = file.name.length > "40";
    if (!isPDF) {
      message.error(`${file.name} is not a PDF file`);
      return;
    }
    if (!isFileSizeOk) {
      message.error(`File size should be 1MB or less`);
      return;
    }
    if (isFileNameLengthOk) {
      message.error(`Filename must be within 40 characters`);
      return;
    }

    axios
      .put(
        `${base_url}/api/v1/client/profile-completion/scanned-document/${user_id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        // console.log(response.data);
        if (response.data.code === 200) {
          message.success(`${file.name} uploaded successfully`);

          setNIDDoc(response.data.data.user.nid);
          const updatedFileList = [
            {
              uid: "-2",
              name: file.name,
              status: "done",
              url: `${base_url}/client/${user_id}/${nidDoc}`,
            },
          ];
          setFileListForNIDDoc(updatedFileList);
        }
        setProfileCompletionProgressPercentageTemp(
          response.data.profileCompletionProgressPercentage
        );
      })
      .catch((error) => {
        // Handle errors here
        message.error(`${file.name} upload failed.`);
      });
  };

  const handleETINDocChange = ({ file }) => {
    const formData = new FormData();
    formData.append("tinDoc", file);
    const isPDF = file.type === "application/pdf";
    const isFileSizeOk = file.size <= "1000000";
    const isFileNameLengthOk = file.name.length > "40";
    if (!isPDF) {
      message.error(`${file.name} is not a PDF file`);
      return;
    }
    if (!isFileSizeOk) {
      message.error(`File size should be 1MB or less`);
      return;
    }
    if (isFileNameLengthOk) {
      message.error(`Filename must be within 40 characters`);
      return;
    }

    axios
      .put(
        `${base_url}/api/v1/client/profile-completion/scanned-document/${user_id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        // console.log(response);

        if (response.data.code === 200) {
          message.success(`${file.name} uploaded successfully`);
          setTinDoc(response.data.data.user.tin);
          const updatedFileList = [
            {
              status: "done",
              url: `${base_url}/client/${user_id}/${tinDoc}`,
            },
          ];
          setFileListForTinDoc(updatedFileList);
        }
        setProfileCompletionProgressPercentageTemp(
          response.data.profileCompletionProgressPercentage
        );
      })
      .catch((error) => {
        // Handle errors here
        message.error(`${file.name} upload failed.`);
      });
  };

  const handlePassportDocChange = ({ file }) => {
    const formData = new FormData();
    formData.append("passportDoc", file);
    const isPDF = file.type === "application/pdf";
    const isFileSizeOk = file.size <= "1000000";
    const isFileNameLengthOk = file.name.length > "40";
    if (!isPDF) {
      message.error(`${file.name} is not a PDF file`);
      return;
    }
    if (!isFileSizeOk) {
      message.error(`File size should be 1MB or less`);
      return;
    }
    if (isFileNameLengthOk) {
      message.error(`Filename must be within 40 characters`);
      return;
    }

    axios
      .put(
        `${base_url}/api/v1/client/profile-completion/scanned-document/${user_id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        // console.log(response);

        if (response.data.code === 200) {
          message.success(`${file.name} uploaded successfully`);
          setPassportDoc(response.data.data.user.passport);
          const updatedFileList = [
            {
              status: "done",
              url: `${base_url}/client/${user_id}/${passportDoc}`,
            },
          ];
          setFileListForPassportDoc(updatedFileList);
        }
        setProfileCompletionProgressPercentageTemp(
          response.data.profileCompletionProgressPercentage
        );
      })
      .catch((error) => {
        // Handle errors here
        message.error(`${file.name} upload failed.`);
      });
  };

  const handleTaxReturnDocumentChange = ({ file }) => {
    const formData = new FormData();
    setTaxReturnDoc(file);
    formData.append("taxReturnDoc", file);
    const isPDF = file.type === "application/pdf";
    const isFileSizeOk = file.size <= "1000000";
    const isFileNameLengthOk = file.name.length > "40";
    if (!isPDF) {
      message.error(`${file.name} is not a PDF file`);
      return;
    }
    if (!isFileSizeOk) {
      message.error(`File size should be 1MB or less`);
      return;
    }
    if (isFileNameLengthOk) {
      message.error(`Filename must be within 40 characters`);
      return;
    }

    axios
      .put(
        `${base_url}/api/v1/client/profile-completion/scanned-document/${user_id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        // console.log(response);

        if (response.data.code === 200) {
          message.success(`${file.name} uploaded successfully`);
          setTaxReturnDoc(response.data.data.user.tax_return_documents);
          const updatedFileList = [
            {
              status: "done",
              url: `${base_url}/client/${user_id}/${taxReturnDoc}`,
            },
          ];
          setFileListForTaxReturnDoc(updatedFileList);
        }
        setProfileCompletionProgressPercentageTemp(
          response.data.profileCompletionProgressPercentage
        );
      })
      .catch((error) => {
        // Handle errors here
        message.error(`${file.name} upload failed.`);
      });
  };

  const handleOfficeClearanceCertificateChange = ({ file }) => {
    const formData = new FormData();
    formData.append("officeClearanceCertificate", file);
    const isPDF = file.type === "application/pdf";
    const isFileSizeOk = file.size <= "1000000";
    const isFileNameLengthOk = file.name.length > "40";
    if (!isPDF) {
      message.error(`${file.name} is not a PDF file`);
      return;
    }
    if (!isFileSizeOk) {
      message.error(`File size should be 1MB or less`);
      return;
    }
    if (isFileNameLengthOk) {
      message.error(`Filename must be within 40 characters`);
      return;
    }

    axios
      .put(
        `${base_url}/api/v1/client/profile-completion/scanned-document/${user_id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        // console.log(response);

        if (response.data.code === 200) {
          message.success(`${file.name} uploaded successfully`);
          setLastOfficeClearanceDoc(
            response.data.data.user.last_office_clearance
          );
          const updatedFileList = [
            {
              status: "done",
              url: `${base_url}/client/${user_id}/${lastOfficeClearanceDoc}`,
            },
          ];
          setFileListForLastOfficeClearanceDoc(updatedFileList);
        }
        setProfileCompletionProgressPercentageTemp(
          response.data.profileCompletionProgressPercentage
        );
      })
      .catch((error) => {
        // Handle errors here
        message.error(`${file.name} upload failed.`);
      });
  };

  const handleOfficeSalaryCertificate = ({ file }) => {
    const formData = new FormData();
    formData.append("officeSalaryCertificate", file);
    const isPDF = file.type === "application/pdf";
    const isFileSizeOk = file.size <= "1000000";
    const isFileNameLengthOk = file.name.length > "40";
    if (!isPDF) {
      message.error(`${file.name} is not a PDF file`);
      return;
    }
    if (!isFileSizeOk) {
      message.error(`File size should be 1MB or less`);
      return;
    }
    if (isFileNameLengthOk) {
      message.error(`Filename must be within 40 characters`);
      return;
    }

    axios
      .put(
        `${base_url}/api/v1/client/profile-completion/scanned-document/${user_id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        // console.log(response);

        if (response.data.code === 200) {
          message.success(`${file.name} uploaded successfully`);
          setOfficeSalaryCertificaeDoc(
            response.data.data.user.last_office_salary_certificate
          );
          const updatedFileList = [
            {
              status: "done",
              url: `${base_url}/client/${user_id}/${officeSalaryCertificateDoc}`,
            },
          ];
          setFileListForOfficeSalaryCertificateDoc(updatedFileList);
        }
        setProfileCompletionProgressPercentageTemp(
          response.data.profileCompletionProgressPercentage
        );
      })
      .catch((error) => {
        // Handle errors here
        message.error(`${file.name} upload failed.`);
      });
  };

  const handleSSCDocument = ({ file }) => {
    const formData = new FormData();
    formData.append("sscDoc", file);
    const isPDF = file.type === "application/pdf";
    const isFileSizeOk = file.size <= "1000000";
    const isFileNameLengthOk = file.name.length > "40";
    if (!isPDF) {
      message.error(`${file.name} is not a PDF file`);
      return;
    }
    if (!isFileSizeOk) {
      message.error(`File size should be 1MB or less`);
      return;
    }
    if (isFileNameLengthOk) {
      message.error(`Filename must be within 40 characters`);
      return;
    }

    axios
      .put(
        `${base_url}/api/v1/client/profile-completion/scanned-document/${user_id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        // console.log(response);

        if (response.data.code === 200) {
          message.success(`${file.name} uploaded successfully`);
          setSSCDoc(response.data.data.user.ssc_certificate);
          const updatedFileList = [
            {
              status: "done",
              url: `${base_url}/client/${user_id}/${sscDoc}`,
            },
          ];
          setFileListForSSCDoc(updatedFileList);
        }
        setProfileCompletionProgressPercentageTemp(
          response.data.profileCompletionProgressPercentage
        );
      })
      .catch((error) => {
        // Handle errors here
        message.error(`${file.name} upload failed.`);
      });
  };

  const handleHSCDocument = ({ file }) => {
    const formData = new FormData();
    formData.append("hscDoc", file);
    const isPDF = file.type === "application/pdf";
    const isFileSizeOk = file.size <= "1000000";
    const isFileNameLengthOk = file.name.length > "40";
    if (!isPDF) {
      message.error(`${file.name} is not a PDF file`);
      return;
    }
    if (!isFileSizeOk) {
      message.error(`File size should be 1MB or less`);
      return;
    }
    if (isFileNameLengthOk) {
      message.error(`Filename must be within 40 characters`);
      return;
    }

    axios
      .put(
        `${base_url}/api/v1/client/profile-completion/scanned-document/${user_id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        // console.log(response);

        if (response.data.code === 200) {
          message.success(`${file.name} uploaded successfully`);
          setHSCDoc(response.data.data.user.hsc_certificate);
          const updatedFileList = [
            {
              status: "done",
              url: `${base_url}/client/${user_id}/${hscDoc}`,
            },
          ];
          setFileListForHSCDoc(updatedFileList);
        }
        setProfileCompletionProgressPercentageTemp(
          response.data.profileCompletionProgressPercentage
        );
      })
      .catch((error) => {
        // Handle errors here
        message.error(`${file.name} upload failed.`);
      });
  };

  const handleHonsDocument = ({ file }) => {
    const formData = new FormData();
    formData.append("honsDoc", file);
    const isPDF = file.type === "application/pdf";
    const isFileSizeOk = file.size <= "1000000";
    const isFileNameLengthOk = file.name.length > "40";
    if (!isPDF) {
      message.error(`${file.name} is not a PDF file`);
      return;
    }
    if (!isFileSizeOk) {
      message.error(`File size should be 1MB or less`);
      return;
    }
    if (isFileNameLengthOk) {
      message.error(`Filename must be within 40 characters`);
      return;
    }

    axios
      .put(
        `${base_url}/api/v1/client/profile-completion/scanned-document/${user_id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        // console.log(response);

        if (response.data.code === 200) {
          message.success(`${file.name} uploaded successfully`);
          setHonsDoc(response.data.data.user.hsc_certificate);
          const updatedFileList = [
            {
              status: "done",
              url: `${base_url}/client/${user_id}/${honsDoc}`,
            },
          ];
          setFileListForHonsDoc(updatedFileList);
        }
        setProfileCompletionProgressPercentageTemp(
          response.data.profileCompletionProgressPercentage
        );
      })
      .catch((error) => {
        // Handle errors here
        message.error(`${file.name} upload failed.`);
      });
  };

  const handlePassportImageChange = async ({ file }) => {
    const formData = new FormData();
    // setImage(file);
    setPassportImage(file);
    const isImage = file.type === "image/gif";
    // const isFileSizeOk = file.size <= "1000000";
    const isFileNameLengthNotOk = file.name.length > "200";
    if (isImage) {
      message.error(`Image must be png, jpg or jpeg`);
      return;
    }
    // if (!isFileSizeOk) {
    //   message.error(`Image size should be 1MB or less`);
    //   return;
    // }
    if (isFileNameLengthNotOk) {
      message.error(`Filename must be within 200 characters`);
      return;
    }

    // Check if the file is a PNG image, and if not, convert it to PNG
    if (file.type !== "image/png") {
      try {
        // console.log(file);
        const convertedFile = await convertToPNG(file);
        formData.append("passportImage", convertedFile);
      } catch (error) {
        console.error("Failed to convert the file to PNG:", error);
        message.error("Failed to convert the file to PNG.");
        return;
      }
    } else {
      formData.append("passportImage", file);
    }

    axios
      .put(
        `${base_url}/api/v1/client/profile-completion/scanned-document/${user_id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        // console.log(response);
        let tempImageFileName = response.data.data.user.passport_size_photo;
        if (response.data.code === 200) {
          message.success(`${file.name} uploaded successfully`);
          // if(passportImageOfLoggedInUser !== null){
          // console.log(response.data.data);
          setPassportImageOfLoggedInUser(
            response.data.data.user.passport_size_photo
          );
          // console.log(passportImageOfLoggedInUser);
          const updatedFileList = [
            {
              status: "done",
              url: `${base_url}/client/${user_id}/${tempImageFileName}`,
              // time: new Date()
            },
          ];
          setFileList(updatedFileList);
          setPassportImage(updatedFileList);
          forceUpdate();
          // }
        }
        setProfileCompletionProgressPercentageTemp(
          response.data.profileCompletionProgressPercentage
        );
      })
      .catch((error) => {
        // Handle errors here
        message.error(`${file.name} upload failed.`);
      });
  };

  // Function to convert a non-PNG image to PNG
  async function convertToPNG(inputFile) {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const image = new Image();
      image.src = URL.createObjectURL(inputFile);

      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);

        canvas.toBlob((blob) => {
          resolve(
            new File([blob], inputFile.name.replace(/\.[^.]+$/, ".png"), {
              type: "image/png",
            })
          );
        }, "image/png");
      };
      // console.log(image);
      image.onerror = (error) => {
        reject(error);
      };
    });
  }

  const openFileInNewTab = (docType) => {
    if (docType === "nidDoc" && nidDoc) {
      window.open(`${base_url}/client/${user_id}/${nidDoc}`, "_blank");
    }
    if (docType === "tinDoc" && tinDoc) {
      window.open(`${base_url}/client/${user_id}/${tinDoc}`, "_blank");
    }
    if (docType === "taxReturnDoc" && taxReturnDoc) {
      window.open(`${base_url}/client/${user_id}/${taxReturnDoc}`, "_blank");
    }
    if (docType === "passportDoc" && passportDoc) {
      window.open(`${base_url}/client/${user_id}/${passportDoc}`, "_blank");
    }
    if (docType === "lastOfficeClearanceDoc" && lastOfficeClearanceDoc) {
      window.open(
        `${base_url}/client/${user_id}/${lastOfficeClearanceDoc}`,
        "_blank"
      );
    }
    if (
      docType === "officeSalaryCertificateDoc" &&
      officeSalaryCertificateDoc
    ) {
      window.open(
        `${base_url}/client/${user_id}/${officeSalaryCertificateDoc}`,
        "_blank"
      );
    }
    if (docType === "sscDoc" && sscDoc) {
      window.open(`${base_url}/client/${user_id}/${sscDoc}`, "_blank");
    }
    if (docType === "hscDoc" && hscDoc) {
      window.open(`${base_url}/client/${user_id}/${hscDoc}`, "_blank");
    }
    if (docType === "honsDoc" && honsDoc) {
      window.open(`${base_url}/client/${user_id}/${honsDoc}`, "_blank");
    }
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

      {loading ? (
        <div className="overlay">
          <EmployeeProfileInformationLoaderLayout screenLoaderText="Loading Data..." />
        </div>
      ) : (
        <div style={contentStyle}>
          <h4 className="text-muted mb-3" style={{ fontSize: "17px" }}>
            Scanned Documents
          </h4>

          <form className="row g-3" style={{ fontSize: "14px" }}>
            <div className="col-md-12" style={{ textAlign: "center" }}>
              <label for="inputEmail4" className="form-label">
                Passport Size Photo
              </label>
              <div>
                <ImgCrop rotationSlider>
                  <Upload
                    listType="picture-circle"
                    fileList={fileList}
                    onChange={(file) => onChange(file)}
                    onPreview={onPreview}
                    accept=".png, .jpg, ,jpeg"
                    customRequest={handlePassportImageChange}
                  >
                    {fileList.length < 1 && "+ Upload "}
                  </Upload>
                </ImgCrop>
              </div>
            </div>

            <div className="col-md-6">
              <label for="nid_doc" className="form-label">
                NID Document
              </label>
              <div>
                <Upload
                  customRequest={handleNIDDocChange}
                  onChange={(info) => {
                    setFileListForNIDDoc(info.fileList);
                  }}
                  showUploadList={false}
                >
                  <Button
                    icon={<UploadOutlined />}
                    style={{
                      width:
                        windowWidth > 1290
                          ? "650px"
                          : windowWidth > 913
                          ? "350px"
                          : "188px",
                    }}
                  >
                    Upload PDF Only
                  </Button>
                </Upload>
                {nidDoc && (
                  <Space
                    direction="vertical"
                    style={{
                      cursor: "pointer",
                      backgroundColor: "rgb(0,0,0,0.05)",
                      padding: "6px",
                      margin: "5px",
                      borderRadius: "10px",
                      boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#D1E7FA";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "rgb(0,0,0,0.02)";
                    }}
                  >
                    <Space>
                      <FileOutlined />
                      <Typography
                        style={{ fontSize: "12px" }}
                        onClick={() => openFileInNewTab("nidDoc")}
                      >
                        {" "}
                        Open Uploaded Document
                      </Typography>
                    </Space>
                  </Space>
                )}
              </div>
            </div>

            <div className="col-md-6">
              <label for="tin_doc" className="form-label">
                TIN Document
              </label>
              <div>
                <Upload
                  customRequest={handleETINDocChange}
                  onChange={(info) => {
                    setFileListForTinDoc(info.fileList);
                  }}
                  showUploadList={false}
                >
                  <Button
                    icon={<UploadOutlined />}
                    size="medium"
                    style={{
                      width:
                        windowWidth > 1290
                          ? "650px"
                          : windowWidth > 913
                          ? "350px"
                          : "188px",
                    }}
                  >
                    Upload PDF Only{" "}
                  </Button>
                </Upload>
                {tinDoc && (
                  <Space
                    direction="vertical"
                    style={{
                      cursor: "pointer",
                      backgroundColor: "rgb(0,0,0,0.05)",
                      padding: "6px",
                      margin: "5px",
                      borderRadius: "10px",
                      boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#D1E7FA";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "rgb(0,0,0,0.05)";
                    }}
                  >
                    <Space>
                      <FileOutlined />
                      <Typography
                        style={{ fontSize: "12px" }}
                        onClick={() => openFileInNewTab("tinDoc")}
                      >
                        {" "}
                        Open Uploaded Document
                      </Typography>
                    </Space>
                  </Space>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <label for="passport_doc" className="form-label">
                Passport Document
              </label>
              <div>
                <Upload
                  customRequest={handlePassportDocChange}
                  onChange={(info) => {
                    setFileListForPassportDoc(info.fileList);
                  }}
                  showUploadList={false}
                >
                  <Button
                    icon={<UploadOutlined />}
                    size="medium"
                    style={{
                      width:
                        windowWidth > 1290
                          ? "650px"
                          : windowWidth > 913
                          ? "350px"
                          : "188px",
                    }}
                  >
                    Upload PDF Only
                  </Button>
                </Upload>
                {passportDoc && (
                  <Space
                    direction="vertical"
                    style={{
                      cursor: "pointer",
                      backgroundColor: "rgb(0,0,0,0.05)",
                      padding: "6px",
                      margin: "5px",
                      borderRadius: "10px",
                      boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#D1E7FA";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "rgb(0,0,0,0.05)";
                    }}
                  >
                    <Space>
                      <FileOutlined />
                      <Typography
                        style={{ fontSize: "12px" }}
                        onClick={() => openFileInNewTab("passportDoc")}
                      >
                        {" "}
                        Open Uploaded Document
                      </Typography>
                    </Space>
                  </Space>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <label for="tax_return_doc" className="form-label">
                Last Tax Return Document
              </label>
              <div>
                <Upload
                  customRequest={handleTaxReturnDocumentChange}
                  onChange={(info) => {
                    setFileListForTaxReturnDoc(info.fileList);
                  }}
                  showUploadList={false}
                >
                  <Button
                    icon={<UploadOutlined />}
                    size="medium"
                    style={{
                      width:
                        windowWidth > 1290
                          ? "650px"
                          : windowWidth > 913
                          ? "350px"
                          : "188px",
                    }}
                  >
                    Upload PDF Only
                  </Button>
                </Upload>
                {taxReturnDoc && (
                  <Space
                    direction="vertical"
                    style={{
                      cursor: "pointer",
                      backgroundColor: "rgb(0,0,0,0.05)",
                      padding: "6px",
                      margin: "5px",
                      borderRadius: "10px",
                      boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#D1E7FA";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "rgb(0,0,0,0.05)";
                    }}
                  >
                    <Space>
                      <FileOutlined />
                      <Typography
                        style={{ fontSize: "12px" }}
                        onClick={() => openFileInNewTab("taxReturnDoc")}
                      >
                        {" "}
                        Open Uploaded Document
                      </Typography>
                    </Space>
                  </Space>
                )}
              </div>
            </div>

            <div className="col-md-6 ">
              <label for="last_office_clearance_doc" className="form-label">
                Last Office Clearance{" "}
              </label>
              <div>
                <Upload
                  customRequest={handleOfficeClearanceCertificateChange}
                  onChange={(info) => {
                    setFileListForLastOfficeClearanceDoc(info.fileList);
                  }}
                  showUploadList={false}
                >
                  <Button
                    icon={<UploadOutlined />}
                    size="medium"
                    style={{
                      width:
                        windowWidth > 1290
                          ? "650px"
                          : windowWidth > 913
                          ? "350px"
                          : "188px",
                    }}
                  >
                    Upload PDF Only
                  </Button>
                </Upload>
                {lastOfficeClearanceDoc && (
                  <Space
                    direction="vertical"
                    style={{
                      cursor: "pointer",
                      backgroundColor: "rgb(0,0,0,0.05)",
                      padding: "6px",
                      margin: "5px",
                      borderRadius: "10px",
                      boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#D1E7FA";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "rgb(0,0,0,0.05)";
                    }}
                  >
                    <Space>
                      <FileOutlined />
                      <Typography
                        style={{ fontSize: "12px" }}
                        onClick={() =>
                          openFileInNewTab("lastOfficeClearanceDoc")
                        }
                      >
                        {" "}
                        Open Uploaded Document
                      </Typography>
                    </Space>
                  </Space>
                )}
              </div>
            </div>

            <div className="col-md-6">
              <label
                for="last_office_salary_certificate_doc_with_breakdown"
                className="form-label"
              >
                Last office salary certificate (with breakdown){" "}
              </label>
              <div>
                <Upload
                  customRequest={handleOfficeSalaryCertificate}
                  onChange={(info) => {
                    setFileListForOfficeSalaryCertificateDoc(info.fileList);
                  }}
                  showUploadList={false}
                >
                  <Button
                    icon={<UploadOutlined />}
                    size="medium"
                    style={{
                      width:
                        windowWidth > 1290
                          ? "650px"
                          : windowWidth > 913
                          ? "350px"
                          : "188px",
                    }}
                  >
                    Upload PDF Only
                  </Button>
                </Upload>
                {officeSalaryCertificateDoc && (
                  <Space
                    direction="vertical"
                    style={{
                      cursor: "pointer",
                      backgroundColor: "rgb(0,0,0,0.05)",
                      padding: "6px",
                      margin: "5px",
                      borderRadius: "10px",
                      boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#D1E7FA";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "rgb(0,0,0,0.05)";
                    }}
                  >
                    <Space>
                      <FileOutlined />
                      <Typography
                        style={{ fontSize: "12px" }}
                        onClick={() =>
                          openFileInNewTab("officeSalaryCertificateDoc")
                        }
                      >
                        {" "}
                        Open Uploaded Document
                      </Typography>
                    </Space>
                  </Space>
                )}
              </div>
            </div>

            <div className="col-md-6 ">
              <label for="academic_doc" className="form-label">
                SSC Certificate
              </label>
              <div>
                <Upload
                  customRequest={handleSSCDocument}
                  onChange={(info) => {
                    setFileListForSSCDoc(info.fileList);
                  }}
                  showUploadList={false}
                >
                  <Button
                    icon={<UploadOutlined />}
                    size="medium"
                    style={{
                      width:
                        windowWidth > 1290
                          ? "650px"
                          : windowWidth > 913
                          ? "350px"
                          : "188px",
                    }}
                  >
                    Upload PDF Only
                  </Button>
                </Upload>
                {sscDoc && (
                  <Space
                    direction="vertical"
                    style={{
                      cursor: "pointer",
                      backgroundColor: "rgb(0,0,0,0.05)",
                      padding: "6px",
                      margin: "5px",
                      borderRadius: "10px",
                      boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#D1E7FA";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "rgb(0,0,0,0.05)";
                    }}
                  >
                    <Space>
                      <FileOutlined />
                      <Typography
                        style={{ fontSize: "12px" }}
                        onClick={() => openFileInNewTab("sscDoc")}
                      >
                        {" "}
                        Open Uploaded Document
                      </Typography>
                    </Space>
                  </Space>
                )}
              </div>
            </div>

            <div className="col-md-6 ">
              <label for="academic_doc" className="form-label">
                HSC Certificate
              </label>
              <div>
                <Upload
                  customRequest={handleHSCDocument}
                  onChange={(info) => {
                    setFileListForHSCDoc(info.fileList);
                  }}
                  showUploadList={false}
                >
                  <Button
                    icon={<UploadOutlined />}
                    size="medium"
                    style={{
                      width:
                        windowWidth > 1290
                          ? "650px"
                          : windowWidth > 913
                          ? "350px"
                          : "188px",
                    }}
                  >
                    Upload PDF Only
                  </Button>
                </Upload>
                {hscDoc && (
                  <Space
                    direction="vertical"
                    style={{
                      cursor: "pointer",
                      backgroundColor: "rgb(0,0,0,0.05)",
                      padding: "6px",
                      margin: "5px",
                      borderRadius: "10px",
                      boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#D1E7FA";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "rgb(0,0,0,0.05)";
                    }}
                  >
                    <Space>
                      <FileOutlined />
                      <Typography
                        style={{ fontSize: "12px" }}
                        onClick={() => openFileInNewTab("hscDoc")}
                      >
                        {" "}
                        Open Uploaded Document
                      </Typography>
                    </Space>
                  </Space>
                )}
              </div>
            </div>

            <div className="col-md-6 ">
              <label for="academic_doc" className="form-label">
                Hons Certificate (BSc/BA/BBA...)
              </label>
              <div>
                <Upload
                  customRequest={handleHonsDocument}
                  onChange={(info) => {
                    setFileListForHonsDoc(info.fileList);
                  }}
                  showUploadList={false}
                >
                  <Button
                    icon={<UploadOutlined />}
                    size="medium"
                    style={{
                      width:
                        windowWidth > 1290
                          ? "650px"
                          : windowWidth > 913
                          ? "350px"
                          : "188px",
                    }}
                  >
                    Upload PDF Only
                  </Button>
                </Upload>
                {honsDoc && (
                  <Space
                    direction="vertical"
                    style={{
                      cursor: "pointer",
                      backgroundColor: "rgb(0,0,0,0.05)",
                      padding: "6px",
                      margin: "5px",
                      borderRadius: "10px",
                      boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#D1E7FA";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "rgb(0,0,0,0.05)";
                    }}
                  >
                    <Space>
                      <FileOutlined />
                      <Typography
                        style={{ fontSize: "12px" }}
                        onClick={() => openFileInNewTab("honsDoc")}
                      >
                        {" "}
                        Open Uploaded Document
                      </Typography>
                    </Space>
                  </Space>
                )}
              </div>
            </div>

            {/* {upload doc button} */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}></div>
          </form>
        </div>
      )}
      <FloatButton.BackTop tooltip="Move Up" />
    </>
  );
}
