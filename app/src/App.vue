<template>
    <v-app>
        <v-app-bar app dark class="app-bar">
            <v-img :src="pokedexImage" class="pokedex-image"></v-img>
            <v-spacer></v-spacer>

            <template v-if="showSearch">
                <v-text-field
                    v-model="searchQuery"
                    label="Buscar Pokémon"
                    outlined
                    clearable
                    density="compact"
                    hide-details="auto"
                    variant="outlined"
                    prepend-inner-icon="mdi-magnify"
                    @keydown.enter="searchPokemon"
                    class="input"
                    opacity="1"
                />
            </template>

            <template v-else>
                <v-btn class="input" icon @click="toggleSearch">
                    <v-icon>mdi-magnify</v-icon>
                </v-btn>
            </template>

            <!-- <v-btn class="input" icon @click="toggleFilterSheet">
                <v-icon>mdi-filter-variant</v-icon>
            </v-btn> -->

            <v-btn class="input" icon @click="toggleTheme">
                <v-icon>
                    {{
                        isDarkTheme
                            ? 'mdi-white-balance-sunny'
                            : 'mdi-moon-waning-crescent'
                    }}
                </v-icon>
            </v-btn>
        </v-app-bar>

        <v-main>
            <v-container class="container-list">
                <v-btn to="/" text>Todos os Pokémon</v-btn>
                <v-btn to="/favorites" text>Favoritos</v-btn>

                <v-alert v-if="errorMessage" type="error" class="mt-3">{{
                    errorMessage
                }}</v-alert>

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

            <template>
                <BottomSheetFilter
                    :pokemonTypes="pokemonTypes"
                    :selectedTypes="selectedTypes"
                    :showFilterSheet="showFilterSheet"
                    @update:selectedTypes="setSelectedTypes"
                    @update:showFilterSheet="setShowFilterSheet"
                    @apply-filter="applyFilter"
                />
            </template>
        </v-main>
    </v-app>
</template>

<script>
import { ref, onMounted, nextTick, watch } from 'vue'
import {
    fetchPokemonList,
    fetchPokemonDetails,
    fetchAllPokemon,
} from './services/pokeApi.ts'
import { useUtils } from './composables/useUtils.ts'
import { useFavorites } from './composables/useFavorites.ts'
import { usePokemons } from './composables/usePokemons.ts'
import pokedexImage from './assets/Pokedex.png'
import { useDisplay, useTheme } from 'vuetify'
import BottomSheetFilter from './components/BottomSheetFilter.vue'
import { useSearchAndFilter } from './composables/useSearchAndFilter.ts'

export default {
    components: {
        BottomSheetFilter,
    },
    setup() {
        const { smAndDown } = useDisplay()
        const favoritePokemons = ref([])
        const pokemonList = ref([])
        const filteredPokemonList = ref([])
        const theme = useTheme()

        const {
            searchQuery,
            errorMessage,
            showSearch,
            toggleSearch,
            closeFilterSheet,
            showFilterSheet,
            toggleFilterSheet,
        } = useSearchAndFilter(pokemonList, filteredPokemonList)

        const {
            selectedTypes,
            loadMore,
            isLoading,
            loadPokemonList,
            pokemonTypes,
        } = usePokemons(
            pokemonList,
            favoritePokemons,
            searchQuery,
            filteredPokemonList
        )

        const { getPokemonNumber, getPokemonImage, selectPokemon } = useUtils()
        const { toggleFavorite } = useFavorites(favoritePokemons, pokemonList)

        const selectedPokemon = ref(null)

        const isDarkTheme = ref(theme.global.current.value.dark)

        function toggleTheme() {
            theme.global.name.value = theme.global.current.value.dark
                ? 'light'
                : 'dark'
            isDarkTheme.value = !theme.global.current.value.dark
        }

        function toggleTheme() {
            theme.global.name.value = theme.global.current.value.dark
                ? 'light'
                : 'dark'
        }

        const setSelectedTypes = (value) => {
            selectedTypes.value = value
        }

        const setShowFilterSheet = (value) => {
            showFilterSheet.value = value
        }

        const applyFilter = () => {
            filteredPokemonList.value = pokemonList.value.filter((pokemon) => {
                return (
                    pokemon.type[0]?.name &&
                    selectedTypes.value.includes(pokemon.type[0].name)
                )
            })
        }


        //busca pokemon na lista global
        const searchPokemon = async () => {
            const searchValue = searchQuery.value.trim().toLowerCase()

            if (!searchValue) {
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
                errorMessage.value = ''
                filteredPokemonList.value = [localMatch]
            } else {
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
            selectedTypes,
            pokemonTypes,
            pokedexImage,
            showSearch,
            toggleSearch,
            toggleFilterSheet,
            closeFilterSheet,
            applyFilter,
            showFilterSheet,
            setSelectedTypes,
            setShowFilterSheet,
            toggleFilterSheet,
            selectedTypes,
            toggleTheme,
            isDarkTheme,
        }
    },
}
</script>
