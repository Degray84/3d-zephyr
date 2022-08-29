import type { Pages } from '@/stores/config'

interface Tab {
    route: string
    label: string
    icon?: string
}

const TABS: Readonly<Tab>[] = [
    {
        route: 'home',
        label: 'home',
        icon: 'home'
    },
    {
        route: 'about',
        label: 'about',
        icon: 'person'
    }
]
export default TABS