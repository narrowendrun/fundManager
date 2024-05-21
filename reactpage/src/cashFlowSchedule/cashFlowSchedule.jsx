import { useEffect, useState } from "react";
import GraphOutput from "./GraphOutput";
import { postQuery, querier, updateRawData } from "../functions";
export default function CashFlowGraphs({ fundID }) {
  const [allData, setData] = useState({
    cashflow_schedule: {
      rawData: [],
      dataset: {
        fund_id: [],
        date: [],
        liquidation_proceeds: [],
        total_p_i_income: [],
        total_investment: [],
        net_proceeds: [],
      },
    },
  });
  useEffect(() => {
    Object.keys(allData).forEach((table) => {
      postQuery(querier(table, fundID), (data) =>
        updateRawData(table, data, setData)
      );
    });
  }, [fundID]);
  console.log("dataset :", allData.cashflow_schedule);
  return (
    <>
      <GraphOutput CFdataset={allData.cashflow_schedule.dataset} />
    </>
  );
}
