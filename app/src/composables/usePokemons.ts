import { ref, nextTick, Ref } from 'vue'
import { fetchPokemonDetails } from '../services/pokeApi.ts' // Atualize o caminho se necessário

interface Pokemon {
    name: string
    url: string
    types: { name: string; colorName: string }[]
    color: string
    isFavorite: boolean
}

export function usePokemons(
    pokemonList: Ref<Pokemon[]>,
    favoritePokemons: Ref<Pokemon[]>,
    searchQuery: Ref<string>,
    filteredPokemonList: Ref<Pokemon[]>
) {
    const isLoading = ref(false)
    const offset = ref(0)

    //carrega lista inicial de 20 pokemons
    const loadPokemonList = async () => {
        try {
            const response = await fetch(
                'https://pokeapi.co/api/v2/pokemon?limit=20'
            )
            const data = await response.json()
            const pokemonDetailsList = await Promise.all(
                data.results.map(async (pokemon: Pokemon) => {
                    const details = await fetchPokemonDetails(pokemon.name)
                    return {
                        ...pokemon,
                        type: details?.types || [],
                        isFavorite: favoritePokemons.value.some(
                            (fav) => fav.name === pokemon.name
                        ),
                    }
                })
            )
            pokemonList.value = pokemonDetailsList
        } catch (error) {
            console.error('Erro ao carregar a lista de Pokémon', error)
        }
    }

    //carrega 20 pokemons
    const loadMore = async () => {
        isLoading.value = true
        try {
            const response = await fetch(
                `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset.value}`
            )
            const data = await response.json()

            const newPokemonList = await Promise.all(
                data.results.map(async (pokemon: Pokemon) => {
                    const details = await fetchPokemonDetails(pokemon.name)
                    return {
                        ...pokemon,
                        type: details?.types || [],
                        color: details?.color || '',
                        isFavorite: favoritePokemons.value.some(
                            (fav) => fav.name === pokemon.name
                        ),
                    }
                })
            )

            pokemonList.value = [...pokemonList.value, ...newPokemonList]

            if (!searchQuery.value) {
                filteredPokemonList.value = [...pokemonList.value]
            }

            offset.value += 20
        } catch (error) {
            console.error('Erro ao carregar a lista de Pokémon:', error)
        } finally {
            isLoading.value = false
            await nextTick()
        }
    }

    return {
        loadMore,
        isLoading,
        loadPokemonList,
    }
}
