import { useState } from "react";
import logo from "./images/logo.png";
import { useFund } from "./FundContext";
export default function Navbar() {
  // const { fundID, setFundID } = useFund();
  const [fundList, setFundList] = useState([1, 2, 3, 4]);
  const [fundName, setFundName] = useState("1");
  const handleFundChange = (item) => {
    setFundID(item);
    setFundName(item);
    console.log(item);
  };
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
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" href="/capitalschedule/">
                  Capital
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" href="/cashflowschedule/">
                  CashFlow
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" href="/feeschedule/">
                  Fee
                </a>
              </li>

              <div className="builder-nav-item">
                <li className="nav-item ">
                  <a className="nav-link active" href="#">
                    Builder
                  </a>
                </li>
              </div>

              <li
                className="nav-item dropdown"
                style={{ position: "absolute", right: "10px" }}
              >
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
                {/* <ul
                  className="dropdown-menu"
                  aria-labelledby="navbarDropdown"
                  style={{ position: "relative", right: "5px", zIndex: "500" }}
                >
                  {fundList.map((item) => {
                    return (
                      <>
                        <li key={`item${item}`}>
                          <a
                            className="dropdown-item"
                            href="#"
                            onClick={() => handleFundChange(item)}
                          >
                            {item}
                          </a>
                        </li>
                      </>
                    );
                  })}
                </ul> */}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
