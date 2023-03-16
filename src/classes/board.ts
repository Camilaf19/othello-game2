
export class Board {
  cells: number[][]

  //two-dimensional matrix with rows and cols 
  constructor(public rows: number, public cols: number) {
    this.rows = rows
    this.cols = cols
    this.cells = Array(this.rows)
      .fill(0)
      .map(() => Array(this.cols).fill(0))
  }

  // method that starts the game with the 4 tokens in the center
  initBoard(): Board {
    const newBoard = new Board(this.rows, this.cols)

    const centerRow = this.rows / 2
    const centerCol = this.cols / 2

    newBoard.cells[centerRow][centerCol] = 2 // arriba izquierda
    newBoard.cells[centerRow - 1][centerCol] = 1 //abajo iziquierda
    newBoard.cells[centerRow][centerCol - 1] = 1 //arriba derecha
    newBoard.cells[centerRow - 1][centerCol - 1] = 2 //abajo derecha

    return newBoard
  }
}
