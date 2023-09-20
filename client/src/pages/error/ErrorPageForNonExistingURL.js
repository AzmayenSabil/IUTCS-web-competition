import React from "react";

import TabTitle from "../../utils/TabTitle";
import ErrorLayoutForNonExistingURL from "../../components/error/ErrorLayoutForNonExistingURL";

export default function ErrorPageForNonExistingURL() {
  TabTitle("Portal - 404: Not Found");
  return (
    <>
      <ErrorLayoutForNonExistingURL />
    </>
  );
}
