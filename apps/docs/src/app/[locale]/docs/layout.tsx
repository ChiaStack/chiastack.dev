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
      {children}
    </DocsLayout>
  );
}
