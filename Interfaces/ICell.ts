import { CellType } from "../Enums/CellType";

/**
 * Interface for the Cell class.
 */
export interface ICell
{
    /**
     * If the cell is flagged.
     */
    readonly Flagged: boolean;
    
    /**
     * If the cell is revealed.
     */
    readonly Revealed: boolean;

    /**
     * * The type of the cell.
     */
    readonly CellType: CellType;

    /**
     * The position on the board.
     */
    readonly Position: [number, number];

    /**
     * Being clicked on.
     */
    Clicked(): void;

    /**
     * Toggle the flag on the cell.
    */
    PlaceFlag(): void;

    /**
     * Receive a signal from other bomb cell.
     */
    BombSignal(): void;

    /**
     * Receive a signal from other empty cell.
     */
    EmptySignal(): void;

    /**
     * Convert the cell to a string representation.
     * @returns A string representation of the cell.
     */
    ToString(): string;
}