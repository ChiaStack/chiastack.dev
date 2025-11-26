"use client";

import * as React from "react";

import type {
  Time,
  SeriesPartialOptionsMap,
  SeriesType,
  SeriesDefinition,
  ISeriesApi,
  IChartApi,
  SeriesDataItemTypeMap,
} from "lightweight-charts";

import { useChartContext } from "./chart.context";
import type { SeriesContext } from "./series.context";
import { SeriesContextProvider } from "./series.context";

interface Props<T extends SeriesType, TTime extends Time> {
  data: SeriesDataItemTypeMap<TTime>[T][];
  series: SeriesDefinition<T>;
  options?: SeriesPartialOptionsMap[T];
  onInit?: (series: ISeriesApi<T>, chart: IChartApi | null) => void;
  children?: React.ReactNode;
}

const SeriesWithGeneric = <T extends SeriesType, TTime extends Time>(
  { data, series: _series, options, onInit, children }: Props<T, TTime>,
  ref: React.ForwardedRef<ISeriesApi<T>>
) => {
  const chart = useChartContext("Series");
  const series = React.useRef<SeriesContext<T>>({
    _api: null,
    api() {
      if (!this._api) {
        this._api = chart.api().addSeries(_series, options);
        this._api.setData(data);
        onInit?.(this._api, chart._api);
      }
      return this._api;
    },
    free() {
      // check if parent component was removed already
      if (this._api) {
        // remove only current series
        chart.free(this._api);
        this._api = null;
      }
    },
    isDisposed() {
      return this._api === null;
    },
  });

  React.useLayoutEffect(() => {
    const currentRef = series.current;
    currentRef.api();

    return () => currentRef.free();
  }, []);

  React.useLayoutEffect(() => {
    const currentRef = series.current;
    if (options) {
      currentRef.api().applyOptions(options);
    }
  }, [options]);

  React.useImperativeHandle(ref, () => series.current.api(), []);

  return (
    <SeriesContextProvider value={series.current}>
      {children}
    </SeriesContextProvider>
  );
};

export const Series = React.forwardRef(SeriesWithGeneric) as <
  T extends SeriesType,
  TTime extends Time,
>(
  props: Props<T, TTime> & { ref?: React.ForwardedRef<ISeriesApi<T>> }
) => ReturnType<typeof SeriesWithGeneric>;
