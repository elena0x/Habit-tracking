import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Keyboard, KeyboardResize } from '@capacitor/keyboard';
import { App } from '@capacitor/app';

const isNative = Capacitor.isNativePlatform();

export const useNativeApp = () => {
  useEffect(() => {
    if (!isNative) return;

    const initNative = async () => {
      // Status bar - translucent overlay style
      try {
        await StatusBar.setStyle({ style: Style.Light });
        await StatusBar.setOverlaysWebView({ overlay: true });
      } catch {
        // Continue when a native capability is unavailable.
      }

      // Keyboard - resize behavior
      try {
        await Keyboard.setResizeMode({ mode: KeyboardResize.Body });
        await Keyboard.setScroll({ isDisabled: false });
      } catch {
        // Continue when a native capability is unavailable.
      }

      // Hide splash screen after app is ready
      try {
        await SplashScreen.hide({ fadeOutDuration: 300 });
      } catch {
        // Continue when a native capability is unavailable.
      }
    };

    initNative();

    // Listen for dark mode changes to update status bar
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleColorSchemeChange = (e: MediaQueryListEvent) => {
      StatusBar.setStyle({ style: e.matches ? Style.Dark : Style.Light }).catch(() => {});
    };
    mediaQuery.addEventListener('change', handleColorSchemeChange);

    // Set initial dark mode status bar
    if (mediaQuery.matches) {
      StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
    }

    // Handle hardware back button (Android)
    const backHandler = App.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack) {
        window.history.back();
      } else {
        App.minimizeApp();
      }
    });

    return () => {
      mediaQuery.removeEventListener('change', handleColorSchemeChange);
      backHandler.then(h => h.remove());
    };
  }, []);
};
