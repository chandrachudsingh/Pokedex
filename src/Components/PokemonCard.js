import React, { useEffect, useState } from "react";
import { MdCatchingPokemon } from "react-icons/md";
import { Link } from "react-router-dom";
import { formatPokemonCardData } from "../Utils/pokemonUtils";

const PokemonCard = ({ name, pokemon_url }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [pokemonData, setPokemonData] = useState([]);

  const getData = async () => {
    setLoading(true);
    const response = await fetch(pokemon_url);
    const result = await response.json();

    setData(result);
    setLoading(false);
  };

  const setCardPokemonData = (data) => {
    const formattedData = formatPokemonCardData(data);
    setPokemonData(formattedData);
  };

  // const changeImg = (e) => {
  //   e.target.src = PokemonOpen;
  // };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (data.length !== 0) {
      setCardPokemonData(data);
    }
  }, [data]);

  if (loading) {
    return (
      <div className="pokemon-card pokeball-loading">
        {loading && <MdCatchingPokemon className="loading-icon" />}
      </div>
    );
  } else {
    const { id, name, imgSrc, types } = pokemonData;
    return (
      <Link
        to={`/pokemons/${name?.replace(" ", "-")}`}
        key={id}
        className={`pokemon-card ${types && types[0]}-card`}
      >
        <div className="pokemon-img-container">
          <img
            src={imgSrc}
            alt={name}
            // onError={(e) => changeImg(e)}
            className="pokemon-img"
          />
        </div>
        <div className="pokemon-data-container">
          <h2 className="pokemon-name">{name}</h2>
          <p className="pokemon-id">#{id}</p>
          <div className="pokemon-type-container">
            {types?.map((type) => {
              return (
                <p key={type} className={`pokemon-type ${type}`}>
                  <img src={require(`../Images/${type}.svg`)} alt="" />
                  {type}
                </p>
              );
            })}
          </div>
        </div>
      </Link>
    );
  }
};

export default PokemonCard;
