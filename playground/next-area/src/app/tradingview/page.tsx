import type { Metadata } from "next";

import { TradingView } from "@/containers/tradingview";

export function generateMetadata(): Metadata {
  return {
    title: "TradingView",
    description: "TradingView",
  };
}

const Page = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <TradingView />
    </div>
  );
};

export default Page;
