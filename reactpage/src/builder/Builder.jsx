import Divider from "./Divider";
import InFlowLineItem from "./InFlowItem";
import { postQuery } from "../resources/functions";
import { useEffect, useState } from "react";
import OutFlowItem from "./OutFlowItem";
import DataTable from "./DataTable";
import React from "react";
import InitDataTable from "./initDataTable";

export default function Builder({ fundID, setFundID }) {
  // const periods = {
  //   quarterly: {
  //     net_proceeds: {
  //       query: `SELECT date_trunc('quarter', date)::date AS date, SUM(net_proceeds) AS net_proceeds FROM cashflow_schedule WHERE fund_id=${fundID} GROUP BY fund_id, date_trunc('quarter', date)::date ORDER BY fund_id, date`,
  //     },
  //     senior: {
  //       query: `SELECT date_trunc('quarter', date)::date AS date, SUM(senior) AS senior FROM costofcapital WHERE fund_id=${fundID} GROUP BY fund_id, date_trunc('quarter', date)::date ORDER BY fund_id, date;`,
  //     },
  //     mezz: {
  //       query: `SELECT date_trunc('quarter', date)::date AS date, SUM(mezz) AS mezz FROM costofcapital WHERE fund_id=${fundID} GROUP BY fund_id, date_trunc('quarter', date)::date ORDER BY fund_id, date;`,
  //     },
  //     junior: {
  //       query: `SELECT date_trunc('quarter', date)::date AS date, SUM(junior) AS junior FROM costofcapital WHERE fund_id=${fundID} GROUP BY fund_id, date_trunc('quarter', date)::date ORDER BY fund_id, date;`,
  //     },
  //     classa: {
  //       query: `SELECT date_trunc('quarter', date)::date AS date, SUM(classa) AS classa FROM costofcapital WHERE fund_id=${fundID} GROUP BY fund_id, date_trunc('quarter', date)::date ORDER BY fund_id, date;`,
  //     },
  //     classb: {
  //       query: `SELECT date_trunc('quarter', date)::date AS date, SUM(classb) AS classb FROM costofcapital WHERE fund_id=${fundID} GROUP BY fund_id, date_trunc('quarter', date)::date ORDER BY fund_id, date;`,
  //     },
  //   },
  //   biannual: {
  //     net_proceeds: {
  //       query: `SELECT (CASE WHEN EXTRACT(MONTH FROM date) IN (1, 2, 3, 4, 5, 6) THEN date_trunc('year', date) + interval '0 month' ELSE date_trunc('year', date) + interval '6 month' END)::date AS date, SUM(net_proceeds) AS net_proceeds FROM cashflow_schedule WHERE fund_id=${fundID} GROUP BY fund_id, (CASE WHEN EXTRACT(MONTH FROM date) IN (1, 2, 3, 4, 5, 6) THEN date_trunc('year', date) + interval '0 month' ELSE date_trunc('year', date) + interval '6 month' END)::date ORDER BY fund_id, date`,
  //     },
  //     senior: {
  //       query: `SELECT (CASE WHEN EXTRACT(MONTH FROM date) IN (1, 2, 3, 4, 5, 6) THEN date_trunc('year', date) + interval '0 month' ELSE date_trunc('year', date) + interval '6 month' END)::date AS date, SUM(senior) AS senior FROM costofcapital WHERE fund_id=${fundID} GROUP BY fund_id, (CASE WHEN EXTRACT(MONTH FROM date) IN (1, 2, 3, 4, 5, 6) THEN date_trunc('year', date) + interval '0 month' ELSE date_trunc('year', date) + interval '6 month' END)::date ORDER BY fund_id, date;`,
  //     },
  //     mezz: {
  //       query: `SELECT (CASE WHEN EXTRACT(MONTH FROM date) IN (1, 2, 3, 4, 5, 6) THEN date_trunc('year', date) + interval '0 month' ELSE date_trunc('year', date) + interval '6 month' END)::date AS date, SUM(mezz) AS mezz FROM costofcapital WHERE fund_id=${fundID} GROUP BY fund_id, (CASE WHEN EXTRACT(MONTH FROM date) IN (1, 2, 3, 4, 5, 6) THEN date_trunc('year', date) + interval '0 month' ELSE date_trunc('year', date) + interval '6 month' END)::date ORDER BY fund_id, date;`,
  //     },
  //     junior: {
  //       query: `SELECT (CASE WHEN EXTRACT(MONTH FROM date) IN (1, 2, 3, 4, 5, 6) THEN date_trunc('year', date) + interval '0 month' ELSE date_trunc('year', date) + interval '6 month' END)::date AS date, SUM(junior) AS junior FROM costofcapital WHERE fund_id=${fundID} GROUP BY fund_id, (CASE WHEN EXTRACT(MONTH FROM date) IN (1, 2, 3, 4, 5, 6) THEN date_trunc('year', date) + interval '0 month' ELSE date_trunc('year', date) + interval '6 month' END)::date ORDER BY fund_id, date;`,
  //     },
  //   },
  //   annually: {
  //     net_proceeds: {
  //       query: `SELECT date_trunc('year', date)::date AS date, SUM(net_proceeds) AS net_proceeds FROM cashflow_schedule WHERE fund_id=${fundID} GROUP BY fund_id, date_trunc('year', date)::date ORDER BY fund_id, date;`,
  //     },
  //     senior: {
  //       query: `SELECT date_trunc('year', date)::date AS date, SUM(senior) AS senior FROM costofcapital WHERE fund_id=${fundID} GROUP BY fund_id, date_trunc('year', date)::date ORDER BY fund_id, date;`,
  //     },
  //     mezz: {
  //       query: `SELECT date_trunc('year', date)::date AS date, SUM(mezz) AS mezz FROM costofcapital WHERE fund_id=${fundID} GROUP BY fund_id, date_trunc('year', date)::date ORDER BY fund_id, date;`,
  //     },
  //     junior: {
  //       query: `SELECT date_trunc('year', date)::date AS date, SUM(junior) AS junior FROM costofcapital WHERE fund_id=${fundID} GROUP BY fund_id, date_trunc('year', date)::date ORDER BY fund_id, date;`,
  //     },
  //   },
  // };
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
      senior: {
        query: `SELECT 
                  CONCAT('Q', EXTRACT(QUARTER FROM date)) AS duration,
                  EXTRACT(YEAR FROM date) AS fiscal_year,
                  SUM(senior) AS senior 
                FROM costofcapital 
                WHERE fund_id=${fundID} 
                GROUP BY duration, fiscal_year 
                ORDER BY fiscal_year, duration`,
      },
      mezz: {
        query: `SELECT 
                  CONCAT('Q', EXTRACT(QUARTER FROM date)) AS duration,
                  EXTRACT(YEAR FROM date) AS fiscal_year,
                  SUM(mezz) AS mezz 
                FROM costofcapital 
                WHERE fund_id=${fundID} 
                GROUP BY duration, fiscal_year 
                ORDER BY fiscal_year, duration`,
      },
      junior: {
        query: `SELECT 
                  CONCAT('Q', EXTRACT(QUARTER FROM date)) AS duration,
                  EXTRACT(YEAR FROM date) AS fiscal_year,
                  SUM(junior) AS junior 
                FROM costofcapital 
                WHERE fund_id=${fundID} 
                GROUP BY duration, fiscal_year 
                ORDER BY fiscal_year, duration`,
      },
      classa: {
        query: `SELECT 
                  CONCAT('Q', EXTRACT(QUARTER FROM date)) AS duration,
                  EXTRACT(YEAR FROM date) AS fiscal_year,
                  SUM(classa) AS classa 
                FROM costofcapital 
                WHERE fund_id=${fundID} 
                GROUP BY duration, fiscal_year 
                ORDER BY fiscal_year, duration`,
      },
      classb: {
        query: `SELECT 
                  CONCAT('Q', EXTRACT(QUARTER FROM date)) AS duration,
                  EXTRACT(YEAR FROM date) AS fiscal_year,
                  SUM(classb) AS classb 
                FROM costofcapital 
                WHERE fund_id=${fundID} 
                GROUP BY duration, fiscal_year 
                ORDER BY fiscal_year, duration`,
      },
    },
    biannual: {
      net_proceeds: {
        query: `SELECT 
                  CONCAT('H', EXTRACT(MONTH FROM date) < 7 ? 1 : 2) AS duration,
                  EXTRACT(YEAR FROM date) AS fiscal_year,
                  SUM(net_proceeds) AS net_proceeds 
                FROM cashflow_schedule 
                WHERE fund_id=${fundID} 
                GROUP BY duration, fiscal_year 
                ORDER BY fiscal_year, duration`,
      },
      senior: {
        query: `SELECT 
                  CONCAT('H', EXTRACT(MONTH FROM date) < 7 ? 1 : 2) AS duration,
                  EXTRACT(YEAR FROM date) AS fiscal_year,
                  SUM(senior) AS senior 
                FROM costofcapital 
                WHERE fund_id=${fundID} 
                GROUP BY duration, fiscal_year 
                ORDER BY fiscal_year, duration`,
      },
      mezz: {
        query: `SELECT 
                  CONCAT('H', EXTRACT(MONTH FROM date) < 7 ? 1 : 2) AS duration,
                  EXTRACT(YEAR FROM date) AS fiscal_year,
                  SUM(mezz) AS mezz 
                FROM costofcapital 
                WHERE fund_id=${fundID} 
                GROUP BY duration, fiscal_year 
                ORDER BY fiscal_year, duration`,
      },
      junior: {
        query: `SELECT 
                  CONCAT('H', EXTRACT(MONTH FROM date) < 7 ? 1 : 2) AS duration,
                  EXTRACT(YEAR FROM date) AS fiscal_year,
                  SUM(junior) AS junior 
                FROM costofcapital 
                WHERE fund_id=${fundID} 
                GROUP BY duration, fiscal_year 
                ORDER BY fiscal_year, duration`,
      },
    },
    annually: {
      net_proceeds: {
        query: `SELECT 
                  EXTRACT(YEAR FROM date) AS fiscal_year,
                  SUM(net_proceeds) AS net_proceeds 
                FROM cashflow_schedule 
                WHERE fund_id=${fundID} 
                GROUP BY fiscal_year 
                ORDER BY fiscal_year`,
      },
      senior: {
        query: `SELECT 
                  EXTRACT(YEAR FROM date) AS fiscal_year,
                  SUM(senior) AS senior 
                FROM costofcapital 
                WHERE fund_id=${fundID} 
                GROUP BY fiscal_year 
                ORDER BY fiscal_year`,
      },
      mezz: {
        query: `SELECT 
                  EXTRACT(YEAR FROM date) AS fiscal_year,
                  SUM(mezz) AS mezz 
                FROM costofcapital 
                WHERE fund_id=${fundID} 
                GROUP BY fiscal_year 
                ORDER BY fiscal_year`,
      },
      junior: {
        query: `SELECT 
                  EXTRACT(YEAR FROM date) AS fiscal_year,
                  SUM(junior) AS junior 
                FROM costofcapital 
                WHERE fund_id=${fundID} 
                GROUP BY fiscal_year 
                ORDER BY fiscal_year`,
      },
    },
  };

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
  const [outflowLineItems, setOutflowLineItems] = useState([]);
  const [netProceeds, setNetProceeds] = useState([]);
  const netProceedsStatic = [
    {
      date: "2022-10-01",
      net_proceeds: "4075.35",
    },
    {
      date: "2023-01-01",
      net_proceeds: "96041.65629",
    },
  ];
  const [lineData, setLineData] = useState({});
  const [frequency, setFrequency] = useState("");
  const [CAFD, setCAFD] = useState({
    1: netProceeds.map(({ date, net_proceeds }) => ({
      date,
      CAFD: net_proceeds,
    })),
  });
  const [WCR, setWCR] = useState({
    1: netProceeds.map(({ date, net_proceeds }) => ({
      date,
      WCR: net_proceeds,
    })),
  });
  const [due, setDue] = useState({});
  const [paid, setPaid] = useState({});
  const [accrued, setAccrued] = useState({});
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
    setCAFD({
      1: netProceeds.map(({ duration, fiscal_year, net_proceeds }) => ({
        duration,
        fiscal_year,
        CAFD: net_proceeds,
      })),
    });
    setWCR({
      1: netProceeds.map(({ duration, fiscal_year, net_proceeds }) => ({
        duration,
        fiscal_year,
        WCR: net_proceeds,
      })),
    });
  }, [netProceeds]);

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
        setLineData={setLineData}
        setDue={setDue}
        setPaid={setPaid}
        setAccrued={setAccrued}
        setCAFD={setCAFD}
        setWCR={setWCR}
      />
      <br />
      <div className="container">
        {outflowLineItems.map((item, index) => (
          <OutFlowItem
            key={index}
            fundID={fundID}
            list={list}
            index={index}
            item={item}
            setOutflowLineItems={setOutflowLineItems}
            onDelete={handleDeleteLineItem}
            allData={outflowLineItems}
            setLineData={setLineData}
            periods={periods}
            setPaid={setPaid}
            setDue={setDue}
            CAFD={CAFD}
            setCAFD={setCAFD}
            WCR={WCR}
            setWCR={setWCR}
            setAccrued={setAccrued}
          />
        ))}
      </div>
      <br />
      <InitDataTable
        title={"net Proceeds"}
        data={netProceeds}
        CAFD={CAFD[1]}
        WCR={WCR[1]}
        column="net_proceeds"
      />
      <br />
      {Object.keys(lineData).map((tranche) => {
        return (
          <React.Fragment key={`table-${tranche}`}>
            <DataTable
              title={tranche}
              data={lineData[tranche]}
              due={due[tranche]}
              paid={paid[tranche]}
              accrued={accrued[tranche]}
              CAFD={CAFD[tranche]}
              WCR={WCR[tranche]}
            />
            <br />
          </React.Fragment>
        );
      })}
    </>
  );
}
