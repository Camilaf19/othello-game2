

export class Board {
  rows: number
  cols: number
  cells: number[][]

  constructor(rows: number, cols: number) {
    this.rows = rows
    this.cols = cols
    this.cells = Array(rows)
      .fill(0)
      .map(() => Array(cols).fill(0))
  }

  initBoard(): Board {
    const newBoard = new Board(this.rows, this.cols)
    newBoard.cells[3][3] = 2
    newBoard.cells[3][4] = 1
    newBoard.cells[4][3] = 1
    newBoard.cells[4][4] = 2
    return newBoard
  }

  
}
