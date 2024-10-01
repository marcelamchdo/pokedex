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
import { fetchPokemonList, fetchPokemonDetails } from './services/pokeApi.ts'

export default {
    setup() {
        const favoritePokemons = ref([])
        const pokemonList = ref([])
        const isLoading = ref(false)
        const offset = ref(0)
        const selectedPokemon = ref(null)
        const searchQuery = ref('')
        const filteredPokemonList = ref([])

        //buscar pokemon
        const searchPokemon = async () => {
            try {
                const searchValue = searchQuery.value.trim()
                if (!searchValue) return

                const pokemonDetails = await fetchPokemonDetails(
                    searchValue.toLowerCase()
                )
                selectedPokemon.value = pokemonDetails
            } catch (error) {
                console.error('Erro ao buscar Pokémon:', error)
            }
        }

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
            console.log('LoadMore foi chamado')
            isLoading.value = true
            try {
                console.log('Offset atual:', offset.value)
                const response = await fetch(
                    `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset.value}`
                )
                const data = await response.json()
                console.log('Resposta da API:', data.results)

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

                pokemonList.value = [...pokemonList.value, ...newPokemonList];
                console.log('Lista atualizada de Pokémon:', pokemonList.value);

                if (!searchQuery.value) {
                    filteredPokemonList.value = [...pokemonList.value]
                }

                offset.value += 20
                console.log('Novos pokemons carregados', newPokemonList)
            } catch (error) {
                console.error('Erro ao carregar a lista de Pokémon:', error)
            } finally {
                isLoading.value = false
                await nextTick()
                console.log('Estado de carregamento:', isLoading.value)
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
