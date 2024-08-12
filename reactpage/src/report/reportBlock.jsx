import { useEffect, useState } from "react";
import ReportLineItem from "./reportLineItem";
import React from "react";
import { postQuery } from "../resources/functions";

export default function Report({
  fundID,
  data,
  setData,
  rows,
  reportType,
  reportTitle,
  table,
}) {
  useEffect(() => {
    postQuery(
      { query: `SELECT * FROM ${table} WHERE fund_id=${fundID}` },
      (result) => {
        Object.keys(result[0]).map((item) => {
          setData((prevData) => {
            const newData = {
              ...prevData,
              [reportType]: {
                ...prevData[reportType],
                [item]: {
                  ...prevData[reportType][item],
                  data: result[0][item],
                },
              },
            };
            return newData;
          });
        });
      }
    );
  }, [fundID]);
  return (
    <>
      <div className="reportContainerWrapper">
        <h2>{reportTitle}</h2>
        {Object.keys(rows).map((row) => {
          return (
            <React.Fragment key={row}>
              <div className="reportContainer">
                {rows[row].map((item) => {
                  return (
                    <ReportLineItem
                      key={item}
                      title={data[item].title}
                      data={data[item].data}
                      type={data[item].type}
                    />
                  );
                })}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </>
  );
}
