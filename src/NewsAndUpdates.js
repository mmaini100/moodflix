import React, { useEffect, useState } from "react";
import "./NewsAndUpdates.css";

const NewsAndUpdates = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    // Example static news; in future, you can replace with real API data
    const exampleNews = [
      {
        id: 1,
        title: "Season 4 of 'Stranger Things' is Coming!",
        date: "April 10, 2025",
        content:
          "Netflix has announced that Season 4 of 'Stranger Things' will premiere this summer with more thrills, deeper mysteries, and new characters.",
      },
      {
        id: 2,
        title: "Top 10 Must-Watch Movies This Month",
        date: "April 12, 2025",
        content:
          "From action-packed adventures to romantic dramas, check out the top trending films streaming now.",
      },
      {
        id: 3,
        title: "Oscar Buzz Begins: Early Predictions",
        date: "April 13, 2025",
        content:
          "Critics are already predicting this year’s Oscar favorites. Will it be a blockbuster or an indie gem that takes the crown?",
      },
      {
        id: 4,
        title: "New Marvel Series Breaks Streaming Records",
        date: "April 14, 2025",
        content:
          "Marvel’s latest show has shattered records on its opening weekend with fans raving about the twists and cameos.",
      },
      {
        id: 5,
        title: "Classic Films Returning to Theaters",
        date: "April 15, 2025",
        content:
          "Beloved classics like ‘The Godfather’ and ‘Back to the Future’ are hitting the big screen again in a limited-time event.",
      },
    ];

    setNews(exampleNews);
  }, []);

  return (
    <div className="news-container">
      <h1 className="news-title">News & Updates</h1>
      {news.map((item) => (
        <div key={item.id} className="news-card">
          <h2>{item.title}</h2>
          <p className="news-date">{item.date}</p>
          <p>{item.content}</p>
        </div>
      ))}
    </div>
  );
};

export default NewsAndUpdates;
