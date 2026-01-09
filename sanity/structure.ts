import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('user').title('User'),
       S.documentTypeListItem('incident').title('Incidents'),
  //S.documentTypeListItem('report').title('Reports'),
    ])
