import { Plugin, PlayerID } from '../types';
interface PlayerData {
    players: Record<PlayerID, any>;
}
export interface PlayerAPI {
    state: Record<PlayerID, any>;
    get(): any;
    set(value: any): any;
    opponent?: {
        get(): any;
        set(value: any): any;
    };
}
interface PluginPlayerOpts {
    setup?: (playerID: string) => any;
}
/**
 * Plugin that maintains state for each player in G.players.
 * During a turn, G.player will contain the object for the current player.
 * In two player games, G.opponent will contain the object for the other player.
 *
 * @param {function} initPlayerState - Function of type (playerID) => playerState.
 */
declare const PlayerPlugin: ({ setup }?: PluginPlayerOpts) => Plugin<PlayerAPI, PlayerData>;
export default PlayerPlugin;
