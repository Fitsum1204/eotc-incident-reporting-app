import {formateDate} from '@/lib/utils'
//import {EyeIcon} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button';
import { Incident ,User} from '@/sanity/types';
import { urlFor } from '@/sanity/lib/image';

export type IncidentType = Omit<Incident, 'author'> & {author:User}
const IncidentCard = ({post}:{post:IncidentType}) => {
  
 

// helper inside IncidentCard file
      const getImageSrc = (post: any) => {
        // 1) If query returned a direct URL string
        if (typeof post.image === 'string' && post.image.trim() !== '') return post.image;
        if (typeof post.imageUrl === 'string' && post.imageUrl.trim() !== '') return post.imageUrl;

        // 2) If query returned an image object (mainImage or imageObj) — use urlFor
        const imageObj = post.imageObj || post.mainImage || post.image;
        if (imageObj && typeof imageObj === 'object') {
          try {
            return urlFor(imageObj).width(400).height(200).url();
          } catch (err) {
            console.warn('urlFor failed', err);
          }
        }

        // 3) fallback static image
        return '/incidentbg.jpg';
      };
const src = getImageSrc(post);

  return (
  
    <li className="incident-card ">
        <Link href={`/incidents/${post._id}`}>
        <Image
          src={src}
          alt={post.title || 'Incident image'}
          className="incident-card_img"
          layout="responsive"
          width={200}
          height={100}
        />    
        </Link>
        <div className='mt-2 mx-6 gap-0'>
          <div className='flex-1 mx-2'>
             {/*  <Link href={`/user/${post.author?._id}`}>
                <p className='text-16 line-clamp-1'>{post.author.name}</p>
              </Link> */}
              <Link href={`/incidents/${post._id}`}>
              <h3 className="text-26-semibold m-2 font-medium  line-clamp-1">{post.title}</h3>
              <p className="incident-card_desc">{post.description}</p>
            </Link>
            </div>
           {/*  <Link href={`/user/${post.author?._id}`}>
                  <Image
                    src={post.author?.image || "/default-avatar.png"}
                    alt={post.author?.name || "Default Author"}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
              </Link> */}
        </div>
        <div className="flex flex-row justify-between items-center px-4 mt-2 mx-6">
            <p className='incident_card_date'>
                Date of Incident:
            </p>
            <p className='incident_card_date'>
                {formateDate(post?.date)}
            </p>
           {/*  <div className='flex items-end gap-1.5'>
              <EyeIcon className='size-6 text-primary'/>
              <span className='text-16-medium'>{post.views}</span>
            </div> */}
        </div>
         <div className="flex flex-row gap-0 justify-between items-center px-6 mt-2 mx-6">
  <i>Status: </i>
  <b className={`
    ${post.verification === 'pending' ? 'text-amber-400' : ''}
    ${post.verification === 'verified' ? 'text-green-600' : ''}
    ${post.verification === 'rejected' ? 'text-red-600' : ''}
  `}>
    {post.verification}
  </b>
</div>
        <div className="flex justify-between items-center flex-between gap-3 mt-5">
          <Link href={`/?query=${post.category?.toLowerCase()}`}>
          <p className="category_btn">{post.category}</p>
          </Link>
          <Button className="incident-card_btn hover:bg-[#753131]" asChild>
          <Link href={`/incidents/${post._id}`}>View Details</Link>
          </Button>
      </div>
         
    </li>
  )
}

export default IncidentCard