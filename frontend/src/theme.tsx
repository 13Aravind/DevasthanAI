// frontend/src/theme.tsx

import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { ReactNode } from "react";

// 🎨 Divine Indigo–Gold–Ivory Theme
export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#283593", // Deep Indigo
    },
    secondary: {
      main: "#FFB300", // Golden Amber
    },
    background: {
      default: "#FFFDF6", // Ivory calm
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1A1A1A",
      secondary: "#555555",
    },
  },
  typography: {
    fontFamily: "'Poppins', 'Roboto', sans-serif",
    h4: {
      fontWeight: 700,
      color: "#283593",
    },
    h5: {
      fontWeight: 600,
      color: "#283593",
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: "none",
          fontWeight: 600,
          padding: "8px 18px",
          boxShadow: "0 4px 10px rgba(40, 53, 147, 0.2)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 6px 14px rgba(40, 53, 147, 0.25)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 10px 24px rgba(0,0,0,0.12)",
          },
        },
      },
    },
  },
});

// 🎁 Wrapper for easy usage
export const AppThemeProvider = ({ children }: { children: ReactNode }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </ThemeProvider>
);