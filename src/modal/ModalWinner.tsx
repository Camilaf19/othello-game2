interface myProps {
    winner: string
    resetGame: () => void
}

export const ModalWinner = ({ winner, resetGame }:myProps) => {

    return (
      <section className='winner-modal'>
        <div className='body-modal'>
            <button className="close-modal">x</button>
            <h2 className="text-modal"> ¡The player {winner} has won the game Othello! </h2>
          <footer>
            <button  className='button-start' onClick={resetGame}>OK</button>
          </footer>
        </div>
      </section>
    )
}