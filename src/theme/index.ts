import { createTheme, fontWeight } from "@mui/system"
//使用一个mui的默认主题
//https://mui.com/material-ui/customization/default-theme/?expand-path=$.palette
export default createTheme({
  palette: {
    secondary: { main: "#bdbdbd" },
    success: { main: "#52c41a" },
  },
  spacing: 8,
  typography: {
    fontSize: 16,
    h1: {
      fontWeight: 300,
      fontSize: "6rem",
      lineheight: 1.167,
      letterSpacing: "-0.01562em",
    },
    h2: {
      fontWeight: 300,
      fontSize: "3.75rem",
      lineheight: 1.2,
      letterSpacing: "-0.00833em",
    },
    h3: {
      fontWeight: 400,
      fontSize: "2rem",
      lineheight: 1.167,
      letterSpacing: "0em",
    },
    h4: {
      fontWeight: 400,
      fontSize: "1.75rem",
      lineheight: 1.235,
      letterSpacing: "0.00735em",
    },
    secondary: {
      fontSize: 14,
    },
  },
})
