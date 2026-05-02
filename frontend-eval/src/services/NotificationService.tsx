
import { Log } from "../logger";

const EVALUATION_BASE =
  import.meta.env.VITE_EVALUATION_BASE ?? "http://20.207.122.201/evaluation-service";
const BASE_URL = `${EVALUATION_BASE}/notifications`;
const TOKEN = import.meta.env.VITE_API_TOKEN;

export async function fetchNotifications(
  page = 1,
  limit = 10,
  type?: string
) {
  try {
    Log("frontend", "info", "api", "Fetching notifications");

    let url = `${BASE_URL}?page=${page}&limit=${limit}`;
    if (type) url += `&notification_type=${type}`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    if (!res.ok) throw new Error("Fetch failed");

    const data = await res.json();

    Log("frontend", "info", "api", "Notifications fetched");

    return data.notifications;
  } catch (err) {
    Log("frontend", "error", "api", "Fetch error");
    return [];
  }
}
