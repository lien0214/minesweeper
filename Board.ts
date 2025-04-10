import { BoardGenerator } from "./BoardGenerator";
import { UndefinedCell } from "./Cells/UndefinedCell";
import { BoardStatus } from "./Enums/BoardStatus";
import { IBoard } from "./Interfaces/IBoard";
import { IBoardGenerator } from "./Interfaces/IBoardGenerator";
import { ICell } from "./Interfaces/ICell";

export class Board implements IBoard
{
    private _rows: number;
    private _columns: number;
    private _safeCells: number;
    private _status: BoardStatus;

    private _cells: Array<Array<ICell>>;

    private _safeCellDecrement: () => void = () => {
        this._safeCells--;
        if (this._safeCells === 0) {
            this._status = BoardStatus.Win;
        }
    }
    private _bombExplosion: () => void = () => {
        this._status = BoardStatus.Lose;
    };

    private _boardGenerator: IBoardGenerator;

    public get Status(): BoardStatus { return this._status; }

    public constructor(rows: number, columns: number, bombCount: number) {
        if (rows <= 0 || columns <= 0) {
            throw new Error("Rows and columns must be greater than zero.");
        }
        if (bombCount < 0 || bombCount >= rows * columns) {
            throw new Error("Bomb count must be between 0 and rows * columns.");
        }
        this._status = BoardStatus.Default;
        this._rows = rows;
        this._columns = columns;
        this._safeCells = rows * columns - bombCount;
        // set cells to undefined cells to start
        this._cells = new Array(rows);
        this._boardGenerator = new BoardGenerator(rows, columns, bombCount, this._safeCellDecrement, this._bombExplosion);
        for (let i = 0; i < rows; i++) {
            this._cells[i] = new Array(columns);
            for (let j = 0; j < columns; j++) {
                this._cells[i][j] = new UndefinedCell([i, j], (firstClick: [number, number]) => {
                    this._cells = this._boardGenerator.GenerateBoard(firstClick);
                    this._cells[i][j].Clicked();
                })
            }
        }
    }

    public ClickCell(row: number, col: number): void {
        this._cells[row][col].Clicked();
    }

    public PlaceFlag(row: number, col: number): void {
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
}