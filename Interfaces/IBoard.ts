import { BoardStatus } from "../Enums/BoardStatus";

/**
 * Interface for the Board class.
 * This interface defines the methods and properties required for a Minesweeper board.
 * It is used for user to interact with the board, such as clicking cells and placing flags.
 */
export interface IBoard
{
    /**
     * The number of rows in the board.
     */
    readonly Status: BoardStatus

    /**
     * Clicks a cell on the board.
     */
    ClickCell(row: number, col: number): void;

    /**
     * Places a flag on a cell on the board.
     */
    PlaceFlag(row: number, col: number): void;

    /**
     * Renders the board as a string.
     * @returns A string representation of the board.
     */
    Render(): string;
}