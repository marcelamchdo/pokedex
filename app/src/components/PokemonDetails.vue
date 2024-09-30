<template>
<<<<<<< HEAD
    <v-container fluid>
        <v-row
            justify="center"
            align="center"
            class="d-flex"
            style="min-height: 100vh"
        >
            <v-col cols="12" sm="6" md="4" lg="3" class="d-flex justify-center">
                <v-card>
                    <v-img 
                    :src="pokemonImage"
                    alt="Pokemon" height:300px />

                    <v-card-title class="text-center">
                        {{ capitalize(pokemonDetails.name) }}
                    </v-card-title>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
    <div v-if="pokemonDetails">
        <h3>Estatísticas:</h3>
        <ul>
            <li v-for="stat in pokemonDetails.stats"     
            :key="stat.name">
                {{ stat.name }}: {{ stat.base_stat }}
            </li>
        </ul>
    </div>
=======
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
>>>>>>> 0897be8baac4b7ca7aee632de5ec58814cd74bfc
</template>

<script lang="ts">
import { defineComponent, watch, ref } from 'vue'
import { fetchPokemonDetails } from '../services/pokeApi'

export default defineComponent({
    props: {
        pokemonName: {
            type: String,
            required: true,
            validator: (value: string) => !!value,
        },
        pokemonImage: { type: String, required: true }
    },

        setup(props) {
        const pokemonDetails = ref<any | null>(null)

<<<<<<< HEAD
        const capitalize = (str: string) => {
            if (!str) return ''
            return str.charAt(0).toUpperCase() + str.slice(1)
=======
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
>>>>>>> 0897be8baac4b7ca7aee632de5ec58814cd74bfc
        }

        watch(
            () => props.pokemonName,
            async (newName) => {
                if (newName && newName.trim()) {
                    try {
                        const detailsData = await fetchPokemonDetails(newName)
                        console.log(detailsData)
                        pokemonDetails.value = detailsData
                    } catch (e) {
                        console.error('Erro ao buscar detalhes do Pokémon', e)
                    }
                }
            },
            { immediate: true }
        )

        return {
            pokemonDetails,
            capitalize,
        }
    },
})
</script>
