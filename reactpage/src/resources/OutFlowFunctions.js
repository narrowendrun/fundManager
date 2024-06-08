export function deleteLineItem(setLineData) {
  setLineData((prev) => {
    let newObj = { ...prev };
    delete newObj[subtype];
    return newObj;
  });
}
