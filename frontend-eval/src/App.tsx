import AllNotifications from "./pages/AllNotifications";
import PriorityNotifications from "./pages/PriorityNotifications";
import { Box, Container, Paper, Stack, Typography } from "@mui/material";

function App() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={2} sx={{ mb: 3 }}>
        <Typography variant="h4">Campus Notifications</Typography>
        <Typography color="text.secondary">
          Priority alerts first, then the complete feed.
        </Typography>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", md: "5fr 7fr" },
          alignItems: "start",
        }}
      >
        <Paper variant="outlined" sx={{ p: 2 }}>
          <PriorityNotifications />
        </Paper>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <AllNotifications />
        </Paper>
      </Box>
    </Container>
  );
}

export default App;
