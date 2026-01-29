import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import { getPublicUrl } from "../utils/supabaseAssetsStorage";
import type { User } from "../types/interfaces";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserProfile, updateUserProfile } from "../api/guestease-api";
import { AuthContext } from "../contexts/authContext";
import AccountSubNav from "../accountSubNav/accountSubNav";
import EditProfileDialog from "../components/editProfileDialog/EditProfileDialog";
import { deleteUserApi } from "../api/guestease-api";
import AlertDialogSlide from "../components/deleteUserConfirm/deleteUserConfirm";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/supabaseClient";

/**
 * This is the UserProfilePage where all user data are displayed.
 * The user will have the option to update and delete their account.
 * Supabase, though, keeps auth.users for authentication and a separate profiles table for app data.
 * PostgresSQL Triggers sync both ways because supabase may update auth.users, while our UI updates profiles.
 * This ensures both tables stay consistent and each remains the source of truth for its own purpose.
 * Auth handles login; profiles handle user info, andsyncing keeps them aligned.
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

  /**
   * React Query’s useMutation updates the user profile, then invalidates the
   * cached "profile" query so fresh data is refetched.
   * Local form state mirrors the profile data, and useEffect keeps it synced
   * whenever the profile query returns new values from Supabase.
   * https://tanstack.com/query/v4/docs/framework/react/guides/mutations
   * https://tanstack.com/query/v4/docs/framework/react/guides/query-invalidation
   */
  const queryClient = useQueryClient();
  const updateProfileMutation = useMutation({
    // 'Constructs a type with all properties of Type set to optional.'
    // This is perfect for update operations where we only send the fields that changed.
    // https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype
    mutationFn: (updates: Partial<User>) =>
      updateUserProfile(user!.id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
    },
  });

  // useState for the update pop up
  const [open, setOpen] = useState(false);

  // useState for the fields that can be updated by the user
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    country: "",
    zip_code: "",
  });

  /**
   * When the profile data is fetched or updated, we sync it into local form state.
   * The actual database sync between 'profiles' and 'auth.users' is handled by a
   * PostgreSQL trigger 'on_profile_updated'.
   * This effect keeps the form fields up to date with the latest profile values.
   */
  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name,
        last_name: profile.last_name,
        country: profile.country,
        zip_code: profile.zip_code,
      });
    }
  }, [profile]);

  /**
   * We create a 'deleteUser' function with useMutation.
   * 'mutations are typically used to create/update/delete data
   * or perform server side-effects. For this purpose,
   * TanStack Query exports a useMutation hook.'
   * It wraps our the 'deleteUserApi' function in 'guestease-api.ts'
   * https://tanstack.com/query/v4/docs/framework/react/guides/mutations
   */
  const deleteUser = useMutation({
    mutationFn: deleteUserApi,
  });

  // This useState is used to open and close the modal
  const [deleteOpen, setDeleteOpen] = useState(false);

  const navigate = useNavigate();

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
          <Typography variant="h3" component="h2">
            Hey {profile?.first_name}
          </Typography>
          <Typography variant="h5" component="h3">
            Account #{profile?.id.slice(-8)}
          </Typography>
        </Box>
        <AccountSubNav />
        <Box maxWidth="1200px" mx="auto" mt={4} px={2}>
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
                <Typography variant="body1">{profile?.first_name}</Typography>
              </Box>

              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Last Name
                </Typography>
                <Typography variant="body1">{profile?.last_name}</Typography>
              </Box>

              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">{profile?.email}</Typography>
              </Box>

              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Country
                </Typography>
                <Typography variant="body1">{profile?.country}</Typography>
              </Box>

              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Zip Code
                </Typography>
                <Typography variant="body1">{profile?.zip_code}</Typography>
              </Box>

              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Role
                </Typography>
                <Typography variant="body1">{profile?.role}</Typography>
              </Box>

              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Joined
                </Typography>
                <Typography variant="body1">
                  {new Date(user.created_at).toLocaleDateString()}
                </Typography>
              </Box>

              <Box sx={{ pt: { xs: 2, sm: 3 } }}>
                <Button
                  variant="contained"
                  sx={{
                    mb: 3,
                    backgroundColor: "#472d30",
                    "&:hover": { bgcolor: "#e26d5c" },
                  }}
                  onClick={() => setOpen(true)}
                >
                  Edit Profile
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    mb: 3,
                    ml: 2,
                    backgroundColor: "#e26d5c",
                    "&:hover": { bgcolor: "red" },
                  }}
                  onClick={() => setDeleteOpen(true)}
                >
                  Delete Profile
                </Button>
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
        {/* This is the pop up where we edit the user data */}
        <EditProfileDialog
          open={open}
          formData={formData}
          setFormData={setFormData}
          onClose={() => setOpen(false)}
          onSave={() => {
            updateProfileMutation.mutate(formData);
            setOpen(false);
          }}
        />
        <AlertDialogSlide
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          onConfirm={async () => {
            try {
              // Using a promise to delete, waiting for the backend
              // https://tanstack.com/query/v4/docs/framework/react/guides/mutations#promises
              await deleteUser.mutateAsync(user.id);
              // Sign out
              await supabase.auth.signOut();
              // Close modal
              setDeleteOpen(false);
              // Redirect
              navigate("/login");
            } catch (err) {
              console.error(err);
            }
          }}
        />
      </Container>
    </>
  );
};

export default UserProfilePage;
