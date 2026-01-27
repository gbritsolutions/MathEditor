import { Box, Container, Grid, Typography } from "@mui/material";
import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircleTwoTone";
import { REGISTER_MSG1, REGISTER_MSG2 } from "../config/toastMessage";
// import gbrit_logo from "../../assets/images/logos/gbrit_logo_6x4_png.png";

export default function RegisterSuccess() {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          padding: "0 20px", // Add padding for responsiveness
        }}
      >
        {/* Logo */}
        {/* <img
          src={gbrit_logo}
          alt="gbrit_logo"
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 150,
            padding: 10,
          }}
        /> */}

        {/* Main content */}

        <Container maxWidth="md">
          <Grid container spacing={2}>
            <Grid
              item
              xs={12}
              md={2}
              sx={{
                display: "flex",
                justifyContent: { xs: "center", md: "flex-start" },
              }}
            >
              <CheckCircleTwoToneIcon
                color="success"
                sx={{ fontSize: { xs: 50, md: 100 } }}
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={10}
              sx={{ textAlign: { xs: "center", md: "left" } }}
            >
              <Typography variant="h4">{REGISTER_MSG1}</Typography>
              <Typography variant="h6">{REGISTER_MSG2}</Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
