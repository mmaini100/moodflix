// MyListMovieModal.js
import React, { useEffect, useState } from "react";
import movieTrailer from "movie-trailer";
import "./MyListMovieModal.css";

const MyListMovieModal = ({ movie, onClose, onRemove }) => {
  const [trailerUrl, setTrailerUrl] = useState("");
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    if (movie) {
      movieTrailer(movie.title || movie.name || "")
        .then((url) => {
          const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerUrl(urlParams.get("v"));
        })
        .catch((error) => {
          console.error("Trailer not found:", error);
          setTrailerUrl(""); // ensure fallback
        });
    }
  }, [movie]);

  if (!movie) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-button" onClick={onClose}>✖</span>

        {showTrailer && trailerUrl ? (
          <div className="video-wrapper">
            <iframe
              src={`https://www.youtube.com/embed/${trailerUrl}?autoplay=1`}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title="Movie Trailer"
            />
          </div>
        ) : (
          <>
            <img
              src={
                movie.backdrop_path
                  ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
                  : "/images/fallback.png"
              }
              alt={movie.title || movie.name}
              className="modal-backdrop"
            />
            <h2>{movie.title || movie.name}</h2>
            <p>{movie.overview || "No description available."}</p>

            <div className="button-group">
              {trailerUrl ? (
                <button
                  className="watch-trailer-button"
                  onClick={() => {
                    setShowTrailer(true);
                    setTimeout(() => {
                      const iframe = document.querySelector(".video-wrapper iframe");
                      if (iframe?.requestFullscreen) iframe.requestFullscreen();
                      else if (iframe?.webkitRequestFullscreen) iframe.webkitRequestFullscreen();
                      else if (iframe?.mozRequestFullScreen) iframe.mozRequestFullScreen();
                      else if (iframe?.msRequestFullscreen) iframe.msRequestFullscreen();
                    }, 100); // Delay to ensure iframe mounts
                  }}
                >
                  ▶ Watch Trailer
                </button>
              ) : (
                <p className="no-trailer">🚫 Trailer not available</p>
              )}

              <button
                className="remove-button"
                onClick={() => onRemove(movie.id)}
              >
                ❌ Remove from My List
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyListMovieModal;
