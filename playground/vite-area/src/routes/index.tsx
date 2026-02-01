import { createFileRoute } from "@tanstack/react-router";

import { Image } from "@chiastack/ui/image";
import { dayjs } from "@chiastack/utils/day";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="flex h-screen w-full flex-col items-center justify-center gap-4">
      <section className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Hello "/"!</h1>
        <span className="text-sm text-gray-500">
          {dayjs().format("YYYY-MM-DD HH:mm:ss")}
        </span>
      </section>
      <section className="flex flex-col items-center justify-center">
        <Image.Root className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full">
          <Image.Resource
            src="https://avatars.githubusercontent.com/u/38397958?v=4"
            alt="avatar"
          />
          <Image.Fallback className="flex h-full w-full animate-pulse items-center justify-center bg-gray-200" />
        </Image.Root>
      </section>
    </main>
  );
}
