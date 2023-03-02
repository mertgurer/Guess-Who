import React from "react";

export const DataContext = React.createContext({
  categoryData: [],
  setCategoryData: () => {},
});

export default DataContext;
