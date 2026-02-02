import { DocsLayout } from "fumadocs-ui/layouts/docs";

import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";

export default async function Layout({
  children,
  params,
}: LayoutProps<"/[locale]/docs">) {
  const { locale } = await params;

  return (
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    <DocsLayout {...baseOptions(locale)} tree={source.pageTree[locale]!}>
      <div className="pointer-events-none absolute inset-0 -z-10 h-full w-full overflow-x-clip">
        <div className="pointer-events-none absolute top-0 right-0 -z-10 h-256 w-5xl translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/10 mask-(--mask) [--mask:radial-gradient(circle_at_center,red,transparent_69%)] [webkit-mask-image:var(--mask)] max-md:hidden xl:right-1/2" />
        <div className="pointer-events-none fixed top-0 right-0 -z-10 h-256 w-5xl translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/5 mask-(--mask) [--mask:radial-gradient(circle_at_center,red,transparent_69%)] [webkit-mask-image:var(--mask)] max-md:hidden xl:right-1/2" />
        <div className="bg-grid-lines-xl pointer-events-none absolute top-0 right-0 -z-10 h-256 w-5xl translate-x-1/2 -translate-y-1/2 -skew-20 mask-(--mask) [--mask:radial-gradient(circle_at_center_top,red,transparent)] [webkit-mask-image:var(--mask)] max-md:hidden xl:right-1/2 dark:opacity-80" />
      </div>
      {children}
    </DocsLayout>
  );
}
