export const calulateLineData = (
  dataArray,
  upperCAFD,
  upperWCR,
  allocation
) => {
  dataArray[0].paid = Math.min(
    dataArray[0].due,
    (upperCAFD[0] * allocation) / 100
  );
  if (dataArray[0].paid < 0) {
    dataArray[0].paid = 0;
  }
  dataArray[0].accrued = dataArray[0].due - dataArray[0].paid;
  dataArray[0].CAFD = upperCAFD[0] - dataArray[0].paid;
  dataArray[0].WCR = upperWCR[0];

  for (let i = 1; i < dataArray.length; i++) {
    // console.log(
    //   dataArray[i].due,
    //   dataArray[i - 1].accrued,
    //   (dataArray[i].due += dataArray[i - 1].accrued)
    // );
    dataArray[i].due += dataArray[i - 1].accrued;

    dataArray[i].paid = Math.min(
      dataArray[i].due,
      (upperCAFD[i] * allocation) / 100
    );
    if (dataArray[i].paid < 0) {
      dataArray[i].paid = 0;
    }
    dataArray[i].accrued = dataArray[i].due - dataArray[i].paid;
    dataArray[i].CAFD = upperCAFD[i] - dataArray[i].paid;
    dataArray[i].WCR = upperWCR[i];
  }
  return dataArray;
};
export const updateOutFlowData = (prevData, newLineItem, subtype) => {
  const index = prevData.findIndex((item) => item.lineItem.title === subtype);
  if (index !== -1) {
    // Update existing entry
    const updatedData = [...prevData];
    updatedData[index] = {
      ...updatedData[index],
      lineItem: newLineItem,
    };
    return updatedData;
  } else {
    // Add new entry
    return [...prevData, { lineItem: newLineItem }];
  }
};
export const td_style = (value) => {
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
