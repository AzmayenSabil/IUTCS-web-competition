import { Tabs } from "antd";

import PresentOrderHistoryTable from "./PresentOrderHistoryTable";
import PastOrderHistoryTable from "./PastOrderHistoryTable";

export default function HistoryTabLayout() {
  return (
    <Tabs
      defaultActiveKey="1"
      items={[
        {
          label: (
            <span>
              <i class="fas fa-edit"></i>
              &nbsp;Upcoming Orders
            </span>
          ),
          key: "1",
          children: <PresentOrderHistoryTable />,
        },
        {
          label: (
            <span>
              <i class="fa-solid fa-clock-rotate-left"></i>
              &nbsp;Past Orders
            </span>
          ),
          key: "2",
          children: <PastOrderHistoryTable />,
        },
      ]}
    />
  );
}
