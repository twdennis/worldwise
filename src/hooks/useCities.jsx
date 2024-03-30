import { useContext } from "react";

import { CitiesContext } from "../contexts/CitiesContext";

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined) throw new Error("Context error...");
  return context;
}
export { useCities };
