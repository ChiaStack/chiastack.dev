import { defineI18n } from "fumadocs-core/i18n";

export const i18n = defineI18n({
  parser: "dir",
  languages: ["en", "zh"],
  defaultLanguage: "en",
  hideLocale: "default-locale",
});
