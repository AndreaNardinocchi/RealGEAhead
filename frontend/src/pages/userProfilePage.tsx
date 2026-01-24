import React, { useContext, useEffect } from "react";
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import { getPublicUrl } from "../utils/supabaseAssetsStorage";
import type { User } from "../types/interfaces";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../api/guestease-api";
import { AuthContext } from "../contexts/authContext";

/**
 * This is the UserProfilePage where all user data are displayed.
 * The user will have the option to update and delete their account.
 */

const UserProfilePage: React.FC = () => {
  /**
   * Access authentication state from AuthContext.
   * 'auth' may be null before the provider initializes, so we safely
   * destructure 'user' and 'loading' with a fallback to an empty object.
   */
  const auth = useContext(AuthContext);
  const { user, loading } = auth || {};

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
  console.log("This is the profile", profile);

  // Browser title
  useEffect(() => {
    if (user) {
      document.title = `${user.first_name}'s Profile Page | GuestEase`;
    }
  }, [user]);

  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress size={80} thickness={4} />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6">
          Please log in to view your profile.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Container maxWidth="lg">
        <Box maxWidth="1200px" mx="auto" px={2}>
          <Typography variant="h3">Hey {user.first_name}</Typography>
          <Typography variant="h5">Account #{user.id.slice(-8)}</Typography>
        </Box>

        <Box maxWidth="1200px" mx="auto" mt={4} px={2}>
          {/* <SubNav /> */}

          <Typography
            variant="h5"
            align="center"
            sx={{ color: "#472d30", mb: 1, mt: 3 }}
          >
            Here we will have a subnav ###
          </Typography>

          <Typography
            variant="h4"
            align="center"
            sx={{ color: "#472d30", mb: 1, mt: 3 }}
          >
            My Profile
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 4,
              mt: 6,
              mb: 10,
              // Align the items to the start edge of the container on the cross-axis.
              // https://www.geeksforgeeks.org/css/css-align-items-property/
              alignItems: "flex-start",
            }}
          >
            {/* Left column */}
            <Box sx={{ pt: { xs: 0, sm: 1 } }}>
              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  First Name
                </Typography>
                <Typography variant="body1">{user.first_name}</Typography>
              </Box>

              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Last Name
                </Typography>
                <Typography variant="body1">{user.last_name}</Typography>
              </Box>

              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">{user.email}</Typography>
              </Box>

              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Country
                </Typography>
                <Typography variant="body1">{user.country}</Typography>
              </Box>

              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Zip Code
                </Typography>
                <Typography variant="body1">{user.zip_code}</Typography>
              </Box>

              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Role
                </Typography>
                <Typography variant="body1">{user.role}</Typography>
              </Box>

              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Joined
                </Typography>
                <Typography variant="body1">
                  {new Date(user.created_at).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>

            {/* Right column*/}
            <Box
              sx={{
                py: 6,
                px: "5%",
                bgcolor: "background.paper",
                textAlign: "center",
                borderTop: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box
                component="img"
                src={getPublicUrl("GuestEaseLogo.png")}
                alt="GuestEase"
                sx={{
                  width: { xs: "60%", sm: "50%", md: "40%" },
                  height: "auto",
                }}
              />

              <Typography variant="h6" color="text.primary" gutterBottom>
                Comfort, Convenience, and Care
              </Typography>

              <Typography variant="body2" color="text.secondary" maxWidth={600}>
                At GuestEase, we make sure every stay feels like home. Enjoy
                cozy rooms, complimentary breakfast, and curated experiences
                around our guesthouse.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default UserProfilePage;
