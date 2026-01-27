import { Link } from "react-router-dom";
import { Box, Container, Grid, Typography } from "@mui/material";
import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircleTwoTone";
import { SIGNUP_MSG1 } from "../config/toastMessage";

export default function SignUpSuccess() {
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
                {SIGNUP_MSG1}
                <Link to="/sign_in" className="hover:underline text-violet-500">
                  Login now...
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
