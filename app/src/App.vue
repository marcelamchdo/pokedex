<template>
    <v-app>
        <v-app-bar app color="primary" dark>
            <v-toolbar-title>Pokedex</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn to="/" text>Todos os Pokémon</v-btn>
            <v-btn to="/favorites" text>Favoritos</v-btn>
        </v-app-bar>

        <router-view
            :pokemonList="pokemonList"
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
import { ref, onMounted } from 'vue'
import { fetchPokemonList, fetchPokemonDetails } from './services/pokeApi.ts'

export default {
    setup() {
        const favoritePokemons = ref([])
        const pokemonList = ref([])
        const isLoading = ref(false)
        const offset = ref(0)
        const selectedPokemon = ref(null)

        //busca número do pokemons
        const getPokemonNumber = (url) => {
            const segments = url.split('/')
            const pokemonId = segments[segments.length - 2]
            return `${pokemonId.padStart(3, '0')}`
        }

        //busca imagem do pokemon em melhor qualidade
        const getPokemonImage = (url) => {
            const segments = url.split('/')
            const pokemonId = segments[segments.length - 2]
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
                offset.value += 20
                isLoading.value = false
            } catch (error) {
                console.error('Erro ao carregar a lista de Pokémon:', error)
            } finally {
                isLoading.value = false
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

        onMounted(() => {
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
            loadMore()
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
        }
    },
}
</script>
