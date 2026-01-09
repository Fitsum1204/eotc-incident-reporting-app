// components/shared/NotificationButton.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Bell, BellOff, Loader2 } from 'lucide-react'
import { usePushNotifications } from '@/hooks/use-push-notifications';

export function NotificationButton() {
  const { isSupported, isSubscribed, isLoading, subscribe, unsubscribe } = usePushNotifications();

  if (!isSupported) {
    return null; // Don't show button if not supported
  }

  if (isLoading) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Loader2 className="h-5 w-5 animate-spin" />
      </Button>
    );
  }

  if (isSubscribed) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={unsubscribe}
        title="Disable notifications"
      >
        <Bell className="h-5 w-5 text-green-600" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={subscribe}
      title="Enable notifications"
    >
      <BellOff className="h-5 w-5" />
    </Button>
  );
}