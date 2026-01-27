import {
  CssBaseline,
} from "@mui/material";
import ResponsiveAppBar from "./appBar";
import MathEditor from "../../InnerScreens/MathEditor/frame1";

function LandingPage() {
  return (
    <>
      <CssBaseline />
       <ResponsiveAppBar />
       <MathEditor isRegistor={false} />
    </>
  );
}

export default LandingPage;
