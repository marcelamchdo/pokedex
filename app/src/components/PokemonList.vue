<template>
  <div>
    <h2>Lista de Pokémon</h2>
    <ul class="pokemon-list">
      <li v-for="pokemon in pokemonList" :key="pokemon.name" class="pokemon-item">
        <img :src="getPokemonImage(pokemon.url)" alt="Imagem do Pokémon" />
        <p>{{ getPokemonNumber(pokemon.url) }} - {{ pokemon.name }}</p>
        <a href="#" @click.prevent="selectPokemon(pokemon.name)">Ver Detalhes</a>
      </li>
    </ul>

    <button v-if="!isLoading" @click="loadMore">Carregar Mais</button>
    <p v-if="isLoading">Carregando...</p>

    <PokemonDetails v-if="selectedPokemon" :pokemonName="selectedPokemon" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { fetchPokemonList } from '../services/pokeApi';
import PokemonDetails from './PokemonDetails.vue';

export default defineComponent({
  components: {
    PokemonDetails,
  },
  setup() {
    const pokemonList = ref<any[]>([]);
    const offset = ref(0);
    const isLoading = ref(false);
    const selectedPokemon = ref<string | null>(null);

    const loadMore = async () => {
      isLoading.value = true;
      try {
        const listData = await fetchPokemonList(offset.value, 20);
        pokemonList.value = [...pokemonList.value, ...listData.results];
        offset.value += 20;
      } catch (error) {
        console.error('Erro ao carregar mais Pokémon', error);
      } finally {
        isLoading.value = false;
      }
    };

    const selectPokemon = (pokemonName: string) => {
      selectedPokemon.value = pokemonName;
    };

    const getPokemonNumber = (url: string) => {
      const segments = url.split('/');
      return segments[segments.length - 2]; 
    };

    const getPokemonImage = (url: string) => {
      const pokemonId = getPokemonNumber(url);
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
    };

    loadMore();

    return {
      pokemonList,
      loadMore,
      isLoading,
      selectedPokemon,
      selectPokemon,
      getPokemonNumber,
      getPokemonImage,
    };
  },
});
</script>

<style scoped>
.pokemon-list {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.pokemon-item {
  width: 150px;
  text-align: center;
}

img {
  width: 100px;
  height: 100px;
}
</style>
