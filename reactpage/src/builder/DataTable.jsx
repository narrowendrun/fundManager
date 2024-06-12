import { numberFormat } from "../resources/functions";
export default function DataTable({
  title,
  data,
  paid,
  due,
  accrued,
  CAFD,
  WCR,
}) {
  const td_style = (value) => {
    if (value < 0) {
      return { background: "red" };
    } else if (value == 0) {
      return {
        background: "rgb(225,173,1)",
        color: "black",
        borderColor: "black",
      };
    }
  };
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
                <tr>
                  <th>Paid</th>
                </tr>
                <tr>
                  <th>Accrued</th>
                </tr>
              </thead>
            </table>
          </div>

          <div className="tableContainer">
            <table>
              <thead>
                <tr>
                  {data.map((item) => {
                    return (
                      <th
                        key={`${item.duration} ${item.fiscal_year}`}
                      >{`${item.duration} ${item.fiscal_year}`}</th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {due.map((item) => {
                    return (
                      <td key={item.index} style={td_style(item.due)}>
                        {numberFormat(item.due)}
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  {paid.map((item) => {
                    return (
                      <td key={item.index} style={td_style(item.paid)}>
                        {numberFormat(item.paid)}
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  {accrued.map((item) => {
                    return (
                      <td key={item.index} style={td_style(item.accrued)}>
                        {numberFormat(item.accrued)}
                      </td>
                    );
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
                  <th>CAFD-n</th>
                </tr>
                <tr>
                  <th>WCR-n</th>
                </tr>
              </thead>
            </table>
          </div>

          <div className="tableContainer">
            <table>
              <tbody>
                <tr>
                  {CAFD.map((item) => {
                    return (
                      <td key={item.index} style={td_style(item.CAFD)}>
                        {numberFormat(item.CAFD)}
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  {WCR.map((item) => {
                    return (
                      <td key={item.index} style={td_style(item.WCR)}>
                        {numberFormat(item.WCR)}
                      </td>
                    );
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
