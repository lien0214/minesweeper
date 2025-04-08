import { CellCommandType } from "../Enums/CellCommandType";
import { GameStatus } from "../Enums/GameStatus";

export interface IGame
{
    readonly Status: GameStatus;
    StartGame(row: number, col: number, bombCount: number): void;
    StartRound(): void;
    CommandCell(row: number, col: number, commandType: CellCommandType): void;
    EndRound(): void;
}