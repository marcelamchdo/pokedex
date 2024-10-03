<template>
    <v-bottom-sheet :model-value="showFilterSheet" @update:model-value="updateShowFilterSheet" persistent>
      <v-card>
        <v-card-title>Filter</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-chip-group
            :model-value="selectedTypes"
            column
            multiple
            @update:model-value="updateSelectedTypes"
          >
          <h3>Types</h3>
            <v-chip
              v-for="type in pokemonTypes"
              :key="type"
              :value="type"
              filter
              class="ma-2"
            >
              {{ type }}

            </v-chip>
          </v-chip-group>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="closeFilterSheet">Fechar</v-btn>
          <v-btn color="secondary" @click="applyFilter">Filtrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-bottom-sheet>
  </template>
  
  <script>
  export default {
    props: {
      showFilterSheet: {
        type: Boolean,
        required: true,
      },
      pokemonTypes: {
        type: Array,
        required: true,
      },
      selectedTypes: {
        type: Array,
        required: true,
      },
    },
    methods: {
    updateSelectedTypes(value) {
      this.$emit('update:selectedTypes', value);
    },
    applyFilter() {
      this.$emit('apply-filter');
    },
    closeFilterSheet() {
      this.$emit('update:showFilterSheet', false);
    },
    updateShowFilterSheet(value) {
    this.$emit('update:showFilterSheet', value);
  },
  },
};
  </script>
  