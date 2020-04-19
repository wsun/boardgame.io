import { ProcessGameConfig } from '../core/game';
import { Game, Server, State, ActionShape, CredentialedActionShape, LogEntry, PlayerID } from '../types';
import * as StorageAPI from '../server/db/base';
export declare const getPlayerMetadata: (gameMetadata: Server.GameMetadata, playerID: string) => any;
/**
 * Redact the log.
 *
 * @param {Array} log - The game log (or deltalog).
 * @param {String} playerID - The playerID that this log is
 *                            to be sent to.
 */
export declare function redactLog(log: LogEntry[], playerID: PlayerID): {
    action: {
        payload: {
            args: any;
            type: string;
            playerID: string;
        } | {
            args: any;
            type: string;
            playerID: string;
        };
        type: "MAKE_MOVE";
    } | {
        payload: {
            args: any;
            type: string;
            playerID: string;
        } | {
            args: any;
            type: string;
            playerID: string;
        };
        type: "GAME_EVENT";
    };
    _stateID: number;
    turn: number;
    phase: string;
    automatic?: boolean;
}[];
/**
 * Verifies that the game has metadata and is using credentials.
 */
export declare const doesGameRequireAuthentication: (gameMetadata?: Server.GameMetadata) => boolean;
/**
 * Verifies that the move came from a player with the correct credentials.
 */
export declare const isActionFromAuthenticPlayer: (actionCredentials: string, playerMetadata?: Server.PlayerMetadata) => boolean;
declare type AuthFn = (actionCredentials: string, playerMetadata: Server.PlayerMetadata) => boolean | Promise<boolean>;
declare type CallbackFn = (arg: {
    state: State;
    gameID: string;
    action?: ActionShape.Any | CredentialedActionShape.Any;
}) => void;
/**
 * Master
 *
 * Class that runs the game and maintains the authoritative state.
 * It uses the transportAPI to communicate with clients and the
 * storageAPI to communicate with the database.
 */
export declare class Master {
    game: ReturnType<typeof ProcessGameConfig>;
    storageAPI: StorageAPI.Sync | StorageAPI.Async;
    transportAPI: any;
    subscribeCallback: CallbackFn;
    auth: null | AuthFn;
    shouldAuth: typeof doesGameRequireAuthentication;
    constructor(game: Game, storageAPI: any, transportAPI: any, auth?: AuthFn | boolean);
    subscribe(fn: CallbackFn): void;
    /**
     * Called on each move / event made by the client.
     * Computes the new value of the game state and returns it
     * along with a deltalog.
     */
    onUpdate(action: CredentialedActionShape.Any | ActionShape.Any, stateID: number, gameID: string, playerID: string): Promise<{
        error: string;
    }>;
    /**
     * Called when the client connects / reconnects.
     * Returns the latest game state and the entire log.
     */
    onSync(gameID: string, playerID: string, numPlayers: number, syncAll?: boolean): Promise<void>;
    markUserConnection(gameID: string, playerID: string, connected: boolean): Promise<void>;
}
export {};
