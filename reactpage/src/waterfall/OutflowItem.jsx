import { useEffect, useState } from "react";
import { VscArrowSwap, VscError } from "react-icons/vsc";

export default function OutFlowItem({
  list,
  item,
  index,
  outflowLineItems,
  setOutflowLineItems,
}) {
  const [selection, setSelection] = useState(item.outflowType);
  const [outflowType, setOutflowType] = useState("");
  const [subtype, setSubtype] = useState(item.subType);
  const [paidFrom, setPaidFrom] = useState("net proceeds");
  const [allocation, setAllocation] = useState(item.allocation);
  const [loading, setLoading] = useState(0);

  function handleSelection(tranche, type) {
    if (type == "subtype") {
      setOutflowLineItems((prev) => {
        const newLineItems = [...prev];
        newLineItems[index].subType = tranche;
        return newLineItems;
      });
    } else {
      setSelection(list[tranche].title);
      setOutflowType(list[tranche]);
      setOutflowLineItems((prev) => {
        const newLineItems = [...prev];
        newLineItems[index].outflowType = list[tranche].title;
        newLineItems[index].fromTable = list[tranche].fromTable;
        return newLineItems;
      });
    }
  }

  function deleteLineItem() {
    setOutflowLineItems((prevData) => {
      const newLineItems = [...prevData];
      if (index > -1 && index < newLineItems.length) {
        newLineItems.splice(index, 1);
      }
      return newLineItems;
    });
  }

  function swapLineItems() {
    setOutflowLineItems((prevLineItems) => {
      const newLineItems = [...prevLineItems];
      if (index !== newLineItems.length - 1) {
        let temp = newLineItems[index];
        newLineItems[index] = newLineItems[index + 1];
        newLineItems[index + 1] = temp;
      }
      return newLineItems;
    });
  }
  useEffect(() => {
    setSelection(outflowLineItems[index].outflowType);
    setSelection(outflowLineItems[index].outflowType);
    setAllocation(outflowLineItems[index].allocation);
    setSubtype(outflowLineItems[index].subType);
  }, [outflowLineItems]);
  return (
    <>
      <div style={{ marginBottom: "1%" }}>
        <div className="container waterfallOutflowItemContainer">
          <VscArrowSwap
            style={{
              rotate: "90deg",
              fontSize: "1.5em",
              background: "white",
              color: "black",
              cursor: "pointer",
            }}
            onClick={() => swapLineItems()}
          />
          <div className="dropdown waterfallOutflowItemDropdown">
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
          <div className="dropdown waterfallOutflowItemDropdown">
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

          {/* <div className="dropdown waterfallOutflowItemDropdown">
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
          </div> */}

          <input
            type="text"
            className=" outflowInput"
            id={`allocation${index}`}
            value={allocation}
            onChange={(e) => {
              setOutflowLineItems((prevLineItems) => {
                const newLineItems = [...prevLineItems];
                newLineItems[index].allocation = e.target.value;
                return newLineItems;
              });
              setAllocation(e.target.value);
            }}
          />
          {/* <label for="allocation">Allocation%</label> */}
          <VscError
            style={{
              fontSize: "2em",
              marginLeft: "0.2em",
              cursor: "pointer",
              color: "black",
            }}
            onClick={() => deleteLineItem()}
          />
        </div>
      </div>
    </>
  );
}
