import { useEffect, useState } from "react";
import { postQuery } from "../resources/functions";
export default function OutFlowItem({ fundID, list }) {
  const [selection, setSelection] = useState("outflow type");
  const [outflowType, setOutflowType] = useState("");
  const [subtype, setSubtype] = useState("sub-type");
  const [frequency, setFrequency] = useState({
    payment_frequency: "frequency",
  });
  const [paidFrom, setPaidFrom] = useState("net proceeds");
  const [allocation, setAllocation] = useState("");
  function handleSelection(item, type) {
    if (type == "subtype") {
      setSubtype(item);
    } else {
      setSelection(list[item].title);
      setOutflowType(list[item]);
    }
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
  return (
    <>
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
          <ul className="dropdown-menu ">
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
            {outflowType.values &&
              outflowType.values.map((item) => {
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
          id="allocation"
          value={allocation}
          onChange={(e) => setAllocation(e.target.value)}
        />
        {/* <label for="allocation">Allocation%</label> */}
      </div>
    </>
  );
}
