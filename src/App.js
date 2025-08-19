import React, { useState } from "react";
import "./App.css";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "./firebase";
import HomePage from "./HomePage";
import IntroAnimation from "./IntroAnimation"; // ✅ Add your animation component

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showIntro, setShowIntro] = useState(false); // ✅ Only for login intro

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
        setIsSignup(false);
        setEmail("");
        setPassword("");
        setError("Account created! Please sign in.");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        setShowIntro(true); // ✅ show animation only once after login
        setIsLoggedIn(true);
      }
    } catch (err) {
      console.error("Firebase error:", err.code);

      if (err.code === "auth/email-already-in-use") {
        setError("User already exists. Please sign in.");
        setIsSignup(false);
      } else if (err.code === "auth/user-not-found") {
        setError("No user found. Try signing up.");
      } else if (err.code === "auth/wrong-password") {
        setError("Wrong password.");
      } else {
        setError("Something went wrong.");
      }
    }
  };

  // 🔥 Show Moodflix animation first after login
  if (showIntro) {
    return <IntroAnimation onFinish={() => setShowIntro(false)} />;
  }

  // 👤 Who's Watching Screen
  if (isLoggedIn && !selectedProfile) {
    const profiles = [
      { name: "Manav", color: "#e50914" },
      { name: "Rards", color: "#46d369" },
      { name: "Luffy", color: "#f5c518" },
    ];

    return (
      <div className="whos-watching">
        <h1>Who's Watching?</h1>
        <div className="profiles">
          {profiles.map((profile) => (
            <div
              className="profile"
              key={profile.name}
              style={{ backgroundColor: profile.color }}
              onClick={() => setSelectedProfile(profile.name)}
            >
              {profile.name}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 🏠 HomePage
  if (isLoggedIn && selectedProfile) {
    const handleLogout = async () => {
      await auth.signOut();
      setIsLoggedIn(false);
      setSelectedProfile(null);
      setShowIntro(false); // ⛔ don't show intro again
    };

    return (
      <>
        <HomePage />
        <button
          onClick={handleLogout}
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            background: "#e50914",
            color: "white",
            padding: "10px 15px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            zIndex: 1000,
          }}
        >
          Sign Out
        </button>
      </>
    );
  }

  // 🔐 Sign In / Sign Up
  return (
    <div className="netflix-container">
      <div className="logo">
        <span className="mood">MOOD</span>
        <span className="flix">FLIX</span>
      </div>

      <div className="form-wrapper">
        <h2 className="title">{isSignup ? "Sign Up" : "Sign In"}</h2>

        <form className="signin-form" onSubmit={handleAuth}>
          <div className="box">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit">{isSignup ? "Sign Up" : "Sign In"}</button>

          {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

          {!isSignup && (
            <div className="options">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <a href="#">Need help?</a>
            </div>
          )}

          <div className="signup-prompt">
            {isSignup ? (
              <>
                Already have an account?{" "}
                <span
                  style={{ color: "#fff", cursor: "pointer" }}
                  onClick={() => setIsSignup(false)}
                >
                  Sign in
                </span>
              </>
            ) : (
              <>
                New to Moodflix?{" "}
                <span
                  style={{ color: "#fff", cursor: "pointer" }}
                  onClick={() => setIsSignup(true)}
                >
                  Sign up now
                </span>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
