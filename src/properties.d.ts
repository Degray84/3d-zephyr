export {};

declare module 'vue' {
  interface ComponentCustomProperties {
    $pickLocale: (key: { ru: string; en: string }) => string;
  }
}
