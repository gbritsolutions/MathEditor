import React from "react";
import { Typography, Divider, Box, Stack, Card, Grid } from "@mui/material";

export default function FeatureSection2() {
  return (
    <Box
      sx={{
        borderRadius: "0.75rem",
        fontFamily: "system-ui",
        display: "flex",
        flexDirection: "column",
        rowGap: "15px",
        maxWidth: "1250px",
        width: "100%",
        backgroundImage: "linear-gradient(to right, #9796f0, #fbc7d4)",
        padding: "20px",
        " @media(max-width:991px)": { fontSize: "15px" },
        " @media(max-width:479px)": { fontSize: "14px" },
      }}
    >
      <Box>
        <Typography
          variant="p"
          sx={{
            fontSize: "18px",
            fontWeight: "600",
            color: "#1f1a43",
            " @media(max-width:991px)": { fontSize: "17px" },
            " @media(max-width:479px)": { fontSize: "16px" },
          }}
        >
          We've got you covered.
        </Typography>
        <Divider
          sx={{
            margin: "8px 0",
            color: "#dbdbdb",
            border: "none",
            backgroundColor: "#eeebf5ff",
            height: "2px",
            width: "5%",
          }}
          orientation="horizontal"
        ></Divider>
        <Typography variant="p" sx={{ color: "#1f1a43" }}>
          Intuitive drag and drop Page guilder. Stunning themes. Over 100
          Elements. Creating your beautiful website has never been easier.
        </Typography>
      </Box>
      <Grid container rowSpacing={"10px"} columnSpacing={"10px"}>
        <Grid
          item
          sx={{ height: "100%" }}
          xs={12.0}
          sm={6.0}
          md={6.0}
          lg={4.0}
          xl={4.0}
        >
          <Card
            sx={{
              display: "flex",
              columnGap: "20px",
              width: "100%",
              padding: "15px",
              height: "100%",
              background: "rgba(249, 249, 249, 0.28)",
              borderRadius: "16px",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
              backdropFilter: "blur(13.2px)",
              border: "1px solid rgba(249, 249, 249, 0.34)",
              backgroundColor: "inherit",
            }}
          >
            <img
              src="https://purecodestorageprod.blob.core.windows.net/images-svg/FeatureSection1_237a3661-f91d-4bf6-9759-7f0e4f7f53cc.svg"
              style={{
                flexShrink: "0",
                paddingTop: "2px",
                " @media(max-width:991px)": { width: "22px", height: "22px" },
                " @media(max-width:479px)": { width: "19px", height: "19px" },
              }}
              width="25px"
              height="25px"
            />
            <Stack
              sx={{ alignItems: "flex-start", width: "100%" }}
              spacing="10px"
            >
              <Typography variant="h4" sx={{ color: "#1f1a43" }}>
                Stunning Page Builder
              </Typography>
              <Typography
                variant="p"
                sx={{
                  fontSize: "15px",
                  color: "#1f1a43",
                  " @media(max-width:991px)": { fontSize: "14px" },
                  " @media(max-width:479px)": { fontSize: "13px" },
                }}
              >
                Setup pages and content like a PRO Coding is not required and a
                handy documentation is included.
              </Typography>
            </Stack>
          </Card>
        </Grid>
        <Grid
          item
          sx={{ height: "100%" }}
          xs={12.0}
          sm={6.0}
          md={6.0}
          lg={4.0}
          xl={4.0}
        >
          <Card
            sx={{
              display: "flex",
              columnGap: "20px",
              width: "100%",
              padding: "15px",
              height: "100%",
              background: "rgba(249, 249, 249, 0.28)",
              borderRadius: "16px",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
              backdropFilter: "blur(13.2px)",
              border: "1px solid rgba(249, 249, 249, 0.34)",
              backgroundColor: "inherit",
            }}
          >
            <img
              src="https://purecodestorageprod.blob.core.windows.net/images-svg/FeatureSection1_339a0f25-a9e6-46d9-9dd7-793a6e66eb53.svg"
              style={{
                flexShrink: "0",
                paddingTop: "2px",
                " @media(max-width:991px)": { width: "22px", height: "22px" },
                " @media(max-width:479px)": { width: "19px", height: "19px" },
              }}
              width="25px"
              height="25px"
            />
            <Stack
              sx={{ alignItems: "flex-start", width: "100%" }}
              spacing="10px"
            >
              <Typography variant="h4" sx={{ color: "#1f1a43" }}>
                Iconic Awarded Design
              </Typography>
              <Typography
                variant="p"
                sx={{
                  fontSize: "15px",
                  color: "#1f1a43",
                  " @media(max-width:991px)": { fontSize: "14px" },
                  " @media(max-width:479px)": { fontSize: "13px" },
                }}
              >
                This design is featured across the marketplaces and awarded for
                its looks. Walkthrough and enjoy the visuals
              </Typography>
            </Stack>
          </Card>
        </Grid>
        <Grid
          item
          sx={{ height: "100%" }}
          xs={12.0}
          sm={6.0}
          md={6.0}
          lg={4.0}
          xl={4.0}
        >
          <Card
            sx={{
              display: "flex",
              columnGap: "20px",
              width: "100%",
              padding: "15px",
              height: "100%",
              background: "rgba(249, 249, 249, 0.28)",
              borderRadius: "16px",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
              backdropFilter: "blur(13.2px)",
              border: "1px solid rgba(249, 249, 249, 0.34)",
              backgroundColor: "inherit",
            }}
          >
            <img
              src="https://purecodestorageprod.blob.core.windows.net/images-svg/FeatureSection1_b9fd94dc-942d-437c-a6e5-ed965f2b54d6.svg"
              style={{
                flexShrink: "0",
                paddingTop: "2px",
                " @media(max-width:991px)": { width: "22px", height: "22px" },
                " @media(max-width:479px)": { width: "19px", height: "19px" },
              }}
              width="25px"
              height="25px"
            />
            <Stack
              sx={{ alignItems: "flex-start", width: "100%" }}
              spacing="10px"
            >
              <Typography variant="h4" sx={{ color: "#1f1a43" }}>
                Featurewise Complete
              </Typography>
              <Typography
                variant="p"
                sx={{
                  fontSize: "15px",
                  color: "#1f1a43",
                  " @media(max-width:991px)": { fontSize: "14px" },
                  " @media(max-width:479px)": { fontSize: "13px" },
                }}
              >
                Without a doubt, Purecode is one of the most complete WordPress
                themes on the market.
              </Typography>
            </Stack>
          </Card>
        </Grid>
        <Grid
          item
          sx={{ height: "100%" }}
          xs={12.0}
          sm={6.0}
          md={6.0}
          lg={4.0}
          xl={4.0}
        >
          <Card
            sx={{
              display: "flex",
              columnGap: "20px",
              width: "100%",
              padding: "15px",
              height: "100%",
              background: "rgba(249, 249, 249, 0.28)",
              borderRadius: "16px",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
              backdropFilter: "blur(13.2px)",
              border: "1px solid rgba(249, 249, 249, 0.34)",
              backgroundColor: "inherit",
            }}
          >
            <img
              src="https://purecodestorageprod.blob.core.windows.net/images-svg/FeatureSection1_dc5d1d13-30b3-4aac-b251-f6602334cb84.svg"
              style={{
                flexShrink: "0",
                paddingTop: "2px",
                " @media(max-width:991px)": { width: "22px", height: "22px" },
                " @media(max-width:479px)": { width: "19px", height: "19px" },
              }}
              width="22px"
              height="22px"
            />
            <Stack
              sx={{ alignItems: "flex-start", width: "100%" }}
              spacing="10px"
            >
              <Typography variant="h4" sx={{ color: "#1f1a43" }}>
                Mature Project
              </Typography>
              <Typography
                variant="p"
                sx={{
                  fontSize: "15px",
                  color: "#1f1a43",
                  " @media(max-width:991px)": { fontSize: "14px" },
                  " @media(max-width:479px)": { fontSize: "13px" },
                }}
              >
                In fine, gathering awesome feedback from our loyal customers,
                PureCode became a mature. stable and future-proof project
              </Typography>
            </Stack>
          </Card>
        </Grid>
        <Grid
          item
          sx={{ height: "100%" }}
          xs={12.0}
          sm={6.0}
          md={6.0}
          lg={4.0}
          xl={4.0}
        >
          <Card
            sx={{
              display: "flex",
              columnGap: "20px",
              width: "100%",
              padding: "15px",
              height: "100%",
              background: "rgba(249, 249, 249, 0.28)",
              borderRadius: "16px",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
              backdropFilter: "blur(13.2px)",
              border: "1px solid rgba(249, 249, 249, 0.34)",
              backgroundColor: "inherit",
            }}
          >
            <img
              src="https://purecodestorageprod.blob.core.windows.net/images-svg/FeatureSection1_4c3699e4-160f-43b2-9a02-b99eb20f4a91.svg"
              style={{
                flexShrink: "0",
                paddingTop: "2px",
                " @media(max-width:991px)": { width: "22px", height: "22px" },
                " @media(max-width:479px)": { width: "19px", height: "19px" },
              }}
              width="25px"
              height="25px"
            />
            <Stack
              sx={{ alignItems: "flex-start", width: "100%" }}
              spacing="10px"
            >
              <Typography variant="h4" sx={{ color: "#1f1a43" }}>
                Rescue Support
              </Typography>
              <Typography
                variant="p"
                sx={{
                  fontSize: "15px",
                  color: "#1f1a43",
                  " @media(max-width:991px)": { fontSize: "14px" },
                  " @media(max-width:479px)": { fontSize: "13px" },
                }}
              >
                In time, gathering awesome feedack from our loyal customers,
                PureCode became a mature, stable and future-proof project
              </Typography>
            </Stack>
          </Card>
        </Grid>
        <Grid
          item
          sx={{ height: "100%" }}
          xs={12.0}
          sm={6.0}
          md={6.0}
          lg={4.0}
          xl={4.0}
        >
          <Card
            sx={{
              display: "flex",
              columnGap: "20px",
              width: "100%",
              padding: "15px",
              height: "100%",
              background: "rgba(249, 249, 249, 0.28)",
              borderRadius: "16px",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
              backdropFilter: "blur(13.2px)",
              border: "1px solid rgba(249, 249, 249, 0.34)",
              backgroundColor: "inherit",
            }}
          >
            <img
              src="https://purecodestorageprod.blob.core.windows.net/images-svg/FeatureSection1_5f352075-a597-4fe4-b1d4-f4ac197d9221.svg"
              style={{
                flexShrink: "0",
                paddingTop: "2px",
                " @media(max-width:991px)": { width: "22px", height: "22px" },
                " @media(max-width:479px)": { width: "19px", height: "19px" },
              }}
              width="25px"
              height="25px"
            />
            <Stack
              sx={{ alignItems: "flex-start", width: "100%" }}
              spacing="10px"
            >
              <Typography variant="h4" sx={{ color: "#1f1a43" }}>
                E-commerce Ready
              </Typography>
              <Typography
                variant="p"
                sx={{
                  fontSize: "15px",
                  color: "#1f1a43",
                  " @media(max-width:991px)": { fontSize: "14px" },
                  " @media(max-width:479px)": { fontSize: "13px" },
                }}
              >
                In time, gathering awesome from our loyal customers, PureCode
                became a mature. stable and future-proof project
              </Typography>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
