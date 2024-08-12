import React, { useEffect, useState } from "react";
import { postQuery } from "../resources/functions";
import "../style/snapshot.css";
import PieChart from "./pieChart";
import SanpshotReport from "./snapshotReport";
export default function Snapshot({ fundID }) {
  const [dbData, setDbData] = useState({
    count_acq: 0,
    count_hold: 0,
    count_sold: 0,
    investment_acq: 0,
    investment_hold: 0,
    investment_sold: 0,
    legal_balance_acq: 0,
    legal_balance_hold: 0,
    legal_balance_sold: 0,
    property_value_acq: 0,
    property_value_hold: 0,
    property_value_sold: 0,
  });
  useEffect(() => {
    postQuery(
      { query: `select * from performance_snapshot where fund_id=${fundID}` },
      (data) => {
        setDbData(data[0]);
      }
    );
  }, [fundID]);

  return (
    <>
      <div className="snapshotContainer row">
        <h2>Portfolio Snapshot</h2>
        <SanpshotReport dbData={dbData} />

        <PieChart dbData={dbData} />
      </div>
    </>
  );
}
