import React from "react";
import PasswordConfirmationLayout from "../../components/notification/PasswordConfirmationLayout";
import TabTitle from "../../utils/tabTitle/TabTitle";

export default function PasswordConfirmationPage({
  redirectLinkAfterPasswordConfirmation,
}) {
  TabTitle("Portal - Password Confirmation");
  return (
    <PasswordConfirmationLayout
      redirectLinkAfterPasswordConfirmation={
        redirectLinkAfterPasswordConfirmation
      }
    />
  );
}
