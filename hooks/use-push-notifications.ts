// hooks/use-push-notifications.ts
'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  requestNotificationPermission,
  getFcmToken,
  onForegroundMessage,
} from '@/lib/notifications';

async function saveTokenToServer(token: string): Promise<void> {
  const response = await fetch('/api/push/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to save subscription: ${response.status} ${errorBody}`);
  }
}

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] =
    useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const subscribe = useCallback(async () => {
    if (!isSupported) {
      toast.error('Push notifications are not supported in this browser');
      return false;
    }

    setIsLoading(true);

    try {
      const hasPermission = await requestNotificationPermission();

      if (!hasPermission) {
        setPermission(Notification.permission);
        toast.error('Notification permission denied');
        return false;
      }

      setPermission('granted');

      const token = await getFcmToken();

      if (!token) {
        toast.error('Failed to get push token');
        return false;
      }

      await saveTokenToServer(token);

      setIsSubscribed(true);
      toast.success('Push notifications enabled');
      return true;
    } catch (error) {
      console.error('Error subscribing:', error);
      toast.error('Failed to enable push notifications');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  useEffect(() => {
    const supported =
      typeof window !== 'undefined' &&
      'Notification' in window &&
      'serviceWorker' in navigator;

    setIsSupported(supported);

    if (!supported) {
      setIsLoading(false);
      return;
    }

    const currentPermission = Notification.permission;
    setPermission(currentPermission);

    let cancelled = false;

    const syncExistingPermission = async () => {
      if (currentPermission !== 'granted') {
        if (!cancelled) setIsLoading(false);
        return;
      }

      try {
        const token = await getFcmToken();

        if (token) {
          await saveTokenToServer(token);
          if (!cancelled) setIsSubscribed(true);
        }
      } catch (error) {
        console.error('Failed to sync existing push token:', error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    syncExistingPermission();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const unsubscribeForeground = onForegroundMessage((payload) => {
      const data = payload?.data || {};
      const title = data.title || 'Notification';
      const body = data.body;
      toast(title, { description: body });
    });

    return () => {
      unsubscribeForeground();
    };
  }, []);

  const unsubscribe = async () => {
    setIsLoading(true);
    try {
      setIsSubscribed(false);
      toast.success('Push notifications disabled');
      return true;
    } catch (error) {
      console.error('Error unsubscribing', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const notify = async (
    title: string,
    options?: { body?: string; tag?: string; data?: unknown },
  ) => {
    toast(`${title}`, { description: `${options?.body}` });

    try {
      if (
        Notification.permission === 'granted' &&
        'serviceWorker' in navigator
      ) {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(title, {
          body: options?.body,
          tag: options?.tag,
          data: options?.data,
        });
      }
    } catch (err) {
      console.error('Error showing browser notification:', err);
    }
  };

  return {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    subscribe,
    unsubscribe,
    notify,
  };
}
