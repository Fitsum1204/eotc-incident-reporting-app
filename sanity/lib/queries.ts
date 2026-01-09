import { defineQuery } from "next-sanity";

export const POSTS_QUERY = defineQuery(`*[
  _type == "incident"
  && (
    !defined($search)
    || title match $search
    || category match $search
    || author->name match $search
  )
] | order(_createdAt desc){
  _id,
  _createdAt,
  views,
  title,
  description,
  location,
  category,
  "image": image.asset->url,
  "attachments": attachments[] {
    _type == "image" => image.asset->url,
    _type == "file"  => asset->url
  },
  "author": author->{ _id, name, "image": image.asset->url },
   verification
}`);
export const INCIDENTS_LIST_QUERY = `*[_type == "incident"  && (
    !defined($search)
    || title match $search
    || category match $search
    || author->name match $search
  )] | order(_createdAt desc){
  _id,
  _createdAt,
  views,
  title,
  description,
  location,
  date,
  category,
   verification,
  author->{_id, name, "imageUrl": image.asset->url},
  // image object (preferred) and url fallback
  "imageObj": coalesce(mainImage, attachments[_type == "image"][0]),
  "imageUrl": coalesce(mainImage.asset->url, attachments[_type == "image"][0].asset->url)
}`;
export const INCIDENT_QUERY = defineQuery(`*[_type == "incident" && _id == $id][0]{
  _id,
  _createdAt,
  views,
  title,
  description,
  location,
  category,
   verification,
  date,
  locationPoint,
  "image": coalesce(mainImage.asset->url, attachments[_type == "image"][0].asset->url),
  "attachments": attachments[] {
    _type,
    "url": coalesce(image.asset->url, asset->url)
  },
  "author": author->{ _id, name, "image": image.asset->url }
}
`);

export const AUTHOR_BY_GOOGLE_ID_QUERY = defineQuery(`*[_type == "user" && googleId == $googleId][0]{
  _id,
  googleId,
  name,
  role,
  image 
}`);
export const USER_BY_EMAIL_QUERY =defineQuery( `
*[_type == "user" && email == $email][0]{
 _id,
 email,
 password,
  name,
  role,
  image,
  provider 
}
`);
export const INCIDENTS_TABLE_QUERY = defineQuery(`
  *[_type == "incident"] | order(_createdAt desc) {
    _id,
    title,
    category,
    location,
    verification,
    date,  // keep if you still want to display the custom date
  
    "image": coalesce(
      mainImage.asset->url,
      attachments[_type == "image"][0].asset->url
    ),
    "authorName": author->name,
    locationPoint,
  }
`);
 {/*locationPoint*/}
export const DASHBOARD_STATS_QUERY = `
{
  "total": count(*[_type == "incident"]),
  "pending": count(*[_type == "incident" && verification == "pending"]),
  "verified": count(*[_type == "incident" && verification == "verified"]),
  "rejected": count(*[_type == "incident" && verification == "rejected"]),
  
  "today": count(*[
  _type == "incident" &&
  dateTime(_createdAt) >= dateTime(now()) - 60*60*24
]),
  
  "last7days": count(*[
  _type == "incident" && 
  dateTime(_createdAt) >= dateTime(now()) - 60*60*24*7
]),
  
  "last30days": count(*[
  _type == "incident" &&
  dateTime(_createdAt) >= dateTime(now()) - 60*60*24*30
]),
}
`;

// sanity/lib/dashboard-queries.ts

export const INCIDENTS_TREND_QUERY = `
*[_type == "incident"]{
  "date": date
}
`;

// sanity/lib/user-queries.ts
export const USERS_QUERY = `
*[_type == "user"] | order(_createdAt desc) {
  _id,
  name,
  email,
  image,
  role,
  isActive,
  _createdAt
}
`


/* *[_type == "incident" && _id == $id][0]{
  _id,
  _createdAt,
  views,
  title,
  description,
  location,
  category,
  "image": image.asset->url,
  "attachments": attachments[] {
    _type == "image" => image.asset->url,
    _type == "file"  => asset->url
  },
  "author": author->{ _id, name, "image": image.asset->url }
} */