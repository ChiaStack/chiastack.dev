"use client";

import { useTheme } from "next-themes";
import Link from "next/link";
import type { RefObject } from "react";
import { useRef } from "react";

import { Leva } from "leva";
import { useHover } from "usehooks-ts";

import { GL } from "@/components/gl";
import { Button } from "@/components/ui/button";

export const Home = () => {
  const ref = useRef<HTMLButtonElement>(null);
  const isHovered = useHover(ref as RefObject<HTMLElement>);
  const { resolvedTheme } = useTheme();

  return (
    <section className="relative flex h-[calc(90vh-64px)] flex-col justify-between">
      <GL hovering={isHovered} isDark={resolvedTheme === "dark"} />
      <Leva hidden />

      <div className="relative mt-auto pb-16 text-center">
        <h1 className="font-sentient text-5xl sm:text-6xl md:text-7xl">
          ChiaStack
        </h1>
        <p className="text-foreground/60 mx-auto mt-8 max-w-[440px] font-mono text-sm text-balance sm:text-base">
          A collection of packages for building web applications.
        </p>

        <Link className="contents" href="/docs">
          <Button className="mt-14" ref={ref}>
            Get Started
          </Button>
        </Link>
      </div>
      <span className="text-foreground/60 absolute bottom-4 left-1/2 mx-auto block -translate-x-1/2 text-sm">
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
