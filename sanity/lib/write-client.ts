import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId,token } from '../env'

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Set to false if statically generating pages, using ISR or tag-based revalidation
  token, // Add the token for write operations
})
if(!writeClient.config().token){
    throw new Error('Sanity write client is missing the token configuration.')
}