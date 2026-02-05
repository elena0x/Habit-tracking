import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.bc1167c7cb144521ab5d216111fed9b4',
  appName: 'elena-habit-tracking',
  webDir: 'dist',
  server: {
    url: 'https://bc1167c7-cb14-4521-ab5d-216111fed9b4.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile'
  }
};

export default config;
