import { Board } from './board'

export class Cell extends Board {
  neighbors: number[][]
  neighborsDiagonal: number[][]
  flippedTokens: number = 0

  constructor(rows: number, cols: number, public currentPlayer: number, public isCheckedDiagonal: boolean) {
    super(rows, cols)
    this.currentPlayer = currentPlayer
    //adjacent positions 
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

  //validate board boundaries
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

      //iterates all directions to find an adjacent token that belongs to the opponent
      [
        ...this.neighbors,
        ...(this.isCheckedDiagonal ? this.neighborsDiagonal : [])
      ].forEach((direction) => {
        //this makes the new position the following in that direction
        let row = this.rows + direction[0]
        let col = this.cols + direction[1]

        if (this.validateLimit(row, col, Board)) {
          if (Board.cells[row][col] === 3 - this.currentPlayer) {
            while (
              this.validateLimit(row, col, Board) &&
              Board.cells[row][col] === 3 - this.currentPlayer
            ) {
              row += direction[0]
              col += direction[1]
              if (
                this.validateLimit(row, col, Board) &&
                Board.cells[row][col] === this.currentPlayer
              ) {
                //verifies at the end of the chain that there is a token of the current player
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
      //the neighborsDiagonal array is added only if 'isCheck' is true, otherwise only the original array is iterated
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
            Board.cells[r][c] === currentPlayer  //find the token of the current player
          ) {
            if (Board.cells[this.rows][this.cols] !== this.currentPlayer) {
              this.flippedTokens++ // counts the tokens that have been changed
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

    //iterates the board to find remaining valid moves, otherwise, returns false and the player will lose
    for (let rowIndex = 0; rowIndex < board.cells.length; rowIndex++) {
      for (let colIndex = 0; colIndex < board.cells[rowIndex].length; colIndex++) {

        //it creates a new instance and uses the validateMove method to see if each cell has moves available
        let validateEachCell = new Cell(rowIndex, colIndex, currentPlayer, this.isCheckedDiagonal)

        if (validateEachCell.validateMove(board)) {
          isAvailable = true
          return isAvailable
        }
      }
    }
    return isAvailable
  }
}
