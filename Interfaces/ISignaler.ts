import { ICell } from "./ICell";

/**
 * Interface for the Signaler class.
 * This interface defines the methods required for signaling cells in the Minesweeper game.
 */
export interface ISignaler {
    /**
     * Signals a cell to reveal its contents.
     * @param cell The cell to signal.
     */
    Signal(cell: ICell): void;
}