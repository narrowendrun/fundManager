import { VscDiffAdded, VscDebugRestart } from "react-icons/vsc";
export default function Divider({ numberOfOutflows, setOutflowLineItems }) {
  const style = {
    marginBottom: "20px",
    padding: "0",
    display: "flex",
    alignItems: "center",
    transform: "scale(2.5)",
  };
  function addLineItem() {
    setOutflowLineItems((prev) => {
      const newArray = [...prev];
      newArray.push({
        outflowType: "outflow",
        subType: "subtype",
        frequency: "frequency",
        allocation: "100",
      });
      return newArray;
    });
  }
  function clearLineItems() {
    console.log("reset line item");
    setOutflowLineItems([
      {
        outflowType: "outflow",
        subType: "subtype",
        frequency: "frequency",
        allocation: "100",
      },
    ]);
  }
  return (
    <>
      <div
        className="container"
        style={{ marginTop: "2%", display: "flex", alignItems: "center" }}
      >
        <h2 style={{ width: "92%" }}>
          Outflows {numberOfOutflows > 0 ? `(${numberOfOutflows})` : ""}
        </h2>
        <div style={style}>
          <div
            style={{ margin: "0 5px 0 0", cursor: "pointer" }}
            onClick={() => addLineItem()}
          >
            <VscDiffAdded />
          </div>
          <div
            style={{ margin: "0 0 0 5px", cursor: "pointer" }}
            onClick={() => clearLineItems()}
          >
            <VscDebugRestart />
          </div>
        </div>
      </div>
    </>
  );
}
