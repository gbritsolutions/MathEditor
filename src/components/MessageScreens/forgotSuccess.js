import { Box, Container, Grid, Typography } from "@mui/material";
import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircleTwoTone";
import { FORGOT_MSG1 } from "../config/toastMessage";

export default function ForgotSuccess() {
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
            <Grid item xs={12} md={10}>
              <Typography
                variant="h4"
                sx={{ textAlign: { xs: "center", md: "left" } }}
              >
                {FORGOT_MSG1}
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
