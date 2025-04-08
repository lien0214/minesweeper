import { CellType } from '../Enums/CellType';
import { ICell } from '..//Interfaces/ICell';
import { ISignaler } from '../Interfaces/ISignaler';

export class BombCell implements ICell
{
    _signaler: ISignaler;
    _revealed = false;
    _flagged = false;
    _cellType = CellType.Bomb;
    _position: [number, number];

    public get Position(): [number, number] { return this._position; }
    public get CellType(): CellType { return this._cellType; }
    public get Revealed(): boolean { return this._revealed; }
    public get Flagged(): boolean { return this._flagged; }

    public constructor(signaler: ISignaler, position: [number, number]) {
        this._signaler = signaler;
        this._position = position;
    }

    public Clicked(): void {
        if (this._revealed) return;
        this._revealed = true;
        this._signaler.Signal(this);
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