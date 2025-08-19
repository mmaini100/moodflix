// src/IntroAnimation.js
import React, { useEffect } from "react";
import "./IntroAnimation.css";

const IntroAnimation = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish(); // Go to profile selection after animation
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="intro-animation">
      <div className="logo-text">
        <span className="mood">MOOD</span>
        <span className="flix">FLIX</span>
      </div>
    </div>
  );
};

export default IntroAnimation;
