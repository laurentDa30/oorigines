import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    // WSL2 : on écoute sur toutes les interfaces pour être joignable depuis
    // Windows ; hmr.host fixe l'origine écrite dans public/hot (sinon 0.0.0.0,
    // que les navigateurs refusent) et l'URL du websocket HMR.
    server: {
        host: '0.0.0.0',
        hmr: { host: 'localhost' },
    },
    plugins: [
        laravel({ input: ['resources/css/app.css', 'resources/js/app.jsx'], refresh: true }),
        react(),
    ],
});
