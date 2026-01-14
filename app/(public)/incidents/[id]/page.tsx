import Image from 'next/image';
import { sanityFetch, SanityLive } from '@/sanity/lib/live';
import { INCIDENT_QUERY } from '@/sanity/lib/queries';
import { IncidentType } from '@/components/shared/IncidentCard';
import IncidentCard from '@/components/shared/IncidentCard';
import { notFound } from 'next/navigation';
import ExportPDFButton from '@/components/shared/pdfGenerater';
import { Key } from 'react';
//export const experrimental_ppr = true;
export default async function IncidentDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const { data: posts } = await sanityFetch({
    query: INCIDENT_QUERY,
    params: { id },
  });
  if (!posts) return notFound();
  {
    console.log(posts);
  }
  return (
    <>
      <div className='max-w-3xl mx-auto px-4 py-10'>
        {/* Title */}
        <h1 className='text-3xl font-bold tracking-tight text-gray-900 mb-4'>
          {posts.title}
        </h1>

        {/* Image */}
        {posts.image ? (
          <div className='relative w-full h-64 sm:h-80 md:h-96 overflow-hidden rounded-xl mb-6'>
            <Image
              src={posts.image}
              alt={posts.title ?? 'Incident image'}
              fill
              className='object-cover'
              sizes='(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1200px'
              priority
            />
          </div>
        ) : null}

        {/* Metadata */}
        <div className='flex flex-wrap gap-24 text-sm text-gray-600 mb-6'>
          <span className='px-3 py-1 rounded-full bg-gray-100 text-gray-800'>
            {posts.category}
          </span>

          <span className='flex items-center gap-1'>
            <span className='font-medium'>Location:</span> {posts.location}
          </span>

          <span className='flex items-center gap-1'>
            <span className='font-medium'>Author:</span> {posts.author?.name}
          </span>

          <span className='flex items-center gap-1'>
            <span className='font-medium'>Created:</span>
            {new Date(posts._createdAt).toLocaleDateString()}
          </span>
        </div>
        <div className='flex flex-row gap-6 mb-6'>
          <i>Status: </i>
          <b
            className={`
    ${posts.verification === 'pending' ? 'text-amber-600' : ''}
    ${posts.verification === 'verified' ? 'text-green-600' : ''}
    ${posts.verification === 'rejected' ? 'text-red-600' : ''}
  `}
          >
            {posts.verification}
          </b>
        </div>
        {/* Description Card */}
        <div className='bg-white shadow-sm rounded-xl p-5 border border-gray-200 mb-8'>
          <h2 className='text-xl font-semibold text-gray-900 mb-3'>
            Description
          </h2>
          <p className='text-gray-700 leading-relaxed'>{posts.description}</p>
        </div>

        {/* Attachments */}
        {posts.attachments?.length > 0 && (
          <div className='bg-white shadow-sm rounded-xl p-5 border border-gray-200'>
            <h2 className='text-xl font-semibold text-gray-900 mb-3'>
              Attachments
            </h2>

            <div className='space-y-2'>
              {posts.attachments.map((att: string | undefined, i: number) => (
                <a
                  key={i}
                  href={att ?? '#'}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='block text-blue-600 hover:underline'
                  aria-disabled={!att}
                >
                  Attachment {i + 1}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className='flex justify-between items-center  m-6'>
        <ExportPDFButton data={posts} />
      </div>
      {/* Related Incidents */}

      {/* Related Incidents */}
      {posts.relatedIncidents && posts.relatedIncidents.length > 0 && (
        <h1>Related incidents</h1>
      )}
    </>
  );
}
{
  /*<SanityLive />*/
}
{
  /* <section className='border px-6 py-4 flex justify-center flex-col items-center gap-7 mx-auto'>
              <h1 className="heading">All Incidents</h1>

               <ul className='mt-7 card_grid'>
                 {posts && posts.length > 0 ? (
                   posts.map((post:IncidentType) => <IncidentCard key={post._id} post={post} />)
                 ) : (
                   <p className='no-results'>No incidents Found</p>
                 )}
               </ul>
             </section>
             <SanityLive /> */
}
