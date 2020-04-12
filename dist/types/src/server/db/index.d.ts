import { InMemory } from './inmemory';
import { FlatFile } from './flatfile';
declare const DBFromEnv: () => InMemory | FlatFile;
export { InMemory, FlatFile, DBFromEnv };
