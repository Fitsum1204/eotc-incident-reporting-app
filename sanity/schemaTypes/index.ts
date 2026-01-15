import { type SchemaTypeDefinition } from 'sanity'
import {user} from './user'
import {incident} from './incident'
import { pushSubscription } from './pushSubscription';
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [user,incident,  pushSubscription],
}

