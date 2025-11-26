import type { IChartApi, ISeriesApi, SeriesType } from "lightweight-charts";

import { createContext } from "../utils/create-context";

export interface ChartContext {
  _api: IChartApi | null;
  api: () => IChartApi;
  free: (series: ISeriesApi<SeriesType>) => void;
}

export const [ChartContextProvider, useChartContext] =
  createContext<ChartContext>({
    namespace: "Chart",
  });
