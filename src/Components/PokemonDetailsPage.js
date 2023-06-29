import React from "react";
import { useParams } from "react-router-dom";

const PokemonDetailsPage = () => {
  const { pokemon_name } = useParams();
  return (
    <div>
      <h1>hello</h1>
    </div>
  );
};

export default PokemonDetailsPage;
