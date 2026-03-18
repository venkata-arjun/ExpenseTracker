import { BASE_URL } from "./apiPaths";

export const resolveMediaUrl = (url) => {
  if (!url) return "";

  // Leave local preview object URLs untouched.
  if (url.startsWith("blob:")) return url;

  const normalizedBase = (BASE_URL || "").replace(/\/$/, "");

  if (url.startsWith("/")) {
    return `${normalizedBase}${url}`;
  }

  try {
    const parsedUrl = new URL(url);

    // Rewrite old localhost-stored media URLs to deployed backend host.
    if (
      (parsedUrl.hostname === "localhost" ||
        parsedUrl.hostname === "127.0.0.1") &&
      normalizedBase
    ) {
      return `${normalizedBase}${parsedUrl.pathname}`;
    }

    return url;
  } catch {
    return url;
  }
};
