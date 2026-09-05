import rawStore from './store.json';
import { storeSchema } from './schema';
import { assertUnique } from './validation';

export const storeConfig = storeSchema.parse(rawStore);
assertUnique(storeConfig.footer.socialLinks.map((link) => link.id), 'IDs de red social');
