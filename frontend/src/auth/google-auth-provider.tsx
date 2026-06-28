/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import type { GoogleAuthResponse } from "../types/google-auth";

// Google Auth Flow
// 1. User presses the Google button
// 2. Google popup opens and user approves
// 3. Google sends access token
// 4. Frontend sends access token to backend
// 5. Backend sends result
// 6. If success, save token and user. If error, show error.

type GoogleUser = NonNullable<GoogleAuthResponse["user"]>;

type GoogleAuthContextValue = {
  user: GoogleUser | null;
  loginWithGoogle: () => void;
  logout: () => void;
};

const GoogleAuthContext = createContext<GoogleAuthContextValue | null>(null);


const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;


function normalizeUser(user: GoogleUser) {
  return {
    ...user,
    picture: user.picture || user.pict || "",
  };
}

function getSavedUser() {
  const savedUser = localStorage.getItem("user");

  if (savedUser == null) {
    return null;
  }

  return normalizeUser(JSON.parse(savedUser) as GoogleUser);
}

export function GoogleAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<GoogleUser | null>(() => getSavedUser());

  const startGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const login = await axios.post<GoogleAuthResponse>(`${import.meta.env.VITE_API_URL}/auth/google`, {
        acc_token: tokenResponse.access_token,
      });

      const res = login.data;

      if (res.success && res.user != null && res.token != null) {
        const googleUser = normalizeUser(res.user);

        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(googleUser));
        setUser(googleUser);
        alert("Google Successful");
      } else {
        alert(res.err);
      }
    },
    onError: (error) => console.log("Login Failed:", error),
  });


  function loginWithGoogle() {
    if (!googleClientId) {
      alert("Google login is not ready. Please set VITE_GOOGLE_CLIENT_ID.");
      return;
    }

    startGoogleLogin();
  }


  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  const value = useMemo(() => {
    return {
      user,
      loginWithGoogle,
      logout,
    };
  }, [user, loginWithGoogle]);

  return (
    <GoogleAuthContext.Provider value={value}>
      {children}
    </GoogleAuthContext.Provider>
  );
}

export function useGoogleAuth() {
  const context = useContext(GoogleAuthContext);

  if (context == null) {
    throw new Error("useGoogleAuth must be used inside GoogleAuthProvider");
  }

  return context;
}
