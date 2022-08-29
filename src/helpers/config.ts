import { useConfig, type Pages } from '@/stores/config';
import { storeToRefs } from 'pinia';

export const isAvailablePage = (page: keyof Pages): Boolean => {
    const storeConfig = useConfig()
    const { pages } = storeToRefs(storeConfig)

    if (!pages.value) return false

    return !!pages.value[page]
}