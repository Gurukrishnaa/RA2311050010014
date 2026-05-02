// src/pages/PriorityNotifications.tsx

import { useEffect, useState } from "react";
import { fetchNotifications } from "../services/NotificationService";
import { Box, Chip, Stack, Typography } from "@mui/material";

const priorityMap: any = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

export default function PriorityNotifications() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const res = await fetchNotifications();

    const sorted = res
      .sort((a, b) => {
        const p = priorityMap[b.Type] - priorityMap[a.Type];
        if (p !== 0) return p;
        return new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime();
      })
      .slice(0, 10);

    setData(sorted);
    setLoading(false);
  }

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
        <Typography variant="h6">Priority Notifications</Typography>
        <Chip size="small" label="Top 10" variant="outlined" />
      </Stack>

      <Stack spacing={1} sx={{ mt: 2 }}>
        {loading ? (
          <Typography color="text.secondary">Loading…</Typography>
        ) : data.length === 0 ? (
          <Typography color="text.secondary">No priority notifications.</Typography>
        ) : (
          data.map((n) => (
            <Stack key={n.ID} spacing={0.25} sx={{ py: 0.75 }}>
              <Typography variant="subtitle2">{n.Type}</Typography>
              <Typography variant="body2" color="text.secondary">
                {n.Message}
              </Typography>
            </Stack>
          ))
        )}
      </Stack>
    </Box>
  );
}
