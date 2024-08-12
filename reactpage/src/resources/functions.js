export function postQuery(payload, action) {
  fetch("/api/query", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      action(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

export function querier(table, fundID, fields) {
  let non_zero_values = `SELECT
    TO_CHAR(date_trunc('month', date), 'YYYY-MM-DD') AS date,
    SUM(senior) AS senior,
    SUM(mezz) AS mezz,
    SUM(junior) AS junior,
    SUM(classa) AS classa,
    SUM(classb) AS classb
FROM
    ${table}
WHERE
    fund_id = ${fundID}
GROUP BY
    date_trunc('month', date)
ORDER BY
    date_trunc('month', date);`;
  if (
    table == "capitalreturnschedule" ||
    table == "capitaldeploymentschedule"
  ) {
    return { query: non_zero_values };
  } else {
    if (!fields) {
      return { query: `SELECT * FROM ${table} WHERE fund_id=${fundID}` };
    } else {
      return {
        query: `SELECT ${fields} FROM ${table} WHERE fund_id=${fundID}`,
      };
    }
  }
}
function updateDataset(rawData) {
  const newDataset = {};
  // Get the existing fields from the dataset
  const fields = Object.keys(rawData[0]);
  // Initialize newDataset with empty arrays for each field
  fields.forEach((field) => {
    newDataset[field] = [];
  });
  // Populate newDataset with values from rawData
  rawData.forEach((entry) => {
    fields.forEach((field) => {
      newDataset[field].push(entry[field]);
    });
  });
  return newDataset;
}
export function updateRawData(table, newRawData, setData) {
  const newDataset = updateDataset(newRawData);
  setData((prevData) => {
    const updatedData = {
      ...prevData,
      [table]: {
        ...prevData[table],
        rawData: newRawData,
        dataset: newDataset,
      },
    };
    return updatedData;
  });
}
export const getInitialFundID = () => {
  const savedFundID = localStorage.getItem("fundID");
  return savedFundID ? parseInt(savedFundID, 10) : 1;
};
export const numberFormat = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(value));

// queries.js
export const getQuarterlyQuery = (type, fundID) => `
SELECT 
  CONCAT('Q', EXTRACT(QUARTER FROM date)) AS duration,
  EXTRACT(YEAR FROM date) AS fiscal_year,
  SUM(${type}) AS due 
FROM costofcapital 
WHERE fund_id=${fundID} 
GROUP BY duration, fiscal_year 
ORDER BY fiscal_year, duration`;

export const getBiannualQuery = (type, fundID) => `
SELECT 
  CONCAT('H', EXTRACT(MONTH FROM date) < 7 ? 1 : 2) AS duration,
  EXTRACT(YEAR FROM date) AS fiscal_year,
  SUM(${type}) AS due 
FROM costofcapital 
WHERE fund_id=${fundID} 
GROUP BY duration, fiscal_year 
ORDER BY fiscal_year, duration`;

export const getAnnualQuery = (type, fundID) => `
SELECT 
  EXTRACT(YEAR FROM date) AS fiscal_year,
  SUM(${type}) AS due 
FROM costofcapital 
WHERE fund_id=${fundID} 
GROUP BY fiscal_year 
ORDER BY fiscal_year`;
