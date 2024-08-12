import { useEffect, useState } from "react";
import { numberFormat } from "../resources/functions";
export default function ReportLineItem({ title, data, type }) {
  function formatData(type, value) {
    if (type == "integer" || type == "date") return value;
    if (type == "currency") return numberFormat(value);
    if (type == "percentage") return `${value}%`;
  }
  const [style, setStyle] = useState({});
  const [value, setValue] = useState("");
  useEffect(() => {
    if (data <= 0) {
      setStyle({ backgroundColor: "orange" });
    } else {
      setStyle({});
    }
    setValue(formatData(type, data));
  }, [data]);
  return (
    <>
      <div className="reportTile">
        <p className="heading">{title}</p>
        <p className="data" style={style}>
          {value}
        </p>
      </div>
    </>
  );
}
