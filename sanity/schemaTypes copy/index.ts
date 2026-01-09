import { type SchemaTypeDefinition } from 'sanity'
import {user} from './user'
import {incident} from './incident'
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [user,incident ],
}

