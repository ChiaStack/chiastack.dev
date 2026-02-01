"use client";

import type { Time } from "lightweight-charts";
import { CandlestickSeries } from "lightweight-charts";

import { ErrorBoundary } from "@chiastack/ui/error-boundary";
import { Chart } from "@chiastack/ui/trading-chart/chart";
import { MacdSeries } from "@chiastack/ui/trading-chart/macd-series";
import { RsiSeries } from "@chiastack/ui/trading-chart/rsi-series";
import { Series } from "@chiastack/ui/trading-chart/series";
import { dayjs } from "@chiastack/utils/day";

const MOCK_DATA = Array.from({ length: 100 }, (_, i) => {
  const basePrice = 100;
  const volatility = 0.02;
  const trend = Math.sin(i * 0.1) * 0.01;
  const random = (Math.random() - 0.5) * volatility;
  const price = basePrice * (1 + trend + random);

  return {
    time: dayjs()
      .subtract(99 - i, "day")
      .unix() as Time,
    open: price * (1 + (Math.random() - 0.5) * 0.01),
    high: price * (1 + Math.random() * 0.02),
    low: price * (1 - Math.random() * 0.02),
    close: price,
  };
});

export const TradingView = () => {
  return (
    <div className="h-full w-full">
      <ErrorBoundary fallback={<div>Error</div>}>
        <div className="h-[600px] w-full">
          <Chart className="h-full w-full">
            <Series
              series={CandlestickSeries}
              data={MOCK_DATA}
              options={{
                upColor: "#26a69a",
                downColor: "#ef5350",
                borderVisible: false,
                wickUpColor: "#26a69a",
                wickDownColor: "#ef5350",
              }}
            />

            <MacdSeries
              data={MOCK_DATA}
              paneIndex={1}
              fastPeriod={12}
              slowPeriod={26}
              signalPeriod={9}
              macdLineOptions={{
                color: "#2962FF",
                lineWidth: 1.5,
              }}
              signalLineOptions={{
                color: "#FF6D00",
                lineWidth: 1.5,
              }}
              histogramOptions={{
                upColor: "#26a69a",
                downColor: "#ef5350",
              }}
            />

            <RsiSeries
              data={MOCK_DATA}
              paneIndex={2}
              period={14}
              overboughtLevel={70}
              oversoldLevel={30}
              rsiLineOptions={{
                color: "#9C27B0",
                lineWidth: 1.5,
              }}
              overboughtOptions={{
                color: "#FF5722",
                lineWidth: 1,
              }}
              oversoldOptions={{
                color: "#4CAF50",
                lineWidth: 1,
              }}
              showLevels={true}
            />
          </Chart>
        </div>
      </ErrorBoundary>
    </div>
  );
};
