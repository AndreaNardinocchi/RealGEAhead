import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  // https://mui.com/material-ui/react-text-field/
  TextField,
  Typography,
  Container,
  InputAdornment,
  MenuItem,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";
// https://mui.com/material-ui/material-icons/
import EmailIcon from "@mui/icons-material/Email";
import KeyIcon from "@mui/icons-material/Key";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/supabaseClient";
import { countries } from "../types/interfaces";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
//  https://supabase.com/docs/guides/storage
import { getPublicUrl } from "../utils/supabaseAssetsStorage";

/**
 * This page has been built out by essentially refactoring the one built
 * in https://github.com/AndreaNardinocchi/MoviesApp/blob/main/src/pages/signUpPage.tsx
 * for the full stack 2 assignment.
 * However, here we are using the Visibility icons and mechanisms.
 */

const SignUpPage: React.FC = () => {
  /**
   * This is the browser title
   * https://stackoverflow.com/questions/46160461/how-do-you-set-the-document-title-in-react?
   */
  useEffect(() => {
    document.title = `Sign up | GuestEase`;
  }, []);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");
  const navigate = useNavigate();

  // Error flags for validation
  const [nameError, setNameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  // Toggles for showing/hiding password fields
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /**
   * We created this state to display a message confirming that
   * a new user account was created, and that a confirmation email
   * was sent off
   * */
  const [confirmationMessage, setConfirmationMessage] = useState("");

  /**
   * Handles the full signup process as it validatesthe required fields
   * https://supabase.com/docs/reference/javascript/auth-signup
   */
  const handleSignUp = async () => {
    console.log("Starting signup process...");
    console.log("Form values:", {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      country,
      zipCode,
    });

    /**
     * As we would like to handle empty field errors, we will set an error and
     * handle it in the handleSignUp function below.
     * https://muhimasri.com/blogs/mui-validation/
     */
    if (
      firstName.trim() === "" ||
      lastName.trim() === "" ||
      email.trim() === "" ||
      password.trim() === "" ||
      confirmPassword.trim() === "" ||
      zipCode.trim() === "" ||
      country === ""
    ) {
      setNameError(true);
      console.warn("Validation failed: missing required fields");
      return;
    } else if (password !== confirmPassword) {
      setPasswordError(true);
      console.warn("Validation failed: passwords do not match");
      return;
    } else {
      setNameError(false);
      setPasswordError(false);
    }

    try {
      console.log("Calling Supabase signUp...");
      // Call Supabase signUp
      // https://supabase.com/docs/guides/auth/managing-user-data
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            country: country,
            zip_code: zipCode,
          },
        },
      });

      console.log("Supabase signUp returned:", { data, error });

      if (error) {
        console.error("Error signing up:", error);
        alert(`Sign-up failed: ${error.message}`);
        return;
      }

      console.log("User signed up successfully:", data);

      // We will set a confirmation message
      if (data.user && !data.user.email_confirmed_at) {
        setConfirmationMessage(
          "Account created! Please check your email to confirm your account.",
        );
        // Redirect after a short delay
        setTimeout(() => {
          navigate("/login");
        }, 3500);
        return;
      }
      // Fetch the session to confirm
      const sessionRes = await supabase.auth.getSession();
      console.log("Current session after signup:", sessionRes);

      navigate("/login");
    } catch (err) {
      console.error("Unexpected error during signup:", err);
      alert("An unexpected error occurred. Check the console for details.");
    }
  };

  return (
    <>
      {/* Image strip on the top */}
      <Box
        sx={{
          width: "100%",
          height: { xs: "180px", md: "260px" },
          overflow: "hidden",
        }}
      >
        <Box
          component="img"
          src={getPublicUrl("brigidshaven1.png")}
          alt="Signup header"
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Box>
      {/* Main content area */}
      <Box
        sx={{
          minHeight: "50vh",
          pb: 10,
          pt: 5,
          margin: 0,
          backgroundColor: "#ffffff",
        }}
      >
        <Container maxWidth="sm" sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            Create your GuestEase account
            <br />
            <span style={{ fontSize: "1rem" }}>All fields required</span>
          </Typography>

          {/* Sign up form */}
          {/* https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/noValidate */}
          <Box component="form" noValidate autoComplete="off">
            {/* https://www.geeksforgeeks.org/reactjs/how-to-use-textfield-component-in-material-ui/ */}
            <TextField
              fullWidth
              required
              label="First name"
              margin="normal"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              error={nameError}
              helperText={nameError ? "Please enter your first name" : ""}
              InputProps={{
                // https://stackoverflow.com/questions/69554151/how-to-change-material-ui-textfield-inputadornment-background-color
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              required
              label="Last name"
              margin="normal"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              error={nameError}
              helperText={nameError ? "Please enter your last name" : ""}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              required
              label="Email"
              type="email"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={nameError}
              helperText={nameError ? "Please enter your email" : ""}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              required
              label="Password"
              type={showPassword ? "text" : "password"}
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={passwordError}
              helperText={passwordError ? "Passwords do not match" : ""}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <KeyIcon />
                  </InputAdornment>
                ),
                // https://stackoverflow.com/questions/63047684/material-ui-select-menu-with-end-adornment#66245441
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                    >
                      {/* https://materialui.co/icon/visibility-off{" "} */}
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              required
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={passwordError}
              helperText={passwordError ? "Passwords do not match" : ""}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <KeyIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              select
              fullWidth
              required
              label="Country"
              margin="normal"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              error={nameError && country === ""}
              helperText={
                nameError && country === "" ? "Please select your country" : ""
              }
            >
              {countries.map((c) => (
                <MenuItem key={c.code} value={c.name}>
                  {c.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              required
              label="Zip Code"
              margin="normal"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              error={nameError && zipCode === ""}
              helperText={
                nameError && zipCode === "" ? "Please enter your zip code" : ""
              }
            />
            <Button
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                bgcolor: "#472d30",
                color: "#ffffff",
                textTransform: "uppercase",
                fontWeight: 600,
                "&:hover": { bgcolor: "#e26d5c" },
              }}
              onClick={handleSignUp}
            >
              Sign up
            </Button>

            <Button
              onClick={() => navigate("/login")}
              sx={{ color: "#472d30" }}
            >
              Already have an account? Log in
            </Button>
          </Box>

          {confirmationMessage && (
            <Box
              sx={{
                mb: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Alert
                severity="success"
                variant="filled"
                sx={{ fontSize: "1.25rem", py: 2, px: 3, maxWidth: "500px" }}
              >
                {confirmationMessage}
              </Alert>
              <CircularProgress size={90} thickness={4} sx={{ mt: 3 }} />
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

export default SignUpPage;
