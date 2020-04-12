import { Flow } from './flow';
import { INVALID_MOVE } from './reducer';
import { ActionPayload, Game, State } from '../types';
declare type ProcessedGame = Game & {
    flow: ReturnType<typeof Flow>;
    moveNames: string[];
    pluginNames: string[];
    processMove: (state: State, action: ActionPayload.MakeMove) => State | typeof INVALID_MOVE;
};
/**
 * Helper to generate the game move reducer. The returned
 * reducer has the following signature:
 *
 * (G, action, ctx) => {}
 *
 * You can roll your own if you like, or use any Redux
 * addon to generate such a reducer.
 *
 * The convention used in this framework is to
 * have action.type contain the name of the move, and
 * action.args contain any additional arguments as an
 * Array.
 */
export declare function ProcessGameConfig(game: Game | ProcessedGame): ProcessedGame;
export {};
