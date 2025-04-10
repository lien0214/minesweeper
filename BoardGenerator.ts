import { BombCell } from "./Cells/BombCell";
import { NormalCell } from "./Cells/NormalCell";
import { IBoardGenerator } from "./Interfaces/IBoardGenerator";
import { ICell } from "./Interfaces/ICell";
import { BombSignaler } from "./Signalers/BombSignaler";
import { EmptySignaler } from "./Signalers/EmptySignaler";

export class BoardGenerator implements IBoardGenerator {
    private _rows: number;
    private _columns: number;
    private _bombCount: number;

    private _safeCellDecrement: () => void;
    private _bombExplosion: () => void;

    constructor(rows: number, columns: number, bombCount: number);
    constructor(
        rows: number,
        columns: number,
        bombCount: number, 
        safeCellDecrement: () => void,
        bombExplosion: () => void
    );

    constructor(
        rows: number,
        columns: number,
        bombCount: number, 
        safeCellDecrement?: () => void,
        bombExplosion?: () => void
    ) {
        if (rows <= 0 || columns <= 0) {
            throw new Error("Rows and columns must be greater than zero.");
        }
        if (bombCount < 0 || bombCount >= rows * columns) {
            throw new Error("Bomb count must be between 0 and rows * columns.");
        }
        this._safeCellDecrement = safeCellDecrement ?? ( () => {} );
        this._bombExplosion = bombExplosion ?? ( () => {} );
        this._rows = rows;
        this._columns = columns;
        this._bombCount = bombCount;
    }

    public GenerateBoard(firstClick: [number, number]): Array<Array<ICell>> {
            let cellMap: Array<Array<ICell>> = new Array(this._rows);
            let bompMap = this.LocateBombs(firstClick);
            let bombList: Array<BombCell> = new Array();
    
            let emptyCellSignaler = new EmptySignaler();
            let bombCellSignaler = new BombSignaler();
    
            for (let r = 0; r < this._rows; r++) {
                cellMap[r] = new Array(this._columns);
                for (let c = 0; c < this._columns; c++) {
                    // If the cell itself is a bomb, create a BombCell
                    if (bompMap[r][c]) {
                        let newBomb = new BombCell(bombCellSignaler, [r, c], this._bombExplosion);
                        bombList.push(newBomb);
                        cellMap[r][c] = newBomb;
                    }
                    else {
                        // Otherwise, create a NormalCell with the number of adjacent bombs
                        let neighbor_bomb_count = 0;
                        for (let x = -1; x <= 1; x++) {
                            for (let y = -1; y <= 1; y++) {
                                if (r + x < 0 || r + x >= this._rows || c + y < 0 || c + y >= this._columns) continue;
                                if (bompMap[r + x][c + y]) neighbor_bomb_count++;
                            }
                        }
                        cellMap[r][c] = new NormalCell(emptyCellSignaler, neighbor_bomb_count, [r, c], this._safeCellDecrement);
                    }
                }
            }
    
            // Set up the signalers
            emptyCellSignaler.SetCells(cellMap);
            bombCellSignaler.SetBombs(bombList);
            return cellMap;
        }
    
        public LocateBombs(firstClick: [number, number]): Array<Array<boolean>> {
            const result: Array<Array<boolean>> = new Array(this._rows);
            for (let i = 0; i < this._rows; i++) {
                result[i] = new Array(this._columns).fill(false);
            }
            
            // shuffle the indices by using 
            const indices: Array<number> = Array.from({ length: this._rows * this._columns }, (_, i) => i);
            for (let i = indices.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [indices[i], indices[j]] = [indices[j], indices[i]];
            }
    
            // pick the first `bombs` indices
            // Ensure the first click is not a bomb
            for (let i = 0, count = this._bombCount; i < count; i++) {
                const index = indices[i];
                const row = Math.floor(index / this._columns);
                const col = index % this._columns;
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