import { afterEach, describe, expect, it, vi } from "vitest";
import { verifyLoginChallenge } from "@/server/turnstile";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});
function setup(token = "test-token") {
  vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "test-site-key");
  vi.stubEnv("TURNSTILE_SECRET_KEY", "test-secret");
  vi.stubEnv("BETTER_AUTH_URL", "https://www.sks-projets.ma");
  return new Request("https://www.sks-projets.ma/api/auth/sign-in/email", {
    method: "POST",
    headers: {
      origin: "https://www.sks-projets.ma",
      "x-turnstile-token": token,
    },
  });
}
describe("Turnstile login protection", () => {
  it("allows existing configuration only when both keys are absent", async () => {
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "");
    vi.stubEnv("TURNSTILE_SECRET_KEY", "");
    expect(
      await verifyLoginChallenge(new Request("https://example.test")),
    ).toBe(true);
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret");
    expect(
      await verifyLoginChallenge(new Request("https://example.test")),
    ).toBe(false);
  });
  it("rejects missing tokens before contacting Cloudflare", async () => {
    const request = setup("");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    expect(await verifyLoginChallenge(request)).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("checks success, hostname and login action", async () => {
    const request = setup();
    for (const result of [
      { success: true, hostname: "www.sks-projets.ma", action: "login" },
      { success: false, hostname: "www.sks-projets.ma", action: "login" },
      { success: true, hostname: "attacker.test", action: "login" },
      { success: true, hostname: "www.sks-projets.ma", action: "other" },
    ]) {
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json(result)));
      expect(await verifyLoginChallenge(request)).toBe(
        result.success &&
          result.hostname === "www.sks-projets.ma" &&
          result.action === "login",
      );
    }
  });
  it("fails closed on a network failure", async () => {
    const request = setup();
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    expect(await verifyLoginChallenge(request)).toBe(false);
  });
});
