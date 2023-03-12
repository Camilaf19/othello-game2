
export class Board {
  rows: number
  cols: number
  cells: number[][]

  constructor(rows: number, cols: number) {
    this.rows = rows
    this.cols = cols
    this.cells = Array(this.rows)
      .fill(0)
      .map(() => Array(this.cols).fill(0))
  }

  initBoard(): Board {
    const newBoard = new Board(this.rows, this.cols)

    const centerRow = Math.floor(this.rows / 2)
    const centerCol = Math.floor(this.cols / 2)

    newBoard.cells[centerRow][centerCol] = 2
    newBoard.cells[centerRow - 1][centerCol] = 1
    newBoard.cells[centerRow][centerCol - 1] = 1
    newBoard.cells[centerRow - 1][centerCol - 1] = 2

    return newBoard
  }
  
}
