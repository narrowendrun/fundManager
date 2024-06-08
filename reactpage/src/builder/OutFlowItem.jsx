import { useEffect, useState } from "react";
import { postQuery } from "../resources/functions";
import { VscArrowSwap, VscError } from "react-icons/vsc";
export default function OutFlowItem({
  fundID,
  list,
  index,
  item,
  setOutflowLineItems,
  onDelete,
  allData,
  setDue,
  setLineData,
  setAccrued,
  periods,
  setPaid,
  CAFD,
  setCAFD,
  WCR,
  setWCR,
}) {
  const [selection, setSelection] = useState(item.outflowType);
  const [outflowType, setOutflowType] = useState("");
  const [subtype, setSubtype] = useState(item.subType);
  const [editSubtype, setEditSubtype] = useState("");
  const [frequency, setFrequency] = useState({
    payment_frequency: item.frequency,
  });
  const [paidFrom, setPaidFrom] = useState("net proceeds");
  const [allocation, setAllocation] = useState(item.allocation);
  const [localDue, setLocalDue] = useState([]);
  function handleSelection(tranche, type) {
    if (type == "subtype") {
      setSubtype((prev) => {
        // if (prev != "subtype") {
        //   setEditSubtype(prev);
        // }
        return tranche;
      });
    } else {
      setSelection(list[tranche].title);
      setOutflowType(list[tranche]);
    }
  }

  function deleteLineItem() {
    onDelete(index);
    setLineData((prev) => {
      let newObj = { ...prev };
      delete newObj[subtype];
      return newObj;
    });
    setDue((prev) => {
      let newObj = { ...prev };
      delete newObj[subtype];
      return newObj;
    });
    setPaid((prev) => {
      let newObj = { ...prev };
      delete newObj[subtype];
      return newObj;
    });
    setAccrued((prev) => {
      let newObj = { ...prev };
      delete newObj[subtype];
      return newObj;
    });
    setCAFD((prev) => {
      let newObj = { ...prev };
      delete newObj[subtype];
      return newObj;
    });
    setWCR((prev) => {
      let newObj = { ...prev };
      delete newObj[subtype];
      return newObj;
    });
  }
  const __swapLineItems = () => {
    setLineData((prevLineData) => {
      const entries = Object.entries(prevLineData);
      const keyIndex = entries.findIndex(([key]) => key === subtype);
      if (keyIndex < 0 || keyIndex >= entries.length - 1) {
        return prevLineData;
      }
      const temp = entries[keyIndex];
      entries[keyIndex] = entries[keyIndex + 1];
      entries[keyIndex + 1] = temp;

      const newLineData = Object.fromEntries(entries);
      return newLineData;
    });
  };
  function swapLineItems() {
    if (index !== allData.length - 1) {
      setOutflowLineItems((prev) => {
        const newArray = [...prev];
        const toSwap = newArray[index];
        newArray[index] = newArray[index + 1];
        newArray[index + 1] = toSwap;
        return newArray;
      });
    }
    __swapLineItems();
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
    setLineData((prevLineData) => {
      const entries = Object.entries(prevLineData);
      const keyIndex = entries.findIndex(([key]) => key === editSubtype);
      const swapIndex = entries.findIndex(([key]) => key === subtype);

      if (keyIndex !== -1 && swapIndex !== -1 && keyIndex !== swapIndex) {
        // Swap the entries
        const temp = entries[keyIndex];
        entries[keyIndex] = entries[swapIndex];
        entries[swapIndex] = temp;
      }
      const newLineData = Object.fromEntries(entries);
      if (keyIndex !== -1) {
        delete newLineData[editSubtype];
      }
      return newLineData;
    });
  }, [editSubtype, subtype]);

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
    if (subtype !== "subtype" && frequency.payment_frequency !== "frequency") {
      postQuery(periods[frequency.payment_frequency][subtype], (data) => {
        const newLocalDue = data.map((item) => item[subtype]);
        setLocalDue(newLocalDue);
        setLineData((prev) => ({
          ...prev,
          [subtype]: data,
        }));
        setPaid((prevPaid) => {
          const upperCAFD = [];
          const upperWCR = [];
          const currCAFD = [];
          const currWCR = [];
          const localAccrued = [];
          const __localDue = [];
          CAFD[Object.keys(CAFD)[index]].map((item) =>
            upperCAFD.push(item.CAFD)
          );
          WCR[Object.keys(WCR)[index]].map((item) => upperWCR.push(item.WCR));
          const paidArray = [];
          let __paidAmount = 0;
          for (let i = 0; i < upperCAFD.length; i++) {
            //finding if we have to pay from CAFD or WCR
            //initialise each variable
            let payFromCAFD = upperCAFD[i] * (allocation / 100);
            let payFromWCR = upperWCR[i];
            let __paidfromwhich = 0;
            //find the minimum of the two, if either of them are 0 then we use the other
            if (payFromCAFD !== 0 && payFromWCR !== 0) {
              __paidfromwhich = Math.min(payFromCAFD, payFromWCR);
            } else if (payFromCAFD == 0) {
              __paidfromwhich = payFromWCR;
            } else if (payFromWCR == 0) {
              __paidfromwhich = payFromCAFD;
            }
            //calculating paid amount
            __paidAmount = Math.min(newLocalDue[i], __paidfromwhich);
            //calculating currCAFD and currWCR
            if (__paidfromwhich == payFromCAFD) {
              currCAFD.push({ index: i, CAFD: upperCAFD[i] - __paidAmount });
              currWCR.push({ index: i, WCR: upperWCR[i] });
            } else if (__paidfromwhich == payFromWCR) {
              currCAFD.push({ index: i, CAFD: upperCAFD[i] });
              currWCR.push({ index: i, WCR: upperWCR[i] - __paidAmount });
            }
            // if (newLocalDue[i] != 0) {
            //   __paid = Math.min(upperCAFD[i] * (allocation / 100), upperWCR[i]);
            // }

            // if (upperCAFD[i] * (allocation / 100) == __paid) {
            //   __paidfromwhich = "CAFD";
            //   currWCR.push({ index: i, WCR: upperWCR[i] });
            //   currCAFD.push({ index: i, CAFD: upperCAFD[i] - __paid });
            // } else if (upperWCR[i] * (allocation / 100) == __paid) {
            //   __paidfromwhich == "WCR";
            //   currCAFD.push({ index: i, CAFD: upperCAFD[i] });
            //   currWCR.push({ index: i, WCR: upperWCR[i] - __paid });
            // } else if (__paid == 0) {
            //   currCAFD.push({ index: i, CAFD: upperCAFD[i] });
            //   currWCR.push({ index: i, WCR: upperWCR[i] });
            // }
            paidArray.push({ index: i, paid: __paidAmount });
          }

          localAccrued[0] = {
            index: 0,
            accrued: parseFloat(newLocalDue[0]) - parseFloat(paidArray[0].paid),
          };
          __localDue[0] = { index: 0, due: parseFloat(newLocalDue[0]) };
          for (let i = 1; i < newLocalDue.length; i++) {
            __localDue.push({
              index: i,
              due:
                parseFloat(newLocalDue[i]) +
                parseFloat(localAccrued[i - 1].accrued),
            });
            localAccrued.push({
              index: i,
              accrued:
                parseFloat(__localDue[i].due) - parseFloat(paidArray[i].paid),
            });
          }
          setDue((prevDue) => {
            const newDue = { ...prevDue, [subtype]: __localDue };
            return newDue;
          });
          setAccrued((prevAccrued) => {
            const newAccrued = { ...prevAccrued, [subtype]: localAccrued };
            return newAccrued;
          });
          setCAFD((prevCAFD) => {
            return { ...prevCAFD, [subtype]: currCAFD };
          });
          setWCR((prevWCR) => {
            return { ...prevWCR, [subtype]: currWCR };
          });
          const newPaid = { ...prevPaid, [subtype]: paidArray };
          return newPaid;
        });
      });
    }
  }, [
    fundID,
    selection,
    subtype,
    frequency.payment_frequency,
    allocation,
    index,
  ]);
  useEffect(() => {
    setSelection(allData[index].outflowType);
    setSubtype(allData[index].subType);
    setAllocation(allData[index].allocation);
  }, [allData]);
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
