import { Board } from "../classes/board"

interface myProps {
  board: Board
  handleClickBoard: Function,
}

export const BoardComponent = ({ board, handleClickBoard }: myProps) => {

  return (
    <section className='board'>
      {board.cells.map((row, irow) => {
        return (
          <section
            key={irow}
            className='rows'
          >
            {row.map((_, icol) => {
              return (
                <section
                  key={icol}
                  className='cols'
                  onClick={() => handleClickBoard(irow, icol)}
                >
                  {board.cells[irow][icol] === 1 && (
                    <div className='token-black' />
                  )}
                  {board.cells[irow][icol] === 2 && (
                    <div className='token-white' />
                  )}
                </section>
              )
            })}
          </section>
        )
      })}
    </section>
  )
}
