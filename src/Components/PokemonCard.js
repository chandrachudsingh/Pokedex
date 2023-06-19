import React, { useEffect, useState } from "react";
import { MdCatchingPokemon } from "react-icons/md";

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

  const formatPokemonData = (pokemon) => {
    const { id, name, sprites, types } = pokemon;

    const paddedId = String(id).padStart(4, "0");
    const formattedTypes = types.map(({ type }) => type.name);
    const pokemonImg =
      sprites.other["official-artwork"].front_default ||
      sprites.other.dream_world.front_default;
    setPokemonData({
      id: paddedId,
      name: removeHyphens(name),
      imgSrc: pokemonImg,
      types: formattedTypes,
    });
  };

  const removeHyphens = (name) => {
    return name.replace("-", " ");
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (data.length !== 0) {
      formatPokemonData(data);
    }
  }, [data]);

  if (loading) {
    return (
      <div className="pokemon-card pokeball-loading">
        {!loading && <MdCatchingPokemon className="loading-icon" />}
      </div>
    );
  } else {
    const { id, name, imgSrc, types } = pokemonData;
    return (
      <article key={id} className={`pokemon-card ${types && types[0]}-card`}>
        <div className="pokemon-img-container">
          <img src={imgSrc} alt={name} className="pokemon-img" />
        </div>
        <div className="pokemon-data-container">
          <h2 className="pokemon-name">{name}</h2>
          <p className="pokemon-id">#{id}</p>
          <div className="pokemon-type-container">
            {types?.map((type) => {
              return (
                <p key={type} className={`pokemon-type ${type}`}>
                  {type}
                </p>
              );
            })}
          </div>
        </div>
      </article>
    );
  }
};

export default PokemonCard;
