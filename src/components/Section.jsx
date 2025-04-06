import React, { useEffect, useState } from "react";
import "../styles/section.scss";
import { FaSearch, FaTimes } from "react-icons/fa";
import songsData from "../data/songs.js";
import Loader from "./Loader.jsx";

const Section = ({
  title,
  source = "static",
  setCurrentSong,
  visible,
  setVisible,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [songs, setSongs] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let fetchedSongs = [];

    if (source === "static") {
      fetchedSongs = songsData;
    } else if (source === "session") {
      fetchedSongs = JSON.parse(sessionStorage.getItem("recentlyPlayed")) || [];
    } else if (source === "local") {
      fetchedSongs = JSON.parse(localStorage.getItem("favourites")) || [];
    }

    setSongs(fetchedSongs);
    setTimeout(() => setLoading(false), 500); // simulate loading
  }, [source]);

  const filteredSongs = songs.filter((song) =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={`main-container-section ${visible ? "visible" : "invisible"}`}
    >
      <div className="for-you">
        <h2 className="section-title">{title}</h2>
        <div className="search-bar">
          <input
            type="text"
            className="form-floating"
            placeholder="Search Song, Artist"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSearch className="search-icon" />
        </div>

        {loading ? (
          <Loader />
        ) : filteredSongs.length === 0 ? (
          <div className="text-white text-center mt-4">
            {source === "local"
              ? "You haven't added any favourites yet."
              : source === "session"
              ? "No recently played songs."
              : "No songs found."}
          </div>
        ) : (
          <ul className="song-list">
            {filteredSongs.map((song, index) => (
              <li
                key={index}
                className="song-item"
                onClick={() => setCurrentSong(song)}
              >
                <img
                  src={song.thumbnail}
                  alt={song.title}
                  className="song-cover"
                />
                <div className="song-info">
                  <span className="song-title">{song.title}</span>
                  <span className="song-artist">{song.artist}</span>
                </div>
                <span className="song-duration">{song.duration}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {windowWidth < 1200 && visible && (
        <div className="close-button" onClick={() => setVisible(false)}>
          <FaTimes size="1.5rem" />
        </div>
      )}
    </div>
  );
};

export default Section;
