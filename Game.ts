import { IBoard } from "./Interfaces/IBoard";
import { IGame } from "./Interfaces/IGame";
import { Board } from "./Board";
import { CellCommandType } from "./Enums/CellCommandType";
import { GameStatus } from "./Enums/GameStatus";
import { BoardStatus } from "./Enums/BoardStatus";

export class Game implements IGame
{
    private _board: IBoard;
    private _round: number = 0;
    private _status: GameStatus = GameStatus.Default;

    public get Status(): GameStatus { return this._status; }

    public constructor() {
        this._board = undefined as unknown as IBoard;
    }

    StartGame(row: number, col: number, bombCount: number): void {
        this._board = new Board(row, col, bombCount);
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
        if (this._board.Status !== BoardStatus.Default) {
            this._status = this._board.Status === BoardStatus.Win ? GameStatus.Win : GameStatus.Lose;
            this.EndGame();
            return;
        }
        console.log("Ending round " + this._round);
        this._round++;
    }
    private EndGame(): void {
        console.log("Game Over! Result: " + GameStatus[this._status]);
        console.log(this._board.Render());
    }
}