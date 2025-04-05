import { CellCommandType } from "../Enums/CellCommandType";
import { GameResultType } from "../Enums/GameResultType";

export interface IGame
{
    StartGame(row: number, col: number, bombCount: number): void;
    StartRound(): void;
    CommandCell(row: number, col: number, commandType: CellCommandType): void;
    EndRound(): void;
    EndGame(resultType: GameResultType): void;
}