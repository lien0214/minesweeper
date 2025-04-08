import { BombCell } from "../Cells/BombCell";
import { ISignaler } from "../Interfaces/ISignaler";

export class BombSignaler implements ISignaler {
    private bombs: Array<BombCell> = [];

    public SetBombs(bombs: Array<BombCell>): void {
        this.bombs = bombs;
    }

    public Signal(cell: BombCell): void {
        for (const bomb of this.bombs) {
            if (cell === bomb) continue;
            bomb.BombSignal();
        }
    }
}