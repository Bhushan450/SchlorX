import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef
} from "react";

import { authService } from "../services/auth.service";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Keep the latest user available to event listeners
  const userRef = useRef(null);

  useEffect(() => {
    userRef.current = user;
  }, [user]);


  // -----------------------------------------
  // Extract user from API response
  // -----------------------------------------
  const extractUser = (response) => {

    return (
      response?.user ||
      response?.data?.user ||
      response?.data ||
      response?.result ||
      response
    );
  };


  // -----------------------------------------
  // Fetch current logged-in user
  // -----------------------------------------
  const fetchCurrentUser = async (showLoading = true) => {

    try {

      if (showLoading) {
        setLoading(true);
      }

      const response = await authService.getMe();

      const currentUser = extractUser(response);

      console.log("GET ME USER:", currentUser);

      if (currentUser) {

        setUser(currentUser);

        return currentUser;
      }

      setUser(null);

      return null;

    } catch (error) {

      console.error(
        "Failed to fetch current user:",
        error
      );

      setUser(null);

      return null;

    } finally {

      if (showLoading) {
        setLoading(false);
      }
    }
  };


  // -----------------------------------------
  // Initial authentication check
  // -----------------------------------------
  useEffect(() => {

    fetchCurrentUser();

  }, []);


  // -----------------------------------------
  // Synchronize user when browser window
  // becomes active again
  // -----------------------------------------
  useEffect(() => {

    let isSyncing = false;

    const syncUser = async () => {

      // Prevent multiple simultaneous requests
      if (isSyncing) {
        return;
      }

      isSyncing = true;

      console.log(
        "========== AUTH SYNC =========="
      );

      try {

        const previousUser = userRef.current;

        console.log(
          "Previous user:",
          previousUser
        );

        // Get latest user from backend
        const response = await authService.getMe();

        console.log(
          "getMe response:",
          response
        );

        const latestUser = extractUser(response);

        console.log(
          "Latest user:",
          latestUser
        );

        console.log(
          "Previous role:",
          previousUser?.role
        );

        console.log(
          "Latest role:",
          latestUser?.role
        );


        if (!latestUser) {

          console.log(
            "No authenticated user returned"
          );

          return;
        }


        // -----------------------------------------
        // Detect role change
        // -----------------------------------------
        if (
          previousUser?.role !== latestUser?.role
        ) {

          console.log(
            `Role changed: ${previousUser?.role} → ${latestUser?.role}`
          );

        }


        // -----------------------------------------
        // Update authentication state
        // -----------------------------------------
        setUser(latestUser);

        console.log(
          "Authentication state updated:",
          latestUser
        );

        console.log(
          "================================"
        );

      } catch (error) {

        console.error(
          "Authentication synchronization failed:",
          error
        );

      } finally {

        isSyncing = false;
      }
    };


    // -----------------------------------------
    // Browser tab/window becomes visible
    // -----------------------------------------
    const handleVisibilityChange = () => {

      if (
        document.visibilityState === "visible"
      ) {

        console.log(
          "Window became visible - syncing user..."
        );

        syncUser();
      }
    };


    // -----------------------------------------
    // Browser window receives focus
    // -----------------------------------------
    const handleFocus = () => {

      console.log(
        "Window received focus - syncing user..."
      );

      syncUser();
    };


    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    window.addEventListener(
      "focus",
      handleFocus
    );


    return () => {

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );

      window.removeEventListener(
        "focus",
        handleFocus
      );

    };

  }, []);


  // -----------------------------------------
  // Listen for session expiry signalled by the
  // Axios refresh interceptor (refresh-token
  // rotation failed → user must log in again)
  // -----------------------------------------
  useEffect(() => {

    const handleSessionExpired = () => {

      console.log(
        "auth:session-expired — clearing user state"
      );

      setUser(null);
    };

    window.addEventListener(
      'auth:session-expired',
      handleSessionExpired
    );

    return () => {
      window.removeEventListener(
        'auth:session-expired',
        handleSessionExpired
      );
    };

  }, []);


  // -----------------------------------------
  // Login
  // -----------------------------------------
  const login = async (credentials) => {

    const response =
      await authService.login(credentials);

    const loggedInUser =
      extractUser(response);

    console.log(
      "LOGIN USER:",
      loggedInUser
    );

    if (loggedInUser) {

      setUser(loggedInUser);

    } else {

      await fetchCurrentUser();
    }

    return response;
  };


  // -----------------------------------------
  // Logout
  // -----------------------------------------
  const logout = async () => {

    try {

      await authService.logout();

    } catch (error) {

      console.error(
        "Logout error:",
        error
      );

    } finally {

      setUser(null);
    }
  };


  // -----------------------------------------
  // Manually refresh current user
  // -----------------------------------------
  const refreshUser = async () => {

    await fetchCurrentUser(false);

  };


  // -----------------------------------------
  // Auth Context
  // -----------------------------------------
  return (

    <AuthContext.Provider
      value={{

        user,

        loading,

        isAuthenticated: !!user,

        role: user?.role || "guest",

        login,

        logout,

        refreshUser,

        setUser

      }}
    >

      {children}

    </AuthContext.Provider>

  );
};


export const useAuth = () => {

  const context = useContext(AuthContext);

  if (!context) {

    throw new Error(
      "useAuth must be used within an AuthProvider"
    );

  }

  return context;
};