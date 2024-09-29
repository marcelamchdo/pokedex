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
                            types: details.types,
                            color: '',
                        }
                    })
                )

                pokemonList.value = [...pokemonList.value, ...newPokemonList]
                offset.value += 20
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
                            types: details.types, 
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

        //favoritar ou desfavoritar pokemons
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
        }

        onMounted(() => {
            const storedFavorites = localStorage.getItem('pokemonFavorites')
            if (storedFavorites) {
                favoritePokemons.value = JSON.parse(storedFavorites)
            }
            loadPokemonList()
            loadMore()
        })

        return {
            pokemonList,
            favoritePokemons,
            loadMore: loadPokemonList,
            toggleFavorite,
            isLoading,
        }
    },
}
</script>
