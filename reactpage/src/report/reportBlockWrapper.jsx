import Report from "./reportBlock";
import { useState } from "react";
export default function ReportBlockWrapper({ fundID }) {
  const [data, setData] = useState({
    summary: {
      capital_invested: {
        title: "capital invested",
        data: "0",
        type: "currency",
      },
      capital_returned: {
        title: "capital returned",
        data: "0",
        type: "currency",
      },
      average_cob: {
        title: "avg capital balance",
        data: "0",
        type: "currency",
      },
      revenue_to_date: {
        title: "revenue",
        data: "0",
        type: "currency",
      },
      start_date: {
        title: "start date",
        data: "-",
        type: "date",
      },
      age: {
        title: "age (months)",
        data: "0",
        type: "integer",
      },
      proceeds: {
        title: "proceeds",
        data: "0",
        type: "currency",
      },
      roi_annualized: {
        title: "ROI (annualized)",
        data: "0",
        type: "percentage",
      },
    },
    performance: {
      cost_of_assets_sold: {
        title: "cost of assets sold",
        data: "$0",
        type: "currency",
      },
      net_proceeds: {
        title: "net proceeds",
        data: "$0",
        type: "currency",
      },
      roi: {
        title: "ROI (to-date)",
        data: "0%",
        type: "percentage",
      },
      annualised_returns: {
        title: "annualized returns",
        data: "0%",
        type: "percentage",
      },
      target_annualised_return: {
        title: "target annualized returns",
        data: "0%",
        type: "percentage",
      },
      gain_on_sale_yield: {
        title: "gain on sale yield",
        data: "0%",
        type: "percentage",
      },
      projected_annualised_returns: {
        title: "projected annualized returns",
        data: "0%",
        type: "percentage",
      },
      cash_flow_yield: {
        title: "cash flow yield",
        data: "0%",
        type: "percentage",
      },
    },
  });
  const rows = {
    summary: {
      row1: [
        "capital_invested",
        "capital_returned",
        "average_cob",
        "revenue_to_date",
      ],
      row2: ["start_date", "age", "proceeds", "roi_annualized"],
    },
    performance: {
      row1: [
        "cost_of_assets_sold",
        "annualised_returns",
        "target_annualised_return",
        "projected_annualised_returns",
      ],
      row2: ["net_proceeds", "roi", "gain_on_sale_yield", "cash_flow_yield"],
    },
  };
  return (
    <>
      <div className="reportBlockWrapper">
        <Report
          data={data.summary}
          setData={setData}
          fundID={fundID}
          rows={rows.summary}
          reportTitle={"Summary"}
          reportType={"summary"}
          table={"report"}
        />
        <Report
          data={data.performance}
          setData={setData}
          fundID={fundID}
          rows={rows.performance}
          reportTitle={"Overall Performance"}
          reportType={"performance"}
          table={"report_performance"}
        />
      </div>
    </>
  );
}
