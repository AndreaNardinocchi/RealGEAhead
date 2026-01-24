import React, { useState, createContext, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { AuthContextInterface, User } from "../types/interfaces";
import { supabase } from "../supabase/supabaseClient";
// We are importing 'Session' and 'User from the @supabase/supabase-js package
// User is renamed to SupabaseUser using the as keyword to avoid naming conflicts with any other User
import type { Session, User as SupaUser } from "@supabase/supabase-js";

/**
 * The authContext was developed mainly by refactoring the context used in
 * https://github.com/AndreaNardinocchi/MoviesApp/blob/main/src/contexts/authContext.tsx
 * for the Full-stack 2 module assignment
 */

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextInterface | null>(null);

const AuthContextProvider: React.FC<React.PropsWithChildren> = (props) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // The loading state prevents the app from rendering before the user is logged in.
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  /**
   * Authenticates the user using Supabase login data and updates the app state.
   * supabaseData is an object containing the authenticated `user` and `session` from Supabase.
   * Typescript prompted the use of useCallback()
   * https://react.dev/reference/react/useCallback
   */
  const authenticate = useCallback(
    async (supabaseData: { user: SupaUser; session: Session }) => {
      const { user, session } = supabaseData;

      if (!user || !session) {
        // Session not ready yet
        return;
      }

      /**
       * Extract user metadata from Supabase. If no metadata exists,
       * fall back to an empty object to avoid undefined errors.
       */
      const metadata = user.user_metadata || {};

      // Create a clean user object for our app.
      const newUser: User = {
        id: user.id,
        first_name: metadata.first_name || "User",
        last_name: metadata.last_name || "User",
        email: user.email || "user@example.com",
        role: metadata.role || "guest",
        created_at: user.created_at || new Date().toISOString(),
        country: metadata.country || "Unknown",
        zip_code: metadata.zip_code || "Unknown",
      };

      // Updating the user state with the current logged‑in user.
      setUser(newUser);
      setToken(session.access_token || null);

      // Get the page the user originally wanted to visit before being redirected.
      // If it exists, we'll send them back there after they log in.
      const origin = location.state?.intent?.pathname;

      if (origin) {
        navigate(origin);
        // The loading should stop after authentication is finished
        setLoading(false);
      }
    },
    [location, navigate],
  );

  useEffect(() => {
    /**
     * This async function tries to restore an existing user session on page load or refresh.
     * If a valid session is found, it will `authenticate()` to set user state and token again
     * The session data will be fetched from the localStorage and the session will be resumed.
     */
    async function fetchSession() {
      setLoading(true);
      // https://supabase.com/docs/reference/javascript/auth-getsession
      // https://github.com/orgs/supabase/discussions/32783
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Failed to restore session");
        return;
      }

      console.log("getSession(): ", data.session, error);

      // We create a const variable called 'session'
      const session = data.session;

      // If the session and user of that session exist, then, we will authenticate them again and
      // the session will be restored (authenticate() takes the 2 values as per 'const { user, session } = supabaseData;')
      if (session && session.user) {
        await authenticate({ user: session.user, session });
      }
      // Marks loading as finished
      setLoading(false);
    }

    fetchSession();

    /**
     * Add listener for auth state changes (login, logout, token refresh)
     * This ensures the user state and token stay updated automatically, keeping
     *  the auth context in sync with Supabase
     * https://supabase.com/docs/reference/javascript/auth-onauthstatechange
     */
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          authenticate({ user: session.user, session });
        } else {
          setUser(null);
          setToken(null);
        }
      },
    );
    // Clean up the listener when the component unmounts
    return () => subscription?.subscription.unsubscribe();
  }, [authenticate]);

  // We do need to create an async function to use the Supabase signOut() function
  const signout = async () => {
    // https://supabase.com/docs/reference/javascript/auth-signout
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Failed to restore session");
      return;
    }

    setToken(null);
    navigate("/");
  };

  // https://supabase.com/docs/reference/javascript/auth-resetpasswordforemail
  const resetPassword = async (email: string) => {
    if (!email) {
      console.error("Email is required for password reset");
      return { error: "Email is required" };
    }

    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "http://localhost:5173/update-password", // It will be replaced by the deployed URL
      });

      if (error) {
        console.error("Reset password error:", error.message);
        return { error: error.message };
      }

      return { success: true };
    } catch (err: any) {
      console.error("Reset password exception:", err.message);
      return { error: err.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        authenticate,
        signout,
        resetPassword,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
