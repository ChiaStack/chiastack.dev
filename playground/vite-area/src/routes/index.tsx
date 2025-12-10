import { createFileRoute } from "@tanstack/react-router";

import { Image } from "@chiastack/ui/image";
import { dayjs } from "@chiastack/utils/day";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="flex flex-col items-center justify-center h-screen w-full gap-4">
      <section className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Hello "/"!</h1>
        <span className="text-sm text-gray-500">
          {dayjs().format("YYYY-MM-DD HH:mm:ss")}
        </span>
      </section>
      <section className="flex flex-col items-center justify-center">
        <Image.Root className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
          <Image.Resource
            src="https://avatars.githubusercontent.com/u/38397958?v=4"
            alt="avatar"
          />
          <Image.Fallback className="bg-gray-200 animate-pulse w-full h-full flex items-center justify-center" />
        </Image.Root>
      </section>
    </main>
  );
}
