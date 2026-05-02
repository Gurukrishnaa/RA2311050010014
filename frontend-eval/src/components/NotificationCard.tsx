import { Card, CardActionArea, CardContent, Chip, Stack, Typography } from "@mui/material";

interface Props {
  notification: any;
  viewed: boolean;
  onClick: () => void;
}

export default function NotificationCard({ notification, viewed, onClick }: Props) {
  const type = String(notification?.Type ?? "");
  const chipColor =
    type === "Placement" ? ("warning" as const) : type === "Result" ? ("info" as const) : ("success" as const);

  return (
    <Card variant="outlined" sx={{ opacity: viewed ? 0.75 : 1 }}>
      <CardActionArea onClick={onClick}>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <Chip size="small" label={type} color={chipColor} variant="outlined" />
            {viewed && <Chip size="small" label="Viewed" variant="outlined" />}
          </Stack>

          <Typography variant="body1" sx={{ mb: 0.5 }}>
            {notification.Message}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {notification.Timestamp}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
