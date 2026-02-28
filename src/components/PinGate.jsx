import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const PIN_LENGTH = 4;

export default function PinGate({ children }) {
  const { authLoading, pinVerified, verifyPin } = useAuth();
  const [pin, setPin] = useState(Array(PIN_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!pinVerified && !authLoading) {
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [pinVerified, authLoading]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);
    setError("");

    if (value && index < PIN_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newPin.every((d) => d !== "")) {
      handleSubmit(newPin.join(""));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, PIN_LENGTH);
    if (pasted.length === PIN_LENGTH) {
      const newPin = pasted.split("");
      setPin(newPin);
      handleSubmit(pasted);
    }
  };

  const handleSubmit = async (pinString) => {
    if (checking) return;
    setChecking(true);
    const result = await verifyPin(pinString);
    if (!result.success) {
      setError(result.error);
      setPin(Array(PIN_LENGTH).fill(""));
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
    setChecking(false);
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-warm-100 via-warm-50 to-warm-200">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-5xl mb-4"
        >
          🏠
        </motion.div>
        <p className="text-warm-500 font-hand text-xl">Loading Ghar...</p>
      </div>
    );
  }

  // Authenticated — render app
  if (pinVerified) {
    return children;
  }

  // PIN entry screen
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-warm-100 via-warm-50 to-warm-200 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 max-w-sm w-full text-center"
      >
        <motion.span
          className="text-6xl block mb-4"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          🏠
        </motion.span>
        <h1 className="font-display text-3xl font-bold text-warm-900 mb-1">
          Ghar
        </h1>
        <p className="text-warm-400 text-sm mb-1">Our Family Memories</p>
        <p className="font-hand text-lg text-warm-500 mb-8">
          Enter family PIN to continue
        </p>

        {/* PIN input boxes */}
        <div className="flex justify-center gap-3 mb-6">
          {pin.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              type="password"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={i === 0 ? handlePaste : undefined}
              disabled={checking}
              className={`w-14 h-14 text-center text-2xl font-bold rounded-xl border-2 outline-none transition-all bg-warm-50 text-warm-800 ${
                error
                  ? "border-rose-warm focus:border-rose-warm focus:ring-rose-warm/20"
                  : "border-warm-200 focus:border-sunset focus:ring-sunset/20"
              } focus:ring-2`}
            />
          ))}
        </div>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-rose-warm text-sm mb-4"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {checking && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-warm-400 text-sm"
          >
            Verifying...
          </motion.p>
        )}

        <p className="text-warm-300 text-xs mt-6">
          Only family members can access this app
        </p>
      </motion.div>
    </div>
  );
}
