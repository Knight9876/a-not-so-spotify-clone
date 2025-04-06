import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Section from "./components/Section"; // Import Section component
import Player from "./components/Player";
import songs from "./data/songs"; // Import song list
import { FaBars } from "react-icons/fa";

function App() {
  const storedSong = JSON.parse(sessionStorage.getItem("recentlyPlayed"));
  const [currentSong, setCurrentSong] = useState(
    (storedSong && storedSong[0]) || songs[0]
  );
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [showSection, setShowSection] = useState(window.innerWidth >= 1200);
  const [showSidebar, setShowSidebar] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    // Handle section separately
    if (screenWidth < 1200) {
      setShowSection(false);
    } else {
      setShowSection(true);
    }
  }, [screenWidth]);

  useEffect(() => {
    // Handle sidebar separately
    if (screenWidth < 768) {
      setShowSidebar(false);
    } else {
      setShowSidebar(true);
    }
  }, [screenWidth]);

  const handleSongSelect = (song) => {
    setCurrentSong(song);

    // Get existing list from sessionStorage
    let recent = JSON.parse(sessionStorage.getItem("recentlyPlayed")) || [];

    // Remove if already exists
    recent = recent.filter((s) => s.title !== song.title);

    // Add to top
    recent.unshift(song);

    // Keep only last 10
    if (recent.length > 10) recent = recent.slice(0, 10);

    // Save back
    sessionStorage.setItem("recentlyPlayed", JSON.stringify(recent));
  };

  return (
    <Router>
      <div className="overlay" />
      <div className="App d-flex">
        <div className="menu" onClick={() => setShowSidebar(true)}>
          <FaBars size="1.5rem" />
        </div>
        <Sidebar
          visible={showSidebar}
          onNavClick={() => setShowSection(true)}
          setVisible={setShowSidebar}
        />
        <Routes>
          <Route
            path="/"
            element={
              <Section
                title="For You"
                source="static"
                setCurrentSong={handleSongSelect}
                visible={showSection}
                setVisible={setShowSection}
              />
            }
          />
          <Route
            path="/top"
            element={
              <Section
                title="Top Tracks"
                source="static"
                setCurrentSong={handleSongSelect}
                visible={showSection}
                setVisible={setShowSection}
              />
            }
          />
          <Route
            path="/favourites"
            element={
              <Section
                title="Favourites"
                source="local"
                setCurrentSong={handleSongSelect}
                visible={showSection}
                setVisible={setShowSection}
              />
            }
          />
          <Route
            path="/recent"
            element={
              <Section
                title="Recently Played"
                source="session"
                setCurrentSong={handleSongSelect}
                visible={showSection}
                setVisible={setShowSection}
              />
            }
          />
        </Routes>
        <Player
          currentSong={currentSong}
          setCurrentSong={setCurrentSong}
          songs={songs}
        />
      </div>
    </Router>
  );
}

export default App;
