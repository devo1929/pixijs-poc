import { FPGame } from './fp-game';

export class GameController {
    private static _gameInstance: FPGame;

    public static getGameInstance<T extends unknown>(): T {
        return GameController._gameInstance as T;
    }

    public static setGameInstance(g: FPGame) {
        GameController._gameInstance = g;
    }

    public static gotoScene(name: string): boolean {
        if (!GameController._gameInstance) {
            return false;
        }

        return GameController.getGameInstance<any>().gotoScene(name);
    }
}