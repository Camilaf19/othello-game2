import { useState } from 'react'
import { PlayerStats } from './components/PlayerStats'
import { TokenDisplay } from './components/TokenDisplay'
import { Board } from './classes/board'
import { Cell } from './classes/cells'

function App() {
  const initialBoard = new Board(8, 8)
  const [board, setBoard] = useState(initialBoard)
  const newBoard = board.initBoard()
  const [turn, setTurn] = useState(1)
  const [whiteTokens, setWhiteTokens] = useState(32)
  const [blackTokens, setBlackTokens] = useState(32)

  function handleClickBoard(irow: number, icol: number) {
    const selectedCell = new Cell(irow, icol, turn)
    const cellValue = selectedCell.validateMove(board)
    const tokensChanged = selectedCell.flippedTokens

    const validMovements: Record<number, () => void> = {
      1: () => {
        setBlackTokens((prevBlackTokens) => prevBlackTokens - tokensChanged)
        setWhiteTokens((prevWhiteTokens) => prevWhiteTokens + tokensChanged - 1)
        setTurn(2)
      },
      2: () => {
        setWhiteTokens((prevWhiteTokens) => prevWhiteTokens - tokensChanged)
        setBlackTokens((prevBlackTokens) => prevBlackTokens + tokensChanged - 1)
        setTurn(1)
      },
    }

    if (cellValue === 0) {
      setWhiteTokens(whiteTokens)
      setBlackTokens(blackTokens)
    } else {
      validMovements[turn]()
    }
  }

  function handleRestartGame() {
    setBoard(newBoard)
    setWhiteTokens(30)
    setBlackTokens(30)
  }

  return (
    <>
      <header className='header-app'>
        <h1>Othello</h1>
      </header>
      <main className='app-main'>
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
        <aside className='aside-container'>
          <section className='turns-container'>
            <TokenDisplay
              className='token-black'
              isSelected={turn === 1}
            />
            <TokenDisplay
              className='token-white'
              isSelected={turn === 2}
            />
          </section>
          <PlayerStats
            whiteTokens={whiteTokens}
            blackTokens={blackTokens}
            handleRestartGame={handleRestartGame}
          />
        </aside>
      </main>
    </>
  )
}

export default App
