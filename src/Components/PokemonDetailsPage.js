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
import PokeballOpen from "../Images/pokeball-open.png";
import ErrorPage from "../Components/ErrorPage";

const PokemonDetailsPage = () => {
  const [pokemonData, setPokemonData] = useState(null);
  const [pokemonLoading, setPokemonLoading] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [pokemonExists, setPokemonExists] = useState(true);
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

    // check if the pokemon exists
    const resp = await fetch(api + "pokemon/?offset=0&limit=10000");
    const res = await resp.json();
    const pokemonList = res.results;
    const list = pokemonList.filter(
      (pokemon) => pokemon.name === pokemon_name.toLowerCase()
    );
    if (list.length === 0) {
      setPokemonLoading(false);
      setPokemonExists(false);
    }

    // get pokemon
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
    const chain = await evolutionResult.chain;

    const evolution_tree = [[{ ...chain.species, trigger_item: null }]];

    let middleStage = [],
      lastStage = [];
    for (let i = 0; i < chain.evolves_to.length; i++) {
      let evo_chain = chain.evolves_to[i];
      let trigger_item =
        evo_chain.evolution_details.length > 0
          ? evo_chain.evolution_details[0].item
          : null;
      for (let k = 0; k < evo_chain.evolution_details.length; k++) {
        if (evo_chain.evolution_details[k].item) {
          trigger_item = evo_chain.evolution_details[k].item;
          break;
        }
      }
      middleStage.push({ ...evo_chain.species, trigger_item });
      for (let j = 0; j < evo_chain.evolves_to.length; j++) {
        let evo_chain2 = evo_chain.evolves_to[j];
        trigger_item =
          evo_chain2.evolution_details.length > 0
            ? evo_chain2.evolution_details[0].item
            : null;
        for (let k = 0; k < evo_chain.evolution_details.length; k++) {
          if (evo_chain2.evolution_details[k].item) {
            trigger_item = evo_chain2.evolution_details[k].item;
            break;
          }
        }
        lastStage.push({ ...evo_chain2.species, trigger_item });
      }
    }
    if (middleStage.length > 0) {
      evolution_tree.push(middleStage);
    }
    if (lastStage.length > 0) {
      evolution_tree.push(lastStage);
    }

    let evolutionChain = Promise.all(
      evolution_tree.map(async (evolution) => {
        let evolutionStage = Promise.all(
          evolution.map(async (value) => {
            const id = value.url
              .replace(api, "")
              .replaceAll("/", "")
              .replaceAll("-", "")
              .replace(/[^0-9]/g, "");
            const resp = await fetch(url + id);
            const res = await resp.json();
            const item = formatPokemonCardData(res);

            if (value.trigger_item) {
              const trigger_resp = await fetch(value.trigger_item.url);
              const trigger_res = await trigger_resp.json();
              return {
                ...item,
                trigger_item: {
                  name: value.trigger_item.name,
                  img: trigger_res.sprites.default || PokeballOpen,
                },
              };
            } else {
              return { ...item, trigger_tem: null };
            }
          })
        );
        return evolutionStage.then((stage) => stage);
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
    } else {
      setIsBookmarked(false);
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
      ) : pokemonExists ? (
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
                          {pokemonData.evolution.map((stage, i, evolution) => {
                            return (
                              <div
                                key={i}
                                className={`${
                                  i === 0
                                    ? "first-stage"
                                    : i === 1 && evolution.length === 3
                                    ? "middle-stage"
                                    : "last-stage"
                                } ${
                                  stage.length > 2
                                    ? "multi-level"
                                    : stage.length === 2 && "two-level"
                                }`}
                              >
                                {stage.map((item) => {
                                  const {
                                    id,
                                    name,
                                    imgSrc,
                                    types,
                                    trigger_item,
                                  } = item;
                                  return (
                                    <div key={name} className="evolution-stage">
                                      {/* Evolution arrow position */}
                                      {((i !== 0 && evolution[i].length <= 2) ||
                                        (i !== evolution.length - 1 &&
                                          evolution[i + 1].length > 2)) && (
                                        <div className="evolution-method">
                                          {trigger_item && (
                                            <div className="evolution-item">
                                              <img
                                                src={trigger_item.img}
                                                alt=""
                                              />
                                              <p className="item_tooltip">
                                                {trigger_item.name}
                                              </p>
                                            </div>
                                          )}
                                          <MdKeyboardDoubleArrowRight
                                            key={JSON.stringify(Date.now())}
                                            className="arrow-icon"
                                          />
                                        </div>
                                      )}
                                      <div className="pokemon-evolution">
                                        <Link
                                          to={`/pokemon/${name}`}
                                          className="evolution-img-container"
                                        >
                                          {trigger_item &&
                                            evolution[i].length > 2 && (
                                              <div className="evolution-item">
                                                <img
                                                  src={trigger_item.img}
                                                  alt=""
                                                />
                                                <p className="item_tooltip">
                                                  {trigger_item.name}
                                                </p>
                                              </div>
                                            )}
                                          <img src={imgSrc} alt="" />
                                        </Link>
                                        <Link
                                          to={`/pokemon/${name}`}
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
                                                <img
                                                  src={require(`../Images/${type}.svg`)}
                                                  alt=""
                                                />
                                                {type}
                                              </Link>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            );
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
      ) : (
        <ErrorPage errorMessage={"No such Pokémon exist."} />
      )}
    </div>
  );
};

export default PokemonDetailsPage;
