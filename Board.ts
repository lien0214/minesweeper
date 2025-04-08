import { BombCell } from "./Cells/BombCell";
import { NormalCell } from "./Cells/NormalCell";
import { BoardStatus } from "./Enums/BoardStatus";
import { IBoard } from "./Interfaces/IBoard";
import { IBoardGenerator } from "./Interfaces/IBoardGenerator";
import { ICell } from "./Interfaces/ICell";
import { BombSignaler } from "./Signalers/BombSignaler";
import { EmptySignaler } from "./Signalers/EmptySignaler";

export class Board implements IBoard, IBoardGenerator
{
    private _rows: number;
    private _columns: number;
    private _bombCount: number;
    private _safeCells: number;
    private _status: BoardStatus;

    private _cells: Array<Array<ICell>>;

    private EmptyCellSignaler: EmptySignaler = new EmptySignaler();
    private BombCellSignaler: BombSignaler = new BombSignaler();

    private _safeCellDecrement: () => void = () => {
        this._safeCells--;
        if (this._safeCells === 0) {
            this._status = BoardStatus.Win;
        }
    }
    private _bombExplosion: () => void = () => { this._status = BoardStatus.Lose; };

    public get Status(): BoardStatus { return this._status; }

    public constructor(rows: number, columns: number, bombCount: number) {
        this._status = BoardStatus.Default;
        this._rows = rows;
        this._columns = columns;
        this._bombCount = bombCount;
        this._safeCells = rows * columns - bombCount;
        this._cells = undefined as unknown as Array<Array<ICell>>;
    }

    public ClickCell(row: number, col: number): void {
        if (this._cells === undefined) {
            this._cells = this.GenerateBoard(this._rows, this._columns, this._bombCount, [row, col]);
        }
        this._cells[row][col].Clicked();
    }

    public PlaceFlag(row: number, col: number): void {
        if (this._cells === undefined) {
            this._cells = this.GenerateBoard(this._rows, this._columns, this._bombCount, [row, col]);
        }
        this._cells[row][col].PlaceFlag();
    }
    
    // Note: AI generated for Console UI
    public Render(): string {
        const cellWidth = 3;
        const colHeaders = [...Array(this._columns).keys()]
            .map(c => c.toString().padStart(cellWidth, ' '))
            .join(' ');
    
        const horizontalBorder = `   +${'---+'.repeat(this._columns)}\n`;
    
        const rows = [...Array(this._rows).keys()].map(r => {
            const rowCells = [...Array(this._columns).keys()].map(c => {
                const cell = this._cells?.[r]?.[c]?.ToString?.() ?? ' ';
                return ` ${cell.toString().padEnd(1, ' ')} `;
            }).map(cell => `|${cell}`).join('') + '|\n';
    
            return `${r.toString().padStart(2)} ${rowCells}${horizontalBorder}`;
        }).join('');
    
        return `   ${colHeaders}\n${horizontalBorder}${rows}`;
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
    public GenerateBoard(rows: number, columns: number, bombs: number, firstClick: [number, number]): Array<Array<ICell>> {
        let cellMap: Array<Array<ICell>> = new Array(rows);
        let bompMap = this.LocateBombs(rows, columns, bombs, firstClick);
        let bombList: Array<BombCell> = new Array();
        for (let r = 0; r < rows; r++) {
            cellMap[r] = new Array(columns);
            for (let c = 0; c < columns; c++) {
                // If the cell itself is a bomb, create a BombCell
                if (bompMap[r][c]) {
                    let newBomb = new BombCell(this.BombCellSignaler, [r, c], this._bombExplosion);
                    bombList.push(newBomb);
                    cellMap[r][c] = newBomb;
                }
                else {
                    // Otherwise, create a NormalCell with the number of adjacent bombs
                    let neighbor_bomb_count = 0;
                    for (let x = -1; x <= 1; x++) {
                        for (let y = -1; y <= 1; y++) {
                            if (r + x < 0 || r + x >= rows || c + y < 0 || c + y >= columns) continue;
                            if (bompMap[r + x][c + y]) neighbor_bomb_count++;
                        }
                    }
                    cellMap[r][c] = new NormalCell(this.EmptyCellSignaler, neighbor_bomb_count, [r, c], this._safeCellDecrement);
                }
            }
        }

        // Set up the signalers
        this.EmptyCellSignaler.SetCells(cellMap);
        this.BombCellSignaler.SetBombs(bombList);
        return cellMap;
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
    public LocateBombs(rows: number, columns: number, bombs: number, firstClick: [number, number]): Array<Array<boolean>> {
        const result: Array<Array<boolean>> = new Array(rows);
        for (let i = 0; i < rows; i++) {
            result[i] = new Array(columns).fill(false);
        }
        
        // shuffle the indices by using 
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