import React from "react";
import {
  Search,
  Home,
  Shuffle,
  Wand2,
  Monitor,
  Clapperboard,
  Users,
  Plus,
} from "lucide-react";
import "./Sidebar.css";

const Sidebar = ({ onSearchClick, setActivePage, activePage }) => {
  return (
    <div className="sidebar">
      <Search
        className={`sidebar-icon ${activePage === "search" ? "active" : ""}`}
        onClick={onSearchClick}
      />
      <Home
        className={`sidebar-icon ${activePage === "home" ? "active" : ""}`}
        onClick={() => setActivePage("home")}
      />
      <Shuffle
        className={`sidebar-icon ${activePage === "surprise" ? "active" : ""}`}
        onClick={() => setActivePage("surprise")}
      />
      <Wand2
        className={`sidebar-icon ${activePage === "news" ? "active" : ""}`}
        onClick={() => setActivePage("news")}
      />
      <Monitor
        className={`sidebar-icon ${activePage === "monitor" ? "active" : ""}`}
        onClick={() => setActivePage("monitor")}
      />
      <Clapperboard
        className={`sidebar-icon ${activePage === "movies" ? "active" : ""}`}
        onClick={() => setActivePage("movies")}
      />
      <Users
        className={`sidebar-icon ${activePage === "users" ? "active" : ""}`}
        onClick={() => setActivePage("users")}
      />
      <Plus
        className={`sidebar-icon ${activePage === "add" ? "active" : ""}`}
        onClick={() => setActivePage("add")}
      />
    </div>
  );
};

export default Sidebar;
