import { useEffect, useState } from "react";
import { td_style } from "../resources/OutFlowFunctions";
import { numberFormat, postQuery } from "../resources/functions";
export default function SplitsTable({ data, fundID }) {
  console.log("splits :", data);
  const [classa, setClassa] = useState(0);
  const [classb, setClassb] = useState(0);
  useEffect(() => {
    postQuery(
      {
        query: `select equity_type, splits_percent from equity_structure where fund_id=${fundID}`,
      },
      (data) => {
        data.map((item) =>
          item.equity_type == "classa"
            ? setClassa(parseFloat(item.splits_percent) / 100)
            : setClassb(parseFloat(item.splits_percent) / 100)
        );
      }
    );
  }, [fundID]);
  return (
    <>
      <div
        className="container splitsContainer"
        style={{
          boxShadow:
            "rgba(17, 17, 26, 0.5) 0px 8px 24px, rgba(17, 17, 26, 0.5) 0px 16px 56px, rgba(17, 17, 26, 0.5) 0px 24px 80px",
          padding: "2.5%",
          borderRadius: "15px",
          //background: "rgb(0,255,255)",
          //color: "black",
        }}
      >
        <div style={{ color: "white", fontSize: "2em" }}>
          <p>Splits</p>
        </div>
        <div className="dataTable">
          <div className="tableContainerHeadings">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                </tr>
              </thead>
            </table>
          </div>

          <div className="tableContainer">
            <table>
              <thead>
                <tr>
                  {data?.map((item) => {
                    return (
                      <th
                        key={`${item.duration ? item.duration : "Y"} ${
                          item.fiscal_year
                        }`}
                      >{`${item.duration ? item.duration : "Y"} ${
                        item.fiscal_year
                      }`}</th>
                    );
                  })}
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </div>
        <br />
        <div className="dataTable">
          <div className="tableContainerHeadings">
            <table>
              <thead>
                <tr>
                  <th>classa ({(classa * 100).toFixed(1)}%)</th>
                </tr>
                <tr>
                  <th>classb ({(classb * 100).toFixed(1)}%)</th>
                </tr>
              </thead>
            </table>
          </div>

          <div className="tableContainer">
            <table>
              <tbody>
                <tr>
                  {data?.map((item) => {
                    return (
                      <td
                        key={`${item.duration ? item.duration : "Y"} ${
                          item.fiscal_year
                        }`}
                        style={td_style(item.CAFD)}
                      >
                        {numberFormat(item.CAFD * classa)}
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  {data?.map((item) => {
                    return (
                      <td
                        key={`${item.duration ? item.duration : "Y"} ${
                          item.fiscal_year
                        }`}
                        style={td_style(item.CAFD)}
                      >
                        {numberFormat(item.CAFD * classb)}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
