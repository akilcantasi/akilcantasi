import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.akilcantasi.app',
  appName: 'Akıl Çantası',
  webDir: 'dist',
  android: {
    // Büyük paketleri (ZIM, model) dosyadan içe aktarmak için
    allowMixedContent: true,
    backgroundColor: '#0E1B2C',
  },
  server: {
    androidScheme: 'https',
  },
};

export default config;
