import { BombCell } from "./Cells/BombCell";
import { NormalCell } from "./Cells/NormalCell";
import { GameResultType } from "./Enums/GameResultType";
import { IBoard } from "./Interfaces/IBoard";
import { ICell } from "./Interfaces/ICell";
import { IGame } from "./Interfaces/IGame";
import { BombSignaler } from "./Signalers/BombSignaler";
import { EmptySignaler } from "./Signalers/EmptySignaler";

export class Board implements IBoard
{
    private _rows: number;
    private _columns: number;
    private _bombCount: number;

    private _cells: Array<Array<ICell>>;
    private _bombMap: Array<Array<boolean>> = [];
    private _bombs: BombCell[] = [];

    private EmptyCellSignaler: EmptySignaler = new EmptySignaler();
    private BombCellSignaler: BombSignaler = new BombSignaler();

    public constructor(rows: number, columns: number, bombCount: number) {
        this._rows = rows;
        this._columns = columns;
        this._bombCount = bombCount;
        this._cells = undefined as unknown as Array<Array<ICell>>;
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
    
    // Note: AI generated
    public Render(): string {
        const colHeaders = [...Array(this._columns).keys()]
            .map(c => `${c.toString().padStart(2)} `)
            .join('');
        
        const topBorder = `   +${'---+'.repeat(this._columns)}\n`;
        
        const rows = [...Array(this._rows).keys()].map(r => {
            const rowCells = [...Array(this._columns).keys()].map(c => {
                const cell = this._cells?.[r]?.[c]?.ToString?.() ?? ' ';
                return ` ${cell} |`;
            }).join('');
            return `${r.toString().padStart(2)} |${rowCells}\n${topBorder}`;
        }).join('');
    
        return `   ${colHeaders}\n${topBorder}${rows}`;
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
        this._bombMap = this.LocateBombs(rows, columns, bombs, firstClick);
        for (let r = 0; r < rows; r++) {
            this._cells[r] = new Array(columns);
            for (let c = 0; c < columns; c++) {
                // If the cell itself is a bomb, create a BombCell
                if (this._bombMap[r][c]) {
                    let newBomb = new BombCell(this.BombCellSignaler, [r, c]);
                    this._bombs.push(newBomb);
                    this._cells[r][c] = newBomb;
                }
                else {
                    // Otherwise, create a NormalCell with the number of adjacent bombs
                    let neighbor_bomb_count = 0;
                    for (let x = -1; x <= 1; x++) {
                        for (let y = -1; y <= 1; y++) {
                            if (r + x < 0 || r + x >= rows || c + y < 0 || c + y >= columns) continue;
                            if (this._bombMap[r + x][c + y]) neighbor_bomb_count++;
                        }
                    }
                    this._cells[r][c] = new NormalCell(this.EmptyCellSignaler, neighbor_bomb_count, [r, c]);
                }
            }
        }

        // Set up the signalers
        this.EmptyCellSignaler.SetCells(this._cells);
        this.BombCellSignaler.SetBombs(this._bombs);
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