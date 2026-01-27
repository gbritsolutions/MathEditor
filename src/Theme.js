import { createTheme } from "@mui/material";

const font = "Source Sans 3,'sans-serif'";
const Themes = createTheme({
  palette: {
    primary: {
      // main: "#6200ea",
      // main: "#0066ff",
      // main: "#0069b5",
      // backgroundImage: "linear-gradient(to top, rgb(5, 21, 41) 0%, rgb(56, 90, 116) 100%)",
      // main: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
      // main: "#006dba",
      // main: "#4b6b63",
      main: "rgb(5, 32, 65)",
    },
  },
  typography: {
    fontFamily: font,
  },
});

export default Themes;
