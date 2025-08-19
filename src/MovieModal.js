import React, { useEffect, useRef, useState, useCallback } from "react";
import "./MovieModal.css";
import axios from "axios";

const MovieModal = ({ movie, onClose }) => {
  const [trailerKey, setTrailerKey] = useState("");
  const [playing, setPlaying] = useState(false);
  const [isInList, setIsInList] = useState(false);
  const iframeRef = useRef(null);

  // ✅ Stable function
  const checkIfInList = useCallback(() => {
    if (!movie) return;
    const list = JSON.parse(localStorage.getItem("myList")) || [];
    setIsInList(list.some((m) => m.id === movie.id));
  }, [movie]);

  useEffect(() => {
    const fetchTrailer = async () => {
      if (!movie) return;
      try {
        const type = movie.name ? "tv" : "movie";
        const response = await axios.get(
          `https://api.themoviedb.org/3/${type}/${movie.id}/videos`,
          {
            params: {
              api_key: process.env.REACT_APP_TMDB_API_KEY,
              language: "en-US",
            },
          }
        );

        const trailer = response.data.results.find(
          (vid) => vid.type === "Trailer" && vid.site === "YouTube"
        );
        if (trailer) {
          setTrailerKey(trailer.key);
        }
      } catch (err) {
        console.error("Trailer fetch failed", err);
      }
    };

    fetchTrailer();
    checkIfInList();
  }, [movie, checkIfInList]); // ✅ include it safely

  const handleAddToList = () => {
    const list = JSON.parse(localStorage.getItem("myList")) || [];
    if (!list.find((m) => m.id === movie.id)) {
      list.push(movie);
      localStorage.setItem("myList", JSON.stringify(list));
      setIsInList(true);
    }
  };

  const handleRemoveFromList = () => {
    const list = JSON.parse(localStorage.getItem("myList")) || [];
    const updated = list.filter((m) => m.id !== movie.id);
    localStorage.setItem("myList", JSON.stringify(updated));
    setIsInList(false);
  };

  const handlePlay = () => {
    setPlaying(true);
    setTimeout(() => {
      if (iframeRef.current && iframeRef.current.requestFullscreen) {
        iframeRef.current.requestFullscreen().catch((err) => {
          console.error("Fullscreen failed:", err);
        });
      }
    }, 300);
  };

  const handleGoBack = () => {
    setPlaying(false);
    document.exitFullscreen?.().catch(() => {});
  };

  if (!movie) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>

        {playing && trailerKey ? (
          <div className="fullscreen-trailer-wrapper">
            <iframe
              ref={iframeRef}
              className="fullscreen-trailer"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&controls=1`}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title="Trailer"
            ></iframe>
            <button className="go-back-btn" onClick={handleGoBack}>
              ← Go Back
            </button>
          </div>
        ) : (
          <>
            <img
              className="modal-backdrop"
              src={`https://image.tmdb.org/t/p/original${
                movie.backdrop_path || movie.poster_path
              }`}
              alt={movie.title || movie.name}
            />

            <div className="modal-info">
              <h2>{movie.title || movie.name}</h2>
              <p>{movie.overview}</p>
              <div className="modal-actions">
                <button className="play" onClick={handlePlay}>
                  ▶ Play
                </button>
                {isInList ? (
                  <button className="add" onClick={handleRemoveFromList}>
                    ✔ In List
                  </button>
                ) : (
                  <button className="add" onClick={handleAddToList}>
                    ＋ My List
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MovieModal;
