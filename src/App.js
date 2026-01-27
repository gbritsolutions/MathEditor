import { BrowserRouter } from "react-router-dom";
import "./App.css";
import AllRouter from "./router";
import { ThemeProvider } from "@emotion/react";
import Themes from "./Theme";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <ThemeProvider theme={Themes}>
        <BrowserRouter>
          <AllRouter />
          <Toaster position="top-center" reverseOrder={false} />
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
