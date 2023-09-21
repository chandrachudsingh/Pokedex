import React, { useEffect, useState } from "react";
import PokemonCard from "./PokemonCard";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";

const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState(null);

  const url = "https://pokeapi.co/api/v2/pokemon/";

  const deleteAllBookmarks = () => {
    localStorage.removeItem("bookmarks");
    setBookmarks([]);
  };

  useEffect(() => {
    let bookmarkedPokemons = JSON.parse(localStorage.getItem("bookmarks"));
    if (!bookmarkedPokemons) {
      bookmarkedPokemons = [];
    }
    setBookmarks(bookmarkedPokemons.reverse());
  }, []);

  return (
    <div className="bookmarks-page">
      <div className="bookmarks-header">
        <Link to="/" className="home-btn secondary-btn">
          <FaHome />
        </Link>
        <h1 className="bookmarks-heading">
          Bookmarks:{" "}
          {bookmarks && (
            <span>
              {bookmarks.length !== 0
                ? bookmarks.length
                : "No pokémons bookmarked"}
            </span>
          )}
        </h1>
        <button
          className="delete-bookmarks-btn primary-btn"
          onClick={deleteAllBookmarks}
        >
          Delete All
        </button>
      </div>
      {bookmarks ? (
        <div className="bookmarks-container">
          {bookmarks.length > 0 ? (
            <div className="bookmarked-items">
              {bookmarks.map((bookmark, index) => {
                return (
                  <PokemonCard
                    key={index}
                    name={bookmark}
                    pokemon_url={url + bookmark.replace(" ", "-")}
                  />
                );
              })}
            </div>
          ) : (
            <div className="no-bookmarks-message">
              <h2>Your bookmarks will be shown here.</h2>
            </div>
          )}
        </div>
      ) : (
        <div className="loader-container">
          <div className="pokemons-loader">
            <div></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookmarksPage;
