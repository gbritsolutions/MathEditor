import { Container, CssBaseline } from "@mui/material";
import TopNav from "./TopNav";

function HorizontalLayout() {
  return (
    <>
      <Container
        maxWidth="xl"
        display={"grid"}
        justifyContent={"center"}
        alignContent={"center"}
      >
        <CssBaseline />
        <TopNav />
      </Container>
    </>
  );
}

export default HorizontalLayout;
