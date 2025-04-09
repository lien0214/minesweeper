import { ICell } from '..//Interfaces/ICell';
import { ISignaler } from '../Interfaces/ISignaler';

export class BombCell implements ICell
{
    private _signaler: ISignaler;
    private _revealed = false;
    private _flagged = false;
    private _position: [number, number];
    private _bombExplosion: () => void;

    public get Position(): [number, number] { return this._position; }
    public get Revealed(): boolean { return this._revealed; }
    public get Flagged(): boolean { return this._flagged; }

    public constructor(signaler: ISignaler, position: [number, number], bombExplosion: () => void) {
        this._signaler = signaler;
        this._position = position;
        this._bombExplosion = bombExplosion;
    }

    public Clicked(): void {
        if (this._revealed) return;
        if (this._flagged) return;
        this._bombExplosion();
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