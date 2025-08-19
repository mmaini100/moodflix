const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// Fetch random movie from popular list
export const getRandomMovieOrShow = async () => {
  try {
    const page = Math.floor(Math.random() * 10) + 1;

    const res = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&page=${page}`);
    const data = await res.json();

    const randomIndex = Math.floor(Math.random() * data.results.length);
    return data.results[randomIndex];
  } catch (err) {
    console.error("Error fetching random movie:", err);
    return null;
  }
};
