import { Board } from './board'

export class Cell extends Board {
  neighbors: number[][]
  flippedTokens: number = 0

  constructor(rows: number, cols: number, public currentPlayer: number) {
    super(rows, cols)
    this.currentPlayer = currentPlayer
    this.neighbors = [
      [-1, 0], // arriba
      [0, 1], // derecha
      [1, 0], // abajo
      [0, -1], // izquierda
    ]
  }

  //verificar los limites del tablero
  validateLimit(row: number, col: number): boolean {
    return row >= 0 && row < 8 && col >= 0 && col < 8
  }

  validateMove(Board: Board) {
    let isValid = false
    //verifica si la celda está ocupada
    if (Board.cells[this.rows][this.cols] !== 0) {
      isValid = false
    }
    else {
      //recorre todas las direcciones para encontrar una ficha adyacente que sea del oponente
      this.neighbors.forEach((direction) => {
        let row = this.rows + direction[0]
        let col = this.cols + direction[1]
 
        //verifica si es un movimiento que cumpla con las condiciones
        if (this.validateLimit(row, col)) {
          if (Board.cells[row][col] === 3 - this.currentPlayer) {
            while (
              this.validateLimit(row, col) &&
              Board.cells[row][col] === 3 - this.currentPlayer
            ) {
              row += direction[0] 
              col += direction[1]
              if (
                this.validateLimit(row, col) &&
                Board.cells[row][col] === this.currentPlayer // verifica al final de la cadena que haya una ficha actual
              ) {
                isValid = true
                break
              }
            }
          }
        }
      })
    }
    return isValid
  }

  createChain(row: number, col: number, currentPlayer: number, Board: Board) {
    //si es un movimiento valido recorre la cadena y cambia los valores de los tokens
    if (this.validateMove(Board)) {
    
      this.neighbors.forEach((direction) => {
        let r = row + direction[0] 
        let c = col + direction[1]

        while (
          this.validateLimit(r, c) &&
          Board.cells[r][c] === 3 - currentPlayer
        ) {
          r += direction[0]
          c += direction[1]

          //encuentra la ficha del actual al final de la cadena
          if (this.validateLimit(r, c) && Board.cells[r][c] === currentPlayer) {
            if (Board.cells[this.rows][this.cols] !== this.currentPlayer) {
              this.flippedTokens++
              Board.cells[this.rows][this.cols] = this.currentPlayer
            }
            r = row + direction[0] //se devuelve en la iteración ya que puede haber otra cadena en otra dirección
            c = col + direction[1]

            while (
              this.validateLimit(r, c) &&
              Board.cells[r][c] === 3 - currentPlayer
            ) {
              Board.cells[r][c] = currentPlayer // actualiza el valor de la celda que se hizo click
              this.flippedTokens++
              r += direction[0]
              c += direction[1]
            }
          }
        }
      })
    }
    return Board.cells[this.rows][this.cols]
  }

  checkAvailableMoves(currentPlayer: number, board: Board) {
    let isAvailable = false 

    //recorre el tablero para encontrar movimientos validos restantes, sino, devuelve false y pierde el jugador
    for (let rowIndex = 0; rowIndex < board.cells.length; rowIndex++) {
      for (let colIndex = 0; colIndex < board.cells[rowIndex].length; colIndex++) {
        let validateEachCell = new Cell(rowIndex, colIndex, currentPlayer)
        if (validateEachCell.validateMove(board)) {
          isAvailable = true
          return isAvailable
        }
      }
    }
    return isAvailable
  }
}
