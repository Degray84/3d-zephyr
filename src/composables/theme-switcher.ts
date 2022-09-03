import { useColorMode, usePreferredDark } from '@vueuse/core';

const preferDark = usePreferredDark();

const mode = useColorMode({
  attribute: 'color-scheme',
  initialValue: preferDark.value ? 'dark' : 'light',
});

export function changeTheme() {
  mode.value = mode.value === 'light' ? 'dark' : 'light';
}
