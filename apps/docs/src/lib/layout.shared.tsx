import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

import { i18n } from "@/lib/i18n";

export function baseOptions(_locale: string): BaseLayoutProps {
  return {
    nav: {
      title: "Chia Stack",
    },
    i18n,
  };
}
