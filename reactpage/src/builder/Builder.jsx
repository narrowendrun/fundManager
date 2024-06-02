import Divider from "./Divider";
import InFlowLineItem from "./InFlowItem";
import { postQuery, querier } from "../resources/functions";
import { useEffect, useState } from "react";
import OutFlowItem from "./OutFlowItem";

export default function Builder({ fundID, setFundID }) {
  const [list, setList] = useState({
    costofequity: {
      title: "cost of debt",
      values: ["senior", "mezz", "junior"],
    },
    costofdebt: {
      title: "cost of equity",
      values: ["classa", "classb"],
    },
  });
  const [outflowLineItems, setOutflowLineItems] = useState([
    {
      outflowType: "outflow",
      subType: "subtype",
      frequency: "frequency",
      allocation: "100",
    },
  ]);
  const [netProceeds, setNetProceeds] = useState([]);
  const handleDeleteLineItem = (index) => {
    setOutflowLineItems((prevItems) =>
      prevItems.filter((_, itemIndex) => itemIndex !== index)
    );
  };
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
      <Divider
        title={"Outflow Items"}
        button={true}
        numberOfOutflows={outflowLineItems.length}
        setOutflowLineItems={setOutflowLineItems}
      />
      <br />
      <div className="container">
        {outflowLineItems.map((item, index) => (
          <OutFlowItem
            key={index}
            list={list}
            fundID={fundID}
            index={index}
            item={item}
            setOutflowLineItems={setOutflowLineItems}
            onDelete={handleDeleteLineItem}
            allData={outflowLineItems}
          />
        ))}
      </div>
      <br />
      <div className="container dataTable">
        <div className="tableContainerHeadings">
          <table>
            <thead>
              <tr>
                <th>Date</th>
              </tr>
              <tr>
                <th>Net Proceeds</th>
              </tr>
            </thead>
          </table>
        </div>
        <div className="tableContainer">
          <table className="netProceedsTable">
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
          </table>
        </div>
      </div>
    </>
  );
}
