import { SyncInfo, State, LogEntry } from '../types';
/**
 * Generate a move to be dispatched to the game move reducer.
 *
 * @param {string} type - The move type.
 * @param {Array}  args - Additional arguments.
 * @param {string}  playerID - The ID of the player making this action.
 * @param {string}  credentials - (optional) The credentials for the player making this action.
 */
export declare const makeMove: (type: string, args?: any, playerID?: string, credentials?: string) => {
    type: "MAKE_MOVE";
    payload: {
        type: string;
        args: any;
        playerID: string;
        credentials: string;
    };
};
/**
 * Generate a game event to be dispatched to the flow reducer.
 *
 * @param {string} type - The event type.
 * @param {Array}  args - Additional arguments.
 * @param {string}  playerID - The ID of the player making this action.
 * @param {string}  credentials - (optional) The credentials for the player making this action.
 */
export declare const gameEvent: (type: string, args?: any, playerID?: string, credentials?: string) => {
    type: "GAME_EVENT";
    payload: {
        type: string;
        args: any;
        playerID: string;
        credentials: string;
    };
};
/**
 * Generate an automatic game event that is a side-effect of a move.
 * @param {string} type - The event type.
 * @param {Array}  args - Additional arguments.
 * @param {string}  playerID - The ID of the player making this action.
 * @param {string}  credentials - (optional) The credentials for the player making this action.
 */
export declare const automaticGameEvent: (type: string, args: any, playerID?: string, credentials?: string) => {
    type: "GAME_EVENT";
    payload: {
        type: string;
        args: any;
        playerID: string;
        credentials: string;
    };
    automatic: boolean;
};
export declare const sync: (info: SyncInfo) => {
    type: "SYNC";
    state: State;
    log: LogEntry[];
    initialState: State;
    clientOnly: true;
};
/**
 * Used to update the Redux store's state in response to
 * an action coming from another player.
 * @param {object} state - The state to restore.
 * @param {Array} deltalog - A log delta.
 */
export declare const update: (state: State, deltalog: LogEntry[]) => {
    type: "UPDATE";
    state: State;
    deltalog: LogEntry[];
    clientOnly: true;
};
/**
 * Used to reset the game state.
 * @param {object} state - The initial state.
 */
export declare const reset: (state: State) => {
    type: "RESET";
    state: State;
    clientOnly: true;
};
/**
 * Used to undo the last move.
 */
export declare const undo: () => {
    type: "UNDO";
};
/**
 * Used to redo the last undone move.
 */
export declare const redo: () => {
    type: "REDO";
};
/**
 * Allows plugins to define their own actions and intercept them.
 */
export declare const plugin: (type: string, args?: any, playerID?: string, credentials?: string) => {
    type: "PLUGIN";
    payload: {
        type: string;
        args: any;
        playerID: string;
        credentials: string;
    };
};
