import React from "react";
import {
  Typography,
  Stack,
  Avatar,
  CardHeader,
  CardContent,
  CardActions,
  Card,
  Grid,
  Box,
} from "@mui/material";

export default function CardList3() {
  return (
    <Box
      sx={{
        fontFamily: "system-ui, sans-serif",
        width: "100%",
        padding: "2rem",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        rowGap: "1.5rem",
        backgroundImage: "linear-gradient(45deg, #ffe5a8 0%, #fbaede 100%)",
        " @media(max-width:991px)": { padding: "1.5rem 1rem" },
        " @media(max-width:479px)": { padding: "1rem 0.8rem" },
      }}
    >
      <Stack
        sx={{ justifyContent: "center", alignItems: "center" }}
        spacing="10px"
        direction="row"
      >
        <Typography
          variant="h1"
          sx={{
            " @media(max-width:991px)": { fontSize: "26px" },
            " @media(max-width:479px)": { fontSize: "21px" },
          }}
        >
          OUR
        </Typography>
        <Typography
          variant="h1"
          sx={{
            color: "#ba0a5f",
            " @media(max-width:991px)": { fontSize: "26px" },
            " @media(max-width:479px)": { fontSize: "21px" },
          }}
        >
          TEAM
        </Typography>
      </Stack>
      <Typography
        variant="p"
        sx={{
          " @media(max-width:991px)": { fontSize: "15px" },
          " @media(max-width:479px)": { fontSize: "14px" },
        }}
      >
        Our team is composed of talented individuals with diverse backgrounds,
        expertise, and experiences
      </Typography>
      <Grid container rowSpacing={"10px"} columnSpacing={"10px"}>
        <Grid item xs={12.0} sm={6.0} md={4.0} lg={4.0} xl={4.0}>
          <Card
            sx={{
              padding: "1rem",
              backgroundColor: "#ffffff3f",
              width: "100%",
              height: "100%",
              transition: "transform 0.5s ease",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardHeader
              sx={{
                "& .MuiCardHeader-content": { display: "none" },
                "& .MuiCardHeader-action": {
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                },
              }}
              action={
                <>
                  <Avatar
                    sx={{
                      borderRadius: "50%",
                      height: "100px",
                      width: "100px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                      objectFit: "cover",
                      " @media(max-width:991px)": {
                        height: "90px",
                        width: "90px",
                      },
                      " @media(max-width:479px)": {
                        height: "80px",
                        width: "80px",
                      },
                    }}
                    src="https://objectstorage.me-dubai-1.oraclecloud.com/n/axwzijd5v1vn/b/DSL_IMAGES/o/IMAGE/5be95fdb-2740-4bae-8fba-f78cd06b13eb-New-circle-profile-pic (1).png"
                  ></Avatar>
                </>
              }
            ></CardHeader>
            <CardContent
              sx={{ display: "flex", flexDirection: "column", rowGap: "10px" }}
            >
              <Typography
                variant="h2"
                sx={{
                  " @media(max-width:991px)": { fontSize: "21px" },
                  " @media(max-width:479px)": { fontSize: "18px" },
                }}
              >
                Jason Doe
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  color: "#ba0a5f",
                  " @media(max-width:991px)": { fontSize: "15px" },
                  " @media(max-width:479px)": { fontSize: "14px" },
                }}
              >
                Web Developer
              </Typography>
              <Typography
                variant="p"
                sx={{
                  " @media(max-width:991px)": { fontSize: "15px" },
                  " @media(max-width:479px)": { fontSize: "14px" },
                }}
              >
                I'm a passionate and innovative web developer with 5 of
                experience crafting dynamic and user-friendly websites. My
                journey in web development began with a fascination for
                technology and a drive to create impactful digital experiences.
              </Typography>
            </CardContent>
            <CardActions
              sx={{
                display: "flex",
                columnGap: "1rem",
                justifyContent: "center",
                marginTop: "auto",
              }}
            >
              <img
                src="https://purecodestorageprod.blob.core.windows.net/images-svg/CardList3_66f71d65-7571-409a-9f42-dc0ec86247e4.svg"
                style={{
                  " @media(max-width:991px)": { height: "22px", width: "22px" },
                  " @media(max-width:479px)": { height: "18px", width: "18px" },
                }}
                width="25px"
                height="25px"
              />
              <img
                src="https://purecodestorageprod.blob.core.windows.net/images-svg/CardList3_378a2c04-7640-430a-af4c-7fa2eb04311c.svg"
                style={{
                  " @media(max-width:991px)": { height: "22px", width: "22px" },
                  " @media(max-width:479px)": { height: "18px", width: "18px" },
                }}
                width="25px"
                height="25px"
              />
              <img
                src="https://purecodestorageprod.blob.core.windows.net/images-svg/CardList3_6b46d10f-e0f4-45d0-a826-49e6f52e1ecc.svg"
                style={{
                  " @media(max-width:991px)": { height: "22px", width: "22px" },
                  " @media(max-width:479px)": { height: "18px", width: "18px" },
                }}
                width="25px"
                height="25px"
              />
              <img
                src="https://purecodestorageprod.blob.core.windows.net/images-svg/CardList3_6997afa1-d3f5-4f2b-8a86-b24db1e7d527.svg"
                style={{
                  " @media(max-width:991px)": { height: "22px", width: "22px" },
                  " @media(max-width:479px)": { height: "18px", width: "18px" },
                }}
                width="25px"
                height="25px"
              />
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12.0} sm={6.0} md={4.0} lg={4.0} xl={4.0}>
          <Card
            sx={{
              padding: "1rem",
              backgroundColor: "#ffffff3f",
              width: "100%",
              height: "100%",
              transition: "transform 0.5s ease",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardHeader
              sx={{
                "& .MuiCardHeader-content": { display: "none" },
                "& .MuiCardHeader-action": {
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                },
              }}
              action={
                <>
                  <Avatar
                    sx={{
                      borderRadius: "50%",
                      height: "100px",
                      width: "100px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                      objectFit: "cover",
                      " @media(max-width:991px)": {
                        height: "90px",
                        width: "90px",
                      },
                      " @media(max-width:479px)": {
                        height: "80px",
                        width: "80px",
                      },
                    }}
                    src="https://objectstorage.me-dubai-1.oraclecloud.com/n/axwzijd5v1vn/b/DSL_IMAGES/o/IMAGE/2335ab1a-75f1-41c9-9f93-999895909105-Emily-Circle-Profile-1024x1024.png"
                  ></Avatar>
                </>
              }
            ></CardHeader>
            <CardContent
              sx={{ display: "flex", flexDirection: "column", rowGap: "10px" }}
            >
              <Typography
                variant="h2"
                sx={{
                  " @media(max-width:991px)": { fontSize: "21px" },
                  " @media(max-width:479px)": { fontSize: "18px" },
                }}
              >
                Emily Johnson
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  color: "#ba0a5f",
                  " @media(max-width:991px)": { fontSize: "15px" },
                  " @media(max-width:479px)": { fontSize: "14px" },
                }}
              >
                Web Developer
              </Typography>
              <Typography
                variant="p"
                sx={{
                  " @media(max-width:991px)": { fontSize: "15px" },
                  " @media(max-width:479px)": { fontSize: "14px" },
                }}
              >
                Experienced web developer with expertise in both front-end and
                back-end development. Skilled in creating responsive and
                user-friendly web applications using modern technologies and
                frameworks and Implemented best practices in coding and testing.
              </Typography>
            </CardContent>
            <CardActions
              sx={{
                display: "flex",
                columnGap: "1rem",
                justifyContent: "center",
                marginTop: "auto",
              }}
            >
              <img
                src="https://purecodestorageprod.blob.core.windows.net/images-svg/CardList3_dc0a90b1-730d-4909-8da8-00becb10ca66.svg"
                style={{
                  " @media(max-width:991px)": { height: "22px", width: "22px" },
                  " @media(max-width:479px)": { height: "18px", width: "18px" },
                }}
                width="25px"
                height="25px"
              />
              <img
                src="https://purecodestorageprod.blob.core.windows.net/images-svg/CardList3_d4eb75a7-6d7e-4625-839c-d9577d19a965.svg"
                style={{
                  " @media(max-width:991px)": { height: "22px", width: "22px" },
                  " @media(max-width:479px)": { height: "18px", width: "18px" },
                }}
                width="25px"
                height="25px"
              />
              <img
                src="https://purecodestorageprod.blob.core.windows.net/images-svg/CardList3_bf7a9e76-eb0e-4a22-95aa-511c2dd1ce8e.svg"
                style={{
                  " @media(max-width:991px)": { height: "22px", width: "22px" },
                  " @media(max-width:479px)": { height: "18px", width: "18px" },
                }}
                width="25px"
                height="25px"
              />
              <img
                src="https://purecodestorageprod.blob.core.windows.net/images-svg/CardList3_0c1f2c22-fbd1-4d29-a45d-f27c7ff468f7.svg"
                style={{
                  " @media(max-width:991px)": { height: "22px", width: "22px" },
                  " @media(max-width:479px)": { height: "18px", width: "18px" },
                }}
                width="25px"
                height="25px"
              />
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12.0} sm={6.0} md={4.0} lg={4.0} xl={4.0}>
          <Card
            sx={{
              padding: "1rem",
              backgroundColor: "#ffffff3f",
              width: "100%",
              height: "100%",
              transition: "transform 0.5s ease",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardHeader
              sx={{
                "& .MuiCardHeader-content": { display: "none" },
                "& .MuiCardHeader-action": {
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                },
              }}
              action={
                <>
                  <Avatar
                    sx={{
                      borderRadius: "50%",
                      height: "100px",
                      width: "100px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                      objectFit: "cover",
                      " @media(max-width:991px)": {
                        height: "90px",
                        width: "90px",
                      },
                      " @media(max-width:479px)": {
                        height: "80px",
                        width: "80px",
                      },
                    }}
                    src="https://objectstorage.me-dubai-1.oraclecloud.com/n/axwzijd5v1vn/b/DSL_IMAGES/o/IMAGE/d8504a84-7046-46e3-92f6-da06dee887b4-Profile-picture_Matthieu-Gallon_circle (1).png"
                  ></Avatar>
                </>
              }
            ></CardHeader>
            <CardContent
              sx={{ display: "flex", flexDirection: "column", rowGap: "10px" }}
            >
              <Typography
                variant="h2"
                sx={{
                  " @media(max-width:991px)": { fontSize: "21px" },
                  " @media(max-width:479px)": { fontSize: "18px" },
                }}
              >
                Michael Smith
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  color: "#ba0a5f",
                  " @media(max-width:991px)": { fontSize: "15px" },
                  " @media(max-width:479px)": { fontSize: "14px" },
                }}
              >
                Web Developer
              </Typography>
              <Typography
                variant="p"
                sx={{
                  " @media(max-width:991px)": { fontSize: "15px" },
                  " @media(max-width:479px)": { fontSize: "14px" },
                }}
              >
                Experienced web developer proficient in front-end and back-end
                development. Skilled in HTML, CSS, JavaScript, and popular
                frameworks like React.js keen eye for design and Developed web
                application using modern technologies.
              </Typography>
            </CardContent>
            <CardActions
              sx={{
                display: "flex",
                columnGap: "1rem",
                justifyContent: "center",
                marginTop: "auto",
              }}
            >
              <img
                src="https://purecodestorageprod.blob.core.windows.net/images-svg/CardList3_74926abf-7e4e-4d21-95a2-c674c7f7c4cc.svg"
                style={{
                  " @media(max-width:991px)": { height: "22px", width: "22px" },
                  " @media(max-width:479px)": { height: "18px", width: "18px" },
                }}
                width="25px"
                height="25px"
              />
              <img
                src="https://purecodestorageprod.blob.core.windows.net/images-svg/CardList3_4a6facc2-2d1e-4409-b60e-4c6ebad286b3.svg"
                style={{
                  " @media(max-width:991px)": { height: "22px", width: "22px" },
                  " @media(max-width:479px)": { height: "18px", width: "18px" },
                }}
                width="25px"
                height="25px"
              />
              <img
                src="https://purecodestorageprod.blob.core.windows.net/images-svg/CardList3_72cea577-9aaf-4445-866d-3c504edba6af.svg"
                style={{
                  " @media(max-width:991px)": { height: "22px", width: "22px" },
                  " @media(max-width:479px)": { height: "18px", width: "18px" },
                }}
                width="25px"
                height="25px"
              />
              <img
                src="https://purecodestorageprod.blob.core.windows.net/images-svg/CardList3_c0993f78-a9ac-4d25-8d0f-333055762641.svg"
                style={{
                  " @media(max-width:991px)": { height: "22px", width: "22px" },
                  " @media(max-width:479px)": { height: "18px", width: "18px" },
                }}
                width="25px"
                height="25px"
              />
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
