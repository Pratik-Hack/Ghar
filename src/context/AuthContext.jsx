import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { onAuthStateChanged, signInAnonymously, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [pinVerified, setPinVerified] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setPinVerified(true);
      } else {
        setUser(null);
        setPinVerified(false);
      }
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  const hashPin = useCallback(async (pin) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(pin);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }, []);

  const verifyPin = useCallback(async (pin) => {
    const pinHash = await hashPin(pin);

    try {
      // Sign in anonymously first to get read access to Firestore
      await signInAnonymously(auth);

      const configDoc = await getDoc(doc(db, "config", "app"));

      if (!configDoc.exists()) {
        await signOut(auth);
        return { success: false, error: "App not configured. Please set up PIN in Firebase Console." };
      }

      const storedHash = configDoc.data().pinHash;

      if (pinHash === storedHash) {
        setPinVerified(true);
        return { success: true };
      } else {
        // Wrong PIN — sign out immediately
        await signOut(auth);
        setPinVerified(false);
        return { success: false, error: "Wrong PIN. Try again." };
      }
    } catch (error) {
      try { await signOut(auth); } catch (_) { /* ignore */ }
      setPinVerified(false);
      return { success: false, error: "Connection error. Please try again." };
    }
  }, [hashPin]);

  const logout = useCallback(async () => {
    await signOut(auth);
    setUser(null);
    setPinVerified(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, authLoading, pinVerified, verifyPin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
