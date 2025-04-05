import { CellType } from '../Enums/CellType';
import { ICell } from '..//Interfaces/ICell';
import { IBoard } from '../Interfaces/IBoard';

export class BombCell implements ICell
{
    _signaler: IBoard;
    _revealed = false;
    _flagged = false;
    _cellType = CellType.Bomb;

    public get CellType(): CellType { return this._cellType; }
    public get Revealed(): boolean { return this._revealed; }
    public get Flagged(): boolean { return this._flagged; }

    public constructor(signaler: IBoard)
    {
        this._signaler = signaler;
    }

    public Clicked(): void {
        if (this._revealed) return;
        this._revealed = true;
        this._signaler.SignalBomb();
    }

    public PlaceFlag(): void {
        if (this._revealed) return;
        this._flagged = !this._flagged;
    }

    public EmptySignal(): void {
        // do nothing
    }

    public BombSignal(): void
    {
        if (this._revealed) return;
        this._revealed = true;
    }

    public ToString(): string
    {
        if (this.Revealed) return "B";
        if (this.Flagged) return "F";
        return " ";
    }
}