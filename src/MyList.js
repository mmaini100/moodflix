import React, { useEffect, useState } from "react";
import "./MyList.css";
import MyListMovieModal from "./MyListMovieModal";

const MyList = () => {
  const [myList, setMyList] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("my-movie-list")) || [];
    setMyList(saved);
  }, []);

  const handleRemove = (id) => {
    const updated = myList.filter((movie) => movie.id !== id);
    setMyList(updated);
    localStorage.setItem("my-movie-list", JSON.stringify(updated));
    setSelectedMovie(null);
  };

  const baseImageUrl = "https://image.tmdb.org/t/p/w500";

  return (
    <div className="my-list-container">
      <h2 className="my-list-title">My List</h2>

      {myList.length === 0 ? (
        <p className="my-list-empty">You haven’t added any movies yet.</p>
      ) : (
        <div className="my-list-scroll">
          {myList.map((movie) => (
            <div
              className="my-list-item"
              key={movie.id}
              onClick={() => setSelectedMovie(movie)}
            >
              {movie.poster_path ? (
                <img
                  className="my-list-poster"
                  src={`${baseImageUrl}${movie.poster_path}`}
                  alt={movie.title}
                />
              ) : (
                <div className="no-poster">No Image</div>
              )}
              <p className="my-list-movie-title">{movie.title}</p>
            </div>
          ))}
        </div>
      )}

      {selectedMovie && (
        <MyListMovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onRemove={handleRemove}
        />
      )}
    </div>
  );
};

export default MyList;
