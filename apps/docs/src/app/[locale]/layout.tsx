import { defineI18nUI } from "fumadocs-ui/i18n";
import { RootProvider } from "fumadocs-ui/provider/next";
import { Inter } from "next/font/google";

import { i18n } from "@/lib/i18n";

import "../global.css";

const inter = Inter({
  subsets: ["latin"],
});

// eslint-disable-next-line @typescript-eslint/unbound-method
const { provider } = defineI18nUI(i18n, {
  translations: {
    en: {
      displayName: "English",
    },
    zh: {
      displayName: "Chinese",
      search: "搜尋文檔",
    },
  },
});

export default async function Layout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider i18n={provider(locale)}>{children}</RootProvider>
      </body>
    </html>
  );
}
