import { Ref, ref, computed } from 'vue'

interface Pokemon {
    name: string
    url: string
    type: { name: string; colorName: string }[]
    color: string
    isFavorite: boolean
}

export function useFavorites(
    favoritePokemons: Ref<Pokemon[]>,
    pokemonList: Ref<Pokemon[]>
) {
    const selectedPokemon = ref<Pokemon | null>(null)

    //alterna o status do pokemon entre favorito e não favorito
    const toggleFavorite = (pokemon: Pokemon) => {
        const index = favoritePokemons.value.findIndex(
            (fav) => fav.name === pokemon.name
        )

        if (index >= 0) {
            favoritePokemons.value.splice(index, 1)
        } else {
            favoritePokemons.value.push(pokemon)
        }

        localStorage.setItem(
            'pokemonFavorites',
            JSON.stringify(favoritePokemons.value)
        )

        pokemonList.value = pokemonList.value.map((p) => ({
            ...p,
            isFavorite: favoritePokemons.value.some(
                (fav) => fav.name === p.name
            ),
        }))
    }
    
    //retorna a lista de pokemons marcados como favoritos
    const filteredFavorites = computed(() => {
        return favoritePokemons.value.filter((p) => p.isFavorite)
    })

    //verifica se o pokemon é favorito
    const isFavorite = (pokemonName: string): boolean => {
        return favoritePokemons.value.some((fav) => fav.name === pokemonName)
    }

    return {
        toggleFavorite,
        isFavorite,
        filteredFavorites,
        selectedPokemon,
    }
}
