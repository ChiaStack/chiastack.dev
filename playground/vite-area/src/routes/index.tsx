import { createFileRoute } from "@tanstack/react-router";

import { dayjs } from "@chiastack/utils/day";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      Hello "/"!<span>{dayjs().format("YYYY-MM-DD HH:mm:ss")}</span>
    </div>
  );
}
