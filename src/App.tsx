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
  const [winner, setWinner] = useState('')
  const [showModal, setShowModal] = useState(false)

  const [whiteTokens, setWhiteTokens] = useState((sizeBoard * sizeBoard) / 2)
  const [blackTokens, setBlackTokens] = useState((sizeBoard * sizeBoard) / 2)
  const [isCheckedDiagonal, setIsCheckedDiagonal] = useState(false)

  const newWinner = turn === 1 ? 'White' : 'Black'

  useEffect(() => {
    if (whiteTokens <= 0 || blackTokens <= 0) {
      setWinner(newWinner)
      setShowModal(true)
    }
  }, [blackTokens, whiteTokens, turn, newWinner])

  const handleChangeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(event.target.value)
    setSizeBoard(newSize)
    setBoard(new Board(newSize, newSize))
    const initTokens = (newSize * newSize) / 2
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
    const selectedCell = new Cell(irow, icol, turn, isCheckedDiagonal)
    const isValidMove = selectedCell.validateMove(board)
    selectedCell.createChain(irow, icol, turn, board)
    const tokensChanged = selectedCell.flippedTokens

    const updateTokens: Record<number, () => void> = {
      1: () => {
        setBlackTokens((prevBlackTokens) => prevBlackTokens - tokensChanged)
        setWhiteTokens((prevWhiteTokens) => prevWhiteTokens + tokensChanged -1)
        setTurn(2)
      },
      2: () => {
        setWhiteTokens((prevWhiteTokens) => prevWhiteTokens - tokensChanged)
        setBlackTokens((prevBlackTokens) => prevBlackTokens + tokensChanged - 1)
        setTurn(1)
      },
    }

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
        setShowModal(!showModal)
        setWinner(newWinner)
      }
    } else {
      updateTokens[turn]()
    }
  }

  const resetGameModal = () => {
    setBoard(initialBoard)
    setWhiteTokens((sizeBoard * sizeBoard) / 2)
    setBlackTokens((sizeBoard * sizeBoard) / 2)
    setWinner('')
    setShowModal(false)
  }

  const onChangeCheckDiagonal = () => {
    setIsCheckedDiagonal(!isCheckedDiagonal)
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
          <select
            className='select'
            onChange={handleChangeSelect}
          >
            <option value={0}>Select an option</option>
            <option value={6}>6 x 6</option>
            <option value={8}>8 x 8</option>
            <option value={10}>10 x 10</option>
          </select>
          <section className='check-diagonal'>
            <input
              type='checkbox'
              checked={isCheckedDiagonal}
              onChange={onChangeCheckDiagonal}
            />
            Allow diagonal moves
          </section>
          <section className='turns-container'>
            <TokenDisplay
              className='token-black'
              isChanged={turn === 1}
            />
            <TokenDisplay
              className='token-white'
              isChanged={turn === 2}
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
        {showModal && (
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
