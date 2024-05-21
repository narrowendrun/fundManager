import { useState } from "react";

export default function InFlowLineItem({ selectorOpacity, componentOpacity }) {
  const [opacity, setOpacity] = useState(selectorOpacity);
  const [compOpacity, setCompOpacity] = useState(componentOpacity);
  const [list, setList] = useState([
    "net proceeds",
    "working capital reserves",
  ]);
  const [selection, setSelection] = useState(list[0]);
  let style = { opacity: opacity };
  let otherStyle = { opacity: compOpacity };
  function selectInFlow() {
    setOpacity((prevOpacity) =>
      prevOpacity === selectorOpacity ? 1 : selectorOpacity
    );
    setCompOpacity((prevOpacity) =>
      prevOpacity === componentOpacity ? 1 : componentOpacity
    );
  }
  function handleSelection(item) {
    setSelection(item);
  }
  return (
    <>
      <div className="container inflow_line_item_container" style={otherStyle}>
        <div className="inflow_line_item_addbuttons">
          <div
            className="btn btn-outline-primary"
            onClick={() => selectInFlow()}
          >
            +
          </div>
        </div>
        <div className="dropdown inflow_line_item_selector" style={style}>
          <button
            className="btn btn-outline-primary dropdown-toggle inflow_dropdown_buttons"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            disabled={style.opacity == 1 ? false : true}
          >
            {selection}
          </button>
          <ul className="dropdown-menu inflow-dropdown-menu">
            {list.map((item) => {
              return (
                <li key={item}>
                  <a
                    href="#"
                    className="dropdown-item"
                    onClick={() => handleSelection(item)}
                  >
                    {item}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}
