'use client';

import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { List, Activity, Clock, Loader2 } from 'lucide-react';

import SearchForm from '@/components/shared/SearchForm';
import IncidentCard, { IncidentType } from '@/components/shared/IncidentCard';
import { Button } from '@/components/ui/button';
import { client } from '@/sanity/lib/client'; // Use the standard client for browser-side
import { INCIDENTS_LIST_QUERY, DASHBOARD_STATS_QUERY } from '@/sanity/lib/queries';

export default function Home() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';

// 1. Fetch Stats - Updates every 30 seconds
const { data: stats, isLoading: statsLoading } = useQuery({
  queryKey: ['dashboard-stats'],
  queryFn: async () => await client.fetch(DASHBOARD_STATS_QUERY),
  refetchInterval: 30000, // 30 seconds
  refetchIntervalInBackground: false, // Don't poll if the tab is minimized to save battery
});

// 2. Fetch Incidents - Updates every 30 seconds
const { data: posts, isLoading: incidentsLoading, isFetching } = useQuery({
  queryKey: ['incidents', query],
  queryFn: async () => {
    const params = { search: query || null };
    return await client.fetch(INCIDENTS_LIST_QUERY, params);
  },
  refetchInterval: 30000, 
});

  return (
    <>
      <section className='w-full min-h-[530px] flex justify-center items-center flex-col py-10 px-6 relative'>
        <div className='absolute inset-0 z-0'>
          <Image
            src='/incidentbg.jpg'
            alt='Background image'
            fill
            className='object-cover blur-sm'
            priority
          />
        </div>
        <div className='absolute inset-0 bg-black/20 z-10' />
        <h1 className='z-30 uppercase font-extrabold text-[#1E3A8A] sm:text-[54px] text-[36px] max-w-5xl text-center my-5'>
          Welcome to EOTC incident report platform
        </h1>
        <div className='z-30 w-full max-w-[735px] mx-auto px-4 my-28 flex justify-center'>
          <Button asChild variant='outline' className='font-medium text-white bg-[#3B82F6] h-[50px] rounded-full w-full max-w-[300px] border-0'>
            <Link href='/report'>Report incident</Link>
          </Button>
        </div>
      </section>

      {/* Stats Cards Section */}
      <div className='absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex justify-center w-full md:gap-20'>
        <StatCard 
          icon={<List className='text-orange-500 w-8 h-8' />} 
          label="Total incidents" 
          value={stats?.total} 
          loading={statsLoading} 
        />
        <StatCard 
          icon={<Activity className='text-orange-500 w-8 h-8' />} 
          label="Reports this week" 
          value={stats?.last7days} 
          loading={statsLoading}
          hideMobile
        />
        <StatCard 
          icon={<Clock className='text-orange-500 w-8 h-8' />} 
          label="Under review" 
          value={stats?.pending} 
          loading={statsLoading}
          hideMobile
        />
      </div>

      <section className='my-40 px-6 py-10 flex justify-center flex-col items-center gap-7 mx-auto'>
        <div className='w-full max-w-[450px]'>
          <SearchForm query={query} />
        </div>
        <p className='text-30-semibold'>
          {query ? `Search results for "${query}"` : `All Incidents`}
        </p>

        {incidentsLoading ? (
          <div className="flex flex-col items-center gap-2 mt-10">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
            <p>Loading incidents...</p>
          </div>
        ) : (
          <ul className='mt-7 card_grid'>
            {posts && posts.length > 0 ? (
              posts.map((post: IncidentType) => (
                <IncidentCard key={post._id} post={post} />
              ))
            ) : (
              <p className='no-results'>No incidents Found</p>
            )}
          </ul>
        )}
      </section>
    </>
  );
}

// Helper Sub-component for Stats
function StatCard({ icon, label, value, loading, hideMobile }: any) {
  return (
    <div className={`${hideMobile ? 'hidden md:flex' : 'flex'} shadow-md bg-white rounded-sm px-1 py-5 flex-col items-center justify-start gap-5 border border-gray-200 w-[180px] h-[200px]`}>
      <div>{icon}</div>
      <div className='flex flex-col items-center'>
        <span className='text-sm text-gray-600'>{label}</span>
      </div>
      {loading ? (
        <Loader2 className="animate-spin h-5 w-5 text-gray-400" />
      ) : (
        <span className='font-bold text-lg'>{value || 0}</span>
      )}
    </div>
  );
}