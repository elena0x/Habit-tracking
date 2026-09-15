import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';
import { useCallback } from 'react';

const isNative = Capacitor.isNativePlatform();

export const useHaptics = () => {
  const lightTap = useCallback(async () => {
    if (!isNative) return;
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch {
      // Haptics are an enhancement; unsupported devices should remain usable.
    }
  }, []);

  const mediumTap = useCallback(async () => {
    if (!isNative) return;
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch {
      // Haptics are an enhancement; unsupported devices should remain usable.
    }
  }, []);

  const heavyTap = useCallback(async () => {
    if (!isNative) return;
    try {
      await Haptics.impact({ style: ImpactStyle.Heavy });
    } catch {
      // Haptics are an enhancement; unsupported devices should remain usable.
    }
  }, []);

  const success = useCallback(async () => {
    if (!isNative) return;
    try {
      await Haptics.notification({ type: NotificationType.Success });
    } catch {
      // Haptics are an enhancement; unsupported devices should remain usable.
    }
  }, []);

  const warning = useCallback(async () => {
    if (!isNative) return;
    try {
      await Haptics.notification({ type: NotificationType.Warning });
    } catch {
      // Haptics are an enhancement; unsupported devices should remain usable.
    }
  }, []);

  const error = useCallback(async () => {
    if (!isNative) return;
    try {
      await Haptics.notification({ type: NotificationType.Error });
    } catch {
      // Haptics are an enhancement; unsupported devices should remain usable.
    }
  }, []);

  const selectionTap = useCallback(async () => {
    if (!isNative) return;
    try {
      await Haptics.selectionStart();
      await Haptics.selectionChanged();
      await Haptics.selectionEnd();
    } catch {
      // Haptics are an enhancement; unsupported devices should remain usable.
    }
  }, []);

  return {
    lightTap,
    mediumTap,
    heavyTap,
    success,
    warning,
    error,
    selectionTap,
  };
};
