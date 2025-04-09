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
    GenerateBoard(firstClickPosition: [row, col]): Array<<ICell>>
    LocateBombs(firstClickPosition: [row, col]): Array<<boolean>>
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

To simulate the real random, I implement `O(rows * columns)` method by randomly switching any index with index `i` for all `i` from `0` to `row * column - 1`.

### Whole Game

