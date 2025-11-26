"use client";

import * as React from "react";

import type { IChartApi, ChartOptions, DeepPartial } from "lightweight-charts";
import { createChart } from "lightweight-charts";

import { ChartContextProvider } from "./chart.context";
import type { ChartContext } from "./chart.context";

export interface ChartContainerProps {
  children: React.ReactNode;
  container: HTMLDivElement;
  layout?: DeepPartial<ChartOptions["layout"]>;
  initOptions?: DeepPartial<ChartOptions>;
  onInit?: (chart: IChartApi) => void;
}

interface ChartProps
  extends Omit<ChartContainerProps, "container">,
    Omit<React.ComponentPropsWithoutRef<"div">, "children"> {}

export const Chart = React.forwardRef<IChartApi, ChartProps>(
  ({ children, layout, initOptions, onInit, ...props }, ref) => {
    const [container, setContainer] = React.useState<HTMLDivElement | null>(
      null
    );
    const handleRef = React.useCallback(
      (ref: HTMLDivElement) => setContainer(ref),
      []
    );
    return (
      <div ref={handleRef} {...props}>
        {container && (
          <ChartContainer
            ref={ref}
            container={container}
            layout={layout}
            onInit={onInit}
            initOptions={initOptions}>
            {children}
          </ChartContainer>
        )}
      </div>
    );
  }
);

export const ChartContainer = React.forwardRef<IChartApi, ChartContainerProps>(
  ({ children, container, layout, initOptions, onInit }, ref) => {
    const chartApiRef = React.useRef<ChartContext>({
      _api: null,
      api() {
        if (!this._api) {
          this._api = createChart(container, {
            ...initOptions,
            layout,
            width: container.clientWidth,
          });
          onInit?.(this._api);
        }
        return this._api;
      },
      free(series) {
        if (this._api && series) {
          this._api.removeSeries(series);
        }
      },
    });

    React.useLayoutEffect(() => {
      const currentRef = chartApiRef.current;
      const chart = currentRef.api();

      const handleResize = () => {
        chart.applyOptions({
          width: container.clientWidth,
        });
      };

      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
        chartApiRef.current._api = null;
        chart.remove();
      };
    }, [container]);

    React.useLayoutEffect(() => {
      const currentRef = chartApiRef.current;
      currentRef.api();
    }, []);

    React.useLayoutEffect(() => {
      const currentRef = chartApiRef.current;
      if (initOptions) {
        currentRef.api().applyOptions(initOptions);
      }
    }, [initOptions]);

    React.useImperativeHandle(ref, () => chartApiRef.current.api(), []);

    React.useEffect(() => {
      const currentRef = chartApiRef.current;
      if (layout) {
        currentRef.api().applyOptions({ layout });
      }
    }, [layout]);

    return (
      <ChartContextProvider value={chartApiRef.current}>
        {children}
      </ChartContextProvider>
    );
  }
);
