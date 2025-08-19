import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./HomePage.css";
import VideoPlayer from "./VideoPlayer";
import Sidebar from "./Sidebar";
import SearchSidebar from "./SearchSidebar";
import SurpriseMe from "./SurpriseMe";
import MovieModal from "./MovieModal";
import MyList from "./MyList";
import NewsAndUpdates from "./NewsAndUpdates";

const API_KEY = "ce8d896846e3eaa30375751dd6040915";

const HomePage = () => {
  const [showTvGenres, setShowTvGenres] = useState(false);
  const [showMovieGenres, setShowMovieGenres] = useState(false);
  const [showSidebarSearch, setShowSidebarSearch] = useState(false);
  const [activePage, setActivePage] = useState("home");
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [topTvShows, setTopTvShows] = useState([]);
  const [hovered, setHovered] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [savedMovies, setSavedMovies] = useState([]);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const [movieGenres, setMovieGenres] = useState([]);
  const [tvGenres, setTvGenres] = useState([]);
  const [genreResults, setGenreResults] = useState([]);
  const [genreTitle, setGenreTitle] = useState("");

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [trendingRes, topTvRes, movieGenresRes, tvGenresRes] = await Promise.all([
          axios.get("https://api.themoviedb.org/3/trending/movie/day", { params: { api_key: API_KEY } }),
          axios.get("https://api.themoviedb.org/3/tv/top_rated", { params: { api_key: API_KEY } }),
          axios.get("https://api.themoviedb.org/3/genre/movie/list", { params: { api_key: API_KEY } }),
          axios.get("https://api.themoviedb.org/3/genre/tv/list", { params: { api_key: API_KEY } }),
        ]);
        setTrendingMovies(trendingRes.data.results);
        setTopTvShows(topTvRes.data.results);
        setMovieGenres(movieGenresRes.data.genres);
        setTvGenres(tvGenresRes.data.genres);
      } catch (err) {
        console.error("Error fetching initial data:", err);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const storedList = JSON.parse(localStorage.getItem("my-movie-list")) || [];
    setSavedMovies(storedList);
  }, []);

  const toggleTvGenres = () => {
    setShowTvGenres(!showTvGenres);
    setShowMovieGenres(false);
  };

  const toggleMovieGenres = () => {
    setShowMovieGenres(!showMovieGenres);
    setShowTvGenres(false);
  };

  const handleGenreClick = async (genreId, type) => {
    try {
      const endpoint = type === "movie" ? "discover/movie" : "discover/tv";
      const res = await axios.get(`https://api.themoviedb.org/3/${endpoint}`, {
        params: { api_key: API_KEY, with_genres: genreId },
      });
      setGenreResults(res.data.results);

      const genreName =
        type === "movie"
          ? movieGenres.find((g) => g.id === genreId)?.name
          : tvGenres.find((g) => g.id === genreId)?.name;

      setGenreTitle(`${type === "movie" ? "Movies" : "TV Shows"} in Genre: ${genreName}`);
      setActivePage("genre");
      setShowMovieGenres(false);
      setShowTvGenres(false);
    } catch (err) {
      console.error("Error fetching genre items:", err);
    }
  };

  const addToMyList = (movie) => {
    const existingList = JSON.parse(localStorage.getItem("my-movie-list")) || [];
    if (!existingList.find((m) => m.id === movie.id)) {
      const updatedList = [...existingList, movie];
      localStorage.setItem("my-movie-list", JSON.stringify(updatedList));
      setSavedMovies(updatedList);
    }
  };

  const removeFromMyList = (movieId) => {
    const updatedList = savedMovies.filter((m) => m.id !== movieId);
    localStorage.setItem("my-movie-list", JSON.stringify(updatedList));
    setSavedMovies(updatedList);
  };

  const sliderSettings = {
    arrows: true,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 3 } },
      { breakpoint: 600, settings: { slidesToShow: 2, slidesToScroll: 2 } },
    ],
  };

  const handlePlay = () => {
    setIsFullScreen(true);
    const player = document.getElementById("trailer-video");
    if (player) {
      player.requestFullscreen?.();
      player.currentTime = 0;
      player.play();
    }
  };

  const exitFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    setIsFullScreen(false);
  };

  return (
    <div className="homepage">
      <Sidebar onSearchClick={() => setShowSidebarSearch(true)} setActivePage={setActivePage} />

      {showSidebarSearch && <SearchSidebar onClose={() => setShowSidebarSearch(false)} />}

      {activePage === "home" && (
        <>
          <div className="nav">
            <div className="menu">
              <span onClick={() => setActivePage("home")}>Home</span>

              <div className="dropdown">
                <span onClick={toggleTvGenres}>TV Shows ▾</span>
                {showTvGenres && (
                  <div className="dropdown-content">
                    {tvGenres.map((genre) => (
                      <span key={genre.id} onClick={() => handleGenreClick(genre.id, "tv")}>
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="dropdown">
                <span onClick={toggleMovieGenres}>Movies ▾</span>
                {showMovieGenres && (
                  <div className="dropdown-content">
                    {movieGenres.map((genre) => (
                      <span key={genre.id} onClick={() => handleGenreClick(genre.id, "movie")}>
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <span onClick={() => setActivePage("mylist")}>My List</span>

              <div className="mood-menu">
                <button className="mood-toggle">Mood ☰</button>
                <ul className="mood-dropdown">
                  <li>Happy</li>
                  <li>Sad</li>
                  <li>Thrilling</li>
                  <li>Romantic</li>
                  <li>Chill</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Banner */}
          <div className="banner">
            <VideoPlayer id="trailer-video" />
            {isFullScreen ? (
              <button className="go-back-button" onClick={exitFullScreen}>
                ← Go Back
              </button>
            ) : (
              <div className="banner-text">
                <h1>Big Buck Bunny</h1>
                <div className="rating-tag">PG | 10 min | Animation, Comedy</div>
                <p>
                  A peaceful forest. A gentle giant. And three tiny bullies who picked the wrong bunny
                  to mess with...
                </p>
                <button className="play-button" onClick={handlePlay}>
                  ▶ Play
                </button>
              </div>
            )}
          </div>

          {/* Trending */}
          <div className="section">
            <h2>Trending Now</h2>
            <Slider {...sliderSettings}>
              {trendingMovies.map((movie) => (
                <div
                  key={movie.id}
                  className="poster-item"
                  onMouseEnter={() => setHovered(movie.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setSelectedMovie(movie)}
                >
                  {hovered === movie.id ? (
                    <video src="/videos/sample.mp4" autoPlay muted loop className="poster-video" />
                  ) : (
                    <img
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                          : "/images/fallback.png"
                      }
                      alt={movie.title}
                      className="poster-image"
                    />
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToMyList(movie);
                    }}
                    disabled={savedMovies.some((m) => m.id === movie.id)}
                  >
                    {savedMovies.some((m) => m.id === movie.id) ? "✅ Added" : "+ My List"}
                  </button>
                </div>
              ))}
            </Slider>
          </div>

          {/* Top TV Shows */}
          <div className="section">
            <h2>Top TV Shows</h2>
            <Slider {...sliderSettings}>
              {topTvShows.map((show) => (
                <div
                  key={show.id}
                  className="poster-item"
                  onMouseEnter={() => setHovered(show.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setSelectedMovie(show)}
                >
                  {hovered === show.id ? (
                    <video src="/videos/sample.mp4" autoPlay muted loop className="poster-video" />
                  ) : (
                    <img
                      src={
                        show.poster_path
                          ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
                          : "/images/fallback.png"
                      }
                      alt={show.name}
                      className="poster-image"
                    />
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToMyList(show);
                    }}
                    disabled={savedMovies.some((m) => m.id === show.id)}
                  >
                    {savedMovies.some((m) => m.id === show.id) ? "✅ Added" : "+ My List"}
                  </button>
                </div>
              ))}
            </Slider>
          </div>
        </>
      )}

      {activePage === "mylist" && (
        <MyList savedMovies={savedMovies} removeFromMyList={removeFromMyList} />
      )}

      {activePage === "surprise" && <SurpriseMe />}
      {activePage === "news" && <NewsAndUpdates />}

      {activePage === "genre" && (
        <div className="section">
          <h2>{genreTitle}</h2>
          <Slider {...sliderSettings}>
            {genreResults.map((item) => (
              <div
                key={item.id}
                className="poster-item"
                onMouseEnter={() => setHovered(item.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setSelectedMovie(item)}
              >
                {hovered === item.id ? (
                  <video src="/videos/sample.mp4" autoPlay muted loop className="poster-video" />
                ) : (
                  <img
                    src={
                      item.poster_path
                        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                        : "/images/fallback.png"
                    }
                    alt={item.title || item.name}
                    className="poster-image"
                  />
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToMyList(item);
                  }}
                  disabled={savedMovies.some((m) => m.id === item.id)}
                >
                  {savedMovies.some((m) => m.id === item.id) ? "✅ Added" : "+ My List"}
                </button>
              </div>
            ))}
          </Slider>
        </div>
      )}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onAddToList={addToMyList}
          onRemoveFromList={removeFromMyList}
          isSaved={savedMovies.some((m) => m.id === selectedMovie.id)}
        />
      )}
    </div>
  );
};

export default HomePage;
