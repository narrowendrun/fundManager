import { useEffect, useState } from "react";
import logo from "../images/logo.png";
import { postQuery } from "./functions";
export default function Navbar({ fundID, setFundID }) {
  const [fundList, setFundList] = useState([]);
  const [fundName, setFundName] = useState("");
  const handleFundChange = (item) => {
    setFundID(item.fund_id);
    setFundName(item.name);
  };
  useEffect(() => {
    postQuery(
      { query: `SELECT fund_id, name FROM fund_information` },
      setFundList
    );
  }, []);
  useEffect(() => {
    if (fundList.length) {
      setFundName(fundList[fundID - 1].name);
      setFundID(fundList[fundID - 1].fund_id);
    }
  }, [fundList]);
  useEffect(() => {
    localStorage.setItem("fundID", fundID);
  }, [fundID]);
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            <img
              src={logo}
              alt="image here"
              style={{ width: "40px", marginRight: "10px" }}
            />
            Revolve Capital
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item nav-item-magnify">
                <a className="nav-link active" aria-current="page" href="/">
                  Home
                </a>
              </li>
              <li className="nav-item nav-item-magnify">
                <a className="nav-link active" href="/capitalschedule/">
                  Capital
                </a>
              </li>
              <li className="nav-item nav-item-magnify">
                <a className="nav-link active" href="/cashflowschedule/">
                  CashFlow
                </a>
              </li>
              <li className="nav-item nav-item-magnify">
                <a className="nav-link active" href="/feeschedule/">
                  Fee
                </a>
              </li>

              <div className="builder-nav-item">
                <li className="nav-item nav-item-magnify ">
                  <a className="nav-link active" href="#">
                    Builder
                  </a>
                </li>
              </div>

              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  onChange={handleFundChange}
                >
                  {fundName}
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  {fundList.length &&
                    fundList.map((item) => {
                      return (
                        <li key={item.fund_id}>
                          <a
                            className="dropdown-item"
                            href="#"
                            onClick={() => handleFundChange(item)}
                          >
                            {item.name}
                          </a>
                        </li>
                      );
                    })}
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
