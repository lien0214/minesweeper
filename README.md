# [1st Call] PicCollage Interview Project: Minesweeper

## Quickstart

The project is develop under npm 22.14.0, please make sure you have the npm version.
1. run `npm install` to install the required package
2. run `npm run start` to run the whole Minesweeper game
3. or run `npm run test-board-generator` to run the board generator test

## Design Explanation

### Requirement Part

```typescript
Interface IBoardGenerator {
    GenerateBoard(firstClickPosition: [row, col]): Array<Array<ICell>>
    LocateBombs(firstClickPosition: [row, col]): Array<Array<boolean>>
}

Class Board implements IBoardGenerator {
    constructor(rows, cols, bombCount) { ... }
    // rest of implementation
}
```

To fit the requirement, I design the class `Board` as the pseudo above, where:
1. `GenerateBoard`: Generate implemented `ICell` for gaming afterwards
2. `LocateBombs`: Generate pure 2D boolean presenting the location of the bombs on the board
3. `constructor`: Input the number of rows, columns and bombs as board field.

#### Flow (Use Case)

1. The user constructs the `Board` with those three number.
2. At first click, `Board` object generate the board with the function.

#### Bomb Generation

The spec requires that first click cannot be the bomb. To ensure this, the bombs will be locate right after the first click.

The bomb location is decided by the first `bombCount` number with the random sequence in a size of `rows * columns`

To simulate the real random sequence, I implement `O(rows * columns)` method by randomly switching any index with index `i` for all `i` from `0` to `row * column - 1`.

### Whole Game

Because of time limitation, I did not draw diagram for the architecture, but I will explain the design below:

#### Game

```typescript
Interface IGame {
    readonly GameStatus // like win or lose or in-progress
    StartGame
    StartRound
    CommandCell
    EndRound
}
```

Game is just designed for state seperating and setting the function that has to be run in every state, not very important. This part I did not implement error handling, supposing the user calls the method in the right sequence.


#### Cells

```typescript
Interface ICell {
    readonly Cell information // like position, if revealed or flagged
    Clicked()
    PlaceFlag()
    BombSignal()  // Receiving Bomb Signal
    EmptySignal() // Receiving Empty Signal
    ToString()    // For Output
}
```

Three implementation:
1. UndefinedCell: All the cells before first click are UndefinedCell, it is designed for the flag action before first click.
2. NormalCell: The cell without bomb after first click.
3. BombCell: The cell with bomb after first click.


#### Logic: Clicked

If the cell is clicked, it will first check if it is revealed or flagged.

The board will be generated if the click action is on the unflagged undefined cell.

As the unflagged bomb or normal cell being clicked, they will reveal itself and call some assigned callback function, including remain safe cell decrement, explode all the other bombs, reveal the cell beside the empty cell itself.

#### Complexity

Space:
- The space is limited with the size of the board `O(size of board)`.

Time:
- Board Generation: Generate cell with `O(size of board)` random sequence generation, `O(number of bombs)` locating bombs, and `O(size of board)` constructing bomb.
- Click: 
  - `O(number of bombs)` for bomb cell.
  - `O(size of board)` for normal cell.
  - `O(Board Generation) + O(Click normal cell)` for undefined cell.

Others may not be critical for the project. 