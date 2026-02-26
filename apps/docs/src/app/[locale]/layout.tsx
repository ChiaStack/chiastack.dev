import "../global.css";
import { Inter } from "next/font/google";

import { Analytics } from "@vercel/analytics/react";
import { defineI18nUI } from "fumadocs-ui/i18n";
import { RootProvider } from "fumadocs-ui/provider/next";

import { i18n } from "@/lib/i18n";

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
      <body className="flex min-h-screen flex-col">
        <RootProvider
          i18n={provider(locale)}
          theme={{
            enabled: true,
            enableSystem: true,
          }}>
          {children}
        </RootProvider>
        <Analytics />
      </body>
    </html>
  );
}
