import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1f6feb" }, // blue
    secondary: { main: "#0f766e" }, // teal
    background: {
      default: "#f6f8fa",
      paper: "#ffffff",
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: [
      "Inter",
      "system-ui",
      "-apple-system",
      "Segoe UI",
      "Roboto",
      "Helvetica",
      "Arial",
      "sans-serif",
    ].join(","),
    h4: { fontWeight: 700 },
    h6: { fontWeight: 700 },
  },
});

