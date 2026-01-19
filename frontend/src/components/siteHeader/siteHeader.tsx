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

import React, { useContext, useEffect, useState, type MouseEvent } from "react";
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
// Importing the supabase 'assets' storage function
import { getPublicUrl } from "../../utils/supabaseAssetsStorage";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/authContext";
import UserProfileDrawer from "../userProfileDrawer/userProfileDrawer";

const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);

const SiteHeader: React.FC = () => {
  const location = useLocation();

  // Created a useState for userName so that we can set it as a user logs in
  const [userName, setUserName] = useState("User");

  const { token, user } = useContext(AuthContext) || {};

  useEffect(
    () => {
      // You can remove this or set it from somewhere else if needed
      setUserName(user?.first_name ?? "User");
    }, // Run this effect every time `token` changes ensuring the 'userFirstName' is up-to-date
    [token, user],
  );

  /**
   * We created the variable 'navButtonStyle' to style a nav link
   * when 'active' to enhance the user experience.
   */
  const navButtonStyle = (active: boolean) => ({
    textTransform: "none",
    // Ternary operator: is it active? Then, use 'bold, otherwise 'inherit'
    fontWeight: active ? "bold" : "inherit",
    // Needed for the animated underline (::after) to position correctly
    position: "relative",
    // Smooth animation for color, weight, and underline changes
    transition: "all 0.3s ease",
    color: active ? "#EFF5E0" : "inherit",
    borderBottom: active ? "3px solid #EFF5E0" : "none",
    /**
     * Animated underline, which expands on hover
     * Fully visible when active.
     * https://css-tricks.com/css-link-hover-effects/
     * */
    "&:after": {
      // Required for ::after pseudo‑element as MUI supports this via the sx selector API
      content: '""',
      /**
       * Needed so the underline can be positioned relative to the parent (MUI pseudo‑element
       * https://mui.com/material-ui/customization/how-to-customize/#pseudo-classes)
       *  */
      position: "absolute",
      width: active ? "100%" : "0%",
      height: "2px",
      bottom: 0,
      left: 0,
      backgroundColor: "#EFF5E0",
      transition: "width 0.3s ease",
    },

    // Expands the underline fully on hover with a smooth animation
    "&:hover:after": {
      width: "100%",
    },
  });

  /**
   * 'drawerOpen' state has been set for the logged in user state. The reason behind that is
   * that to manage the open/close state of the UserProfileDrawer,
   * a side panel (also known as a drawer) that slides in from the edge of the screen, a boolean
   * state variable that tracks whether the drawer is currently visible (true) or hidden (false)
   * was needed
   */
  const [drawerOpen, setDrawerOpen] = useState(false);

  /**
   * Checks whether the current URL path is the homepage or other pages for
   * which we wish to have the offSet removed, and returns true only when
   * the user is on "/", "/login", and so on.
   * We use it to erase the offSet between the HeroImage and siteHeader components.
   */
  const isHomePage = location.pathname === "/";
  const isLoginPage = location.pathname === "/login";
  const isSignUpPage = location.pathname === "/signup";

  /**
   * When the user lands on the 'account' or '/account/profile' pages,
   * the 'Welcome User' header link will be active
   */
  const isUserArea =
    location.pathname.startsWith("/account") ||
    location.pathname.startsWith("/account/profile");

  /**
   * React Router navigation helper
   * 'Returns a function that lets you navigate programmatically in the browser
   * in response to user interactions or effects.'
   * https://api.reactrouter.com/v7/functions/react_router.useNavigate.html
   * */
  const navigate = useNavigate();

  /**
   * Access the Material UI theme object
   * https://reactnavigation.org/docs/use-theme/
   * */
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  /**
   * Anchor element for the mobile dropdown menu.
   * When null the menu is closed.
   * When set, then, menu opens at that element's position.
   * https://mui.com/material-ui/react-menu/
   */
  const [mobileAnchorEl, setMobileAnchorEl] = useState<null | HTMLElement>(
    null,
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
        <Toolbar sx={{ color: "#EFF5E0" }}>
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
              src={getPublicUrl("GuestEaseLogo.png")}
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
                /** The dropdown container is styled through the slotProps property.
                 * https://mui.com/material-ui/api/menu/#props
                 * https://mui.com/material-ui/api/menu/#slots
                 * */
                slotProps={{
                  paper: {
                    sx: {
                      bgcolor: "#472d30",
                      color: "#EFF5E0",
                      borderRadius: "8px",
                    },
                  },
                }}
              >
                {mobileMenuOptions.map((opt) => {
                  const active = location.pathname === opt.path;

                  return (
                    <MenuItem
                      key={opt.label}
                      onClick={() => handleNavigate(opt.path)}
                      sx={{
                        fontWeight: active ? "bold" : "normal",
                        color: "#EFF5E0",
                        borderBottom: active ? "2px solid #EFF5E0" : "none",
                        backgroundColor: "#472d30",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {opt.label}
                    </MenuItem>
                  );
                })}
                {token ? (
                  <MenuItem
                    onClick={() => {
                      setDrawerOpen(true);
                      handleMenuClose();
                    }}
                  >
                    Welcome {userName}!
                  </MenuItem>
                ) : (
                  <MenuItem onClick={() => navigate("/login")}>
                    Login <LoginIcon sx={{ ml: 1 }} />
                  </MenuItem>
                )}
              </Menu>
            </>
          ) : (
            <>
              <Button
                sx={navButtonStyle(location.pathname === "/")}
                color="inherit"
                onClick={() => handleNavigate("/")}
              >
                Home
              </Button>
              <Button
                sx={navButtonStyle(location.pathname === "/about-us")}
                color="inherit"
                onClick={() => handleNavigate("/about-us")}
              >
                About us
              </Button>

              <Button
                sx={navButtonStyle(location.pathname === "/rooms")}
                onClick={() => handleNavigate("/rooms")}
              >
                Rooms
              </Button>

              <Button
                sx={navButtonStyle(location.pathname === "/facilities")}
                color="inherit"
                onClick={() => handleNavigate("/facilities")}
              >
                Facilities
              </Button>

              {token ? (
                <>
                  <Button
                    sx={{
                      textTransform: "none",
                      color: isUserArea ? "#EFF5E0" : "inherit",
                      borderBottom: isUserArea ? "3px solid #EFF5E0" : "none",
                      fontWeight: isUserArea ? "bold" : "inherit",
                    }}
                    color="inherit"
                    onClick={() => setDrawerOpen(true)}
                  >
                    Welcome {userName}
                  </Button>
                </>
              ) : (
                <Button
                  sx={{
                    textTransform: "none",
                    color: isUserArea ? "#EFF5E0" : "inherit",
                    borderBottom: isUserArea ? "3px solid #EFF5E0" : "none",
                    fontWeight: isUserArea ? "bold" : "inherit",
                  }}
                  color="inherit"
                  onClick={() => navigate("/login")}
                >
                  Login <LoginIcon sx={{ ml: 1 }} />
                </Button>
              )}
            </>
          )}
        </Toolbar>
      </AppBar>
      <UserProfileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      {/* Only add Offset if not one of the below pages */}
      {!isHomePage && !isLoginPage && !isSignUpPage && <Offset />}
    </>
  );
};

export default SiteHeader;
