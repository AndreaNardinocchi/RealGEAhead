/**
 * This route file will protect the routes that are supposed to be viewable
 * only by the loggedin user.
 * https://github.com/AndreaNardinocchi/MoviesApp/blob/main/src/components/routes/protectedRoutes.tsx
 */
import React, { useContext } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/authContext";
import { Box, CircularProgress } from "@mui/material";

const ProtectedRoute: React.FC<React.PropsWithChildren> = (props) => {
  const authContext = useContext(AuthContext);
  const { token, loading } = authContext || {};
  const location = useLocation();
  // If loading return circular progress in case of any delays in retrieving user data
  if (loading) {
    return (
      <Box
        sx={{
          textAlign: "center",
          mt: 8,
        }}
      >
        <CircularProgress size={80} thickness={4} />
      </Box>
    );
  }

  if (!token) {
    return <Navigate to={"/login"} replace state={{ intent: location }} />;
  }

  return props.children;
};

export default ProtectedRoute;
