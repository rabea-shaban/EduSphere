import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !["ar", "en"].includes(locale)) {
    locale = "ar";
  }

  let messages = {};
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (err) {
    messages = (await import(`../../messages/ar.json`)).default;
  }

  return {
    locale,
    messages,
  };
});
