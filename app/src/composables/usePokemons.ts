import { ref, nextTick, Ref, watch, onMounted } from 'vue'
import { fetchPokemonDetails } from '../services/pokeApi.ts'
import axios from 'axios'

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
    const loadingTypes = ref(false)
    const pokemonTypes = ref([])
    let error = ref<string | null>(null)
    const selectedTypes = ref([])

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

    //buscar tipos de pokemon
    const fetchPokemonTypes = async () => {
        loadingTypes.value = true
        try {
            const response = await axios.get('https://pokeapi.co/api/v2/type')
            pokemonTypes.value = response.data.results.map(
                (type: any) => type.name
            )
        } catch (err) {
            error.value = 'Erro ao carregar tipos de Pokémon'
        } finally {
            loadingTypes.value = false
        }
    }

    //filtrar pokemon por tipo
    watch(selectedTypes, () => {
         if (selectedTypes.value.length > 0) {
            filteredPokemonList.value = pokemonList.value.filter((pokemon) => {
                if (!pokemon.types || !Array.isArray(pokemon.types)) {
                    return false
                }

                return selectedTypes.value.some((type) => {
                    return pokemon.types.some((pokemonType) => {
                        if (pokemonType && pokemonType.name) {
                            return pokemonType?.name === type
                        }
                        return false
                    })
                })
            })
        } else {
            filteredPokemonList.value = [...pokemonList.value]
        }
    })

    onMounted(async () => {
        await fetchPokemonTypes();
    });

    return {
        loadMore,
        isLoading,
        loadPokemonList,
        selectedTypes,
        pokemonTypes,
        loadingTypes,
        error,
    }
}
