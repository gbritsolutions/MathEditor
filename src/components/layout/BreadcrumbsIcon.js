import { Box, Breadcrumbs, Link, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import HomeTwoToneIcon from "@mui/icons-material/HomeTwoTone";
import LayersTwoToneIcon from "@mui/icons-material/LayersTwoTone";
import SpaceDashboardTwoToneIcon from "@mui/icons-material/SpaceDashboardTwoTone";
import GroupAddTwoToneIcon from "@mui/icons-material/GroupAddTwoTone";
import MonetizationOnTwoToneIcon from "@mui/icons-material/MonetizationOnTwoTone";
import GroupsTwoToneIcon from "@mui/icons-material/GroupsTwoTone";
import LocalMallTwoToneIcon from "@mui/icons-material/LocalMallTwoTone";
import AssuredWorkloadTwoToneIcon from "@mui/icons-material/AssuredWorkloadTwoTone";
import CreditScoreTwoToneIcon from "@mui/icons-material/CreditScoreTwoTone";
import DoubleArrowTwoToneIcon from "@mui/icons-material/DoubleArrowTwoTone";
import { AddModeratorTwoTone, Map } from "@mui/icons-material";
import ReportTwoToneIcon from "@mui/icons-material/ReportTwoTone";
import AccountBalanceWalletTwoToneIcon from "@mui/icons-material/AccountBalanceWalletTwoTone";
import ScheduleSendTwoToneIcon from "@mui/icons-material/ScheduleSendTwoTone";
import SettingsAccessibilityTwoToneIcon from "@mui/icons-material/SettingsAccessibilityTwoTone";
import AssignmentTwoToneIcon from "@mui/icons-material/AssignmentTwoTone";

function BreadcrumbsIcon() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const pageIcons = {
    "": <HomeTwoToneIcon />,
    access: <SettingsAccessibilityTwoToneIcon />,
    assignCommission: <AssignmentTwoToneIcon />,
    beneficiary: <GroupAddTwoToneIcon />,
    fieldMapping: <Map />,
    commission: <MonetizationOnTwoToneIcon />,
    customer: <GroupsTwoToneIcon />,
    mathEditor: <SpaceDashboardTwoToneIcon />,
    pages: <LayersTwoToneIcon />,
    product: <LocalMallTwoToneIcon />,
    payFrequency: <AccountBalanceWalletTwoToneIcon />,
    report: <ReportTwoToneIcon />,
    role: <AssuredWorkloadTwoToneIcon />,
    scheduler: <ScheduleSendTwoToneIcon />,
    transaction: <CreditScoreTwoToneIcon />,
    variable: <AddModeratorTwoTone />,
  };

  return (
    <>
      <Box role="presentation" sx={{ boxShadow: 3, padding: 2, margin: 2 }}>
        <Breadcrumbs
          aria-label="breadcrumb"
          separator={<DoubleArrowTwoToneIcon />}
        >
          <Link
            underline="none"
            sx={{ display: "flex", alignItems: "center" }}
            color="inherit"
            href="/"
            style={{ pointerEvents: "count" === 0 ? "" : "none" }}
          >
            <span className="mr-1">{pageIcons[""]}</span>
            MathIt
          </Link>
          {pathnames.map((name, index) => {
            const isLast = index === pathnames.length - 1;
            const to = `/${pathnames.slice(0, index + 1).join(">")}`;
            return isLast ? (
              <Typography
                key={to}
                sx={{ display: "flex", alignItems: "center" }}
                color="text.primary"
              >
                <span className="mr-1">{pageIcons[name]}</span>
                {capitalizeFirstLetter(name)}
              </Typography>
            ) : (
              <Link
                key={to}
                underline="none"
                sx={{ display: "flex", alignItems: "center" }}
                color="inherit"
                href={to}
              >
                <span className="mr-1">{pageIcons[name]}</span>
                {capitalizeFirstLetter(name)}
              </Link>
            );
          })}
        </Breadcrumbs>
      </Box>
    </>
  );
}

export default BreadcrumbsIcon;
