import React, { useEffect, useState, useRef, useCallback } from "react";
import "./SurpriseMe.css";

const SurpriseMe = () => {
  const [movie, setMovie] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);
  const [addedToList, setAddedToList] = useState(false);
  const trailerRef = useRef(null);
  const hasFetched = useRef(false);

  const apiKey = process.env.REACT_APP_TMDB_API_KEY;

  const checkIfAlreadyInList = useCallback((m) => {
    const existingList = JSON.parse(localStorage.getItem("my-movie-list")) || [];
    const alreadyExists = existingList.some((x) => x.id === m.id);
    setAddedToList(alreadyExists);
  }, []);

  const getRandomMovie = useCallback(async () => {
    try {
      const randomPage = Math.floor(Math.random() * 50) + 1;
      const res = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=${randomPage}`
      );
      const data = await res.json();

      if (data.results && data.results.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.results.length);
        const selectedMovie = data.results[randomIndex];

        const trailerRes = await fetch(
          `https://api.themoviedb.org/3/movie/${selectedMovie.id}/videos?api_key=${apiKey}`
        );
        const trailerData = await trailerRes.json();
        const trailer = (trailerData.results || []).find(
          (vid) => vid.type === "Trailer" && vid.site === "YouTube"
        );

        setTrailerKey(trailer ? trailer.key : null);
        setMovie(selectedMovie);
        setShowTrailer(false);
        checkIfAlreadyInList(selectedMovie);
      }
    } catch (error) {
      console.error("Error fetching movie or trailer:", error);
    }
  }, [apiKey, checkIfAlreadyInList]);

  useEffect(() => {
    // Guard against Strict Mode double-invoke in development
    if (hasFetched.current) return;
    hasFetched.current = true;
    getRandomMovie();
  }, [getRandomMovie]);

  useEffect(() => {
    if (showTrailer && trailerRef.current) {
      trailerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showTrailer]);

  const saveToMyList = (m) => {
    const existingList = JSON.parse(localStorage.getItem("my-movie-list")) || [];
    const alreadyExists = existingList.some((x) => x.id === m.id);
    if (!alreadyExists) {
      const updatedList = [...existingList, m];
      localStorage.setItem("my-movie-list", JSON.stringify(updatedList));
      setAddedToList(true);
    }
  };

  if (!movie) return <p className="loading-text">Loading Surprise...</p>;

  return (
    <div className="surprise-me-container">
      <h2 className="surprise-title">🎁 Surprise Pick!</h2>
      <div className="movie-card">
        {movie.poster_path && (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="surprise-image"
          />
        )}

        <div className="surprise-info">
          <h3>{movie.title}</h3>
          <p>{movie.overview || "No description available."}</p>
        </div>

        <div className="button-group">
          <button className="surprise-button" onClick={getRandomMovie}>
            🔁 Another One
          </button>

          <button
            className="surprise-button"
            onClick={() => saveToMyList(movie)}
            disabled={addedToList}
          >
            {addedToList ? "✅ Added" : "➕ Add to My List"}
          </button>

          {trailerKey && (
            <button
              className="surprise-button"
              onClick={() => setShowTrailer((prev) => !prev)}
            >
              {showTrailer ? "❌ Hide Trailer" : "▶️ Show Trailer"}
            </button>
          )}
        </div>

        {showTrailer && trailerKey && (
          <div ref={trailerRef} className="trailer-embed">
            <iframe
              width="100%"
              height="315"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=1`}
              title="YouTube trailer"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SurpriseMe;
