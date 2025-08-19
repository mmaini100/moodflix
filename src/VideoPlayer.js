import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

const VideoPlayer = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource("https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8");
 // sample trailer
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";
    }
  }, []);

  return (
    <video
      ref={videoRef}
      controls
      autoPlay
      muted
      loop
      className="trailer-video"
    />
  );
};

export default VideoPlayer;
