// hooks/use-push-notifications.ts
'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  requestNotificationPermission,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
  getPushSubscription,
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
      'Notification' in window &&
      'serviceWorker' in navigator &&
      'PushManager' in window
    ) {
      setIsSupported(true);
      setPermission(Notification.permission);

      // Check if already subscribed
      getPushSubscription().then((sub) => {
        setIsSubscribed(!!sub);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  // Show an in-app toast and a browser push notification (via service worker)
  const notify = async (
    title: string,
    options?: { body?: string; tag?: string; data?: any }
  ) => {
    // In-app toast
    toast(title, { description: options?.body });

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

  const subscribe = async () => {
    if (!isSupported) {
      toast.error('Push notifications are not supported in this browser');
      return false;
    }

    setIsLoading(true);

    try {
      // Request permission first
      const hasPermission = await requestNotificationPermission();

      if (!hasPermission) {
        toast.error('Notification permission denied');
        setPermission(Notification.permission);
        setIsLoading(false);
        return false;
      }

      setPermission('granted');

      // Subscribe to push
      const subscription = await subscribeToPushNotifications();

      if (!subscription) {
        toast.error('Failed to subscribe to push notifications');
        setIsLoading(false);
        return false;
      }

      // Send subscription to server
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
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
    setIsLoading(true);

    try {
      const unsubscribed = await unsubscribeFromPushNotifications();

      if (unsubscribed) {
        // TODO: Remove subscription from server
        setIsSubscribed(false);
        toast.success('Push notifications disabled');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error unsubscribing:', error);
      toast.error('Failed to disable push notifications');
      return false;
    } finally {
      setIsLoading(false);
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
