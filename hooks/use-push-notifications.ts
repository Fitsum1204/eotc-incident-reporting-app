// hooks/use-push-notifications.ts
'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  requestNotificationPermission,
  getFcmToken,
} from '@/lib/notifications';

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] =
    useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if browser supports notifications
    if (
      typeof window !== 'undefined' &&
      'Notification' in window &&
      'serviceWorker' in navigator
    ) {
      setIsSupported(true);
      setPermission(Notification.permission);
      
      // In FCM, "subscribed" loosely means we have a token and permission is granted.
      // We don't check a remote API for "isSubscribed" here to keep it simple, 
      // but we could check if we have a token in local storage or indexedDB (FCM handlers do this).
      if (Notification.permission === 'granted') {
        setIsSubscribed(true);
      }
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  const subscribe = async () => {
    if (!isSupported) {
      toast.error('Push notifications are not supported in this browser');
      return false;
    }

    setIsLoading(true);

    try {
      const hasPermission = await requestNotificationPermission();

      if (!hasPermission) {
        toast.error('Notification permission denied');
        setPermission(Notification.permission);
        setIsLoading(false);
        return false;
      }

      setPermission('granted');

      // Get FCM Token
      const token = await getFcmToken();

      if (!token) {
        toast.error('Failed to get push token');
        setIsLoading(false);
        return false;
      }

      // Send token to server
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new Error('Failed to save subscription');
      }

      setIsSubscribed(true);
      toast.success('Push notifications enabled!');
      return true;
    } catch (error) {
      console.error('Error subscribing:', error);
      toast.error('Failed to enable push notifications');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const unsubscribe = async () => {
    // With FCM, unsubscribing usually just means deleting the token or 
    // simply not sending it to the server anymore.
    // Real unsubscription from FCM is deleteToken(messaging).
    // For now, we'll just simulate it UI-wise.
    setIsLoading(true);
    try {
        // TODO: Call server to delete token mapping
        setIsSubscribed(false);
        toast.success('Push notifications disabled');
        return true;
    } catch (error) {
        console.error("Error unsubscribing", error);
        return false;
    } finally {
        setIsLoading(false);
    }
  };

  const notify = async (
    title: string,
    options?: { body?: string; tag?: string; data?: any }
  ) => {
    // In-app toast
    toast(`${title}`, { description: `${options?.body}` });

    // Browser notification via service worker
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
