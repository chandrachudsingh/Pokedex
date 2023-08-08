import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  MdDoubleArrow,
  MdCatchingPokemon,
  MdKeyboardDoubleArrowRight,
  MdBookmarks,
} from "react-icons/md";
import { Link } from "react-router-dom";
import { FaHome, FaStar } from "react-icons/fa";
import {
  formatPokemonCardData,
  formatPokemonData,
} from "../Utils/pokemonUtils";

const PokemonDetailsPage = () => {
  const [pokemonData, setPokemonData] = useState(null);
  const [pokemonLoading, setPokemonLoading] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { pokemon_name } = useParams();
  const url = "https://pokeapi.co/api/v2/pokemon/";
  const api = "https://pokeapi.co/api/v2/";

  const maxStats = {
    hp: 255,
    attack: 190,
    defense: 230,
    "special-attack": 194,
    "special-defense": 230,
    speed: 180,
  };

  const getPokemonDetails = async () => {
    setPokemonLoading(true);
    const response = await fetch(url + pokemon_name);
    let result = await response.json();

    const speciesResponse = await fetch(result.species.url);
    let speciesResult = await speciesResponse.json();
    setPokemonDetails(result, speciesResult);
  };

  const setPokemonDetails = (pokemon, species) => {
    const formattedData = formatPokemonData(pokemon, species);

    setPokemonData(formattedData);
    getEvolutionChain(species.evolution_chain);
  };

  const getEvolutionChain = async (evolution_chain) => {
    const evolutionResponse = await fetch(evolution_chain.url);
    const evolutionResult = await evolutionResponse.json();
    let chain = await evolutionResult.chain;
    const evolution = [chain.species];
    while (chain.evolves_to.length > 0) {
      chain = chain.evolves_to[0];
      const nextEvolution = chain.species;
      evolution.push(nextEvolution);
    }

    let evolutionChain = Promise.all(
      evolution.map(async (value) => {
        const id = value.url
          .replace(api, "")
          .replaceAll("/", "")
          .replaceAll("-", "")
          .replace(/[^0-9]/g, "");
        const resp = await fetch(url + id);
        const res = await resp.json();
        const item = formatPokemonCardData(res);
        return item;
      })
    );
    evolutionChain.then((evolution) => {
      setPokemonData((prevData) => {
        return { ...prevData, evolution };
      });
    });
  };

  const bookmarkPokemon = (pokemon) => {
    let bookmarks = new Set(JSON.parse(localStorage.getItem("bookmarks")));
    if (bookmarks.has(pokemon)) {
      bookmarks.delete(pokemon);
      localStorage.setItem("bookmarks", JSON.stringify([...bookmarks]));
      setIsBookmarked(false);
    } else {
      bookmarks.add(pokemon);
      localStorage.setItem("bookmarks", JSON.stringify([...bookmarks]));
      setIsBookmarked(true);
    }
  };

  const checkBookmark = () => {
    let bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
    if (bookmarks && bookmarks.includes(pokemonData.name)) {
      setIsBookmarked(true);
    }
  };

  useEffect(() => {
    getPokemonDetails();
  }, [pokemon_name]);

  useEffect(() => {
    if (pokemonData) {
      setPokemonLoading(false);
      checkBookmark();
    }
  }, [pokemonData]);

  return (
    <div className="pokemon-details-page">
      {pokemonLoading ? (
        <>
          <div className="loader-container">
            <div className="pokemons-loader">
              <div></div>
            </div>
          </div>
        </>
      ) : (
        <>
          {pokemonData && (
            <div className="pokemon-details">
              <div className={`pokemon-basics ${pokemonData.types[0]}-card`}>
                <Link to="/" className="home-btn secondary-btn">
                  <FaHome />
                </Link>
                <div className="bookmarks-btn-container">
                  <button
                    onClick={() => bookmarkPokemon(pokemonData.name)}
                    className={`bookmark-pokemon-btn secondary-btn ${
                      isBookmarked && "bookmarked"
                    }`}
                  >
                    <FaStar />
                  </button>
                  <Link to="/bookmarks" className="bookmarks-btn secondary-btn">
                    <MdBookmarks />
                  </Link>
                </div>
                <div className="basic-details">
                  <h2 className="pokemon-id">{"#" + pokemonData.id}</h2>
                  <div className="pokemon-type-container">
                    {pokemonData.types.map((type) => {
                      return (
                        <Link
                          to={`/pokemons?type=${type}`}
                          key={type}
                          className={`pokemon-type ${type}`}
                        >
                          <img src={require(`../Images/${type}.svg`)} alt="" />
                          {type}
                        </Link>
                      );
                    })}
                  </div>
                  <h1 className="pokemon-name">{pokemonData.name}</h1>
                  <p className="pokemon-description">
                    {pokemonData.description}
                  </p>
                </div>
                <div className="division-line">
                  <img
                    src={require(`../Images/${pokemonData.types[0]}.svg`)}
                    alt=""
                  />
                </div>
                <div className="pokemon-img">
                  <img src={pokemonData.imgSrc} alt="" />
                </div>
              </div>
              <div className="pokemon-specs">
                <div className="pokemon-about">
                  <div className="about-details">
                    <div className="pokemon-height">
                      <h3>Height</h3>
                      <p>{pokemonData.height}</p>
                    </div>
                  </div>
                  <div className="about-details">
                    <div className="pokemon-weight">
                      <h3>Weight</h3>
                      <p>{pokemonData.weight}</p>
                    </div>
                  </div>
                  <div className="about-details">
                    <div className="pokemon-ability">
                      <h3>Abilities</h3>
                      {pokemonData.abilities.map((ability) => {
                        return (
                          <p key={ability}>
                            <MdDoubleArrow className="vertical-center" />
                            <span className="vertical-center">{ability}</span>
                          </p>
                        );
                      })}
                    </div>
                  </div>
                  <div className="about-details">
                    <div className="pokemon-habitat">
                      <h3>Habitat</h3>
                      <p>{pokemonData.habitat}</p>
                    </div>
                  </div>
                  <div className="about-details">
                    <div className="pokemon-group">
                      <h3>Egg-Groups</h3>
                      {pokemonData.eggGroups.map((group) => {
                        return (
                          <p key={group}>
                            <MdDoubleArrow className="vertical-center" />
                            <span className="vertical-center">{group}</span>
                          </p>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="stats">
                  <h2>Stats</h2>
                  <div className="pokemon-stats">
                    {pokemonData.stats.map((stat) => {
                      const { name, base_stat } = stat;
                      const threshold = maxStats[name] * 0.25;
                      const percentage = (base_stat / maxStats[name]) * 100;
                      return (
                        <div key={name} className="stat">
                          <h4>{name}</h4>
                          <p className="base-stat-value">{base_stat}</p>
                          <div className="stat-bar">
                            <div
                              className={`slide-value ${
                                base_stat > threshold ? "high-stat" : "low-stat"
                              }`}
                              style={{ "--stat-value": percentage + "%" }}
                            ></div>
                          </div>
                          <p className="max-stat-value">
                            Max: {maxStats[name]}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="moves">
                  <h2>Moves</h2>
                  <div className="pokemon-moves">
                    {pokemonData.moves.map((move, index) => {
                      return <p key={index}>{index + 1 + ". " + move}</p>;
                    })}
                  </div>
                </div>
                <div className="evolution">
                  <h2>Evolution Chain</h2>
                  {pokemonData.evolution ? (
                    <div className="evolution-chain">
                      {pokemonData.evolution.length === 1 ? (
                        <h3 className="no-evolve-heading">
                          This pokemon doesn't evolve.
                        </h3>
                      ) : (
                        <>
                          {pokemonData.evolution.map((item, i, evolution) => {
                            const { id, name, imgSrc, types } = item;
                            if (evolution.length - 1 === i) {
                              // last element
                              return (
                                <div key={name} className="pokemon-evolution">
                                  <Link
                                    to={`/pokemons/${name}`}
                                    className="evolution-img-container"
                                  >
                                    <img src={imgSrc} alt="" />
                                  </Link>
                                  <Link
                                    to={`/pokemons/${name}`}
                                    className="pokemon-id"
                                  >
                                    <h3>{name}</h3>
                                    <p>#{id}</p>
                                  </Link>
                                  <div className="pokemon-types">
                                    {types.map((type) => {
                                      return (
                                        <Link
                                          key={type}
                                          to={`/pokemons?type=${type}`}
                                          className={type}
                                        >
                                          {type}
                                        </Link>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            } else {
                              // not last element
                              return (
                                <React.Fragment key={name}>
                                  <div className="pokemon-evolution">
                                    <Link
                                      to={`/pokemons/${name}`}
                                      className="evolution-img-container"
                                    >
                                      <img src={imgSrc} alt="" />
                                    </Link>
                                    <Link
                                      to={`/pokemons/${name}`}
                                      className="pokemon-id"
                                    >
                                      <h3>{name}</h3>
                                      <p>#{id}</p>
                                    </Link>
                                    <div className="pokemon-types">
                                      {types.map((type) => {
                                        return (
                                          <Link
                                            to={`/pokemons?type=${type}`}
                                            key={type}
                                            className={type}
                                          >
                                            {type}
                                          </Link>
                                        );
                                      })}
                                    </div>
                                  </div>
                                  <MdKeyboardDoubleArrowRight
                                    key={JSON.stringify(Date.now())}
                                    className="arrow-icon"
                                  />
                                </React.Fragment>
                              );
                            }
                          })}
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="pokeball-loading">
                      <MdCatchingPokemon className="loading-icon" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PokemonDetailsPage;
