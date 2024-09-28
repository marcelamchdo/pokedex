import axios from 'axios';

const api = axios.create({
    baseURL: 'https://pokeapi.co/api/v2/',
    timeout: 10000,
});

export const fetchPokemonList = async (
    offset: number = 0,
    limit: number = 20,
) => {
    try {
        const response = await api.get(
            `/pokemon?offset=${offset}&limit=${limit}`,
        );
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar a lista de Pokémon', error);
        throw error;
    }
};

export const fetchPokemonDetails = async (pokemonNameOrId: string | number) => {
    try {
        const response = await api.get(`/pokemon/${pokemonNameOrId}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar detalhes do Pokémon', error);
        throw error;
    }
};

export const fetchPokemonSpecies = async (pokemonNameOrId: string | number) => {
    try {
        const response = await api.get(`/pokemon-species/${pokemonNameOrId}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar a espécie do Pokémon', error);
        throw error;
    }
};
