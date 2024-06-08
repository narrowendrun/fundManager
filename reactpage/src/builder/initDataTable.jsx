export default function InitDataTable({ title, data, CAFD, WCR, column }) {
  return (
    <>
      <div
        className="container"
        style={{
          boxShadow:
            "rgba(17, 17, 26, 0.5) 0px 8px 24px, rgba(17, 17, 26, 0.5) 0px 16px 56px, rgba(17, 17, 26, 0.5) 0px 24px 80px",
          padding: "2.5%",
          borderRadius: "15px",
        }}
      >
        <div className="container" style={{ color: "white", fontSize: "2em" }}>
          <p>{title}</p>
        </div>
        <div className="container dataTable">
          <div className="tableContainerHeadings">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                </tr>
                <tr>
                  <th>Due</th>
                </tr>
              </thead>
            </table>
          </div>

          <div className="tableContainer">
            <table>
              <thead>
                <tr>
                  {data.map((item) => {
                    return <th key={item.date}>{item.date}</th>;
                  })}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {data.map((item) => {
                    return <td key={item.date}>{item[column]}</td>;
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <br />
        <div className="container dataTable">
          <div className="tableContainerHeadings">
            <table>
              <thead>
                <tr>
                  <th>CAFD-1</th>
                </tr>
                <tr>
                  <th>WCR-1</th>
                </tr>
              </thead>
            </table>
          </div>

          <div className="tableContainer">
            <table>
              <tbody>
                <tr>
                  {CAFD.map((item) => {
                    return <td key={item.date}>{item.CAFD}</td>;
                  })}
                </tr>
                <tr>
                  {WCR.map((item) => {
                    return <td key={item.date}>{item.WCR}</td>;
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
