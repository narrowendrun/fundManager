import Divider from "./Divider";
import InFlowLineItem from "./InFlowItem";
import { postQuery } from "../resources/functions";
import { useEffect, useState } from "react";
import OutFlowItem from "./OutFlowItem";
import DataTable from "./DataTable";
import React from "react";
import useLogger from "../resources/useLogger";
import SplitsTable from "./splits";
import GraphOutput from "./GraphOutput";

export default function Builder({ fundID, setFundID }) {
  const periods = {
    quarterly: {
      net_proceeds: {
        query: `SELECT 
                  CONCAT('Q', EXTRACT(QUARTER FROM date)) AS duration,
                  EXTRACT(YEAR FROM date) AS fiscal_year,
                  SUM(net_proceeds) AS net_proceeds 
                FROM cashflow_schedule 
                WHERE fund_id=${fundID} 
                GROUP BY duration, fiscal_year 
                ORDER BY fiscal_year, duration`,
      },
      total_fee: {
        query: `SELECT 
                  CONCAT('Q', EXTRACT(QUARTER FROM date)) AS duration,
                  EXTRACT(YEAR FROM date) AS fiscal_year,
                  SUM(total_fee) AS due 
                FROM fee_schedule 
                WHERE fund_id=${fundID} 
                GROUP BY duration, fiscal_year 
                ORDER BY fiscal_year, duration`,
      },
      senior: {
        query: `SELECT 
                  CONCAT('Q', EXTRACT(QUARTER FROM date)) AS duration,
                  EXTRACT(YEAR FROM date) AS fiscal_year,
                  SUM(senior) AS due 
                FROM costofcapital 
                WHERE fund_id=${fundID} 
                GROUP BY duration, fiscal_year 
                ORDER BY fiscal_year, duration`,
      },
      mezz: {
        query: `SELECT 
                  CONCAT('Q', EXTRACT(QUARTER FROM date)) AS duration,
                  EXTRACT(YEAR FROM date) AS fiscal_year,
                  SUM(mezz) AS due 
                FROM costofcapital 
                WHERE fund_id=${fundID} 
                GROUP BY duration, fiscal_year 
                ORDER BY fiscal_year, duration`,
      },
      junior: {
        query: `SELECT 
                  CONCAT('Q', EXTRACT(QUARTER FROM date)) AS duration,
                  EXTRACT(YEAR FROM date) AS fiscal_year,
                  SUM(junior) AS due 
                FROM costofcapital 
                WHERE fund_id=${fundID} 
                GROUP BY duration, fiscal_year 
                ORDER BY fiscal_year, duration`,
      },
      classa: {
        query: `SELECT 
                  CONCAT('Q', EXTRACT(QUARTER FROM date)) AS duration,
                  EXTRACT(YEAR FROM date) AS fiscal_year,
                  SUM(classa) AS due 
                FROM costofcapital 
                WHERE fund_id=${fundID} 
                GROUP BY duration, fiscal_year 
                ORDER BY fiscal_year, duration`,
      },
      classb: {
        query: `SELECT 
                  CONCAT('Q', EXTRACT(QUARTER FROM date)) AS duration,
                  EXTRACT(YEAR FROM date) AS fiscal_year,
                  SUM(classb) AS due 
                FROM costofcapital 
                WHERE fund_id=${fundID} 
                GROUP BY duration, fiscal_year 
                ORDER BY fiscal_year, duration`,
      },
    },
  };
  //dropdownlist for outflow items
  const [list, setList] = useState({
    costoffee: {
      title: "cost of fee",
      values: ["total_fee"],
    },
    costofequity: {
      title: "cost of debt",
      values: ["senior", "mezz", "junior"],
    },
    costofdebt: {
      title: "cost of equity",
      values: ["classa", "classb"],
    },
  });
  const [outflowLineItems, setOutflowLineItems] = useState([]);
  const [netProceeds, setNetProceeds] = useState([]);
  const [frequency, setFrequency] = useState("");

  const [outFlowData, setOutFlowData] = useState([]);
  const [graphCashFlows, setGraphCashFlows] = useState({});
  const handleDeleteLineItem = (index) => {
    setOutflowLineItems((prevItems) =>
      prevItems.filter((_, itemIndex) => itemIndex !== index)
    );
  };
  useEffect(() => {
    postQuery(
      {
        query: `SELECT debt_type, payment_frequency FROM debt_structure WHERE (fund_id = ${fundID} AND debt_type='senior')`,
      },
      (data) => setFrequency(data[0])
    );
  }, [fundID]);
  useEffect(() => {
    if (frequency.payment_frequency) {
      postQuery(
        periods[frequency.payment_frequency].net_proceeds,
        setNetProceeds
      );
    }
  }, [frequency]);
  useEffect(() => {
    setOutFlowData((prevData) => {
      const index = prevData.findIndex(
        (item) => item.lineItem.title === "net proceeds"
      );
      let newLineItem = {
        title: "net proceeds",
        data: netProceeds,
      };
      for (let i = 0; i < newLineItem.data.length; i++) {
        newLineItem.data[i].CAFD = parseFloat(newLineItem.data[i].net_proceeds);
        newLineItem.data[i].WCR = Math.round(
          parseFloat(newLineItem.data[i].net_proceeds) / 2
        );
        newLineItem.data[i].due = parseFloat(newLineItem.data[i].net_proceeds);
      }
      if (index !== -1) {
        // Update existing entry
        const updatedData = [...prevData];
        updatedData[index] = {
          ...updatedData[index],
          lineItem: newLineItem,
        };
        return updatedData;
      } else {
        // Add new entry
        return [...prevData, { lineItem: newLineItem }];
      }
    });
  }, [netProceeds]);
  // useLogger("lineitems", outflowLineItems);
  // useLogger("lineData", outFlowData);
  const cashflows = () => {
    const cashflowArray = {};
    for (let i = 1; i < outFlowData.length; i++) {
      if (!cashflowArray[outFlowData[i].lineItem.title]) {
        cashflowArray[outFlowData[i].lineItem.title] = [];
        for (let j = 0; j < outFlowData[i].lineItem.data.length; j++) {
          cashflowArray[outFlowData[i].lineItem.title].push(
            outFlowData[i].lineItem.data[j].paid
          );
        }
      } else {
        for (let j = 0; j < outFlowData[i].lineItem.data.length; j++) {
          cashflowArray[outFlowData[i].lineItem.title][j] +=
            outFlowData[i].lineItem.data[j].paid;
        }
      }
    }
    cashflowArray.date = [];
    if (outFlowData.length > 1) {
      for (
        let i = 0;
        i < outFlowData[outFlowData.length - 1].lineItem?.data.length;
        i++
      ) {
        let date =
          outFlowData[outFlowData.length - 1].lineItem.data[i].duration +
          outFlowData[outFlowData.length - 1].lineItem.data[i].fiscal_year;
        cashflowArray.date.push(date);
      }
      for (let i = 0; i < Object.keys(cashflowArray).length; i++) {
        for (
          let j = 1;
          j < cashflowArray[Object.keys(cashflowArray)[i]].length;
          j++
        ) {
          if (Object.keys(cashflowArray)[i] !== "date") {
            cashflowArray[Object.keys(cashflowArray)[i]][j] +=
              cashflowArray[Object.keys(cashflowArray)[i]][j - 1];
          }
        }
      }
    }
    return cashflowArray;
  };
  useEffect(() => {
    setGraphCashFlows((prev) => {
      return cashflows();
    });
  }, [outFlowData]);
  // useLogger("graphCashFlows :", graphCashFlows);
  // useLogger("outflowData", outFlowData);
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
        setOutFlowData={setOutFlowData}
      />
      <br />
      <div className="container">
        {outflowLineItems.map((item, index) => (
          <OutFlowItem
            key={`${outflowLineItems}-${index}`}
            fundID={fundID}
            list={list}
            index={index}
            item={item}
            outflowLineItems={outflowLineItems}
            setOutflowLineItems={setOutflowLineItems}
            onDelete={handleDeleteLineItem}
            periods={periods}
            outFlowData={outFlowData}
            setOutFlowData={setOutFlowData}
          />
        ))}
      </div>

      <br />

      {outFlowData.map((item, index) => {
        return (
          <React.Fragment key={item.lineItem.title}>
            <DataTable
              index={index + 1}
              title={`${item.lineItem.title} ${
                item.lineItem.outflow ? `(${item.lineItem.outflow})` : ``
              }`}
              data={item.lineItem.data}
              show={item.lineItem.title !== "net proceeds"}
            />
            <br />
          </React.Fragment>
        );
      })}
      <br />
      <SplitsTable
        fundID={fundID}
        data={outFlowData[outFlowData.length - 1]?.lineItem.data}
      />
      <br />
      <GraphOutput cashflows={graphCashFlows} />
      <br />
      <br />
    </>
  );
}
