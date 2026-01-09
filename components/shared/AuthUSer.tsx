'use client';
import { useNotifications } from '@/hooks/use-push-notifications';
import { useEffect, useState, useRef } from 'react';
import { DataTable } from '../../app/tabel/data-table';
import { columns } from '../../app/tabel/columns';
import { sanityFetch } from '@/sanity/lib/client-fetch';
import { INCIDENTS_TABLE_QUERY } from '@/sanity/lib/queries';
import { updateIncidentStatus } from '@/components/updateIncidents';
import { toast } from 'sonner';
import IncidentMapClient from '@/components/shared/IncidentMapClient';
import { Incident } from '@/sanity/types';

export default function AdminIncidentsPage() {
  const { notify, permission } = useNotifications();
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Track previous incident IDs to detect NEW incidents
  const previousIncidentIdsRef = useRef<Set<string>>(new Set());
  const lastNotificationTimeRef = useRef<number>(0);
  const NOTIFICATION_COOLDOWN = 60000; // 1 minute between notifications

  // First useEffect: Initial fetch
  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const data: Incident[] = await sanityFetch({
          query: INCIDENTS_TABLE_QUERY,
        });
        const withHandlers = (data || []).map((inc: Incident) => ({
          ...inc,
          onUpdateStatus: async (verification: 'verified' | 'rejected') =>
            handleUpdateStatus(inc._id, verification),
        }));

        // Store initial incident IDs
        previousIncidentIdsRef.current = new Set(data.map((inc) => inc._id));
        setIncidents(withHandlers);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch incidents');
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, []);

  // Second useEffect: Poll for NEW incidents and notify
 /*  useEffect(() => {
    // Don't poll if notifications aren't supported or permission is denied
    if (permission === 'denied') {
      console.log('Notification permission denied, skipping polling');
      return;
    }

    const checkNewIncidents = async () => {
      try {
        const data: Incident[] = await sanityFetch({
          query: INCIDENTS_TABLE_QUERY,
        });
        const currentIds = new Set(data.map((inc) => inc._id));

        // Find truly NEW incidents (not in previous set)
        const newIncidents = data.filter(
          (inc) => !previousIncidentIdsRef.current.has(inc._id)
        );

        if (newIncidents.length > 0) {
          const now = Date.now();

          // Only notify if cooldown period has passed (prevents spam)
          if (now - lastNotificationTimeRef.current > NOTIFICATION_COOLDOWN) {
            const unverifiedNew = newIncidents.filter(
              (inc) => inc.verification === 'pending'
            );
            console.log(unverifiedNew);
            if (unverifiedNew.length > 0) {
              // This will show toast + browser notification (if permission granted)
              notify('New incidents require verification', {
                body: `${unverifiedNew.length} new incident(s) pending verification`,
                tag: 'new-incidents', // Prevents duplicate browser notifications
              });

              lastNotificationTimeRef.current = now;
            }
          }

          // Update tracked IDs
          previousIncidentIdsRef.current = currentIds;
        }
      } catch (err) {
        console.error(err);
      }
    };

    // Check immediately, then every 30 seconds
    checkNewIncidents();
    const interval = setInterval(checkNewIncidents, 30000);

    return () => clearInterval(interval);
  }, [notify, permission]); // ✅ Include notify and permission in dependencies
 */
  const handleUpdateStatus = async (
    id: string,
    verification: 'verified' | 'rejected'
  ) => {
    try {
      await updateIncidentStatus(id, verification);

      setIncidents((prev) =>
        prev.map((inc) =>
          inc._id === id ? { ...inc, status: verification, verification } : inc
        )
      );

      toast.success(`Incident ${verification}`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status');
    }
  };

  if (loading) return <p>Loading incidents...</p>;

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-semibold mb-4'>Incidents</h1>

      <DataTable columns={columns} data={incidents} />
      <IncidentMapClient incidents={incidents} />
    </div>
  );
}
