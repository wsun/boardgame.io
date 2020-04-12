import * as StorageAPI from './base';
import { State, Server, LogEntry } from '../../types';
/**
 * FlatFile data storage.
 */
export declare class FlatFile extends StorageAPI.Async {
    private games;
    private dir;
    private logging?;
    private ttl?;
    constructor({ dir, logging, ttl, }: {
        dir: string;
        logging?: boolean;
        ttl?: boolean;
    });
    connect(): Promise<void>;
    createGame(gameID: string, opts: StorageAPI.CreateGameOpts): Promise<void>;
    fetch<O extends StorageAPI.FetchOpts>(gameID: string, opts: O): Promise<StorageAPI.FetchResult<O>>;
    clear(): Promise<{}>;
    setState(id: string, state: State, deltalog?: LogEntry[]): Promise<void>;
    setMetadata(id: string, metadata: Server.GameMetadata): Promise<void>;
    wipe(id: string): Promise<void>;
    listGames(): Promise<string[]>;
}
