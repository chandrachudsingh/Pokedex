import React, { useEffect, useRef, useState } from "react";
import pokemonLogo from "../Images/pokemon-logo2.png";
import Pokeball from "../Images/pokeball.png";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import ErrorMessage from "./ErrorMessage";

var modalTimeout;

const HomePage = () => {
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ isError: false, msg: "" });
  const searchBtnRef = useRef(null);

  const errorDuration = 3000;
  const navigate = useNavigate();

  const api = "https://pokeapi.co/api/v2/";

  const getResults = async (url) => {
    const response = await fetch(url);
    const result = await response.json();
    const pokemonList = result.results;
    const list = pokemonList.filter(
      (pokemon) => pokemon.name === searchText.toLowerCase()
    );
    return list;
  };

  const showError = (errorMsg) => {
    clearTimeout(modalTimeout);
    setError({ ...error, isError: false });
    setTimeout(() => {
      setError({ isError: true, msg: errorMsg });
    }, 0);
    const transitionDuration = 200;
    modalTimeout = setTimeout(() => {
      setError({ ...error, isError: false });
    }, errorDuration + transitionDuration);
  };

  const validateSearch = async () => {
    if (searchText) {
      const searchVal = searchText.toLowerCase();
      setLoading(true);
      // search by name
      const pokemonList = await getResults(
        api + "pokemon/?offset=0&limit=10000"
      );
      if (pokemonList.length > 0) {
        setLoading(false);
        navigate(`/pokemons?search=${searchVal}`);
      } else {
        // search by ability
        const pokemonList2 = await getResults(
          api + "ability/?offset=0&limit=1000"
        );
        if (pokemonList2.length > 0) {
          setLoading(false);
          navigate(`/pokemons?search=${searchVal}`);
        } else {
          // search by move
          const pokemonList3 = await getResults(
            api + "move/?offset=0&limit=1000"
          );
          if (pokemonList3.length > 0) {
            setLoading(false);
            navigate(`/pokemons?search=${searchVal}`);
          } else {
            setLoading(false);
            showError("invalid search");
          }
        }
      }
    } else {
      setLoading(false);
      showError("search field can't be empty");
    }
  };

  useEffect(() => {
    const input = document.getElementById("txsearch");

    input.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        searchBtnRef.current.click();
      }
    });
  }, []);

  return (
    <main className="home-page">
      {loading && (
        <div className="loading-overlay" id="overlay">
          <div className="pokemons-loader">
            <div></div>
          </div>
        </div>
      )}

      <div className="pokemon-search-section">
        <div className="pokemon-logo-container">
          <img src={pokemonLogo} alt="Pokemon Logo" />
        </div>
        <div className="search-heading">
          <h3>Search Pokémons by its Name, Ability or Move.</h3>
        </div>
        <div className="search-container">
          <div className="search-field">
            <input
              type="text"
              id="txsearch"
              placeholder="Search Pokémon"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button
              className="search-btn"
              ref={searchBtnRef}
              onClick={validateSearch}
            >
              <FaSearch className="search-icon" />
            </button>
          </div>
          <div className="search-error">
            {error.isError && (
              <ErrorMessage error={error} errorDuration={errorDuration} />
            )}
          </div>
        </div>

        <Link to="/pokemons?search=pokedex" className="pokedex-btn">
          <img src={Pokeball} alt="" />
          <p>Pokédex</p>
        </Link>
      </div>
    </main>
  );
};

export default HomePage;
