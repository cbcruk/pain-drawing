import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  /*
    상대 경로로 빌드한다. GitHub Pages는 프로젝트 사이트라
    `/pain-drawing/` 하위에 놓이는데, 저장소 이름을 base에 박아두면 포크나
    커스텀 도메인에서 깨진다. HTML이 전부 루트 한 단계에 있어 상대 경로로 충분하다.
  */
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // 저작 도구는 별도 엔트리다. 지시 도구 번들에 섞이지 않는다.
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        author: fileURLToPath(new URL('./author.html', import.meta.url)),
      },
    },
  },
})
