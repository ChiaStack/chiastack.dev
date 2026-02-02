import { ViewTransition } from "react";

import { createFileRoute } from "@tanstack/react-router";

import { Image } from "@chiastack/ui/image";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="flex h-screen w-full flex-col items-center justify-center gap-4">
      <section className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Hello "/"!</h1>
      </section>
      <section className="flex flex-col items-center justify-center">
        <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full">
          <Image.Root>
            <ViewTransition>
              <Image.Resource
                src="https://avatars.githubusercontent.com/u/38397958?v=4"
                alt="avatar"
                className="absolute inset-0 h-full w-full rounded-full object-cover"
              />
            </ViewTransition>
            <ViewTransition>
              <Image.Fallback className="absolute inset-0 flex h-full w-full animate-pulse items-center justify-center rounded-full bg-gray-200">
                C
              </Image.Fallback>
            </ViewTransition>
          </Image.Root>
        </div>
      </section>
    </main>
  );
}
