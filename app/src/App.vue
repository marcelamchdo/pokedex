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

        <v-main>
            <v-container>
                <v-alert v-if="errorMessage" type="error" class="mt-3">{{ errorMessage }}</v-alert>

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
            </v-container>
        </v-main>
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
        const favoritePokemons = ref([])
        const pokemonList = ref([])
        const searchQuery = ref('')
        const filteredPokemonList = ref([])
        const errorMessage = ref('')

        const { getPokemonNumber, getPokemonImage, selectPokemon } = useUtils()
        const { toggleFavorite } = useFavorites(favoritePokemons, pokemonList)
        const { loadMore, isLoading, loadPokemonList } = usePokemons(
            pokemonList,
            favoritePokemons,
            searchQuery,
            filteredPokemonList
        )

        const selectedPokemon = ref(null)

        //busca pokemon na lista global
        const searchPokemon = async () => {
            const searchValue = searchQuery.value.trim().toLowerCase()
            console.log('Valor da busca:', searchValue)

            if (!searchValue) {
                console.log('Busca vazia')
                errorMessage.value = ''
                filteredPokemonList.value = [...pokemonList.value]
                return
            }

            const localMatch = pokemonList.value.find(
                (pokemon) =>
                    pokemon.name.toLowerCase() === searchValue ||
                    getPokemonNumber(pokemon.url) === searchValue
            )

            if (localMatch) {
                console.log('Pokémon encontrado localmente', localMatch)
                errorMessage.value = ''
                filteredPokemonList.value = [localMatch]
            } else {
                console.log(
                    'Nenhum Pokémon encontrado localmente, iniciando busca externa'
                )
                try {
                    let pokemonDetails

                    if (!isNaN(Number(searchValue))) {
                        pokemonDetails = await fetchPokemonDetails(
                            Number(searchValue)
                        )
                    } else {
                        pokemonDetails = await fetchPokemonDetails(searchValue)
                    }

                    if (pokemonDetails && pokemonDetails.types) {
                        console.log(
                            'Pokémon encontrado externamente:',
                            pokemonDetails
                        )
                        pokemonDetails.type = pokemonDetails.types.map(
                            (type) => ({
                                name: type.name,
                                colorName: type.colorName,
                            })
                        )

                        if (pokemonDetails) {
                            pokemonDetails.url = `https://pokeapi.co/api/v2/pokemon/${pokemonDetails.name}`
                            pokemonDetails.id = pokemonDetails.id || searchValue

                            filteredPokemonList.value = [pokemonDetails]
                        }
                    }
                } catch (error) {
                    console.error('Erro ao buscar Pokémon:', error)
                    errorMessage.value = 'Erro ao buscar Pokémon.'
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
            errorMessage,
        }
    },
}
</script>
