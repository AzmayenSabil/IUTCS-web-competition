import React from "react";
import PasswordConfirmationLayout from "../../components/notification/PasswordConfirmationLayout";
import TabTitle from "../../utils/TabTitle";

export default function PasswordConfirmationPage({
  redirectLinkAfterPasswordConfirmation,
}) {
  TabTitle("Portal - Password-Recovery");
  return (
    <PasswordConfirmationLayout
      redirectLinkAfterPasswordConfirmation={
        redirectLinkAfterPasswordConfirmation
      }
    />
  );
}
