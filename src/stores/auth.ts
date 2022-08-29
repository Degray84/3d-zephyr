import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@firebase/auth'

export const useAuth = defineStore('auth', () => {
    let user = ref<User | null>(null)

    const fetchUser = (authUser: User | null) => {
        if (authUser) {
            user.value = authUser
        } else {
            user.value = null
        }
    }

    return { user, fetchUser }
})