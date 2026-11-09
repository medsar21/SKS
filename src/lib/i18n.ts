export const locales = ["fr", "ar", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";
export const timeZone = "Africa/Casablanca";
export const dictionaries = {
  fr: { catalogue: "Catalogue", customer: "Espace client", direction: "ltr" },
  ar: { catalogue: "المنتجات", customer: "فضاء العملاء", direction: "rtl" },
  en: { catalogue: "Catalogue", customer: "Customer portal", direction: "ltr" },
} as const;
export function formatMoney(amount: number, locale: Locale = defaultLocale) {
  return new Intl.NumberFormat(
    locale === "fr" ? "fr-MA" : locale === "ar" ? "ar-MA" : "en-MA",
    { style: "currency", currency: "MAD" },
  ).format(amount);
}
export function formatDate(date: Date, locale: Locale = defaultLocale) {
  return new Intl.DateTimeFormat(locale, {
    timeZone,
    dateStyle: "medium",
  }).format(date);
}
