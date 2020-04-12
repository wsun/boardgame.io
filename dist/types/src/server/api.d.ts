import Koa from 'koa';
import * as StorageAPI from './db/base';
import { Server, Game } from '../types';
/**
 * Creates a new game.
 *
 * @param {object} db - The storage API.
 * @param {object} game - The game config object.
 * @param {number} numPlayers - The number of players.
 * @param {object} setupData - User-defined object that's available
 *                             during game setup.
 * @param {object } lobbyConfig - Configuration options for the lobby.
 */
export declare const CreateGame: (db: StorageAPI.Sync | StorageAPI.Async, game: Game, numPlayers: number, setupData: object, lobbyConfig: Server.LobbyConfig) => Promise<string>;
export declare const createApiServer: ({ db, games, lobbyConfig, generateCredentials, }: {
    db: any;
    games: any;
    lobbyConfig?: Server.LobbyConfig;
    generateCredentials?: Server.GenerateCredentials;
}) => Koa<Koa.DefaultState, Koa.DefaultContext>;
export declare const addApiToServer: ({ app, db, games, lobbyConfig, generateCredentials, }: {
    app: Koa<Koa.DefaultState, Koa.DefaultContext>;
    games: Game[];
    lobbyConfig?: Server.LobbyConfig;
    generateCredentials?: Server.GenerateCredentials;
    db: StorageAPI.Sync | StorageAPI.Async;
}) => Koa<Koa.DefaultState, Koa.DefaultContext>;
