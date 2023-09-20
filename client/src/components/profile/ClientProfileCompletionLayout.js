import React, { useState, useEffect } from "react";
import axios from "axios";
import { debounce } from "lodash";
import { Button, message, Steps, theme, Progress, Space } from "antd";
import icon from "../../assets/birthdayCake.png";
import CheckAuth from "../authentication/common/hooks/CheckAuth";
import GeneralInformationLayout from "./profileCompletionLayouts/GeneralInformationLayout";
import {
  UserOutlined,
  CopyOutlined,
  SafetyOutlined,
  ProfileOutlined,
  PhoneOutlined,
  HeartOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import BasicInformationLayout from "./profileCompletionLayouts/BasicInformationLayout";
import ConfidentialInformationLayout from "./profileCompletionLayouts/ConfidentialInformationLayout";
import ScannedDocumentLayout from "./profileCompletionLayouts/ScannedDocumentLayout";
import EmergencyContactLayout from "./profileCompletionLayouts/EmergencyContactLayout";

const steps = [
  {
    title: "First",
    description: "Basic information",
    content: <BasicInformationLayout />,
    icon: <UserOutlined />,
  },
  {
    title: "Second",
    description: "General information",
    content: <GeneralInformationLayout />,
    icon: <ProfileOutlined />,
  },
  {
    title: "Third",
    description: "Confidential information",
    content: <ConfidentialInformationLayout />,
    icon: <SafetyOutlined />,
  },
  {
    title: "Forth",
    description: "Scanned Documents",
    content: <ScannedDocumentLayout />,
    icon: <CopyOutlined />,
  },
  {
    title: "Fifth",
    description: "Emergency Contacts",
    content: <EmergencyContactLayout />,
    icon: <PhoneOutlined />,
  },
];

export default function ClientProfileCompletionLayout() {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const { Step } = Steps;
  const [
    profileCompletionProgressPercentage,
    setProfileCompletionProgressPercentage,
  ] = useState("");

  // const next = () => {
  //   setCurrent(current + 1);
  //   setStepContentKey(Date.now());
  // };

  // const prev = () => {
  //   setCurrent(current - 1);
  //   setStepContentKey(Date.now());
  // };
  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
    description: item.description,
    icon: item.icon,
  }));
  const contentStyle = {
    // lineHeight: '260px',
    // textAlign: 'center',
    // color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `2px dashed ${token.colorBorder}`,
    marginTop: 50,
  };

  CheckAuth();

  return (
    <>
    <div style={{ margin: "65px" }}>
      <Steps current={current}>
        {steps.map((step, index) => (
          <Step
            key={index}
            title={step.title}
            icon={step.icon}
            description={step.description}
            onClick={() => setCurrent(index)}
            style={{cursor:"pointer"}}
          />
        ))}
      </Steps>
      <div>{steps[current].content}</div>
      <div
        style={{
          marginTop: 24,
          marginBottom: 30,
        }}
      >
        {current > 0 && (
          <Button
            style={{
              margin: "0 8px",
            }}
            onClick={prev}
          >
            <i className="fa-solid fa-arrow-left"></i> &nbsp;Previous
          </Button>
        )}
        {current < steps.length - 1 && (
          <Button
            style={{
              margin: "0 8px",
              background: "rgb(0,176,240)",
              color: "white",
            }}
            onClick={next}
          >
            Next &nbsp;<i className="fa-solid fa-arrow-right"></i>
          </Button>
        )}
      </div>
    </div>
  </>
  );
}
