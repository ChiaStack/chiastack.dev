"use client";

import type { RefObject } from "react";
import { useRef } from "react";

import { Leva } from "leva";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useHover } from "usehooks-ts";

import { GL } from "@/components/gl";
import { Button } from "@/components/ui/button";

export const Home = () => {
  const ref = useRef<HTMLButtonElement>(null);
  const isHovered = useHover(ref as RefObject<HTMLElement>);
  const { resolvedTheme } = useTheme();

  return (
    <section className="flex flex-col h-[calc(90vh-64px)] justify-between relative">
      <GL hovering={isHovered} isDark={resolvedTheme === "dark"} />
      <Leva hidden />

      <div className="pb-16 mt-auto text-center relative">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-sentient">
          Chia Stack
        </h1>
        <p className="font-mono text-sm sm:text-base text-foreground/60 text-balance mt-8 max-w-[440px] mx-auto">
          A collection of packages for building web applications.
        </p>

        <Link className="contents" href="/docs">
          <Button className="mt-14" ref={ref}>
            Get Started
          </Button>
        </Link>
      </div>
      <span className="text-foreground/60 text-sm mx-auto block absolute bottom-4 left-1/2 -translate-x-1/2">
        Powered by{" "}
        <Link
          href="https://v0.app/templates/skal-ventures-template-tnZGzubtsTc?ref=VH1R97"
          className="font-medium underline">
          V0
        </Link>
      </span>
    </section>
  );
};
