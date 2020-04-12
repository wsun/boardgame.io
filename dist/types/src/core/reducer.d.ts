import { ActionShape, Game, State } from '../types';
/**
 * Moves can return this when they want to indicate
 * that the combination of arguments is illegal and
 * the move ought to be discarded.
 */
export declare const INVALID_MOVE = "INVALID_MOVE";
/**
 * CreateGameReducer
 *
 * Creates the main game state reducer.
 */
export declare function CreateGameReducer({ game, isClient, }: {
    game: Game;
    isClient?: boolean;
}): (state: State, action: ActionShape.Any) => State;
