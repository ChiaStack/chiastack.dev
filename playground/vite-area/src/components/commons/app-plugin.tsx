import { useEffect } from "react";

import { initDayjs } from "@chiastack/utils/day";

export const AppPlugin = () => {
  useEffect(() => {
    initDayjs();
  }, []);

  return null;
};
