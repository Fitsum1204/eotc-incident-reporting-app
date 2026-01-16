import SearchForm from '@/components/shared/SearchForm';
import { Button } from '@/components/ui/button';
import { List, Activity, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import IncidentCard, { IncidentType } from '@/components/shared/IncidentCard';
import { sanityFetch, SanityLive } from '@/sanity/lib/live';
import {
  INCIDENTS_LIST_QUERY,
  DASHBOARD_STATS_QUERY,
} from '@/sanity/lib/queries';

import { auth } from '@/auth';
export const revalidate = 0;
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;
  const params = { search: query || null };
  const { data: posts } = await sanityFetch({
    query: INCIDENTS_LIST_QUERY,
    params,
  });
  const stats = await sanityFetch({
    query: DASHBOARD_STATS_QUERY,
  });
  const session = await auth();
  return (
    <>
      <section className='w-full min-h-[530px] flex justify-center items-center flex-col py-10 px-6 relative'>
        <div className='absolute inset-0 z-0'>
          <Image
            src='/incidentbg.jpg'
            alt='Blurred background image'
            fill
            className='object-cover blur-sm'
            priority
          />
        </div>
        <div className='absolute inset-0 bg-black/20 z-10 ' />
        <h1 className='z-30 uppercase  shadow-1xl px-6 py-3 font-extrabold text-[#1E3A8A] sm:text-[54px] sm:leading-[64px] text-[36px] leading-[46px] max-w-5xl text-center my-5 rounded-sm '>
          Welcome to EOTC incident report platform
        </h1>
        <div className='z-30 w-full max-w-[735px] mx-auto px-4 my-28'>
          <div className='flex justify-center w-full'>
            <Button
              asChild
              variant='outline'
              className='z-30 font-medium text-[15px] text-white bg-[#3B82F6] h-[50px] rounded-full w-full  w- max-w-[300px]  border-0'
            >
              <Link
                href='/report'
                className='w-full h-full flex items-center justify-center'
              >
                Report incident
              </Link>
            </Button>
          </div>
        </div>
      </section>
      {/*Small card*/}
      <div className='absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex justify-center  w-full md:gap-20'>
        <div className=' shadow-md bg-white rounded-sm px-1 py-5 flex flex-col items-center justify-start gap-5 border border-gray-200 w-[250px] h-[200px] md:w-[180px] md:h-[200px]'>
          <div className='flex items-center justify-center'>
            <List className='text-orange-500 w-8 h-8' />
          </div>

          <div className='flex flex-col justify-center items-center'>
            <span className='text-sm text-gray-600'>Total incidents</span>
          </div>
          <span className='font-bold text-lg'>{stats.data.total}</span>
        </div>

        <div className='hidden md:flex shadow-md bg-white rounded-sm w-[180px] h-[200px] px-1 py-5 flex-col items-center justify-start gap-5 border border-gray-200'>
          <div className='flex items-center justify-center'>
            <Activity className='text-orange-500 w-8 h-8' />
          </div>
          <div className='flex flex-col justify-center items-center gap-4'>
            <span className='text-sm text-gray-600'>Reports in this week</span>
            <span className='font-bold text-lg'>{stats.data.last7days}</span>
          </div>
        </div>

        <div className='hidden md:flex shadow-md bg-white rounded-sm px-1 py-5 flex flex-col items-center justify-start gap-5 border border-gray-200 w-[250px] h-[200px] md:w-[180px] md:h-[200px]'>
          <div className='flex items-center justify-center'>
            <Clock className='text-orange-500 w-8 h-8' />
          </div>
          <div className='flex flex-col justify-center items-center gap-4'>
            <span className='text-sm text-gray-600'>Under review</span>
            <span className='font-bold text-lg'>{stats.data.pending}</span>
          </div>
        </div>
      </div>

      <section className='my-40 border px-6 py-10 flex justify-center flex-col items-center gap-7 mx-auto'>
        <div className='  w-[450px]'>
          <SearchForm query={query} />
        </div>
        <p className='text-30-semibold'>
          {query ? `Search results for ${query}` : `All Incidents`}
        </p>

        <ul className='mt-7 card_grid'>
          {posts && posts.length > 0 ? (
            posts.map((post: IncidentType) => (
              <IncidentCard key={post._id} post={post} />
            ))
          ) : (
            <p className='no-results'>No incidents Found</p>
          )}
        </ul>
      </section>
      <SanityLive />
    </>
  );
}
