import { ICell } from "../Interfaces/ICell";

export class UndefinedCell implements ICell {
    private _flagged = false;
    private _position: [number, number];
    private _clickedCallback: (firstClick: [number, number]) => void;

    public get Revealed(): boolean { return false; }
    public get Flagged(): boolean { return this._flagged; }
    public get Position(): [number, number] { return [-1, -1]; }

    constructor(position: [number, number], GenerateBoard: (firstClick: [number, number]) => void) {
        this._position = position;
        this._clickedCallback = GenerateBoard;
    }
    

    public Clicked(): void {
        if (this._flagged) return;
        this._clickedCallback(this._position);
    }

    public PlaceFlag(): void {
        this._flagged = !this._flagged;
    }

    public BombSignal(): void {
        throw new Error("BombSignal not planned for UndefinedCell.");
    }

    public EmptySignal(): void {
        throw new Error("EmptySignal not planned for UndefinedCell.");
    }

    public ToString(): string {
        return this.Flagged ? "F" : "U";
    }
}