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
  //verificar los limites del tablero
  validateLimit(row: number, col: number): boolean {
    return row >= 0 && row < 8 && col >= 0 && col < 8
  }

  validateMove(Board: Board) {
    //verificar si la celda esta ocupada
    if (Board.cells[this.rows][this.cols] !== 0) {
      return 0
    }

    //recorre todas las direcciones adaycentes para encontrar una ficha del oponente
    this.neighbors.forEach((direction) => {
      let row = this.rows + direction[0]
      let col = this.cols + direction[1]
      if (this.validateLimit(row, col)) {
        if (Board.cells[row][col] === 3 - this.currentPlayer) {
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

  // itera y crea la cadena si encuentra una ficha del jugador actual al final de la fila o columna
  createChain(
    row: number,
    col: number,
    direction: number[],
    currentPlayer: number,
    Board: Board
  ) {
    let r = row + direction[0] // adyacentes del actual
    let c = col + direction[1]
    let foundCurrentPlayerToken = false

    while (
      this.validateLimit(r, c) &&
      Board.cells[r][c] === 3 - currentPlayer
    ) {
      r += direction[0] //cambia a los valores adyacentes de la adyacente
      c += direction[1]

      if (this.validateLimit(r, c) && Board.cells[r][c] === currentPlayer) {
        foundCurrentPlayerToken = true
        break
      }
    }

    // si se encontró una ficha del jugador actual, se actualiza el valor la cadena
    if (foundCurrentPlayerToken) {
      if (Board.cells[this.rows][this.cols] !== this.currentPlayer) {
        this.flippedTokens++
        Board.cells[this.rows][this.cols] = this.currentPlayer
      }
      r = row + direction[0]
      c = col + direction[1]
      while (
        this.validateLimit(r, c) &&
        Board.cells[r][c] === 3 - currentPlayer
      ) {
        Board.cells[r][c] = currentPlayer // actualiza el valor de la celda que se hizo click
        this.flippedTokens++
        r += direction[0] //cambia a los valores adyacentes de la adyacente
        c += direction[1]
      }
    }
  }
}
