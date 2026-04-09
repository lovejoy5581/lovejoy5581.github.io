import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 配置路径解析
  resolve: {
      // 配置路径别名
      alias: {
          // 将@别名指向src目录
          "@": path.resolve(__dirname, "src"),
      },
  },
})
