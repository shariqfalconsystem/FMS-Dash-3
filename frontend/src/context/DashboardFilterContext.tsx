import { createContext, useContext, useState } from "react";

type FilterType =
  | "ALL"
  | "ACTIVE"
  | "IDLE"
  | "ALERTS"
  | "DRIVERS";

const DashboardFilterContext = createContext<any>(null);

export const DashboardFilterProvider = ({ children }: any) => {
  const [filter, setFilter] = useState<FilterType>("ALL");

  return (
    <DashboardFilterContext.Provider value={{ filter, setFilter }}>
      {children}
    </DashboardFilterContext.Provider>
  );
};

export const useDashboardFilter = () =>
  useContext(DashboardFilterContext);
