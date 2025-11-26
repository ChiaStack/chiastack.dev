"use client";

import * as React from "react";

import type { Time } from "lightweight-charts";
import { LineSeries } from "lightweight-charts";
import { RSI } from "technicalindicators";

import { Series } from "./series";

export interface RsiData<TTime extends Time> {
  time: TTime;
  close: number;
}

export interface RsiSeriesProps<TTime extends Time> {
  data: RsiData<TTime>[];
  period?: number;
  paneIndex?: number;
  overboughtLevel?: number;
  oversoldLevel?: number;
  rsiLineOptions?: {
    color?: string;
    lineWidth?: number;
  };
  overboughtOptions?: {
    color?: string;
    lineWidth?: number;
  };
  oversoldOptions?: {
    color?: string;
    lineWidth?: number;
  };
  showLevels?: boolean;
}

export const RsiSeries = <TTime extends Time>({
  data,
  period = 14,
  paneIndex = 2,
  overboughtLevel = 70,
  oversoldLevel = 30,
  rsiLineOptions = {
    color: "#9C27B0",
    lineWidth: 2,
  },
  overboughtOptions = {
    color: "#FF5722",
    lineWidth: 1,
  },
  oversoldOptions = {
    color: "#4CAF50",
    lineWidth: 1,
  },
  showLevels = true,
}: RsiSeriesProps<TTime>) => {
  const { rsiData, overboughtData, oversoldData } = React.useMemo(() => {
    if (data.length === 0) {
      return {
        rsiData: [],
        overboughtData: [],
        oversoldData: [],
      };
    }

    const rsiResult = RSI.calculate({
      values: data.map((d) => d.close),
      period,
    });

    const startIndex = data.length - rsiResult.length;

    const rsiData = rsiResult.map((value, index) => ({
      time: data[startIndex + index]?.time ?? (0 as TTime),
      value: value || 0,
    }));

    const overboughtData = data.map((item) => ({
      time: item.time,
      value: overboughtLevel,
    }));

    const oversoldData = data.map((item) => ({
      time: item.time,
      value: oversoldLevel,
    }));

    return {
      rsiData,
      overboughtData,
      oversoldData,
    };
  }, [data, period, overboughtLevel, oversoldLevel]);

  return (
    <>
      <Series
        series={LineSeries}
        data={rsiData}
        options={{
          color: rsiLineOptions.color,
          lineWidth: rsiLineOptions.lineWidth as any,
          priceFormat: {
            type: "price",
            precision: 2,
            minMove: 0.01,
          },
        }}
        onInit={(series) => {
          series.moveToPane(paneIndex);
          series.priceScale().applyOptions({
            scaleMargins: {
              top: 0.1,
              bottom: 0.1,
            },
          });
        }}
      />

      {showLevels && (
        <Series
          series={LineSeries}
          data={overboughtData}
          options={{
            color: overboughtOptions.color,
            lineWidth: overboughtOptions.lineWidth as any,
            lineStyle: 2,
            priceFormat: {
              type: "price",
              precision: 2,
              minMove: 0.01,
            },
          }}
          onInit={(series) => series.moveToPane(paneIndex)}
        />
      )}

      {showLevels && (
        <Series
          series={LineSeries}
          data={oversoldData}
          options={{
            color: oversoldOptions.color,
            lineWidth: oversoldOptions.lineWidth as any,
            lineStyle: 2,
            priceFormat: {
              type: "price",
              precision: 2,
              minMove: 0.01,
            },
          }}
          onInit={(series) => series.moveToPane(paneIndex)}
        />
      )}
    </>
  );
};
