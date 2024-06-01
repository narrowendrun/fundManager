import Divider from "./Divider";
import InFlowLineItem from "./InFlowItem";
import { postQuery, querier } from "../resources/functions";
import { useEffect, useState } from "react";
import OutFlowItem from "./OutFlowItem";

export default function Builder({ fundID, setFundID }) {
  const [list, setList] = useState({
    costofequity: {
      title: "cost of equity",
      values: ["senior", "mezz", "junior"],
    },
    costofdebt: {
      title: "cost of debt",
      values: ["classa", "classb"],
    },
  });
  const [netProceeds, setNetProceeds] = useState([]);
  const [numberOfOutflows, setNumberOfOutflows] = useState(1);
  useEffect(() => {
    postQuery(
      querier("cashflow_schedule", fundID, "date, net_proceeds"),
      setNetProceeds
    );
  }, [fundID]);
  return (
    <>
      <Divider title={"Inflow Items"} />
      <br />
      <div className="container">
        <div className="row">
          <div className="col">
            <InFlowLineItem selectorOpacity={0.5} componentOpacity={1} />
          </div>
          <div className="col">
            <InFlowLineItem selectorOpacity={0.3} componentOpacity={0.1} />
          </div>
        </div>
      </div>
      <Divider title={"Outflow Items"} button={true} />
      <br />
      <div className="container">
        {Array.from({ length: numberOfOutflows }, (_, index) => (
          <OutFlowItem key={index} list={list} fundID={fundID} />
        ))}
      </div>
      <h1>balances</h1>
      <br />
      {/* <table>
        <thead>
          <tr>
            {netProceeds.map((item) => {
              return <th key={item.date}>{item.date}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          <tr>
            {netProceeds.map((item) => {
              return <td key={item.date}>{item.net_proceeds}</td>;
            })}
          </tr>
        </tbody>
      </table> */}
    </>
  );
}
