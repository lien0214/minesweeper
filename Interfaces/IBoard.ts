import { ICell } from "./ICell";

export interface IBoard
{
    SignalEmpty(cell: ICell): void;
    SignalBomb(): void;
    ClickCell(row: number, col: number): void;
    PlaceFlag(row: number, col: number): void;
    Render(): string;
}