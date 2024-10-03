<template>
    <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
            <v-card-title v-if="pokemonDetails">
                {{ capitalize(pokemonDetails.name) }}
                <v-spacer></v-spacer>
                <v-btn icon @click="closeDialog">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>

            <v-img :src="pokemonImage" alt="Pokemon" height="300px"></v-img>

            <v-card-text
                v-if="
                    pokemonDetails &&
                    pokemonDetails.stats &&
                    pokemonDetails.types
                "
            >
                <h3>Estatísticas:</h3>
                <ul>
                    <li v-for="stat in pokemonDetails.stats" :key="stat.name">
                        {{ stat.name }}: {{ stat.base_stat }}
                    </li>
                </ul>

                <v-row justify="center" class="pokemon-types">
                    <v-chip
                        v-for="type in pokemonDetails.types"
                        :key="type.name"
                        class="pokemon-chip"
                        :style="{ backgroundColor: type.colorName }"
                    >
                        {{ type.name }}
                    </v-chip>
                </v-row>

                <h3
                    v-if="
                        pokemonDetails.evolutions &&
                        pokemonDetails.evolutions.length
                    "
                >
                    Evolutions
                </h3>
                <v-row
                    v-if="
                        pokemonDetails.evolutions &&
                        pokemonDetails.evolutions.length
                    "
                >
                    <v-col
                        v-for="evolution in pokemonDetails.evolutions"
                        :key="evolution.name"
                        cols="12"
                        sm="6"
                        md="4"
                        lg="3"
                        class="d-flex justify-center"
                    >
                        <v-card>
                            <v-img
                                :src="evolution.imageUrl"
                                alt="Evolução"
                                height="150px"
                                contain
                            ></v-img>
                            <v-card-title class="text-center">{{
                                capitalize(evolution.name)
                            }}</v-card-title>
                        </v-card>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue';
import { usePokemonDetails } from '../composables/usePokemonDetails';


export default defineComponent({
    props: {
        pokemonName: {
            type: String,
            required: true,
        },
        pokemonImage: {
            type: String,
            required: true,
        },
        dialog: {
            type: Boolean,
            required: true,
        },
    },
    emits: ['update:dialog'],
    setup(props, { emit }) {
    const { pokemonDetails, getPokemonDetails } = usePokemonDetails()
    

    const capitalize = (str: string) => {
      if (!str) return ''
      return str.charAt(0).toUpperCase() + str.slice(1)
    }

    const closeDialog = () => {
      emit('update:dialog', false)
    }

    watch(
      () => props.dialog,
      (isOpen) => {
        if (isOpen) {
          getPokemonDetails(props.pokemonName) 
        }
      },
      { immediate: true }
    )

    return {
      pokemonDetails,
      capitalize,
      closeDialog,
    }
  },
})
</script>