import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('user').title('user'),
       S.documentTypeListItem('incident').title('incident'),
        S.documentTypeListItem('pushSubscription').title('Push Subscription'),
  //S.documentTypeListItem('report').title('Reports'),
    ])
