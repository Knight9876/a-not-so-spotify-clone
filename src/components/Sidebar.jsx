import React, { useEffect, useState } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { FaSpotify, FaTimes } from "react-icons/fa";
import "../styles/sidebar.scss";
import profile_photo from "../assets/images/profile_photo.png";
import { NavLink } from "react-router-dom";

const Sidebar = ({ onNavClick, visible, setVisible }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={`sidebar d-flex flex-column p-3 ${
        visible ? "visible" : "invisible"
      }`}
    >
      {windowWidth < 768 && visible && (
        <div className="close" onClick={() => setVisible(false)}>
          <FaTimes size="1.5rem" />
        </div>
      )}

      {/* Spotify Logo */}
      <Navbar className="logo mb-4">
        <Navbar.Brand className="d-flex align-items-center">
          <FaSpotify size={32} className="text-white me-2" />
          <h4 className="brand-name m-0 text-white">Spotify</h4>
          <div className="text-white">&reg;</div>
        </Navbar.Brand>
      </Navbar>

      {/* Navigation Menu */}
      <Nav className="nav-links flex-column">
        <Nav.Link as={NavLink} to="/" end onClick={onNavClick}>
          For You
        </Nav.Link>
        <Nav.Link as={NavLink} to="/top" onClick={onNavClick}>
          Top Tracks
        </Nav.Link>
        <Nav.Link as={NavLink} to="/favourites" onClick={onNavClick}>
          Favourites
        </Nav.Link>
        <Nav.Link as={NavLink} to="/recent" onClick={onNavClick}>
          Recently Played
        </Nav.Link>
      </Nav>

      {/* Profile Icon */}
      <div className="profile text-center mt-auto">
        <img src={profile_photo} alt="profile_photo" />
      </div>
    </div>
  );
};

export default Sidebar;
