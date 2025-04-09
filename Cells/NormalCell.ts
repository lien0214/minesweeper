import { ICell } from '..//Interfaces/ICell';
import { ISignaler } from '../Interfaces/ISignaler';

export class NormalCell implements ICell
{
    private _signaler: ISignaler;
    private _revealed = false;
    private _flagged = false;
    private _bombs: number;
    private _position: [number, number];
    private _safeCellDecrement: () => void;

    public get Position(): [number, number] { return this._position; }
    public get Revealed(): boolean { return this._revealed; }
    public get Flagged(): boolean { return this._flagged; }

    public constructor(signaler: ISignaler, bombs: number, position: [number, number], safeCellDecrement: () => void) {
        this._signaler = signaler;
        this._bombs = bombs;
        this._position = position;
        this._safeCellDecrement = safeCellDecrement;
    }

    public Clicked(): void {
        if (this._revealed) return;
        if (this._flagged) return;
        this._safeCellDecrement();
        this._revealed = true;
        if (this._bombs > 0) return;
        this._signaler.Signal(this);
    }

    public PlaceFlag(): void {
        if (this._revealed) return;
        this._flagged = !this._flagged;
    }

    public BombSignal(): void
    {
        // do nothing
    }

    public EmptySignal(): void
    {
        if (this._revealed) return;
        this._safeCellDecrement();
        this._revealed = true;
        if (this._bombs === 0) {
            this._signaler.Signal(this);
        }
    }


    public ToString(): string
    {
        if (this.Revealed) return this._bombs.toString();
        if (this.Flagged) return "F";
        return " ";
    }
}