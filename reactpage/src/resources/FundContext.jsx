// FundContext.js
import React, { createContext, useContext, useState } from "react";

const FundContext = createContext();

export const useFund = () => useContext(FundContext);

export const FundProvider = ({ children }) => {
  const [fundID, setFundID] = useState(1);

  return (
    <FundContext.Provider value={{ fundID, setFundID }}>
      {children}
    </FundContext.Provider>
  );
};
