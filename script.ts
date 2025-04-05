import * as readline from 'readline';
import { Game } from './Game';
import { CellCommandType } from './Enums/CellCommandType';
import { GameResultType } from './Enums/GameResultType';

// Create game instance
const game = new Game();

// Setup readline
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve));
}

async function play() {
  const row = parseInt(await askQuestion("Enter number of rows: "));
  const col = parseInt(await askQuestion("Enter number of columns: "));
  const bombs = parseInt(await askQuestion("Enter number of bombs: "));

  game.StartGame(row, col, bombs);

  while (true) {
    game.StartRound();

    const cmd = await askQuestion("Command (click/flag): ");
    const r = parseInt(await askQuestion("Row: "));
    const c = parseInt(await askQuestion("Col: "));

    const type = cmd.toLowerCase() === 'click'
      ? CellCommandType.ClickCell
      : CellCommandType.PlaceFlag;

    game.CommandCell(r, c, type);

    // You can add game-over checking here if you have a flag for it
    const exit = await askQuestion("Continue? (y/n): ");
    if (exit.toLowerCase() !== 'y') {
      game.EndGame(GameResultType.Lose); // or Win if you check for it
      rl.close();
      break;
    }

    game.EndRound();
  }
}

play();