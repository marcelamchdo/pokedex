<template>
  <div v-if="pokemonDetails">
    <h2>Detalhes do Pokémon: {{ pokemonDetails.name }}</h2>
    <p><strong>Altura:</strong> {{ pokemonDetails.height }}</p>
    <p><strong>Peso:</strong> {{ pokemonDetails.weight }}</p>
    <h3>Estatísticas:</h3>
    <ul>
      <li v-for="stat in pokemonDetails.stats" :key="stat.stat.name">
        {{ stat.stat.name }}: {{ stat.base_stat }}
      </li>
    </ul>
    <h3>Tipos:</h3>
    <ul>
      <li v-for="type in pokemonDetails.types" :key="type.type.name">
        {{ type.type.name }}
      </li>
    </ul>
  </div>
  <p v-else>Carregando detalhes do Pokémon...</p>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { fetchPokemonDetails } from '../services/pokeApi';

export default defineComponent({
    props: {
        pokemonName: {
            type: String,
            required: true,
        },
    },

    setup(props) {
        const pokemonDetails = ref<any | null>(null);

        const loadPokemonDetails = async (name: string) => {
            try {
                const detailsData = await fetchPokemonDetails(name);
                pokemonDetails.value = detailsData;
            } catch (e) {
                console.error('Erro ao buscar detalhes do Pokémon', e);
            }
        }

        watch(() => props.pokemonName, (newName) => {
            if(newName) {
                loadPokemonDetails(newName);
            }
        }, {immediate: true });
            return {
                pokemonDetails,
            }
        }
        });

</script>
