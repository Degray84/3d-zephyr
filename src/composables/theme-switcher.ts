import { useColorMode, usePreferredDark } from '@vueuse/core';

export function useChangeTheme() {
  const preferDark = usePreferredDark();

  const mode = useColorMode({
    attribute: 'color-scheme',
    initialValue: preferDark.value ? 'dark' : 'light',
  });

  return {
    changeTheme() {
      mode.value = mode.value === 'light' ? 'dark' : 'light';
    },
  };
}
