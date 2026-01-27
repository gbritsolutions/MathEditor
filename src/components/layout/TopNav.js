import React, { useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  styled,
  Toolbar,
  Tooltip,
  Typography,
  Zoom,
} from "@mui/material";
import { Link, Outlet } from "react-router-dom";
import MenuTwoToneIcon from "@mui/icons-material/MenuTwoTone";
import logo from "../../assets/images/logos/logo.png";
import BreadcrumbNavigation from "./BreadcrumbsIcon";
import { menus, settings } from "./menus";
import Logout from "../OuterScreens/Logout";
import { ORG_NAME, USER_NAME } from "../config/sessionStorage";

const GradientAppBar = styled(AppBar)({
  backgroundImage: 'linear-gradient(to top,rgb(5, 21, 41) 0%,rgb(56, 90, 116) 100%)',
});

function TopBar({ setIsAuthenticated, setRes }) {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [subMenuIndex, setSubMenuIndex] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentMenu, setCurrentMenu] = useState(null);

  const userName = USER_NAME();
  const orgName = ORG_NAME();

  const displayOrgName =
    orgName.length > 15 ? `${orgName.slice(0, 15)}...` : orgName;

  const displayUserName =
    userName.length > 15 ? `${userName.slice(0, 15)}...` : userName;

  const handleOpenNavMenu = (event, index) => {
    setSubMenuIndex(index);
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setSubMenuIndex(null);
    setAnchorElNav(null);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenMenu = (event, menu) => {
    setCurrentMenu(menu);
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setCurrentMenu(null);
    setAnchorEl(null);
  };

  const menuItems = menus(); // Call the menus function to get the array

  return (
    <>
      <Box maxWidth="xl">
        <GradientAppBar position="sticky">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="/mathEditor"
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
                <img
                  src={logo}
                  alt="logo"
                  sx={{ display: "flex" }}
                  className="h-12"
                />
              </Typography>
              {/* Mobile Display */}
              <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuTwoToneIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                >
                  {menuItems.map((menu, index) => (
                    <MenuItem key={menu.text}>
                      <Link
                        to={menu.link}
                        style={{ textDecoration: "none" }}
                        onClick={() => handleCloseNavMenu()}
                      >
                        <Typography textAlign="center">{menu.text}</Typography>
                      </Link>
                      {menu.children && (
                        <IconButton
                          size="large"
                          aria-label="submenu"
                          aria-haspopup="true"
                          onClick={(event) => handleOpenNavMenu(event, index)}
                          color="inherit"
                        >
                          <MenuTwoToneIcon />
                        </IconButton>
                      )}
                      {menu.children && subMenuIndex === index && (
                        <Menu
                          id={`submenu-${index}`}
                          anchorEl={anchorElNav}
                          open={subMenuIndex === index && Boolean(anchorElNav)}
                          onClose={handleCloseNavMenu}
                          anchorOrigin={{
                            vertical: "top",
                            horizontal: "right",
                          }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "left",
                          }}
                        >
                          {menu.children.map((child) => (
                            <MenuItem key={child.text}>
                              <Link
                                to={child.link}
                                style={{ textDecoration: "none" }}
                                onClick={handleCloseNavMenu}
                              >
                                <Typography textAlign="center">
                                  {child.text}
                                </Typography>
                              </Link>
                            </MenuItem>
                          ))}
                        </Menu>
                      )}
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
              <Typography
                variant="h5"
                noWrap
                component="a"
                href="/mathEditor"
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
                <img
                  src={logo}
                  alt="logo"
                  sx={{ display: "flex" }}
                  className="h-9"
                />
              </Typography>
              {/* Desktop Display */}
              <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                {menuItems.map((menu) => (
                  <div key={menu.text} style={{ marginRight: "10px" }}>
                    {menu.children && menu.children.length > 0 ? (
                      <>
                        <Button
                          onClick={(event) => handleOpenMenu(event, menu)}
                          aria-controls={menu.text}
                          aria-haspopup="true"
                          style={{ color: "white" }}
                        >
                          {menu.text}
                        </Button>
                        {currentMenu && currentMenu.text === menu.text && (
                          <Menu
                            id={menu.text}
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleCloseMenu}
                          >
                            {menu.children.map((child) => (
                              <Link
                                key={child.text}
                                to={child.link}
                                style={{ textDecoration: "none" }}
                              >
                                <MenuItem onClick={handleCloseMenu}>
                                  <Typography variant="inherit" noWrap>
                                    {child.text}
                                  </Typography>
                                </MenuItem>
                              </Link>
                            ))}
                          </Menu>
                        )}
                      </>
                    ) : (
                      <Link to={menu.link} style={{ textDecoration: "none" }}>
                        <Button style={{ color: "white" }}>{menu.text}</Button>
                      </Link>
                    )}
                  </div>
                ))}
              </Box>
              <Box sx={{ display: { xs: "none", md: "flex" } }}>
                {displayOrgName && (
                  <Tooltip title={orgName} TransitionComponent={Zoom} arrow>
                    <Typography variant="subtitle1" gutterBottom>
                      {displayOrgName},
                    </Typography>
                  </Tooltip>
                )}
                <Tooltip title={userName} TransitionComponent={Zoom} arrow>
                  <Typography variant="subtitle1" gutterBottom px={1}>
                    {displayUserName}
                  </Typography>
                </Tooltip>
              </Box>
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings" TransitionComponent={Zoom} arrow>
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={userName} src="/static/images/avatar/2.jpg" />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: 1 }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
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
                      onClick={() => setAnchorElUser(null)}
                    >
                      {setting.link === "sign_in" ? (
                        <Typography
                          textAlign="center"
                          onClick={Logout({ setIsAuthenticated, setRes })}
                        >
                          {setting.text}
                        </Typography>
                      ) : (
                        <Link
                          to={setting.link}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <Typography textAlign="center">
                            {setting.text}
                          </Typography>
                        </Link>
                      )}
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </Toolbar>
          </Container>
        </GradientAppBar>
        <BreadcrumbNavigation />
        <Outlet />
      </Box>
    </>
  );
}

export default TopBar;
