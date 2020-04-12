import { Game } from '../types';
import { State } from '../types';
/**
 * Creates the initial game state.
 */
export declare function InitializeGame({ game, numPlayers, setupData, }: {
    game: Game;
    numPlayers: number;
    setupData?: any;
}): State;
