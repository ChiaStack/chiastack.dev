import { Outlet, createRootRoute, HeadContent } from "@tanstack/react-router";

import { AppPlugin } from "@/components/commons/app-plugin";

export const Route = createRootRoute({
  component: () => (
    <>
      <HeadContent />
      <AppPlugin />
      <Outlet />
    </>
  ),
  notFoundComponent: () => (
    <div className="flex flex-col items-center justify-center h-screen w-full">
      <span>Not Found</span>
    </div>
  ),
  errorComponent: () => (
    <div className="flex flex-col items-center justify-center h-screen w-full">
      <span>Error</span>
    </div>
  ),
});
