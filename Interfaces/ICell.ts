import { CellType } from "../Enums/CellType";

export interface ICell
{
    readonly Flagged: boolean;
    readonly Revealed: boolean;
    readonly CellType: CellType;

    Clicked(): void;
    PlaceFlag(): void;
    BombSignal(): void;
    EmptySignal(): void;
    ToString(): string;
}