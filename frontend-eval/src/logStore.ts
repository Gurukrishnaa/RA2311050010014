import { useSyncExternalStore } from "react";

export type Stack = "frontend";
export type Level = "debug" | "info" | "warn" | "error" | "fatal";
export type Package = "api" | "component" | "hook" | "page" | "state" | "style";

export type LogStatus = "queued" | "sent" | "failed";

export interface LogEntry {
  id: string;
  ts: number;
  stack: Stack;
  level: Level;
  pkg: Package;
  message: string;
  status: LogStatus;
  remoteLogID?: string;
  error?: string;
}

let logs: LogEntry[] = [];
const listeners = new Set<() => void>();
const MAX_LOGS = 200;

function emit() {
  for (const listener of listeners) listener();
}

export function addLog(entry: LogEntry) {
  logs = [entry, ...logs].slice(0, MAX_LOGS);
  emit();
}

export function updateLog(id: string, patch: Partial<LogEntry>) {
  const idx = logs.findIndex((l) => l.id === id);
  if (idx === -1) return;
  const next = [...logs];
  next[idx] = { ...next[idx], ...patch };
  logs = next;
  emit();
}

export function clearLogs() {
  logs = [];
  emit();
}

export function getLogsSnapshot(): LogEntry[] {
  return logs;
}

export function subscribeLogs(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useLogs(): LogEntry[] {
  return useSyncExternalStore(subscribeLogs, getLogsSnapshot, getLogsSnapshot);
}

