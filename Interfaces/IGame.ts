import { CellCommandType } from "../Enums/CellCommandType";
import { GameStatus } from "../Enums/GameStatus";

/**
 * Interface for the Game class.
 * This interface defines the methods and properties required for a Minesweeper game,
 * providing functionality to start a game, manage rounds, and handle cell commands.
 */
export interface IGame
{
    /**
     * The current status of the game.
     * @returns It can be Default as InProgress, Lost, or Won.
     */
    readonly Status: GameStatus;

    /**
     * Starts a new game with the specified parameters.
     * @param row The number of rows in the game board.
     * @param col The number of columns in the game board.
     * @param bombCount The number of bombs to place on the game board.
     */
    StartGame(row: number, col: number, bombCount: number): void;

    /**
     * Starts a new round in the game.
     */
    StartRound(): void;

    /**
     * Executes a command on a specific cell in the game.
     * @param row The row index of the cell to command.
     * @param col The column index of the cell to command.
     * @param commandType The type of command to execute on the cell.
     */
    CommandCell(row: number, col: number, commandType: CellCommandType): void;

    /**
     * Ends the current round in the game.
     */
    EndRound(): void;
}