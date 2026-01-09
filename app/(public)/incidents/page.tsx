import { sanityFetch,SanityLive } from "@/sanity/lib/live";
import {INCIDENTS_LIST_QUERY } from '@/sanity/lib/queries';
import SearchForm from "@/components/shared/SearchForm";
import { IncidentType } from "@/components/shared/IncidentCard";
import IncidentCard from "@/components/shared/IncidentCard";
import ExportPDFButton from "@/components/shared/pdfGenerater";
export default async  function IncidentList({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
})  {
  
 const query = (await searchParams).query;
  const params = {search:query || null}
  const { data: posts } = await sanityFetch({ query: INCIDENTS_LIST_QUERY ,params});
    return (
      <>
       <section className='border px-6 py-4 flex justify-center flex-col items-center gap-7 mx-auto'>
              <h1 className="heading">All Incidents</h1>
               <div className='  w-[450px]'>
                 <SearchForm query={query} />
               </div>
               {/* <p className='text-30-semibold'>
                 {query ? `Search results for ${query}` : `All Incidents`}
               </p> */}
               <ul className='mt-7 card_grid'>
                 {posts && posts.length > 0 ? (
                   posts.map((post:IncidentType) => <IncidentCard key={post._id} post={post} />)
                 ) : (
                   <p className='no-results'>No incidents Found</p>
                 )}
               </ul>  
               {/* <ExportPDFButton data={posts} /> */}
             </section>
           
             <SanityLive />
      </>
    )
  }
  