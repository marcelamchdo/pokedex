import { ref } from 'vue'


export function useSearchAndFilter(
) {
    const showSearch = ref(false)
    const showFilterSheet = ref(false)
    const searchQuery = ref('')
    const errorMessage = ref('')

    const toggleSearch = () => {
        showSearch.value = !showSearch.value
    }

    const toggleFilterSheet = () => {
        showFilterSheet.value = !showFilterSheet.value
    }

    const closeFilterSheet = () => {
        showFilterSheet.value = false
    }

    return {
        searchQuery,
        showSearch,
        toggleSearch,
        showFilterSheet,
        toggleFilterSheet,
        closeFilterSheet,

        errorMessage,
    }
}
