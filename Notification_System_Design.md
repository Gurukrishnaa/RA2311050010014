# Campus Notification System - Evaluation Submission

## Overview

This project implements a campus notification system in two stages:

- Stage 1: Notification prioritization logic (Top 10)
- Stage 2: React frontend that displays notifications and supports interaction

The system also includes application logging. Logs are sent to the evaluation service and are displayed in the UI for easier debugging.

---

## Stage 1 - Notification Priority System

### Objective

Fetch notifications from the API and compute the Top 10 most important notifications based on:

- Priority: Placement > Result > Event
- Recency: latest first

### API Used

```text
GET http://20.207.122.201/evaluation-service/notifications
```

### Approach

1. Fetch all notifications from the API
2. Assign weights:
   - Placement -> 3
   - Result -> 2
   - Event -> 1
3. Sort notifications:
   - First by priority (descending)
   - Then by timestamp (descending)
4. Return the first 10 items

### Logging Integration

The code logs key steps and failures:

```ts
Log("frontend", "info", "api", "Fetching notifications");
Log("frontend", "info", "api", "Notifications fetched");
Log("frontend", "info", "api", "Top 10 notifications computed");
Log("frontend", "error", "api", "Error fetching notifications");
```

### Screenshot - Console Output

![Console output](../assets/console_output.png)

---

## Stage 2 - Frontend Application

### Objective

Build a React app that:

- Displays all notifications (with filtering and pagination)
- Displays priority notifications (Top 10)
- Allows marking notifications as viewed
- Displays application logs (local log stream + best-effort remote fetch)

### Architecture

```text
src/
  components/
    LogsPanel.tsx
    NotificationCard.tsx
  pages/
    AllNotifications.tsx
    PriorityNotifications.tsx
  services/
    NotificationService.tsx
  logStore.ts
  logger.ts
  App.tsx
```

### API Integration

Endpoints used:

```text
GET  /evaluation-service/notifications
POST /evaluation-service/logs
```

Query parameters supported for notifications:

- page
- limit
- notification_type

### Local Development

The app runs at:

```text
http://localhost:3000
```

To avoid browser CORS issues during development, the frontend uses a Vite proxy for `/evaluation-service/*`. The app calls the API using relative paths (same origin), and Vite forwards requests to the evaluation server.

### UI Design

- Built with Material UI
- Neutral, light theme (no neon or purple)
- Responsive layout (desktop and mobile)
- Clear separation of sections: Priority, All Notifications, Logs

### Screenshots - UI

#### All Notifications

![All notifications](../assets/all_notifications.png)

#### Priority Notifications

![Priority notifications](../assets/priority_notification.png)

#### Mobile View

![Mobile view](../assets/mobile_view.png)

---

## Conclusion

This implementation provides:

- Authenticated API integration
- Priority-based notification computation
- A clean, responsive frontend for viewing and filtering notifications
- Logging that is both sent to the evaluation service and visible in the UI

