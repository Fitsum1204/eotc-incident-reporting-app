'use client';

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
