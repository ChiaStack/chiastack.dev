import type { Metadata } from "next";

import { Home } from "@/containers/home";

export const metadata: Metadata = {
  title: "Chia Stack",
  description: "A collection of packages for building web applications.",
};

export default function HomePage() {
  return <Home />;
}
