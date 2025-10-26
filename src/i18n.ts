import { register, init } from 'svelte-i18n';

register('kr', () => import('./_locales/kr.json'));
register('jp', () => import('./_locales/jp.json'));
register('en', () => import('./_locales/en.json'));

// 기본 설정을 초기화합니다.
init({
    fallbackLocale: 'en', // 번역이 없을 때 사용할 기본 언어
    initialLocale: 'kr', // 초기 언어 설정
});