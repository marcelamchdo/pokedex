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
                @input="filterPokemonList"
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

export default {
    setup() {
        const favoritePokemons = ref([])
        const pokemonList = ref([])
        const isLoading = ref(false)
        const offset = ref(0)
        const selectedPokemon = ref(null)
        const searchQuery = ref('')
        const filteredPokemonList = ref([])

        // Função de busca local
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

        const searchPokemon = async () => {
            const searchValue = searchQuery.value.trim().toLowerCase() // Obtém o valor da busca
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

                    // Verifica se o valor é numérico (busca pelo número do Pokémon)
                    if (!isNaN(searchValue)) {
                        pokemonDetails = await fetchPokemonDetails(
                            Number(searchValue)
                        )
                    } else {
                        pokemonDetails = await fetchPokemonDetails(searchValue)
                    }

                    if (pokemonDetails && pokemonDetails.types) {
                        // Ajuste correto para manter a estrutura de `types` no retorno
                        pokemonDetails.type = pokemonDetails.types.map(
                            (type) => ({
                                name: type.name,
                                colorName: type.colorName || 'defaultColor', // Defina uma cor padrão, se necessário
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
                        filteredPokemonList.value = [...pokemonList.value] // Reseta a lista
                    }
                } catch (error) {
                    console.error('Erro ao buscar Pokémon:', error)
                    filteredPokemonList.value = [...pokemonList.value] // Reseta a lista em caso de erro
                }
            }
        }

        //busca número do pokemons
        const getPokemonNumber = (url, id) => {
            const segments = url.split('/')
            const pokemonId = id || (url ? segments[segments.length - 2] : null)
            if (!pokemonId) return ''

            return String(pokemonId).padStart(3, '0')
        }

        //busca imagem do pokemon em melhor qualidade
        const getPokemonImage = (url, id) => {
            const segments = url.split('/')
            const pokemonId = id || (url ? segments[segments.length - 2] : null)

            if (!pokemonId) return ''

            const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`
            return imageUrl
        }

        //pokemon selecionado
        const selectPokemon = (pokemonName) => {
            selectedPokemon.value = pokemonName
        }

        //carrega mais 20 pokemons
        const loadMore = async () => {
            isLoading.value = true
            try {
                const response = await fetch(
                    `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset.value}`
                )
                const data = await response.json()

                const newPokemonList = await Promise.all(
                    data.results.map(async (pokemon) => {
                        const details = await fetchPokemonDetails(pokemon.name)
                        return {
                            ...pokemon,
                            type: details.types,
                            color: details.color,
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

        //carrega lista inicial de pokemons
        const loadPokemonList = async () => {
            try {
                const response = await fetch(
                    'https://pokeapi.co/api/v2/pokemon?limit=20'
                )
                const data = await response.json()
                const pokemonDetailsList = await Promise.all(
                    data.results.map(async (pokemon) => {
                        const details = await fetchPokemonDetails(pokemon.name)
                        return {
                            ...pokemon,
                            type: details.type,
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

        //favorita e desfavorita pokemon
        const toggleFavorite = (pokemon) => {
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
            pokemonList,
            favoritePokemons,
            loadMore,
            toggleFavorite,
            isLoading,
            selectedPokemon,
            selectPokemon,
            getPokemonNumber,
            getPokemonImage,
            searchPokemon,
            searchQuery,
            filterPokemonList,
            filteredPokemonList,
        }
    },
}
</script>
