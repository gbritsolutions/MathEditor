import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import logo from "../../../assets/images/logos/logo.png";
import HowToRegTwoToneIcon from "@mui/icons-material/HowToRegTwoTone";
import { Fab, styled } from "@mui/material";

const GradientAppBar = styled(AppBar)({
  backgroundImage: 'linear-gradient(to top,rgb(5, 21, 41) 0%,rgb(56, 90, 116) 100%)',
});

const pages = [
  {
    text: "Home",
    link: "/",
  },
  {
    text: "Pricing",
    link: "#",
  },
  {
    text: "FAQ",
    link: "#",
  },
];
const settings = [
  {
    text: "Register",
    link: "register",
  },
  {
    text: "Login",
    link: "sign_in",
  },
];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  useEffect(() => {
    const handleCloseMenu = (event) => {
      if (
        anchorElNav &&
        !anchorElNav.contains(event.target) &&
        anchorElNav !== event.target
      ) {
        setAnchorElNav(null);
      }
      if (
        anchorElUser &&
        !anchorElUser.contains(event.target) &&
        anchorElUser !== event.target
      ) {
        setAnchorElUser(null);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        setAnchorElNav(null);
        setAnchorElUser(null);
      }
    };

    document.addEventListener("click", handleCloseMenu);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("click", handleCloseMenu);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [anchorElNav, anchorElUser]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <GradientAppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <img src={logo} alt="logo" className="h-12" />
          </Typography>

          {/* Mobile view */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.text} onClick={handleCloseNavMenu}>
                  <Link to={page.link} style={{ textDecoration: "none" }}>
                    <Typography textAlign="center">{page.text}</Typography>
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <img src={logo} alt="logo" className="h-9" />
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page.text}
                component={Link}
                to={page.link}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page.text}
              </Button>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0 }} onClick={handleOpenUserMenu}>
            <Fab size="small">
              <HowToRegTwoToneIcon />
            </Fab>
            <Menu
              onClose={handleCloseUserMenu}
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              TransitionProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&::before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting.text}
                  component={Link}
                  to={setting.link}
                  onClick={handleCloseUserMenu}
                >
                  <Link to={setting.link} style={{ textDecoration: "none" }}>
                    <Typography textAlign="center">{setting.text}</Typography>
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </GradientAppBar>
  );
}
export default ResponsiveAppBar;
