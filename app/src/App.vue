<template>
    <v-app>
        <v-app-bar app color="primary" dark>
            <v-toolbar-title>Pokedex</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-text-field
                v-model="searchQuery"
                label="Buscar Pokémon"
                solo-inverted
                clearable
                @keydown.enter="searchPokemon"
            />
            <v-btn to="/" text>Todos os Pokémon</v-btn>
            <v-btn to="/favorites" text>Favoritos</v-btn>
        </v-app-bar>

        <router-view
            :pokemonList="filteredPokemonList"
            :favoritePokemons="favoritePokemons"
            :toggleFavorite="toggleFavorite"
            :loadMore="loadMore"
            :isLoading="isLoading"
            :pokemonName="selectedPokemon"
            :getPokemonNumber="getPokemonNumber"
            :getPokemonImage="getPokemonImage"
            :selectPokemon="selectPokemon"
        />
    </v-app>
</template>

<script>
import { ref, onMounted, nextTick } from 'vue'
import {
    fetchPokemonList,
    fetchPokemonDetails,
    fetchAllPokemon,
} from './services/pokeApi.ts'
import { useUtils } from './composables/useUtils.ts'
import { useFavorites } from './composables/useFavorites.ts'
import { usePokemons } from './composables/usePokemons.ts'

export default {
    setup() {
        const favoritePokemons = ref([]);
        const pokemonList = ref([]);
        const searchQuery = ref('')
        const filteredPokemonList = ref([])

        const { getPokemonNumber, getPokemonImage, selectPokemon } = useUtils();
        const { toggleFavorite } = useFavorites(favoritePokemons, pokemonList);
        const { loadMore, isLoading, loadPokemonList } = usePokemons(pokemonList, favoritePokemons, searchQuery, filteredPokemonList);

        const selectedPokemon = ref(null)

        // busca pokemon na lista local
        const filterPokemonList = () => {
            const searchValue = searchQuery.value.trim().toLowerCase()
            if (!searchValue) {
                filteredPokemonList.value = [...pokemonList.value]
            } else {
                filteredPokemonList.value = pokemonList.value.filter(
                    (pokemon) =>
                        pokemon.name.toLowerCase().includes(searchValue) ||
                        getPokemonNumber(pokemon.url).includes(searchValue)
                )
            }
        }
        //busca pokemon na lista global
        const searchPokemon = async () => {
            const searchValue = searchQuery.value.trim().toLowerCase()
            if (!searchValue) {
                filteredPokemonList.value = [...pokemonList.value]
                return
            }

            const localMatch = pokemonList.value.find(
                (pokemon) =>
                    pokemon.name.toLowerCase() === searchValue ||
                    getPokemonNumber(pokemon.url) === searchValue
            )

            if (localMatch) {
                filteredPokemonList.value = [localMatch]
            } else {
                try {
                    let pokemonDetails

                    if (!isNaN(searchValue)) {
                        pokemonDetails = await fetchPokemonDetails(
                            Number(searchValue)
                        )
                    } else {
                        pokemonDetails = await fetchPokemonDetails(searchValue)
                    }

                    if (pokemonDetails && pokemonDetails.types) {
                        pokemonDetails.type = pokemonDetails.types.map(
                            (type) => ({
                                name: type.name,
                                colorName: type.colorName,
                            })
                        )

                        if (pokemonDetails) {
                            pokemonDetails.url = `https://pokeapi.co/api/v2/pokemon/${pokemonDetails.name}`
                            pokemonDetails.id = pokemonDetails.id || searchValue

                            if (
                                !pokemonDetails.types ||
                                pokemonDetails.types.length === 0
                            ) {
                                console.error(
                                    'Os tipos do Pokémon não foram carregados corretamente.'
                                )
                            }

                            filteredPokemonList.value = [pokemonDetails]
                        }
                    } else {
                        console.error('Pokémon não encontrado.')
                        filteredPokemonList.value = [...pokemonList.value]
                    }
                } catch (error) {
                    console.error('Erro ao buscar Pokémon:', error)
                    filteredPokemonList.value = [...pokemonList.value]
                }
            }
        }
 

        onMounted(async () => {
            const storedFavorites = localStorage.getItem('pokemonFavorites')
            if (storedFavorites) {
                try {
                    const parsedFavorites = JSON.parse(storedFavorites)
                    favoritePokemons.value = parsedFavorites
                        .map((pokemon) => {
                            if (typeof pokemon === 'object' && pokemon.name) {
                                return {
                                    ...pokemon,
                                    isFavorite: true,
                                }
                            }
                            return null
                        })
                        .filter(Boolean)
                } catch (e) {
                    console.e('Erro ao carregar favoritos, e')
                }
            }

            await loadMore()

            filteredPokemonList.value = [...pokemonList.value]
        })

        return {
            getPokemonNumber,
            getPokemonImage,
            selectPokemon,
            toggleFavorite,
            favoritePokemons,
            pokemonList,
            loadMore,
            isLoading,
            filteredPokemonList,
            selectedPokemon,
            searchPokemon,
            searchQuery,
            filterPokemonList,
        }
    },
}
</script>
