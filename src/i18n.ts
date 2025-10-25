import { register, init, getLocaleFromNavigator } from 'svelte-i18n';

register('kr', () => import('./_locales/kr.json'));
register('jp', () => import('./_locales/jp.json'));
register('en', () => import('./_locales/en.json'));


init({
  fallbackLocale: 'en',
  initialLocale: getLocaleFromNavigator() // ex: "ko-KR" → "ko"
});