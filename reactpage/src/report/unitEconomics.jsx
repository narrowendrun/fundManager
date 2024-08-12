import { useEffect, useState } from "react";
import { postQuery, numberFormat } from "../resources/functions";
import "../style/unitEconomics.css";
export default function UnitEconomics({ fundID }) {
  const [dbData, setDbData] = useState({
    acq_cost: 0,
    life: 0,
    margin_per_loan: 0,
    performance_ratio: 0,
    return_annualized: 0,
    revenue: 0,
    roi: 0,
  });
  const unitData = {
    revenue: numberFormat(dbData.revenue),
    "acq cost": numberFormat(dbData.acq_cost),
    "margin / loan": numberFormat(dbData.margin_per_loan),
    ROI: `${dbData.roi}%`,
    "avg life": dbData.life,
    "return (annual)": `${dbData.return_annualized}%`,
    performance: dbData.performance_ratio,
  };
  useEffect(() => {
    postQuery(
      { query: `SELECT * FROM unit_economics WHERE fund_id = ${fundID}` },
      (data) => setDbData(data[0])
    );
  }, [fundID]);
  return (
    <>
      <div className="unitEcononmicsWrapper">
        <div className=" unitEcononmics">
          <h2>Unit Economics</h2>
          <br />
          <br />
          <div className="unitHeadings">
            {Object.keys(unitData).map((key) => {
              return <p key={key}>{key}</p>;
            })}
          </div>
          <div className="unitData">
            {Object.keys(unitData).map((key) => {
              return <p key={key}>{unitData[key]}</p>;
            })}
          </div>
        </div>
      </div>
    </>
  );
}
