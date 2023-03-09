import { Board } from './board'

export class Cell extends Board {
  neighbors: number[][]
  flippedTokens: number = 0

  constructor(rows: number, cols: number, public currentPlayer: number) {
    super(rows, cols)
    this.neighbors = [
      [-1, 0], // arriba
      [0, 1], // derecha
      [1, 0], // abajo
      [0, -1], // izquierda
    ]
    this.currentPlayer = currentPlayer
  }

  validateLimit(row: number, col: number): boolean {
    return row >= 0 && row < 8 && col >= 0 && col < 8
  }

  validateMove(Board: Board) {
    if (Board.cells[this.rows][this.cols] !== 0) {
      //celda ocupada
      return 0
    }

    this.neighbors.forEach((direction) => {
      let row = this.rows + direction[0] // posicion adayacentes
      let col = this.cols + direction[1]
      debugger
      if (this.validateLimit(row, col)) {
        if (Board.cells[row][col] === 3 - this.currentPlayer) {
          // la celda adyacente sea el oponente
          this.createChain(
            this.rows,
            this.cols,
            direction,
            this.currentPlayer,
            Board
          )
        }
      }
    })
    return Board.cells[this.rows][this.cols]
  }

  createChain(
    row: number,
    col: number,
    direction: number[],
    currentPlayer: number,
    Board: Board
  ) {
    let r = row + direction[0] // adyacentes del actual
    let c = col + direction[1]
    let foundCurrentPlayerToken = false // variable de control

    while (
      this.validateLimit(r, c) &&
      Board.cells[r][c] === 3 - currentPlayer
    ) {
      r += direction[0] //cambia a los valores adayacentes de la adyacente
      c += direction[1]
      if (Board.cells[r][c] === currentPlayer) {
        foundCurrentPlayerToken = true // se encontró una ficha del jugador actual
        break // se sale del ciclo
      }
    }

    // si se encontró una ficha del jugador actual, se actualiza la cadena
    if (foundCurrentPlayerToken) {
      r = row + direction[0]
      c = col + direction[1]
      if (Board.cells[this.rows][this.cols] !== this.currentPlayer) {
        this.flippedTokens++
        Board.cells[this.rows][this.cols] = this.currentPlayer //pintar el turno actual
      }
      while (
        this.validateLimit(r, c) &&
        Board.cells[r][c] === 3 - currentPlayer
      ) {
        Board.cells[r][c] = currentPlayer // pinta la celda posicion nueva
        this.flippedTokens++
        r += direction[0] //cambia a los valores adayacentes de la adyacente
        c += direction[1]
      }
    }
  }
}
