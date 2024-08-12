import { numberFormat } from "../resources/functions";
const SanpshotReport = ({ dbData }) => {
  const data = {
    headers: ["Acquired", "Sold", "Remaining"],
    rows: [
      ["Count", dbData.count_acq, dbData.count_sold, dbData.count_hold],
      [
        "Legal Balance",
        numberFormat(dbData.legal_balance_acq),
        numberFormat(dbData.legal_balance_sold),
        numberFormat(dbData.legal_balance_hold),
      ],
      [
        "Property Value",
        numberFormat(dbData.property_value_acq),
        numberFormat(dbData.property_value_sold),
        numberFormat(dbData.property_value_hold),
      ],
      [
        "Investment",
        numberFormat(dbData.investment_acq),
        numberFormat(dbData.investment_sold),
        numberFormat(dbData.investment_hold),
      ],
    ],
  };

  return (
    <div className="reportSnapshot">
      <div className="reportHeadings">
        <p className="headingStyle">Acquired</p>
        <p className="headingStyle">Sold</p>
        <p className="headingStyle">Remaining</p>
      </div>
      {data.rows.map((row) => {
        return (
          <div className="reportDataLine" key={JSON.stringify(row)}>
            {row.map((item, index) => {
              return (
                <p
                  key={index}
                  className={/[a-zA-Z]/.test(item) ? `headingStyle` : ``}
                >
                  {item}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default SanpshotReport;
