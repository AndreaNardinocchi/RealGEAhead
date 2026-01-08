/**
 * Material Ui allow us to define a style theme for the app which all components inherit -
 * it provides a default if none is declared. The useTheme hook gives components access to the theme.
 * Material UI provides the useMediaQuery hook to simplify the implementation of media queries, i.e.
 * to query properties of the browser/device running the app. We are querying the browser’s viewport
 * dimensions, checking if they are in the medium (md) or smaller category - a mobile device.
 * const isMobile = useMediaQuery(theme.breakpoints.down(“md”))
 * The Theme object includes helper methods that generate the query string necessary to express the media query,
 * e.g. theme.breakpoints.down().
 * When the browser/device is a mobile type, the site header should render the drop-down menu;
 * otherwise, the standard navigation links should render.
 */

import React, { useState, type MouseEvent } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { styled, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Link, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import LoginIcon from "@mui/icons-material/Login";

const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);

const SiteHeader: React.FC = () => {
  /**
   * Checks whether the current URL path is the homepage, and returns true only when the user is on "/".
   * We use it to erase the offSet between the HeroImage and siteHeader components
   */
  const isHomePage = location.pathname === "/";
  // Stores the logged‑in user's name (default placeholder for now) */
  const [userName, setUserName] = useState("User");

  /**
   * React Router navigation helper
   * 'Returns a function that lets you navigate programmatically in the browser
   * in response to user interactions or effects.'
   * https://api.reactrouter.com/v7/functions/react_router.useNavigate.html
   * */
  const navigate = useNavigate();

  /**
   * Access the Material UI theme object
   *
   * https://reactnavigation.org/docs/use-theme/
   * */
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  /**
   * Anchor element for the mobile dropdown menu.
   * When null the menu is closed.
   * When set, then, menu opens at that element's position.
   *
   * https://mui.com/material-ui/react-menu/
   */
  const [mobileAnchorEl, setMobileAnchorEl] = useState<null | HTMLElement>(
    null
  );

  // Boolean flag for whether the mobile menu is open
  const mobileMenuOpen = Boolean(mobileAnchorEl);

  // Opens the mobile menu by setting the clicked element as the anchor
  const handleMobileMenu = (event: MouseEvent<HTMLElement>) => {
    setMobileAnchorEl(event.currentTarget);
  };

  // Closes the mobile menu
  const handleMenuClose = () => {
    setMobileAnchorEl(null);
  };

  /**
   * Navigates to a given route and closes the mobile menu.
   * Keeps navigation logic consistent across desktop and mobile.
   */
  const handleNavigate = (path: string) => {
    navigate(path);
    handleMenuClose();
  };

  const mobileMenuOptions = [
    { label: "Home", path: "/" },
    { label: "About us", path: "/about-us" },
    { label: "Rooms", path: "/rooms" },
    { label: "Facilities", path: "/facilities" },
  ];

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        color="transparent"
        sx={{ bgcolor: "#472d30;" }}
      >
        <Toolbar sx={{ color: "white" }}>
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              flexGrow: 1,
            }}
          >
            <img
              src="/assets/GuestEaseLogo.svg"
              alt="GuestEase logo"
              style={{
                height: "80px",
                width: "auto",
                marginLeft: "2%",
              }}
            />
          </Link>

          {isMobile ? (
            <>
              <IconButton
                aria-label="menu"
                onClick={handleMobileMenu}
                color="inherit"
                size="large"
              >
                <MenuIcon />
              </IconButton>

              <Menu
                id="mobile-menu"
                anchorEl={mobileAnchorEl}
                open={mobileMenuOpen}
                onClose={handleMenuClose}
                sx={{ color: "white" }}
              >
                {mobileMenuOptions.map((opt) => (
                  <MenuItem
                    key={opt.label}
                    onClick={() => handleNavigate(opt.path)}
                  >
                    {opt.label}
                  </MenuItem>
                ))}

                <MenuItem>Welcome {userName}! </MenuItem>
                <MenuItem onClick={() => navigate("/login")}>
                  Login <LoginIcon sx={{ ml: 1 }} />
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button
                sx={{ textTransform: "none" }}
                color="inherit"
                onClick={() => handleNavigate("/")}
              >
                Home
              </Button>
              <Button
                sx={{ textTransform: "none" }}
                color="inherit"
                onClick={() => handleNavigate("/about-us")}
              >
                About us
              </Button>
              <Button
                sx={{ textTransform: "none" }}
                color="inherit"
                onClick={() => handleNavigate("/rooms")}
              >
                Rooms
              </Button>
              <Button
                sx={{ textTransform: "none" }}
                color="inherit"
                onClick={() => handleNavigate("/facilities")}
              >
                Facilities
              </Button>

              <Button sx={{ textTransform: "none" }} color="inherit">
                Welcome {userName}!
              </Button>
              <Button
                sx={{ textTransform: "none" }}
                color="inherit"
                onClick={() => navigate("/")}
              >
                Login <LoginIcon sx={{ ml: 1 }} />
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Only add Offset if not one of the below pages */}
      {!isHomePage && <Offset />}
    </>
  );
};

export default SiteHeader;
