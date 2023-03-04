<script setup lang="ts">
import { ref } from 'vue';
import { authSignIn, authSignOut } from '@/api/auth.api';

import { useChangeAuth } from '@/composables/auth-switcher';
import { useChangeTheme } from '@/composables/theme-switcher';
import { useChangeLocale } from '@/composables/locale-switcher';

const { user } = useChangeAuth();
const { changeTheme } = useChangeTheme();
const { changeLanguage } = useChangeLocale();
</script>
<template>
  <q-btn round>
    <q-avatar>
      <q-img
        :src="user?.photoURL || 'https://cdn.quasar.dev/img/boy-avatar.png'"
        spinner-color="white"
      >
        <template #error>
          <span>AD</span>
        </template>
      </q-img>
    </q-avatar>
    <q-menu transition-show="rotate" transition-hide="rotate">
      <q-list style="min-width: 100px">
        <q-item clickable @click="changeTheme">
          <q-item-section>{{ $t('changeTheme') }}</q-item-section>
        </q-item>
        <q-item clickable @click="changeLanguage">
          <q-item-section>{{ $t('changeLanguage') }}</q-item-section>
        </q-item>
        <q-separator />
        <q-item v-if="user" clickable @click="authSignOut">
          <q-item-section>{{ $t('logout') }}</q-item-section>
        </q-item>
        <q-item v-else clickable @click="authSignIn">
          <q-item-section>{{ $t('login') }}</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<style lang="scss" scoped>
.user-dropdown {
  --animate-duration: 0.3s;
  position: relative;

  &__trigger {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: var(--skr-base-4);
    color: var(--skr-base-6);
    overflow: hidden;
    border: 1px solid var(--skr-base-3);
    cursor: pointer;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  &__list {
    position: absolute;
    z-index: 999;
    top: 100%;
    left: 0;
    display: flex;
    flex-direction: column;
    width: 280px;
    background-color: var(--skr-surface-4);
    border: 1px solid var(--skr-base-3);
    border-radius: var(--skr-border-radius-m);
    box-shadow: var(--skr-shadow-down-m);
    overflow: hidden;

    &-title {
      padding: var(--skr-space-2) var(--skr-space-4);
      color: var(--skr-base-5);
      font: var(--skr-title-m);
      border-bottom: 1px solid var(--skr-base-3);
    }

    &-item {
      padding: var(--skr-space-2) var(--skr-space-4);
      display: flex;
      align-items: center;
      gap: var(--skr-space-2);
      color: var(--skr-base-5);
      font: var(--skr-body-m);
      cursor: pointer;
      transition: color 0.3s, background-color 0.3s;
      &:not(:last-child) {
        border-bottom: 1px solid var(--skr-base-3);
      }
      &:hover {
        background-color: var(--skr-base-3);
        color: var(--skr-text-2);
      }
    }
  }
}
</style>
