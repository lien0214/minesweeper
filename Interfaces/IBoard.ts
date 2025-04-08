import { BoardStatus } from "../Enums/BoardStatus";

export interface IBoard
{
    readonly Status: BoardStatus
    ClickCell(row: number, col: number): void;
    PlaceFlag(row: number, col: number): void;
    Render(): string;
}