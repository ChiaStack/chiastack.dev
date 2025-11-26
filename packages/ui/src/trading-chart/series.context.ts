import type { SeriesType, ISeriesApi, IChartApi } from "lightweight-charts";

import { createContext } from "../utils/create-context";

export interface SeriesContext<T extends SeriesType> {
  _api: ISeriesApi<T> | null;
  api: () => ISeriesApi<T>;
  free: (chart?: IChartApi) => void;
  isDisposed: () => boolean;
}

export const [SeriesContextProvider, useSeriesContext] = createContext<
  SeriesContext<SeriesType>
>({
  namespace: "Series",
});
