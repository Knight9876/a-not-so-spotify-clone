import React, { useRef, useState, useEffect, useCallback } from "react";
import "../styles/player.scss";
import ColorThief from "color-thief-browser";
import {
  MoreHoriz as MoreIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  VolumeUp as VolumeIcon,
} from "@mui/icons-material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const Player = ({ currentSong, songs, setCurrentSong }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const [favourites, setFavourites] = useState(
    JSON.parse(localStorage.getItem("favourites")) || []
  );

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.warn("Play error:", err));
    }
  };

const nextSong = useCallback(() => {
  if (!songs || songs.length === 0) return;
  const currentIndex = songs.findIndex((song) => song.id === currentSong.id);
  const nextIndex = (currentIndex + 1) % songs.length;
  setCurrentSong(songs[nextIndex]);
}, [songs, currentSong, setCurrentSong]);

  const prevSong = () => {
    if (!songs || songs.length === 0) return;
    const currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    setCurrentSong(songs[prevIndex]);
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    audioRef.current.currentTime = newTime;
  };

  useEffect(() => {
    const audio = audioRef.current;

    if (audio) {
      // Reset playback
      audio.pause();
      audio.load();
      setIsPlaying(false);

      // Define time update handler
      const updateTime = () => {
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration || 0);
      };

      // Attach listeners
      audio.addEventListener("timeupdate", updateTime);
      audio.addEventListener("loadedmetadata", updateTime);

      // Try autoplay
      const playAudio = async () => {
        try {
          await audio.play();
          setIsPlaying(true);
        } catch (err) {
          console.error("Autoplay error:", err);
          setIsPlaying(false);
        }
      };

      playAudio();

      // autoplay the next song if current one ends
      audio.addEventListener("ended", nextSong);

      // Clean up on unmount or song change
      return () => {
        audio.removeEventListener("timeupdate", updateTime);
        audio.removeEventListener("loadedmetadata", updateTime);
        audio.removeEventListener("ended", nextSong);
      };
    }
  }, [currentSong, nextSong]);

  // Extract dominant color and update body background
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = currentSong.thumbnail;

    img.onload = () => {
      const colorThief = new ColorThief();
      const dominantColor = colorThief.getColor(img);
      const rgbColor = `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`;

      // Set background gradient for entire website
      document.body.style.background = `linear-gradient(to right, ${rgbColor}, black)`;
    };
  }, [currentSong]);

  const isFavourite = favourites.some((s) => s.title === currentSong.title);

  const toggleFavourite = () => {
    let updatedFavs;

    if (isFavourite) {
      updatedFavs = favourites.filter((s) => s.title !== currentSong.title);
    } else {
      updatedFavs = [currentSong, ...favourites];
    }

    setFavourites(updatedFavs);
    localStorage.setItem("favourites", JSON.stringify(updatedFavs));
  };

  return (
    <div className="main-container flex-grow-1">
      <div className="player-container">
        <div className="song-info">
          <h4 className="song-title">{currentSong.title}</h4>
          <p className="artist-name">{currentSong.artist}</p>
        </div>
        <div className="album-art">
          <img src={currentSong.thumbnail} alt={currentSong.title} />
        </div>
        <div className="progress-bar-container" onClick={handleSeek}>
          <div className="progress-bar">
            <div
              className="progress"
              style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
            ></div>
          </div>
        </div>
        <div className="playbar">
          <div className="more-fav d-flex">
            <div className="more-bg">
              <MoreIcon
                className="icon more cursor-pointer"
                onClick={() => setShowMore(!showMore)}
              />
            </div>

            {/* Slide-up Favourite icon */}
            <div className={`fav-slide fav-bg ${showMore ? "show" : ""}`}>
              {isFavourite ? (
                <FavoriteIcon
                  className="fav-icon icon favourite"
                  onClick={toggleFavourite}
                />
              ) : (
                <FavoriteBorderIcon
                  className="fav-icon icon"
                  onClick={toggleFavourite}
                />
              )}
            </div>
          </div>

          <div className="controls">
            <i className="fa-solid fa-backward" onClick={prevSong}></i>
            <div className="play-button" onClick={togglePlayPause}>
              {isPlaying ? (
                <PauseIcon className="icon pause" />
              ) : (
                <PlayIcon className="icon play" />
              )}
            </div>
            <i className="fa-solid fa-forward" onClick={nextSong}></i>
          </div>
          <div className="volume-bg">
            <VolumeIcon className="icon volume cursor-pointer" />
          </div>
        </div>

        {/* 🎵 Audio Element */}
      </div>
      <audio ref={audioRef}>
        <source src={currentSong.musicUrl} />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default Player;
