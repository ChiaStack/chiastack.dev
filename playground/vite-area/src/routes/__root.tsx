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
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <span>Not Found</span>
    </div>
  ),
  errorComponent: () => (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <span>Error</span>
    </div>
  ),
});
