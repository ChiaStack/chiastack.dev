"use client";

import * as React from "react";

import type { Time } from "lightweight-charts";
import { LineSeries, HistogramSeries } from "lightweight-charts";
import { MACD } from "technicalindicators";

import { Series } from "./series";

export interface MacdData<TTime extends Time> {
  time: TTime;
  close: number;
}

export interface MacdSeriesProps<TTime extends Time> {
  data: MacdData<TTime>[];
  fastPeriod?: number;
  slowPeriod?: number;
  signalPeriod?: number;
  paneIndex?: number;
  macdLineOptions?: {
    color?: string;
    lineWidth?: number;
  };
  signalLineOptions?: {
    color?: string;
    lineWidth?: number;
  };
  histogramOptions?: {
    upColor?: string;
    downColor?: string;
  };
}

export const MacdSeries = <TTime extends Time>({
  data,
  fastPeriod = 12,
  slowPeriod = 26,
  signalPeriod = 9,
  paneIndex = 1,
  macdLineOptions = {
    color: "#2962FF",
    lineWidth: 2,
  },
  signalLineOptions = {
    color: "#FF6D00",
    lineWidth: 2,
  },
  histogramOptions = {
    upColor: "#26a69a",
    downColor: "#ef5350",
  },
}: MacdSeriesProps<TTime>) => {
  const { macdData, signalData, histogramData } = React.useMemo(() => {
    if (data.length === 0) {
      return {
        macdData: [],
        signalData: [],
        histogramData: [],
      };
    }

    const macdResult = MACD.calculate({
      values: data.map((d) => d.close),
      fastPeriod,
      slowPeriod,
      signalPeriod,
      SimpleMAOscillator: false,
      SimpleMASignal: false,
    });

    const startIndex = data.length - macdResult.length;

    const macdData = macdResult.map((result, index) => ({
      time: data[startIndex + index]?.time ?? (0 as TTime),
      value: result.MACD || 0,
    }));

    const signalData = macdResult.map((result, index) => ({
      time: data[startIndex + index]?.time ?? (0 as TTime),
      value: result.signal || 0,
    }));

    const histogramData = macdResult.map((result, index) => ({
      time: data[startIndex + index]?.time ?? (0 as TTime),
      value: result.histogram || 0,
      color:
        (result.histogram || 0) >= 0
          ? histogramOptions.upColor
          : histogramOptions.downColor,
    }));

    return {
      macdData,
      signalData,
      histogramData,
    };
  }, [
    data,
    fastPeriod,
    slowPeriod,
    signalPeriod,
    histogramOptions.upColor,
    histogramOptions.downColor,
  ]);

  return (
    <>
      <Series
        series={LineSeries}
        data={macdData}
        options={{
          color: macdLineOptions.color,
          lineWidth: macdLineOptions.lineWidth as any,
          priceFormat: {
            type: "price",
            precision: 4,
            minMove: 0.0001,
          },
        }}
        onInit={(series) => series.moveToPane(paneIndex)}
      />

      <Series
        series={LineSeries}
        data={signalData}
        options={{
          color: signalLineOptions.color,
          lineWidth: signalLineOptions.lineWidth as any,
          priceFormat: {
            type: "price",
            precision: 4,
            minMove: 0.0001,
          },
        }}
        onInit={(series) => series.moveToPane(paneIndex)}
      />

      <Series
        series={HistogramSeries}
        data={histogramData}
        options={{
          priceFormat: {
            type: "price",
            precision: 4,
            minMove: 0.0001,
          },
        }}
        onInit={(series) => series.moveToPane(paneIndex)}
      />
    </>
  );
};
