import { ICell } from "./ICell";

export interface IBoard
{
    ClickCell(row: number, col: number): void;
    PlaceFlag(row: number, col: number): void;
    Render(): string;
}