import type { Metadata } from "next";

import { Hello } from "@/containers/hello";

export function generateMetadata(): Metadata {
  return {
    title: "Hello",
    description: "Hello",
  };
}

const Page = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Hello />
    </div>
  );
};

export default Page;
