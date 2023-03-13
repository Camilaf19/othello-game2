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
  const [sizeBoard, setSizeBoard] = useState(8)
  const [whiteTokens, setWhiteTokens] = useState((sizeBoard * sizeBoard) / 2)
  const [blackTokens, setBlackTokens] = useState((sizeBoard * sizeBoard) / 2)
  const [winner, setWinner] = useState('')
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (whiteTokens <= 0 || blackTokens <= 0) {
      const newWinner = turn === 1 ? 'White' : 'Black'
      setWinner(newWinner)
      setShow(true)
    }
  }, [blackTokens, whiteTokens, turn])

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const valueSelected = parseInt(event.target.value)
    setSizeBoard(valueSelected)
    setBoard(new Board(valueSelected, valueSelected))
    const initTokens = (valueSelected * valueSelected) / 2
    setBlackTokens(initTokens)
    setWhiteTokens(initTokens)
  }

  const handleStartGame = () => {
    setBoard(newBoard)
    setWhiteTokens(whiteTokens - 2)
    setBlackTokens(blackTokens - 2)
    setTurn(1)
  }

  const handleClickBoard = (irow: number, icol: number) => {
    const selectedCell = new Cell(irow, icol, turn)
    const isValidMove = selectedCell.validateMove(board)
    selectedCell.createChain(irow, icol, turn, board)
    const tokensChanged = selectedCell.flippedTokens

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
    debugger
    updateDataTurn(isValidMove, selectedCell, updateTokens)
  }

  const updateDataTurn = (
    isValidMove: boolean,
    selectedCell: Cell,
    updateTokens: Record<number, () => void>
  ) => {
    if (!isValidMove) {
      setWhiteTokens(whiteTokens)
      setBlackTokens(blackTokens)
      if (!selectedCell.checkAvailableMoves(turn, board)) {
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
      <main className='main-app'>
        <BoardComponent
          board={board}
          handleClickBoard={handleClickBoard}
        />
        <aside className='aside-container'>
          <h2 className='title-aside'>
            Choose the size of the board to start the game:
          </h2>
          <select className='select' onChange={handleChange}>
            <option value={0}>Select an option</option>
            <option value={6}>6 x 6</option>
            <option value={8}>8 x 8</option>
            <option value={10}>10 x 10</option>
          </select>

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
          />
          <button
            className='buttons'
            onClick={handleStartGame}
          >
            Start game
          </button>
        </aside>
        {show && (
          <ModalWinner
            resetGameModal={resetGameModal}
            winner={winner}
          />
        )}
      </main>
    </>
  )
}

export default App
