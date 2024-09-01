import react from '@vitejs/plugin-react';
import os from 'os';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const interfaceName in interfaces) {
    const interfaceInfo = interfaces[interfaceName] as os.NetworkInterfaceInfo[];
    for (const info of interfaceInfo) {
      if (!info.internal && info.family === 'IPv4') {
        return info.address;
      }
    }
  }
  return 'localhost';
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        // svgr options
      },
    }),
  ],
  // server: {
  //   host: getLocalIP(),
  //   strictPort: true,
  //   port: 5173,
  //   // proxy: {
  //   //   '/api': {
  //   //     target: `http://${getLocalIP()}:8080`,
  //   //     changeOrigin: true,
  //   //   },
  //   // },
  // },
});
