import { Link } from "react-router-dom";
import { Container, Typography, Grid, Box } from "@mui/material";
import InfoTwoToneIcon from "@mui/icons-material/InfoTwoTone";
import {
  TOKEN_VERIFIED_MSG1,
  TOKEN_VERIFIED_MSG2,
} from "../config/toastMessage";

export default function TokenVerified() {
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
              <InfoTwoToneIcon
                color="info"
                sx={{ fontSize: { xs: 50, md: 100 } }}
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={10}
              sx={{ textAlign: { xs: "center", md: "left" } }}
            >
              <Typography variant="h4">{TOKEN_VERIFIED_MSG1}</Typography>
              <Typography variant="h6">
                {TOKEN_VERIFIED_MSG2}&nbsp;
                <Link to="/sign_in" className="hover:underline text-violet-500">
                  Login...
                </Link>
                &nbsp; to the application.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
