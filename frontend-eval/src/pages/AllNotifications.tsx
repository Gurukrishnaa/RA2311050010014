import { useEffect, useState } from "react";
import { fetchNotifications } from "../services/NotificationService";
import NotificationCard from "../components/NotificationCard";
import { Log } from "../logger";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";

export default function AllNotifications() {
  const [data, setData] = useState<any[]>([]);
  const [viewed, setViewed] = useState<Set<string>>(new Set());
  const [type, setType] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    load();
  }, [type]);

  async function load() {
    setLoading(true);
    const res = await fetchNotifications(1, 10, type);
    setData(res);
    setLoading(false);
  }

  function markViewed(id: string) {
    setViewed(prev => new Set(prev).add(id));
    Log("frontend", "info", "state", "Notification marked viewed");
  }

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
        <Typography variant="h6">All Notifications</Typography>

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="notif-type">Type</InputLabel>
          <Select
            labelId="notif-type"
            label="Type"
            value={type}
            onChange={(e) => setType(String(e.target.value))}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <Stack spacing={1.5} sx={{ mt: 2 }}>
        {loading ? (
          <Typography color="text.secondary">Loading…</Typography>
        ) : data.length === 0 ? (
          <Typography color="text.secondary">No notifications found.</Typography>
        ) : (
          data.map((n) => (
            <NotificationCard
              key={n.ID}
              notification={n}
              viewed={viewed.has(n.ID)}
              onClick={() => markViewed(n.ID)}
            />
          ))
        )}
      </Stack>
    </Box>
  );
}
