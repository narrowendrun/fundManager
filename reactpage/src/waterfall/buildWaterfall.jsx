import { useEffect, useState } from "react";
import Divider from "./divider";
import OutFlowItem from "./OutflowItem";
import { postQuery } from "../resources/functions";
export default function BuildWaterfall({ fundID }) {
  const [list, setList] = useState({
    costoffee: {
      title: "cost of fee",
      values: ["total_fee"],
      fromTable: "fee_schedule",
    },
    costofdebt: {
      title: "cost of debt",
      values: ["senior", "mezz", "junior"],
      fromTable: "costofcapital",
    },
    costofequity: {
      title: "cost of equity",
      values: ["classa", "classb"],
      fromTable: "costofcapital",
    },
  });
  const [outflowLineItems, setOutflowLineItems] = useState([]);
  const [waterfallExists, setWaterfallExists] = useState();
  const [apiResult, setApiResult] = useState("");
  useEffect(() => {
    postQuery(
      {
        query: `SELECT EXISTS (
  SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'waterfall_${fundID}'
);`,
      },
      (response) => {
        setWaterfallExists(response[0].exists == "True");
      }
    );
  }, [fundID]);

  function DeleteWaterfall() {
    postQuery({ query: `DROP TABLE waterfall_${fundID}` }, (response) => {
      if (response.message == "Query executed successfully") {
        window.location.reload();
      }
    });
  }
  function waterfall() {
    const requestBody = JSON.stringify({
      name: `waterfall_${fundID}`,
      columns: outflowLineItems.map((item) => {
        return item.subType;
      }),
      fromTable: outflowLineItems.map((item) => {
        return item.fromTable;
      }),
      allocations: outflowLineItems.map((item) => {
        return parseFloat(item.allocation);
      }),
      fundID: fundID,
    });
    console.log(requestBody);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: requestBody,
      redirect: "follow",
    };

    fetch("/api/waterfall", requestOptions)
      .then((response) => response.text())
      .then((result) => setApiResult(result))
      .catch((error) => console.log("error", error));
  }

  return (
    <>
      <div
        className="buildWaterfallContainer"
        style={{ height: `${waterfallExists ? "30%" : "80%"}` }}
      >
        <h2>Build Waterfall</h2>
        <br />

        {!waterfallExists ? (
          <>
            <div className="outflowsContainer">
              <Divider
                setOutflowLineItems={setOutflowLineItems}
                numberOfOutflows={outflowLineItems.length}
              />
              {outflowLineItems.map((item, _index) => {
                return (
                  <OutFlowItem
                    key={_index}
                    item={item}
                    index={_index}
                    outflowLineItems={outflowLineItems}
                    setOutflowLineItems={setOutflowLineItems}
                    list={list}
                  />
                );
              })}
              <button
                onClick={() => {
                  waterfall();
                }}
              >
                Save
              </button>
            </div>
          </>
        ) : (
          <button className="deleteWaterfall" onClick={() => DeleteWaterfall()}>
            Delete Existing Waterfall
          </button>
        )}
        <p>{apiResult}</p>
      </div>
    </>
  );
}
