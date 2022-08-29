<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';

import { useAuth } from '@/stores/auth';
import { useSettings } from '@/stores/settings';
import { useI18n } from 'vue-i18n';
import { authSignIn, authSignOut } from '@/api/auth.api';

import BaseIcon from '@/components/base/BaseIcon.vue';

const authStore = useAuth();
const { user } = storeToRefs(authStore);
const { changeDarkTheme } = useSettings();
const { locale } = useI18n({ useScope: 'global' });

const changeLanguage = () => {
  locale.value === 'ru' ? (locale.value = 'en') : (locale.value = 'ru');
};

const menuList = [
  { label: 'changeTheme', icon: 'dark_mode', action: changeDarkTheme },
  { label: 'changeLanguage', icon: 'translate', action: changeLanguage },
  { label: 'logout', icon: 'logout', action: authSignOut },
  { label: 'login', icon: 'login', action: authSignIn },
];

const computedList = computed(() =>
  menuList.filter(({ label }) => (!user.value ? label !== 'logout' : label !== 'login'))
);

const opened = ref(false);

const closeDropdown = () => {
  opened.value = false;
};

onMounted(() => {
  document.body.addEventListener('click', closeDropdown);
});

onUnmounted(() => {
  document.body.removeEventListener('click', closeDropdown);
});
</script>

<template>
  <div class="user-dropdown" @click.stop>
    <div class="user-dropdown__trigger" @click="opened = !opened">
      <img v-if="user" :src="user?.photoURL || '#'" alt="userphoto" />
      <span v-else class="material-icons-outlined">person</span>
    </div>
    <Transition
      enter-active-class="animate__animated animate__fadeInRight"
      leave-active-class="animate__animated animate__fadeOutRight"
    >
      <div class="user-dropdown__list" v-if="opened">
        <div class="user-dropdown__list-title">
          {{ user?.displayName }}
          {{ user?.email }}
        </div>

        <div
          v-for="{ label, icon, action } in computedList"
          :key="label"
          class="user-dropdown__list-item"
          @click="action"
        >
          <BaseIcon small>{{ icon }}</BaseIcon>
          {{ $t(label) }}
        </div>
      </div>
    </Transition>
  </div>
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
    top: 100%;
    right: 0;
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
