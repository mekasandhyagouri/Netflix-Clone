import React, { useState, useEffect } from "react";
import axios from "./axios";
import requests from "./request";
import "./Banner.css";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";



function Banner() {
  const [movie, setMovie] = React.useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(requests.fetchNetflixOriginals);
      setMovie(
        request.data.results[
          Math.floor(Math.random() * request.data.results.length)
        ]
      );
      console.log(request.data.results);
      return request;
    }
    fetchData();
  }, []);

  console.log("sad", movie);

  function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  }

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  const handleClick = (movie) => {
    console.log('movie', movie);
    if (trailerUrl) {
      // console.log('url', trailerUrl);
      setTrailerUrl("");
    } else {
      movieTrailer(movie?.name || movie?.title || movie?.original_title || "")
      .then(url => {
        const urlParams = new URLSearchParams(new URL(url).search);
        setTrailerUrl(urlParams.get("v"));
        console.log('url',urlParams.get("v") );
      }).catch(err => console.log(err));
    }
  }

  return (
    <>
      <header
        className="banner"
        style={{
          backgroundSize: "cover",
          backgroundImage: `url(https://image.tmdb.org/t/p/original/${movie?.backdrop_path})`,
          backgroundPosition: "center center",
        }}
      >
        <div className="banner_content">
          <h1 className="banner_title">
            {movie?.name || movie?.title || movie?.original_name}
          </h1>
          <div className="banner_buttons">
            <button
              className="banner_button"
              onClick={() => handleClick(movie)}
            >
              Play
            </button>
            <button className="banner_button">My List</button>
          </div>

          <h1 className="banner_description">{truncate(movie?.overview, 150)}</h1>
        </div>
        <div className="banner_fadeBottom"></div>
      </header>
      {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
    </>
  );
}

export default Banner;
