import { ICell } from "./ICell";

export interface ISignaler {
    Signal(cell: ICell): void;
}