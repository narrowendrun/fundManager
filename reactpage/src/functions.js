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
function updateDataset(updatedData, table, setData) {
  const newDataset = {};
  // Get the existing fields from the dataset
  const fields = Object.keys(updatedData[table].dataset);
  // Initialize newDataset with empty arrays for each field
  fields.forEach((field) => {
    newDataset[field] = [];
  });
  // Populate newDataset with values from rawData
  updatedData[table].rawData.forEach((entry) => {
    fields.forEach((field) => {
      newDataset[field].push(entry[field]);
    });
  });
  setData((prevState) => ({
    ...prevState,
    [table]: {
      ...prevState[table],
      dataset: newDataset,
    },
  }));
}
export function updateRawData(table, newRawData, setData) {
  setData((prevData) => {
    const updatedData = {
      ...prevData,
      [table]: {
        ...prevData[table],
        rawData: newRawData,
      },
    };
    // Run updateDataset after setting rawData
    updateDataset(updatedData, table, setData);
    return updatedData;
  });
}
