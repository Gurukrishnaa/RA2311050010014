type Stack = "frontend";
type Level = "debug" | "info" | "warn" | "error" | "fatal";
type Package =
  | "api"
  | "component"
  | "hook"
  | "page"
  | "state"
  | "style";

interface LogResponse {
  logID: string;
  message: string;
}

const TOKEN = import.meta.env.VITE_API_TOKEN;
const BASE_URL = import.meta.env.VITE_BASE_URL;

function getJwtExpSeconds(token: string | undefined): number | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const payloadJson = atob(padded);
    const payload = JSON.parse(payloadJson) as {
      exp?: number;
      MapClaims?: { exp?: number };
    };

    if (typeof payload.exp === "number") return payload.exp;
    if (typeof payload.MapClaims?.exp === "number") return payload.MapClaims.exp;
    return null;
  } catch {
    return null;
  }
}

export async function Log(
  stack: Stack,
  level: Level,
  pkg: Package,
  message: string
): Promise<LogResponse | void> {
  try {
    if (!BASE_URL) {
      console.error("Logging failed: missing VITE_BASE_URL (check frontend-eval/.env)");
      return;
    }

    const expSeconds = getJwtExpSeconds(TOKEN);
    if (!TOKEN) {
      console.error("Logging failed: missing VITE_API_TOKEN (check frontend-eval/.env)");
      return;
    }
    if (expSeconds && expSeconds * 1000 <= Date.now()) {
      console.error(
        `Logging failed: VITE_API_TOKEN is expired (exp ${new Date(expSeconds * 1000).toISOString()}). Update frontend-eval/.env and restart dev server.`
      );
      return;
    }

    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({
        stack,
        level,
        package: pkg,
        message,
      }),
    });

    if (!res.ok) {
      if (res.status === 401) {
        const expSeconds2 = getJwtExpSeconds(TOKEN);
        if (expSeconds2 && expSeconds2 * 1000 <= Date.now()) {
          throw new Error(
            `HTTP 401 (token expired at ${new Date(expSeconds2 * 1000).toISOString()}; update frontend-eval/.env and restart dev server)`
          );
        }
        throw new Error(
          "HTTP 401 (unauthorized; check VITE_API_TOKEN value, and restart dev server after updating frontend-eval/.env)"
        );
      }
      throw new Error(`HTTP ${res.status}`);
    }

    const data: LogResponse = await res.json();
    console.log("Log success:", data);

    return data;
  } catch (err: any) {
    console.error("Logging failed:", err.message);
  }
}
