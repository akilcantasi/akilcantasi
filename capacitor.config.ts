import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.akilcantasi.app',
  appName: 'Akıl Çantası',
  webDir: 'dist',
  android: {
    // Uygulama https://localhost'tan açılır; aynı ağdaki başka bir bilgi noktasına
    // (http://192.168.x.x:8080: pano, paket listesi, LAN'dan indirme) fetch ancak bununla gider.
    // Betikler etkilenmez: index.html CSP'si script-src 'self' (http betiği yüklenemez).
    allowMixedContent: true,
    backgroundColor: '#0E1B2C',
  },
  server: {
    androidScheme: 'https',
  },
};

export default config;
