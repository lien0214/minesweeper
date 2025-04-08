import { ICell } from "./ICell";

export interface IBoardGenerator {
    GenerateBoard(rows: number, columns: number, bombs: number, firstClick: [number, number]): Array<Array<ICell>>;
    LocateBombs(rows: number, columns: number, bombs: number, firstClick: [number, number]): Array<Array<boolean>>;
}