import { Ref } from 'vue';

interface Pokemon {
  name: string;
  isFavorite?: boolean;
}

export function useFavorites(
  favoritePokemons: Ref<Pokemon[]>,
  pokemonList: Ref<Pokemon[]>
) {
  const toggleFavorite = (pokemon: Pokemon) => {
    const index = favoritePokemons.value.findIndex(
      (fav) => fav.name === pokemon.name
    );

    if (index >= 0) {
      favoritePokemons.value.splice(index, 1);
    } else {
      favoritePokemons.value.push(pokemon);
    }

    // Atualiza o localStorage
    localStorage.setItem(
      'pokemonFavorites',
      JSON.stringify(favoritePokemons.value)
    );

    // Atualiza a lista de Pokémon, definindo o estado de favoritos
    pokemonList.value = pokemonList.value.map((p) => ({
      ...p,
      isFavorite: favoritePokemons.value.some((fav) => fav.name === p.name),
    }));
  };

  return {
    toggleFavorite,
  };
}
