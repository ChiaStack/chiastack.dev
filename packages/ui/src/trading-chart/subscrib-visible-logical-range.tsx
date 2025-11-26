"use client";

import * as React from "react";

import type { LogicalRange } from "lightweight-charts";

import { useChartContext } from "./chart.context";

interface Props {
  method: (range: number) => void | Promise<void>;
  enabled?: boolean;
}

export const SubscribeVisibleLogicalRange = ({
  method,
  enabled = true,
}: Props) => {
  const chart = useChartContext("SubscribeVisibleLogicalRange");

  const handleSubscribeVisibleLogicalRangeChange = React.useCallback(
    (logicalRange: LogicalRange | null) => {
      if (!logicalRange || !enabled) {
        return;
      }
      if (logicalRange.from < 10) {
        void method(logicalRange.from);
      }
    },
    [enabled, method]
  );

  React.useEffect(() => {
    const api = chart.api();
    if (enabled) {
      api
        .timeScale()
        .subscribeVisibleLogicalRangeChange(
          handleSubscribeVisibleLogicalRangeChange
        );
    } else {
      api
        .timeScale()
        .unsubscribeVisibleLogicalRangeChange(
          handleSubscribeVisibleLogicalRangeChange
        );
    }

    return () => {
      api
        .timeScale()
        .unsubscribeVisibleLogicalRangeChange(
          handleSubscribeVisibleLogicalRangeChange
        );
    };
  }, [chart, enabled, handleSubscribeVisibleLogicalRangeChange]);

  return null;
};
