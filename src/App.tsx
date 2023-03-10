import { useState, useEffect } from 'react'
import { BoardComponent } from './components/BoardComponent'
import { PlayerStats } from './components/PlayerStats'
import { TokenDisplay } from './components/TokenDisplay'
import { ModalWinner } from './modal/ModalWinner'
import { Board } from './classes/board'
import { Cell } from './classes/cells'

function App() {
  const initialBoard = new Board(8, 8)
  const [board, setBoard] = useState(initialBoard)
  const newBoard = board.initBoard()
  const [turn, setTurn] = useState(1)
  const [whiteTokens, setWhiteTokens] = useState(32)
  const [blackTokens, setBlackTokens] = useState(32)
  const [winner, setWinner] = useState('')
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (whiteTokens <= 0 || blackTokens <= 0) {
      const newWinner = turn === 1 ? 'White' : 'Black'
      setWinner(newWinner)
      setShow(true)
    }
  }, [blackTokens, whiteTokens, turn])

  const handleStartGame = () => {
    setBoard(newBoard)
    setWhiteTokens(30)
    setBlackTokens(30)
    setTurn(1)
  }

  const handleClickBoard = (irow: number, icol: number) => {
    const selectedCell = new Cell(irow, icol, turn)
    const isValidMove = selectedCell.validateMove(board)
    selectedCell.createChain(irow, icol, turn, board)
    const tokensChanged = selectedCell.flippedTokens
    const hasAvailableMoves = selectedCell.checkAvailableMoves(turn, board)

    const updateTokens: Record<number, () => void> = {
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

    updateDataTurn(isValidMove, hasAvailableMoves, updateTokens)
  }

  const updateDataTurn = (
    isValidMove: boolean,
    hasAvailableMoves: boolean,
    updateTokens: Record<number, () => void>
  ) => {
    if (!isValidMove) {
      setWhiteTokens(whiteTokens)
      setBlackTokens(blackTokens)
      if (!hasAvailableMoves) {
        setShow(true)
        const newWinner = turn === 1 ? 'White' : 'Black'
        setWinner(newWinner)
      }
    } else {
      updateTokens[turn]()
    }
  }

  const resetGameModal = () => {
    setBoard(initialBoard)
    setWhiteTokens(32)
    setBlackTokens(32)
    setWinner('')
    setShow(false)
  }

  return (
    <>
      <header className='header-app'>
        <h1>Othello</h1>
      </header>
      <main className='app-main'>
        <BoardComponent
          board={board}
          handleClickBoard={handleClickBoard}
        />
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
            handleRestartGame={handleStartGame}
          />
          {show && (
            <ModalWinner
              resetGameModal={resetGameModal}
              winner={winner}
            />
          )}
        </aside>
      </main>
    </>
  )
}

export default App
