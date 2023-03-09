interface myProps {
    winner: string
    resetGame: () => void
}

export const ModalWinner = ({ winner, resetGame }:myProps) => {

    return (
      <section className='winner-modal'>
        <div className='body-modal'>
          <header>
            <button className="close-modal">X</button>
          </header>
          ¡The player {winner} has won the game Othello!
          <footer>
            <button  className='button-start' onClick={resetGame}>OK</button>
          </footer>
        </div>
      </section>
    )
}