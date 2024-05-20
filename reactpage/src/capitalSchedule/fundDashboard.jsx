import DebtDataHeadings from "./debtDataHeadings";
import EquityDataHeadings from "./equityDataHeadings";

export default function FundDashboard({ fundData, debtData, equityData }) {
  const numberFormat = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  return (
    <>
      <div className="fundName">
        <center>
          <h3>{fundData[0] !== undefined ? fundData[0].name : "FUND"}</h3>
        </center>
      </div>
      <div className="fundDashboard">
        <div className="row fundDashboardSubSections">
          {fundData.map((item) => {
            return (
              <div key={item.fund_id}>
                <div
                  className="row"
                  style={{
                    borderTopLeftRadius: "12.5px",
                  }}
                >
                  <div className="col">fund size</div>
                  <div className="col">{numberFormat(item.fund_size)}</div>
                </div>
                <div className="row">
                  <div className="col">acquisition term</div>
                  <div className="col">{item.acquisition_term}</div>
                </div>
                <div className="row">
                  <div className="col">start date</div>
                  <div className="col">{item.start_date}</div>
                </div>
                <div className="row">
                  <div className="col">term</div>
                  <div className="col">{item.term}</div>
                </div>
                <div
                  className="row"
                  style={{
                    borderBottomLeftRadius: "12.5px",
                  }}
                >
                  <div className="col">recylce</div>
                  <div className="col">{item.recycle}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="row fundDashboardSubSections">
          <DebtDataHeadings />
          {debtData.map((item) => {
            return (
              <div className="col" key={item.debt_type}>
                <div className="row">
                  <div className="col">{item.debt_type}</div>
                </div>
                {/* <div className="row">
                  <div className="col">{item.debt_equity_ratio}</div>
                </div> */}
                <div className="row">
                  <div className="col">{item.interest_rate}%</div>
                </div>
                <div className="row">
                  <div className="col">{numberFormat(item.size_usd)}</div>
                </div>
                <div className="row">
                  <div className="col">{item.splits_percent}%</div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="row fundDashboardSubSections">
          <EquityDataHeadings />
          {equityData.map((item) => {
            return (
              <div className="col" key={item.equity_type}>
                <div className="row">
                  <div className="col">{item.equity_type}</div>
                </div>

                <div className="row">
                  <div className="col">{item.preferred_percent}%</div>
                </div>

                <div className="row">
                  <div className="col">{numberFormat(item.size_usd)}</div>
                </div>

                <div className="row">
                  <div className="col">{item.splits_percent}%</div>
                </div>
                <div className="row">
                  <div className="col">{item.payment_frequency}</div>
                </div>

                <div className="row">
                  <div className="col">{item.tranche_percent}%</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
