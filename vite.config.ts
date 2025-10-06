// vite.config.ts
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  
  // 빌드 설정 섹션
  build: {
    // 팝업 파일은 항상 같은 이름으로 출력되도록 설정
    rollupOptions: {
      input: 'index.html', // 팝업의 진입점 HTML 파일
      
      output: {
        // 모든 JS 파일은 'assets/index.js' 대신 'popup.js'로 출력되도록 재정의합
        entryFileNames: 'popup.js',
        // 기타 CSS, 에셋 파일 이름에서 해시 제거
        assetFileNames: '[name].[ext]',
        chunkFileNames: '[name].js',
        
        // 크롬 확장 프로그램은 코드 인라인을 허용하지 않으므로,
        // Vite의 asset/CSS 인라인 기능을 비활성화합니다.
        inlineDynamicImports: false,
      },
    },
    // 빌드 출력 폴더는 'dist'로 기본 설정
  },
});