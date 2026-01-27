import React from "react";
import {
  Grid,
  Container,
  Typography,
  Card,
  CardContent,
  CardActionArea,
} from "@mui/material";

import AutoModeTwoToneIcon from "@mui/icons-material/AutoModeTwoTone";
import CalculateTwoToneIcon from "@mui/icons-material/CalculateTwoTone";
import AccessTimeTwoToneIcon from "@mui/icons-material/AccessTimeTwoTone";
import StarsTwoToneIcon from "@mui/icons-material/StarsTwoTone";
import ReportTwoToneIcon from "@mui/icons-material/ReportTwoTone";

export default function Section1() {
  const features = [
    {
      icon: <AutoModeTwoToneIcon />,
      title: "Customizable Commission Structures",
      description:
        "Tailor commissions to fit your unique sales model. Whether it's tiered, flat rate, or a combination, SalesCom adapts to your needs.",
    },
    {
      icon: <CalculateTwoToneIcon />,
      title: "Real-time Reporting",
      description:
        "Stay informed with up-to-the-minute insights. Track sales performance, commissions earned, and payouts effortlessly.",
    },
    {
      icon: <StarsTwoToneIcon />,
      title: "Automated Calculations",
      description:
        "Say goodbye to manual calculations and errors. Our software automates commission calculations, saving you time and resources.",
    },
    {
      icon: <AccessTimeTwoToneIcon />,
      title: "Transparent Payouts",
      description:
        "Foster trust and transparency with your team. Easily communicate commission structures and payouts, ensuring everyone is on the same page.",
    },
    {
      icon: <ReportTwoToneIcon />,
      title: "Mobile Accessibility",
      description:
        "Access SalesCom anytime, anywhere. Our mobile-friendly platform allows your team to view commissions on the go.",
    },
  ];

  return (
    <Container sx={{ py: 7 }} maxWidth="xl" className="bg-gray-100">
      <Typography variant="h4" align="center" gutterBottom>
        Key Features
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card className="hover:shadow-lg">
              <CardActionArea>
                <CardContent className="flex items-center justify-center flex-col">
                  <div className="mb-4">{feature.icon}</div>
                  <Typography variant="h6" align="center" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" align="center">
                    {feature.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
