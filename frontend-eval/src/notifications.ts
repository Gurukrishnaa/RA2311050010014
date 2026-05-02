import { Log } from "./logger";

interface Notification {
  ID: string;
  Type: "Placement" | "Result" | "Event";
  Message: string;
  Timestamp: string;
}

interface ApiResponse {
  notifications: Notification[];
}

const BASE_URL = "http://20.207.122.201/evaluation-service/notifications";
const TOKEN = import.meta.env.VITE_API_TOKEN;

const priorityMap: Record<string, number> = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

export async function getTopNotifications() {
  try {
    Log("frontend", "info", "api", "Fetching notifications");

    const res = await fetch(BASE_URL, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch notifications");
    }

    const data: ApiResponse = await res.json();

    Log("frontend", "info", "api", "Notifications fetched");

    const sorted = data.notifications
      .sort((a, b) => {
        // Priority first
        const priorityDiff =
          priorityMap[b.Type] - priorityMap[a.Type];

        if (priorityDiff !== 0) return priorityDiff;

        // Then latest timestamp
        return (
          new Date(b.Timestamp).getTime() -
          new Date(a.Timestamp).getTime()
        );
      })
      .slice(0, 10);

    Log("frontend", "info", "api", "Top 10 notifications computed");

    console.log("Top 10 Notifications:", sorted);

    return sorted;
  } catch (err: any) {
    Log("frontend", "error", "api", "Error fetching notifications");
    console.error(err.message);
  }
}