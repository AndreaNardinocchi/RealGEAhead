import React, { useContext, type JSX } from "react";
import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase/supabaseClient";
import { AuthContext } from "../contexts/authContext";
import { Box, CircularProgress, Container } from "@mui/material";

/**
 * Props for protecting admin‑only routes.
 * 'JSX.Element' is the return type of a React component
 * https://blog.logrocket.com/react-children-prop-typescript/
 */
interface AdminRouteProps {
  children: JSX.Element;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  // We retrieve the user auth.users from supabase
  // https://react.dev/reference/react/useContext
  const auth = useContext(AuthContext);

  // If AuthContext is not initialized yet, redirect
  if (!auth) {
    return <Navigate to="/" replace />;
  }

  // Wait for Supabase session restoration to complete
  // https://supabase.com/docs/reference/javascript/auth-getsession
  if (auth.loading) {
    return (
      <Container sx={{ mt: 10, textAlign: "center" }}>
        <Box display="flex" justifyContent="center" mt={10}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // If user is not logged in, redirect to home
  if (!auth.user) {
    return <Navigate to="/" replace />;
  }

  /**
   * Fetch the role from the 'profiles' table.
   * This is necessary because Supabase does not store custom roles
   * inside 'auth.user.user_metadata'.
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
   */
  const { data: profile, isLoading } = useQuery({
    // 'profile-role' is just a label
    queryKey: ["profile-role", auth.user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", auth.user?.id)
        .single(); // Fetch exactly one row

      if (error) throw error;
      return data;
    },
  });

  // While the role is being fetched, show loading
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If user is not an admin, redirect to home
  if (!profile || profile.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // User is authenticated AND an admin → allow access
  return children;
};

export default AdminRoute;
