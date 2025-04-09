import * as readline from 'readline';
import { Board } from './Board';

function printBooleanBoard(board: Array<Array<boolean>>): void {
    board.forEach(row => {
        console.log(row.map(cell => (cell ? 'X' : 'O')).join(' '));
    });
}

async function question(this: readline.Interface, prompt: string): Promise<string> {
    return new Promise(resolve => this.question(prompt, resolve));
}

async function main() {
    // Input the rows and columns and bomb count
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    const rows = parseInt(await question.call(rl, 'Enter number of rows: '));
    const cols = parseInt(await question.call(rl, 'Enter number of columns: '));
    const bombs = parseInt(await question.call(rl, 'Enter number of bombs: '));
    const firstRow = parseInt(await question.call(rl, 'Enter first click row: '));
    const firstCol = parseInt(await question.call(rl, 'Enter first click col: '));
    const firstClick: [number, number] = [firstRow, firstCol];

    rl.close();

    // Create the board and generate the bomb map
    const board = new Board(rows, cols, bombs);
    const bombMap = board.LocateBombs([rows, cols], bombs, firstClick);
    console.log("Bomb Map:");
    printBooleanBoard(bombMap);
}

main();