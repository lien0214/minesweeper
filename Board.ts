import { BombCell } from "./Cells/BombCell";
import { NormalCell } from "./Cells/NormalCell";
import { GameResultType } from "./Enums/GameResultType";
import { IBoard } from "./Interfaces/IBoard";
import { ICell } from "./Interfaces/ICell";
import { IGame } from "./Interfaces/IGame";

export class Board implements IBoard
{
    private _rows: number;
    private _columns: number;
    private _bombCount: number;
    private _game: IGame;

    private _cells: Array<Array<ICell>>;
    private _cellMap: Map<ICell, [number, number]> = new Map<ICell, [number, number]>();
    private _bombs: BombCell[] = [];

    public constructor(rows: number, columns: number, bombCount: number, game: IGame) {
        this._rows = rows;
        this._columns = columns;
        this._bombCount = bombCount;
        this._cells = undefined as unknown as Array<Array<ICell>>;
        this._game = game;
    }

    public ClickCell(row: number, col: number): void {
        if (this._cells === undefined) {
            this.GenerateBoard(this._rows, this._columns, this._bombCount, [row, col]);
        }
        this._cells[row][col].Clicked();
    }

    public PlaceFlag(row: number, col: number): void {
        if (this._cells === undefined) {
            this.GenerateBoard(this._rows, this._columns, this._bombCount, [row, col]);
        }
        this._cells[row][col].PlaceFlag();
    }

    public SignalBomb(): void {
        for (const bomb of this._bombs) {
            bomb.BombSignal();
        }
        this._game.EndGame(GameResultType.Lose);
    }

    public SignalEmpty(cell: ICell): void {
        const [row, col] = this._cellMap.get(cell) || [-1, -1];
        if (row === -1 || col === -1) {
            throw new Error("Cell not found in cell map.");
        }
        for (let r = -1; r <= 1; r++) {
            for (let c = -1; c <= 1; c++) {
                const newRow = row + r;
                const newCol = col + c;
                if (newRow < 0 || newRow >= this._rows || newCol < 0 || newCol >= this._columns) continue;
                const neighborCell = this._cells[newRow][newCol];
                if (neighborCell.Revealed) continue;
                neighborCell.EmptySignal();
            }
        }
    }

    public Render(): string {
        let result = "   "; // space for row labels
    
        // Column numbers
        for (let c = 0; c < this._columns; c++) {
            result += ` ${c.toString().padStart(2)} `;
        }
        result += "\n";
    
        // Top border
        result += "   +" + "---+".repeat(this._columns) + "\n";
    
        for (let r = 0; r < this._rows; r++) {
            // Row number
            result += r.toString().padStart(2) + " |";
    
            for (let c = 0; c < this._columns; c++) {
                let cellContent = " ";
                if (this._cells !== undefined) {
                    cellContent = this._cells[r][c].ToString();
                }
                result += ` ${cellContent.padEnd(1)} |`;
            }
    
            result += "\n";
            result += "   +" + "---+".repeat(this._columns) + "\n";
        }
    
        return result;
    }
    
    

    /**
     * Generates a board of cells with the specified number of rows, columns, and bombs.
     * The first click position is used to ensure that the first cell clicked is not a bomb.
     * @param rows The number of rows in the board.
     * @param columns The number of columns in the board.
     * @param bombs The number of the bombs to place on the board.
     * @param firstClick The position of the first click, used to avoid placing a bomb there.
     * @returns A 2D array of cells representing the board.
    */
    private GenerateBoard(rows: number, columns: number, bombs: number, firstClick: [number, number]): void {
        this._cells = new Array(rows);
        const bombBoard: Array<Array<boolean>> = this.LocateBombs(rows, columns, bombs, firstClick);
        for (let r = 0; r < rows; r++) {
            this._cells[r] = new Array(columns);
            for (let c = 0; c < columns; c++) {
                // If the cell itself is a bomb, create a BombCell
                if (bombBoard[r][c]) {
                    let newBomb = new BombCell(this);
                    this._bombs.push(newBomb);
                    this._cells[r][c] = newBomb;
                }
                else {
                    // Otherwise, create a NormalCell with the number of adjacent bombs
                    let neighbor_bomb_count = 0;
                    for (let x = -1; x <= 1; x++) {
                        for (let y = -1; y <= 1; y++) {
                            if (r + x < 0 || r + x >= rows || c + y < 0 || c + y >= columns) continue;
                            if (bombBoard[r + x][c + y]) neighbor_bomb_count++;
                        }
                    }
                    this._cells[r][c] = new NormalCell(this, neighbor_bomb_count);
                }
                
                this._cellMap.set(this._cells[r][c], [r, c]);
            }
        }
    }

    /**
     * Randomly locates bombs on the board, ensuring that the first click position is not a bomb.
     * @param rows The number of rows in the board.
     * @param columns The number of columns in the board.
     * @param bombs The number of the bombs to place on the board.
     * @param firstClick The position of the first click, used to avoid placing a bomb there.
     * @returns A 2D array of booleans representing the bomb locations on the board.
     *          `true` indicates a bomb, and `false` indicates no bomb.
    */
    private LocateBombs(rows: number, columns: number, bombs: number, firstClick: [number, number]): Array<Array<boolean>> {
        const result: Array<Array<boolean>> = new Array(rows);
        for (let i = 0; i < rows; i++) {
            result[i] = new Array(columns).fill(false);
        }
        
        // shuffle the indices
        const indices: Array<number> = Array.from({ length: rows * columns }, (_, i) => i);
        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }

        // pick the first `bombs` indices
        // Ensure the first click is not a bomb
        for (let i = 0, count = bombs; i < count; i++) {
            const index = indices[i];
            const row = Math.floor(index / columns);
            const col = index % columns;
            // Ensure the bomb is not placed on the first click
            if (row === firstClick[0] && col === firstClick[1]) {
                count++;
                continue;
            }
            result[row][col] = true;
        }

        return result;
    }
}