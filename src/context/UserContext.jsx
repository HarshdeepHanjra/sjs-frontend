import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const UserContext = createContext();

export const useAuth = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useAuth must be used within a UserProvider");
  }
  return context;
};

export const useUser = useAuth;

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Generate unique tab ID for this browser tab
  const getTabId = () => {
    let tabId = sessionStorage.getItem("tabId");
    if (!tabId) {
      tabId = `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem("tabId", tabId);
    }
    return tabId;
  };

  const tabId = getTabId();

  // Add event listener for payment approval
  useEffect(() => {
    const handlePaymentApproved = async (event) => {
      console.log("Payment approved event received:", event.detail);

      // Refresh user data to show new courses
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // ✅ Use verify-token endpoint instead of /user/profile
          const response = await api.get("/api/auth/verify-token");
          if (response.data.valid) {
            const verifiedUser = response.data.user;
            const currentUser = user;

            // Merge updated user data
            const mergedUser = {
              ...currentUser,
              ...verifiedUser,
              course_ids: verifiedUser.course_ids || currentUser?.course_ids || [],
            };

            setUser(mergedUser);
            localStorage.setItem("user", JSON.stringify(mergedUser));

            console.log("User data refreshed after payment approval");
            toast.success("Your courses have been updated!");
          }
        } catch (error) {
          console.error("Failed to refresh user data:", error);
        }
      }
    };

    window.addEventListener("paymentApproved", handlePaymentApproved);
    return () =>
      window.removeEventListener("paymentApproved", handlePaymentApproved);
  }, [user]);

  useEffect(() => {
    restoreSession();

    const handleStorageChange = (e) => {
      console.log("Storage event:", e.key, e.newValue, e.oldValue);

      if (e.key === "logout-event" && e.newValue) {
        try {
          const logoutData = JSON.parse(e.newValue);
          if (logoutData.tabId !== tabId) {
            console.log("Logout event from another tab, clearing session");
            clearAuth();
          }
        } catch (error) {
          console.error("Error parsing logout event:", error);
        }
      }

      if (e.key === "token" && e.newValue !== e.oldValue) {
        if (!e.newValue && e.oldValue) {
          const currentToken = localStorage.getItem("token");
          if (currentToken !== e.oldValue) {
            console.log("Token removed in another tab, clearing session");
            clearAuth();
          }
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const restoreSession = async () => {
    const token = localStorage.getItem("token");
    // Try both 'user' and 'userData' for backward compatibility
    const userData = localStorage.getItem("user") || localStorage.getItem("userData");
    const userType = localStorage.getItem("userType");

    console.log("Restoring session:", {
      tokenExists: !!token,
      userType,
      hasUserData: !!userData,
    });

    if (token && userData && userType) {
      try {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const response = await api.get("/api/auth/verify-token");

        if (response.data.valid) {
          const verifiedUser = response.data.user;
          let parsedUser;

          try {
            parsedUser = JSON.parse(userData);
          } catch (e) {
            parsedUser = userData;
          }

          const finalUser = {
            id: verifiedUser.id,
            name: verifiedUser.name || parsedUser?.name,
            email: verifiedUser.email || parsedUser?.email,
            role: verifiedUser.role,
            userType: verifiedUser.role,
            ...(verifiedUser.student_id && {
              student_id: verifiedUser.student_id,
            }),
          };

          if (finalUser.role === userType) {
            setUser(finalUser);
            setIsAuthenticated(true);
            sessionStorage.setItem("tabToken", token);
            sessionStorage.setItem("tabUserType", finalUser.role);
            localStorage.setItem("currentTabId", tabId);
            // Ensure user data is stored consistently
            localStorage.setItem("user", JSON.stringify(finalUser));
            localStorage.setItem("userType", finalUser.role);
            console.log("Session restored successfully for:", finalUser.name);
          } else {
            console.log("Role mismatch, clearing session");
            clearAuth();
          }
        } else {
          console.log("Token invalid, clearing session");
          clearAuth();
        }
      } catch (error) {
        console.error("Session restoration error:", error);
        if (error.code === "ERR_NETWORK") {
          let parsedUser;
          try {
            parsedUser = JSON.parse(userData);
          } catch (e) {
            parsedUser = { name: "User", email: "" };
          }
          setUser({ ...parsedUser, role: userType, userType: userType });
          setIsAuthenticated(true);
        } else if (error.response?.status === 401) {
          clearAuth();
        }
      }
    }
    setLoading(false);
  };

  const clearAuth = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userData");
    localStorage.removeItem("userType");
    localStorage.removeItem("currentTabId");

    sessionStorage.removeItem("tabToken");
    sessionStorage.removeItem("tabUserType");

    delete api.defaults.headers.common["Authorization"];

    setUser(null);
    setIsAuthenticated(false);
  };

  const login = (token, userData, userType) => {
    console.log("Login - Setting user data:", { userData, userType, tabId });

    clearAuth();

    // Store consistently using 'user' key
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("userType", userType);
    localStorage.setItem("currentTabId", tabId);

    sessionStorage.setItem("tabToken", token);
    sessionStorage.setItem("tabUserType", userType);

    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const userWithRole = {
      ...userData,
      role: userType,
      userType: userType,
    };
    setUser(userWithRole);
    setIsAuthenticated(true);

    console.log("Login successful for tab:", tabId);
  };

  const logout = () => {
    console.log("Logging out from tab:", tabId);

    const logoutData = JSON.stringify({ time: Date.now(), tabId: tabId });
    localStorage.setItem("logout-event", logoutData);

    clearAuth();

    setTimeout(() => {
      if (localStorage.getItem("logout-event") === logoutData) {
        localStorage.removeItem("logout-event");
      }
    }, 100);
  };

  const updateUser = (updatedData) => {
    if (user) {
      const newUser = { ...user, ...updatedData };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    }
  };

  const refreshUser = async () => {
    try {
      const response = await api.get("/api/auth/verify-token");
      if (response.data.valid && response.data.user) {
        const verifiedUser = response.data.user;
        const updatedUser = {
          ...user,
          ...verifiedUser,
          role: verifiedUser.role,
          userType: verifiedUser.role,
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        localStorage.setItem("userType", verifiedUser.role);
        sessionStorage.setItem("tabUserType", verifiedUser.role);
        return updatedUser;
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    refreshUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};