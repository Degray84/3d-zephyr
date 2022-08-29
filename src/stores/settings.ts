import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSettings = defineStore('settings', () => {
  const darkTheme = ref(false)

  const changeDarkTheme = () => {
    darkTheme.value = !darkTheme.value
  }

  return { darkTheme, changeDarkTheme }
})