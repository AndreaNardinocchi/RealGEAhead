import React, { useContext } from "react";
// https://mui.com/material-ui/react-drawer/
//  https://mui.com/material-ui/react-divider/
//  https://www.codingeasypeasy.com/blog/mastering-material-ui-drawer-a-comprehensive-guide-with-examples
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  Avatar,
  Link as MuiLink,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/authContext";
import type { User } from "../../types/interfaces";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../../api/guestease-api";

interface UserProfileDrawerProps {
  open: boolean;
  onClose: () => void;
}

const UserProfileDrawer: React.FC<UserProfileDrawerProps> = ({
  open,
  onClose,
}) => {
  const auth = useContext(AuthContext);

  const { user } = auth || {};
  /**
   * React Query is a data-fetching and caching library that simplifies working with
   * asynchronous data in React applications. Instead of manually managing loading states,
   * errors, caching, refetching, and background updates, React Query handles all of this
   * automatically. This results in cleaner components, fewer bugs, and a much smoother UX.
   * React Query v5 is the latest, actively maintained version of TanStack Query.
   * It introduces a simpler, more consistent API using a single options object:
   *
   *    useQuery({ queryKey: [...], queryFn: ... })
   *
   * https://tanstack.com/query/latest/docs/framework/react/reference/useQuery
   * https://tanstack.com/query/latest/docs/framework/react/quick-start
   *    */
  const { data: profile } = useQuery<User>({
    // We have a supabase 'profiles' table with user data stored in it
    queryKey: ["profile", user?.id],
    queryFn: () => getUserProfile(user!.id), // Calling in an api function to fetch a specific user in 'guestease-api'
  });

  if (!user) return null;

  // Using initials on the drawer user profile logo
  const initials = `${profile?.first_name.charAt(0)}${profile?.last_name.charAt(
    0,
  )}`.toUpperCase();

  // We will also show when a user created their account
  const formattedDate = profile?.created_at
    ? new Date(profile?.created_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: 320, padding: 3 } }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5">User Profile</Typography>
        <IconButton onClick={onClose} aria-label="Close drawer">
          <CloseIcon />
        </IconButton>
      </Box>

      <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
        <Avatar
          sx={{
            width: 80,
            height: 80,
            mb: 2,
            bgcolor: "#e26d5c",
            fontSize: 32,
          }}
        >
          {initials}
        </Avatar>
        {/* )} */}
        <Typography variant="h6" align="center">
          {profile?.first_name} {profile?.last_name}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          {profile?.email}
        </Typography>

        {profile?.role === "admin" && (
          <MuiLink
            component={Link}
            to="/admin/bookings"
            underline="hover"
            sx={{ mt: 1, color: "#472d30;", fontWeight: 500 }}
            onClick={onClose}
          >
            View Admin Dashboard
          </MuiLink>
        )}

        <MuiLink
          component={Link}
          // We will link to the user account/My Trips page
          to="/account/mytrips"
          underline="hover"
          sx={{ mt: 1, color: "#472d30;", fontWeight: 500 }}
          onClick={onClose}
        >
          View Account as a guest
        </MuiLink>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Box mb={2}>
        <Typography variant="subtitle1" fontWeight="bold">
          Role:
        </Typography>
        <Typography variant="body1">{profile?.role}</Typography>
      </Box>

      <Box mb={2}>
        <Typography variant="subtitle1" fontWeight="bold">
          Account Created:
        </Typography>
        <Typography variant="body1">{formattedDate}</Typography>
      </Box>

      <Box mb={3}>
        <Typography variant="subtitle1" fontWeight="bold">
          Country:
        </Typography>
        <Typography variant="body1">{profile?.country}</Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Button
        variant="contained"
        sx={{
          bgcolor: "#472d30;",
          color: "#ffffff",
          "&:hover": { bgcolor: "#e26d5c" },
        }}
        startIcon={<LogoutIcon />}
        fullWidth
        onClick={() => {
          auth?.signout?.();
          onClose();
        }}
      >
        Log Out
      </Button>
    </Drawer>
  );
};

export default UserProfileDrawer;
