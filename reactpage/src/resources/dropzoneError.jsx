import { useState } from "react";

export default function DropzoneError({ table, apiCall }) {
  const style = {
    border: "1px solid green",
    borderRadius: "15px",
    textAlign: "left",
    background: `${apiCall[table].status == 200 ? "lightgreen" : "red"}`,
    padding: "5%",
    whiteSpace: "pre-line",
    overflow: "scroll",
    display: `${apiCall[table].result === "" ? "none" : "block"}`,
    margin: "1%",
    ZIndex: "5",
    transition: "all 0.5s ease",
    boxShadow: "rgba(0, 0, 0, 0.56) 0px 22px 70px 4px",
    textAlign: "center",
  };
  const [show, setShow] = useState(false);

  return (
    <>
      <div className="container" style={style} onClick={() => setShow(!show)}>
        <p style={{ fontSize: "1.5em" }}>
          {table}{" "}
          <span style={{ fontWeight: "900" }}>{apiCall[table].status}</span>
        </p>
        <p
          style={{
            display: `${show ? "inline" : "none"}`,
            opacity: `${show ? 1 : 0}`,
            textAlign: "left",
          }}
        >
          {apiCall[table].result}
        </p>
      </div>
    </>
  );
}
