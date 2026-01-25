'use client';

import { usePushNotifications } from '@/hooks/use-push-notifications';
import { useEffect, useState, useRef } from 'react';
import { DataTable } from '@/app/tabel/data-table';
import { columns } from '@/app/tabel/columns';
import { sanityFetch } from '@/sanity/lib/client-fetch';
import {
  INCIDENTS_TABLE_QUERY,
  DASHBOARD_STATS_QUERY,
  INCIDENTS_TREND_QUERY,
} from '@/sanity/lib/queries';
import { updateIncidentStatus } from '@/components/updateIncidents';
import { toast } from 'sonner';
import IncidentMapClient from '@/components/shared/IncidentMapClient';
import { Incident } from '@/sanity/types';
import { VerificationChart } from '@/components/shared/VerificationChart';
import { IncidentsTrendChart } from '@/components/shared/IncidentsTrendChart';
import { StatCard } from '@/components/shared/StatCard';
export default function AdminIncidentsPage() {
  const { notify, permission, subscribe } = usePushNotifications(); 
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [incidentsData, setIncidentsData] = useState<any[]>([]);
  const [trendDates, setTrendDates] = useState<string[]>([]);
const [stats, setStats] = useState<any>(null);
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
        const date = await sanityFetch({
          query: DASHBOARD_STATS_QUERY,
        });
        setIncidentsData(date);
        const statsData = await sanityFetch({
        query: DASHBOARD_STATS_QUERY,
      });

      const trendData: { date: string }[] = await sanityFetch({
        query: INCIDENTS_TREND_QUERY,
      });

      setStats(statsData);
      setTrendDates(trendData.map((d) => d.date));
        const withHandlers = (data || []).map((inc: Incident) => ({
          ...inc,
          onUpdateStatus: async (verification: 'verified' | 'rejected') =>
            handleUpdateStatus(inc._id, verification),
        }));

        // Store initial incident IDs
        const initialIds = new Set(data.map((inc) => inc._id));
        previousIncidentIdsRef.current = initialIds;
        console.log(
          '🔵 Initial incidents loaded:',
          initialIds.size,
          'incidents'
        );
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
  useEffect(() => {
    if (permission === 'denied') return;

    const checkNewIncidents = async () => {
      try {
        const data: Incident[] = await sanityFetch({
          query: INCIDENTS_TABLE_QUERY,
        });

        const currentIds = new Set(data.map((inc) => inc._id));

        const newIncidents = data.filter(
          (inc) => !previousIncidentIdsRef.current.has(inc._id)
        );

        if (newIncidents.length > 0) {
          const now = Date.now();
          const timeSinceLastNotification =
            now - lastNotificationTimeRef.current;

          // Only notify if cooldown period has passed
          // Removed cooldown to ensure all new incidents are notified
          const unverifiedNew = newIncidents.filter(
            (inc) => inc.verification === 'pending'
          );

          if (unverifiedNew.length > 0) {
            notify('New incidents require verification', {
              body: `${unverifiedNew.length} new incident(s) pending verification`,
              tag: 'new-incidents',
            });

            lastNotificationTimeRef.current = now;
          }
        }

        // ✅ ALWAYS update reference
        previousIncidentIdsRef.current = currentIds;
      } catch (err) {
        console.error('❌ Error checking incidents:', err);
      }
    };

    checkNewIncidents();
    const interval = setInterval(checkNewIncidents, 30_000);

    return () => clearInterval(interval);
  }, [notify]);
  const handleUpdateStatus = async (
    id: string,
    verification: 'verified' | 'rejected'
  ) => {
    try {
      await updateIncidentStatus(id, verification);

      setIncidents((prev) =>
        prev.map((inc) => (inc._id === id ? { ...inc, verification } : inc))
      );

      toast.success(`Incident ${verification}`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status');
    }
  };

  if (loading) return <p>Loading incidents...</p>;

  return (
  <div className="p-6 space-y-6">
    <h1 className="text-2xl font-semibold">Incidents Dashboard</h1>

    {/* STAT CARDS */}
    {stats && (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total" value={stats.total} />
        <StatCard title="Pending" value={stats.pending} />
        <StatCard title="Verified" value={stats.verified} />
        <StatCard title="Rejected" value={stats.rejected} />
      </div>
    )}

    {/* CHARTS */}
    {stats && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IncidentsTrendChart dates={trendDates} />
        <VerificationChart
          verified={stats.verified}
          rejected={stats.rejected}
          pending={stats.pending}
        />
      </div>
    )}

    {/* TABLE */}
    <DataTable columns={columns} data={incidents} />

    {/* MAP */}
    <IncidentMapClient incidents={incidents} />
  </div>
)
}
