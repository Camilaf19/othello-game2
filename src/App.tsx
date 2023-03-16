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

  // verify when any player does not have more tokens
  useEffect(() => {
    if (whiteTokens <= 10 || blackTokens <= 10) {
      setWinner(newWinner)
      setShowModal(true)
    }
  }, [blackTokens, whiteTokens, turn, newWinner])

  //change the size of the board according to the select value
  const handleChangeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(event.target.value)
    setSizeBoard(newSize)
    setBoard(new Board(newSize, newSize))
    const initTokens = (newSize * newSize) / 2
    setBlackTokens(initTokens)
    setWhiteTokens(initTokens)
  }

  //start the game and it update the new board, the first turn and substract the tokens that are already in play
  const handleStartGame = () => {
    setBoard(newBoard)
    const startTokens = (sizeBoard * sizeBoard) / 2 - 2
    setWhiteTokens(startTokens)
    setBlackTokens(startTokens)
    setTurn(1)
  }

  //creates the cell instance to validate moves and create the chain 
  const handleClickBoard = (irow: number, icol: number) => {
    const selectedCell = new Cell(irow, icol, turn, isCheckedDiagonal)
    const isValidMove = selectedCell.validateMove(board)
    selectedCell.createChain(irow, icol, turn, board)
    const tokensChanged = selectedCell.flippedTokens

    //it updates the values of the states, subtract and add the number of tokens for each player
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

    updateDataTurn(isValidMove, selectedCell, updateTokens)
  }

  const updateDataTurn = (isValidMove: boolean,selectedCell: Cell, updateTokens: Record<number, () => void>) => {

    //if is not a valid move, it checks if there are more moves available on the board
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

  //after the game finished, reset the game
  const resetGameModal = () => {
    setBoard(initialBoard)
    setWhiteTokens((sizeBoard * sizeBoard) / 2)
    setBlackTokens((sizeBoard * sizeBoard) / 2)
    setWinner('')
    setShowModal(false)
  }

  //set the state when the checkbox is check
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
