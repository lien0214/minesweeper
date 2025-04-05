import { IBoard } from "./Interfaces/IBoard";
import { IGame } from "./Interfaces/IGame";
import { Board } from "./Board";
import { CellCommandType } from "./Enums/CellCommandType";
import { GameResultType } from "./Enums/GameResultType";

export class Game implements IGame
{
    private _board: IBoard;
    private _round: number = 0;

    public constructor() {
        this._board = undefined as unknown as IBoard;
    }

    StartGame(row: number, col: number, bombCount: number): void {
        this._board = new Board(row, col, bombCount, this);
    }
    StartRound(): void {
        console.log("Starting round " + this._round);
        console.log(this._board.Render());
    }
    CommandCell(row: number, col: number, cellCommandType: CellCommandType): void {
        if (cellCommandType === CellCommandType.ClickCell) {
            this._board.ClickCell(row, col);
        }
        else {
            this._board.PlaceFlag(row, col);
        }
        console.log(this._board.Render());
    }
    EndRound(): void {
        console.log("Ending round " + this._round);
        this._round++;
    }
    EndGame(resultType: GameResultType): void {
        console.log("Game Over! Result: " + GameResultType[resultType]);
    }
}