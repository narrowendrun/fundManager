import "../style/waterfall.css";
import { postQuery, numberFormat } from "../resources/functions";
import { useEffect, useState } from "react";
import React from "react";

export default function Waterfall({ fundID }) {
  const [dbData, setDbData] = useState([]);

  function buildWaterfall() {
    fetch("/api/waterfall", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `waterfall_${fundID}`,
        columns: ["total_fee", "classa"],
        fromTable: ["fee_schedule", "costofcapital"],
        allocations: [100, 100],
        fundID: fundID.toString(), // Ensure fundID is passed as a string
      }),
    })
      .then((response) => {
        if (response.ok) {
          // If the request is successful, reload the window
          window.location.reload();
        } else {
          console.error("API call failed with status:", response.status);
        }
      })
      .catch((error) => {
        console.error("Error occurred during the API call:", error);
      });
  }

  useEffect(() => {
    postQuery(
      { query: `SELECT * FROM waterfall_${fundID} ORDER BY date DESC` },
      (response) => {
        setDbData(response);
      }
    );
  }, [fundID]);

  // Check if dbData is empty
  if (!dbData || dbData.length === 0) {
    return (
      <div className="waterfallWrapper">
        <div className="waterfall">
          <p>No waterfall data available.</p>
          <button onClick={() => buildWaterfall()}>build waterfall</button>
        </div>
      </div>
    );
  }

  // Determine the maximum number of 'cafd' fields (cafd-n)
  const maxCafd = dbData.reduce((max, item) => {
    const keys = Object.keys(item);
    const cafdKeys = keys.filter((key) => key.startsWith("cafd"));
    const maxCafdNum = Math.max(
      ...cafdKeys.map((key) => parseInt(key.replace("cafd", "")))
    );
    return Math.max(max, maxCafdNum);
  }, 0);

  return (
    <div className="waterfallWrapper">
      <div className="waterfall">
        <h2>Waterfall</h2>
        <br />
        <div className="waterfallRowWrapper">
          <div className="waterfallRow">
            <p className="waterfallRowHeadings">Date</p>
            {dbData.map((item, index) => {
              // Extract the year and month from the date
              const [year, month] = item.date.split("-");

              // Determine the quarter based on the month
              let quarter;
              switch (month) {
                case "01":
                  quarter = "Q1";
                  break;
                case "04":
                  quarter = "Q2";
                  break;
                case "07":
                  quarter = "Q3";
                  break;
                case "10":
                  quarter = "Q4";
                  break;
                default:
                  quarter = "";
              }

              // Display the quarter and year
              return <p key={index}>{`${quarter} ${year}`}</p>;
            })}
          </div>
          <div className="waterfallRow">
            <p className="waterfallRowHeadings">CAFD0</p>
            {dbData.map((item, index) => (
              <p key={index}>{numberFormat(item.cafd0)}</p>
            ))}
          </div>
        </div>

        {Array.from({ length: maxCafd }, (_, i) => (
          <React.Fragment key={i + 1}>
            <div className="waterfallRowWrapper">
              <div className="waterfallRow">
                <p className="waterfallRowHeadings">Due</p>
                {dbData.map((item, index) => (
                  <p key={index}>{numberFormat(item[`due${i + 1}`])}</p>
                ))}
              </div>
              <div className="waterfallRow">
                <p className="waterfallRowHeadings">Paid</p>
                {dbData.map((item, index) => (
                  <p key={index}>{numberFormat(item[`paid${i + 1}`])}</p>
                ))}
              </div>
              <div className="waterfallRow">
                <p className="waterfallRowHeadings">Accrued</p>
                {dbData.map((item, index) => (
                  <p key={index}>{numberFormat(item[`accrued${i + 1}`])}</p>
                ))}
              </div>
              <div className="waterfallRow">
                <p className="waterfallRowHeadings">CAFD{i + 1}</p>
                {dbData.map((item, index) => (
                  <p key={index}>{numberFormat(item[`cafd${i + 1}`])}</p>
                ))}
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
