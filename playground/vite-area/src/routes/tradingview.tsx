import { createFileRoute } from "@tanstack/react-router";

import { TradingView } from "@/containers/tradingview";

export const Route = createFileRoute("/tradingview")({
  component: RouteComponent,
});

function RouteComponent() {
  return <TradingView />;
}
