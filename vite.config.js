import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/your-repo-name/', // <-- replace with your GitHub repo name
  plugins: [react()],
});
