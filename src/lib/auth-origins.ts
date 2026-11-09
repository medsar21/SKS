const sksOrigins = ["https://www.sks-projets.ma", "https://sks-projets.ma"];

export function getTrustedAuthOrigins(
  baseURL: string,
  nodeEnv: string | undefined,
) {
  return [
    ...new Set([
      new URL(baseURL).origin,
      ...(nodeEnv === "production" ? sksOrigins : []),
      ...(nodeEnv === "development"
        ? ["http://localhost:3000", "http://127.0.0.1:3000"]
        : []),
    ]),
  ];
}
