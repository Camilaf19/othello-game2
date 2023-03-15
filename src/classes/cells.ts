import { Board } from './board'

export class Cell extends Board {
  neighbors: number[][]
  neighborsDiagonal: number[][]
  flippedTokens: number = 0

  constructor(rows: number, cols: number, public currentPlayer: number, public isCheckedDiagonal: boolean) {
    super(rows, cols)
    this.currentPlayer = currentPlayer
    this.neighbors = [
      [-1, 0], // arriba
      [0, 1], // derecha
      [1, 0], // abajo
      [0, -1], // izquierda
    ]
    this.neighborsDiagonal = [
      [-1, -1], //arriba izquierda
      [1, -1],  // abajo izquierda
      [-1, 1], //arriba derecha
      [1, 1] // abajo derecha
    ]
    this.isCheckedDiagonal = isCheckedDiagonal
  }

  //verificar los limites del tablero
  validateLimit(row: number, col: number, board: Board): boolean {
    return (
      row >= 0 &&
      row < board.cells.length &&
      col >= 0 &&
      col < board.cells.length
    )
  }

  validateMove(Board: Board) {
    let isValid = false

    //verify if the cell is occupied
    if (Board.cells[this.rows][this.cols] !== 0) {
      isValid = false
    } else {
      //scan all directions to find an adjacent tile that belongs to the opponent
      [
        ...this.neighbors,
        ...(this.isCheckedDiagonal ? this.neighborsDiagonal : []),
      ].forEach((direction) => {
        let row = this.rows + direction[0]
        let col = this.cols + direction[1]

      
        if (this.validateLimit(row, col, Board)) {
          if (Board.cells[row][col] === 3 - this.currentPlayer) {
            while (this.validateLimit(row, col, Board) && Board.cells[row][col] === 3 - this.currentPlayer) {
              row += direction[0]
              col += direction[1]
              if (this.validateLimit(row, col, Board) && Board.cells[row][col] === this.currentPlayer) {
                // verifica al final de la cadena que haya una ficha actual
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
    //if it is a valid move it goes through the chain and changes the values of the tokens
    if (this.validateMove(Board)) {
      [
        ...this.neighbors,
        ...(this.isCheckedDiagonal ? this.neighborsDiagonal : []),
      ].forEach((direction) => {
        let r = row + direction[0]
        let c = col + direction[1]

        while (
          this.validateLimit(r, c, Board) &&
          Board.cells[r][c] === 3 - currentPlayer
        ) {
          r += direction[0]
          c += direction[1]


          if (
            this.validateLimit(r, c, Board) &&
            Board.cells[r][c] === currentPlayer
          ) {
            if (Board.cells[this.rows][this.cols] !== this.currentPlayer) {
              this.flippedTokens++
              Board.cells[this.rows][this.cols] = this.currentPlayer // update the value of the cell
            }
            r = row + direction[0]
            c = col + direction[1]

            while (
              this.validateLimit(r, c, Board) &&
              Board.cells[r][c] === 3 - currentPlayer
            ) {
              Board.cells[r][c] = currentPlayer // update the value of the cells
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

    //scans the board to find remaining valid moves, otherwise, returns false and the player will lose
    for (let rowIndex = 0; rowIndex < board.cells.length; rowIndex++) {
      for (
        let colIndex = 0;
        colIndex < board.cells[rowIndex].length;
        colIndex++
      ) {
        let validateEachCell = new Cell(
          rowIndex,
          colIndex,
          currentPlayer,
          this.isCheckedDiagonal
        )
        if (validateEachCell.validateMove(board)) {
          isAvailable = true
          return isAvailable
        }
      }
    }
    return isAvailable
  }
}
