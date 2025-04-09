import { ICell } from "./ICell";

/**
 * Interface for generating a Minesweeper board.
 * This interface defines the methods required to generate a board of cells,
 */
export interface IBoardGenerator {
    /**
     * Generates a Minesweeper board with the specified size and number of bombs.
     * @param size The size of the board, represented as a tuple of [rows, columns].
     * @param bombs The number of the bombs on the board.
     * @param firstClick The first click on the board, usually used to avoid placing a bomb there.
     * @returns A 2D array of cell object representing the board.
     */
    GenerateBoard(size: [number, number], bombs: number, firstClick: [number, number]): Array<Array<ICell>>;
    
    /**
     * Generates a 2D array of boolean values representing the locations of bombs on the board.
     * @param size The size of the board, represented as a tuple of [rows, columns].
     * @param bombs The number of the bombs to place on the board.
     * @param firstClick The first click on the board, used to avoid placing a bomb there.
     * @returns A 2D array of booleans representing the bomb locations on the board.
     */
    LocateBombs(size: [number, number], bombs: number, firstClick: [number, number]): Array<Array<boolean>>;
}