import { createRouter, createWebHistory  } from 'vue-router'
import PokemonList from '../components/PokemonList.vue'
import FavoritePokemons from '../components/FavoritePokemons.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: PokemonList,
    },
    {
        path: '/favorites',
        name: 'Favorites',
        component: FavoritePokemons,
        props: true,
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
