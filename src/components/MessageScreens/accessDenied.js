import { Container, Typography, Grid, Box, Grid2 } from "@mui/material";
import { NewReleasesTwoTone } from "@mui/icons-material";
import { ACCESS_MSG1, ACCESS_MSG2 } from "../config/toastMessage";

export default function AccessDenied() {
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
        <Container maxWidth="md">
          <Grid2 container spacing={2}>
            <Grid2
              item
              xs={12}
              md={2}
              sx={{
                display: "flex",
                justifyContent: { xs: "center", md: "flex-start" },
              }}
            >
              <NewReleasesTwoTone
                color="warning"
                sx={{ fontSize: { xs: 50, md: 100 } }}
              />
            </Grid2>
            <Grid2
              item
              xs={12}
              md={10}
              sx={{ textAlign: { xs: "center", md: "left" } }}
            >
              <Typography variant="h4">{ACCESS_MSG1}</Typography>
              <Typography variant="h6">{ACCESS_MSG2}</Typography>
            </Grid2>
          </Grid2>
        </Container>
      </Box>
    </>
  );
}
