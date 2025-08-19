import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./SearchSidebar.css";

const SearchSidebar = ({ onClose }) => {
  const sidebarRef = useRef();
  const inputRef = useRef();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const keys = [..."abcdefghijklmnopqrstuvwxyz1234567890"];

  const suggestions = [
    "The World of The Witcher",
    "Summer — Now Showing",
    "Comedies",
    "Action",
    "Kids & Family",
    "Horror",
    "Documentaries",
    "Anime",
  ];

  const handleKeyClick = (key) => {
    const updated = inputRef.current.value + key;
    inputRef.current.value = updated;
    setQuery(updated);
  };

  const handleSpace = () => {
    const updated = inputRef.current.value + " ";
    inputRef.current.value = updated;
    setQuery(updated);
  };

  const handleDelete = () => {
    const updated = inputRef.current.value.slice(0, -1);
    inputRef.current.value = updated;
    setQuery(updated);
  };

  // Fetch movies from TMDB API
  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&api_key=YOUR_API_KEY`
        );
        setResults(res.data.results || []);
      } catch (err) {
        console.error("Error fetching search results:", err);
        setResults([]);
      }
    };

    const delayDebounce = setTimeout(fetchData, 400);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="search-sidebar" ref={sidebarRef}>
      <div className="search-header">
        <input type="text" placeholder="Search..." ref={inputRef} readOnly />
        <span className="close-icon" onClick={onClose}>✘</span>
      </div>

      <div className="keyboard-grid">
        {keys.map((key, idx) => (
          <button
            key={idx}
            className="key-button"
            onClick={() => handleKeyClick(key)}
          >
            {key}
          </button>
        ))}
        <button className="key-button space" onClick={handleSpace}>
          Space
        </button>
        <button className="key-button delete" onClick={handleDelete}>
          🗑️
        </button>
      </div>

      <div className="search-suggestions">
        {suggestions.map((item, idx) => (
          <div
            key={idx}
            className="suggestion-item"
            onClick={() => {
              inputRef.current.value = item;
              setQuery(item);
            }}
          >
            {item}
          </div>
        ))}
      </div>

      <div className="search-grid">
        {results.length === 0 && query ? (
          <p style={{ padding: "10px" }}>No results found</p>
        ) : (
          results.map((movie) => (
            <div key={movie.id} className="search-poster">
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                    : "https://via.placeholder.com/200x300?text=No+Image"
                }
                alt={movie.title}
              />
              <div className="search-title">{movie.title}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchSidebar;
