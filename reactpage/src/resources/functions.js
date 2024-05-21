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
  if (!fields) {
    return { query: `SELECT * FROM ${table} WHERE fund_id=${fundID}` };
  } else {
    return { query: `SELECT ${fields} FROM ${table} WHERE fund_id=${fundID}` };
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
  }).format(value);
