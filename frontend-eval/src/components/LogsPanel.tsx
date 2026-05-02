import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RefreshIcon from "@mui/icons-material/Refresh";
import { clearLogs, useLogs } from "../logStore";
import type { LogEntry } from "../logStore";
import { fetchRemoteLogs } from "../logger";

function formatTs(ts: number) {
  return new Date(ts).toLocaleString();
}

export default function LogsPanel() {
  const logs = useLogs();
  const [level, setLevel] = useState<string>("all");
  const [q, setQ] = useState<string>("");
  const [remote, setRemote] = useState<string>("");
  const [remoteErr, setRemoteErr] = useState<string>("");
  const [remoteLoading, setRemoteLoading] = useState<boolean>(false);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return logs.filter((l) => {
      if (level !== "all" && l.level !== level) return false;
      if (!query) return true;
      return (
        l.message.toLowerCase().includes(query) ||
        l.pkg.toLowerCase().includes(query) ||
        l.level.toLowerCase().includes(query)
      );
    });
  }, [logs, level, q]);

  async function refreshRemote() {
    setRemoteErr("");
    setRemoteLoading(true);
    try {
      const data = await fetchRemoteLogs();
      setRemote(JSON.stringify(data, null, 2));
    } catch (e: any) {
      setRemoteErr(String(e?.message ?? e));
      setRemote("");
    } finally {
      setRemoteLoading(false);
    }
  }

  function copyText(text: string) {
    void navigator.clipboard.writeText(text);
  }

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
        <Stack spacing={0.25}>
          <Typography variant="h6">Logs</Typography>
          <Typography variant="body2" color="text.secondary">
            Local log stream + optional remote fetch.
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <Select size="small" value={level} onChange={(e) => setLevel(String(e.target.value))}>
            <MenuItem value="all">All levels</MenuItem>
            <MenuItem value="debug">debug</MenuItem>
            <MenuItem value="info">info</MenuItem>
            <MenuItem value="warn">warn</MenuItem>
            <MenuItem value="error">error</MenuItem>
            <MenuItem value="fatal">fatal</MenuItem>
          </Select>

          <TextField
            size="small"
            placeholder="Search…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <Tooltip title="Clear local logs">
            <IconButton onClick={() => clearLogs()}>
              <DeleteOutlineIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      <Divider />

      <Stack spacing={1}>
        {filtered.length === 0 ? (
          <Typography color="text.secondary">No logs yet.</Typography>
        ) : (
          filtered.slice(0, 50).map((l) => <LogRow key={l.id} log={l} onCopy={copyText} />)
        )}
      </Stack>

      <Divider />

      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
        <Typography variant="subtitle1">Remote logs</Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={() => void refreshRemote()}
          disabled={remoteLoading}
        >
          {remoteLoading ? "Loading…" : "Fetch"}
        </Button>
      </Stack>

      {remoteErr ? (
        <Typography color="error" variant="body2">
          {remoteErr}
        </Typography>
      ) : null}

      <TextField
        value={remote}
        placeholder="Remote response will appear here (if GET /logs is supported)."
        multiline
        minRows={6}
        maxRows={14}
        fullWidth
        InputProps={{
          readOnly: true,
          endAdornment: remote ? (
            <Tooltip title="Copy">
              <IconButton onClick={() => copyText(remote)}>
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
          ) : undefined,
        }}
      />
    </Stack>
  );
}

function LogRow({ log, onCopy }: { log: LogEntry; onCopy: (t: string) => void }) {
  const color =
    log.level === "error" || log.level === "fatal"
      ? ("error" as const)
      : log.level === "warn"
        ? ("warning" as const)
        : ("default" as const);

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        p: 1.25,
        bgcolor: "background.paper",
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
          <Chip size="small" label={log.level} color={color} variant="outlined" />
          <Chip size="small" label={log.pkg} variant="outlined" />
          <Typography variant="caption" color="text.secondary" noWrap>
            {formatTs(log.ts)}
          </Typography>
          <Chip
            size="small"
            label={log.status}
            variant="outlined"
            color={log.status === "failed" ? "error" : "default"}
          />
        </Stack>

        <Tooltip title="Copy message">
          <IconButton size="small" onClick={() => onCopy(log.message)}>
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>

      <Typography sx={{ mt: 0.75 }}>{log.message}</Typography>
      {log.error ? (
        <Typography variant="body2" color="error" sx={{ mt: 0.5 }}>
          {log.error}
        </Typography>
      ) : null}
    </Box>
  );
}
