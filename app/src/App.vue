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

export default {
    setup() {
        const favoritePokemons = ref([])
        const pokemonList = ref([])
        const isLoading = ref(false)
        const offset = ref(0)

        const loadMore = async () => {
            isLoading.value = true;
            try {
                const response = await fetch(
                    `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset.value}`
                )
                const data = await response.json();

                const pokemonDetailsPromises = data.results.map(
                    async (pokemon) => {
                        const detailsResponse = await fetch(pokemon.url)
                        const detailsData = await detailsResponse.json()
                        const types = detailsData.types.map((type) => type.type.name);
                        return {
                            ...pokemon,
                            types,
                            color: '',
                        }
                    });
                    
                const newPokemonList = data.results.map((pokemon) => ({
                    ...pokemon,
                    types: [],
                    color: '',
                }))
                pokemonList.value = [...pokemonList.value, ...newPokemonList]
                offset.value += 20
            } catch (error) {
                console.error('Erro ao carregar a lista de Pokémon:', error)
            } finally {
                isLoading.value = false
            }
        }

        const loadPokemonList = async () => {
            try {
                const response = await fetch(
                    'https://pokeapi.co/api/v2/pokemon?limit=20'
                )
                const data = await response.json()
                pokemonList.value = data.results.map((pokemon) => ({
                    ...pokemon,
                    isFavorite: favoritePokemons.value.some(
                        (fav) => fav.name === pokemon.name
                    ),
                }))
            } catch (error) {
                console.error('Erro ao carregar a lista de Pokémon', error)
            }
        }

        onMounted(() => {
            const storedFavorites = localStorage.getItem('pokemonFavorites')
            if (storedFavorites) {
                favoritePokemons.value = JSON.parse(storedFavorites)
            }
            loadPokemonList();
            loadMore();
        })

        const toggleFavorite = (pokemon) => {
            if (favoritePokemons.value.includes(pokemon)) {
                favoritePokemons.value = favoritePokemons.value.filter(
                    (fav) => fav !== pokemon
                )
            } else {
                favoritePokemons.value.push(pokemon)
            }
            localStorage.setItem(
                'pokemonFavorites',
                JSON.stringify(favoritePokemons.value)
            )
        }
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
