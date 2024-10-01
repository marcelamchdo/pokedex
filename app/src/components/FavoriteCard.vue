<template>
    <v-card
    v-if="pokemon && pokemon"
        class="pokemon-card"
        @click="selectPokemon(pokemon.name)"
        :style="{
            position: 'relative',
            minHeight: '300px',
            maxWidth: '300px',
            margin: 'auto',
        }"
    >
        <v-icon
            class="icon-favorite"
            @click.stop="toggleFavorite(pokemon)"
            :size="32"
            :style="{
                position: 'absolute',
                top: '16px',
                right: '16px',
                color: isFavorite ? 'red' : 'grey',
                zIndex: 2,
                cursor: 'pointer',
            }"
        >
            {{ isFavorite ? 'mdi-heart' : 'mdi-heart-outline' }}
        </v-icon>

        <div
            class="pokemon-number-badge"
            style="
                position: absolute;
                top: 16px;
                left: 16px;
                font-size: 14px;
                z-index: 1;
            "
        >
            #{{ pokemonNumber }}
        </div>

        <div class="pokemon-image-container" style="margin: 32px 0">
            <v-img
                :src="pokemonImage"
                alt="Imagem do Pokémon"
                height="150px"
                contain
            ></v-img>
        </div>

        <div class="pokemon-info-container" style="padding-top: 16px">
            <v-card-title class="pokemon-title" style="text-align: center">
                {{ capitalize(pokemon.name) }}
            </v-card-title>

            <v-row justify="center" class="pokemon-types">
                <v-chip
                    v-for="type in pokemon.type"
                    :key="type.name"
                    class="pokemon-chip"
                    :style="{ backgroundColor: type.colorName }"
                >
                    {{ type.name }}
                </v-chip>
            </v-row>
        </div>
    </v-card>
</template>

<script lang="ts">
interface Pokemon {
    name: string;
    url: string;
    type: { name: string; colorName: string }[]; 
    color: string;
}
export default {
    props: {
        pokemon: { type: Object as () => Pokemon, required: true },
        isFavorite: { type: Boolean, required: true },
        toggleFavorite: { type: Function, required: true },
        pokemonNumber: { type: String, required: true },
        pokemonImage: { type: String, required: true },
        selectPokemon: { type: Function, required: true },
    },
    methods: {
        capitalize(str: any) {
            return str.charAt(0).toUpperCase() + str.slice(1)
        },
    },
}
</script>
