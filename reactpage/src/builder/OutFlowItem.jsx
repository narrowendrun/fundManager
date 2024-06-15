import { useEffect, useState } from "react";
import { postQuery } from "../resources/functions";
import { VscArrowSwap, VscError } from "react-icons/vsc";
import {
  calulateLineData,
  updateOutFlowData,
} from "../resources/OutFlowFunctions";
export default function OutFlowItem({
  fundID,
  list,
  index,
  item,
  setOutflowLineItems,
  onDelete,
  periods,
  setOutFlowData,
  outflowLineItems,
}) {
  const [selection, setSelection] = useState(item.outflowType);
  const [outflowType, setOutflowType] = useState("");
  const [subtype, setSubtype] = useState(item.subType);
  const [frequency, setFrequency] = useState({
    payment_frequency: item.frequency,
  });
  const [paidFrom, setPaidFrom] = useState("net proceeds");
  const [allocation, setAllocation] = useState(item.allocation);

  function handleSelection(tranche, type) {
    if (type == "subtype") {
      setSubtype(() => {
        return tranche;
      });
    } else {
      setSelection(list[tranche].title);
      setOutflowType(list[tranche]);
    }
  }

  function deleteLineItem() {
    onDelete(index);
    setOutFlowData((prevData) => {
      const newData = [...prevData];
      if (newData[index + 1]) {
        newData.splice(index + 1, 1);
      }
      return newData;
    });
  }

  function swapLineItems() {
    setOutFlowData((prevData) => {
      const newData = [...prevData];
      if (index + 2 < newData.length) {
        setOutflowLineItems((prev) => {
          const newArray = [...prev];
          const toSwap = newArray[index];
          newArray[index] = newArray[index + 1];
          newArray[index + 1] = toSwap;
          return newArray;
        });
        let temp = newData[index + 1];
        newData[index + 1] = newData[index + 2];
        newData[index + 2] = temp;
      }
      return newData;
    });
  }
  useEffect(() => {
    if (subtype == "senior" || subtype == "mezz" || subtype == "junior") {
      postQuery(
        {
          query: `SELECT payment_frequency FROM debt_structure WHERE (fund_id=${fundID} AND debt_type='${subtype}')`,
        },
        (data) => setFrequency(data[0])
      );
    } else if (subtype == "classa" || subtype == "classb") {
      postQuery(
        {
          query: `SELECT payment_frequency FROM equity_structure WHERE (fund_id=${fundID} AND equity_type='${subtype}')`,
        },
        (data) => setFrequency(data[0])
      );
    }
  }, [fundID, subtype]);

  useEffect(() => {
    setOutflowLineItems((prev) => {
      const newArray = [...prev];
      newArray[index] = {
        outflowType: selection,
        subType: subtype,
        frequency: frequency.payment_frequency,
        allocation: allocation,
      };
      return newArray;
    });
  }, [
    fundID,
    selection,
    subtype,
    frequency.payment_frequency,
    allocation,
    index,
  ]);
  useEffect(() => {
    setSelection(outflowLineItems[index].outflowType);
    setSelection(outflowLineItems[index].outflowType);
    setAllocation(outflowLineItems[index].allocation);
    setSubtype(outflowLineItems[index].subType);
    if (subtype !== "subtype" && frequency.payment_frequency !== "frequency") {
      postQuery(periods[frequency.payment_frequency][subtype], (data) => {
        let dataArray = data.map((item) => {
          return {
            due: parseFloat(item.due),
            duration: item.duration,
            fiscal_year: item.fiscal_year,
          };
        });
        setOutFlowData((prevData) => {
          const upperCAFD = prevData[index].lineItem.data.map((item) => {
            return item.CAFD;
          });
          const upperWCR = prevData[index].lineItem.data.map((item) => {
            return item.WCR;
          });
          dataArray = calulateLineData(
            dataArray,
            upperCAFD,
            upperWCR,
            allocation
          );
          const newLineItem = {
            title: subtype,
            data: dataArray,
          };
          return updateOutFlowData(prevData, newLineItem, subtype);
        });
      });
    }
  }, [outflowLineItems]);
  return (
    <>
      {/* <p>{index}</p> */}
      <div style={{ marginBottom: "1%" }}>
        <div className="container outflowItemContainer">
          <div className="dropdown outflowItemDropdown">
            <button
              className="btn btn-outline-primary dropdown-toggle "
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {selection}
            </button>
            <ul className="dropdown-menu">
              {Object.keys(list).map((item) => {
                let title = list[item].title;
                return (
                  <li key={item}>
                    <a
                      href="#"
                      className="dropdown-item"
                      onClick={() => handleSelection(item)}
                    >
                      {title}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="dropdown outflowItemDropdown">
            <button
              className="btn btn-outline-primary dropdown-toggle "
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {subtype}
            </button>
            <ul className="dropdown-menu">
              {outflowType.values?.map((item) => {
                return (
                  <li key={item}>
                    <a
                      href="#"
                      className="dropdown-item"
                      onClick={() => handleSelection(item, "subtype")}
                    >
                      {item}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="dropdown outflowItemDropdown">
            <button
              className="btn btn-outline-primary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              disabled={true}
              style={{ opacity: "1" }}
            >
              {frequency && frequency.payment_frequency}
            </button>
          </div>
          <div className="dropdown outflowItemDropdown">
            <button
              className="btn btn-outline-primary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {paidFrom}
            </button>
            <ul className="dropdown-menu ">
              <li>net_proceeds</li>
              <li>working capital</li>
            </ul>
          </div>

          <input
            type="text"
            className=" outflowInput"
            id={`allocation${index}`}
            value={allocation}
            onChange={(e) => setAllocation(e.target.value)}
          />
          {/* <label for="allocation">Allocation%</label> */}
          <VscError
            style={{ fontSize: "2em", marginLeft: "0.2em", cursor: "pointer" }}
            onClick={() => deleteLineItem()}
          />
        </div>
        <div style={{ transform: "translateY(-1em)" }}>
          <VscArrowSwap
            style={{
              rotate: "90deg",
              fontSize: "2em",
              background: "white",
              borderRadius: "8px",
              cursor: "pointer",
              marginLeft: "0.5em",
              transform: "scaleX(-1)",
            }}
            onClick={() => swapLineItems()}
          />
        </div>
      </div>
    </>
  );
}
