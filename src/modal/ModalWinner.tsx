interface myProps {
    winner: string
    resetGameModal: () => void
}

export const ModalWinner = ({ winner, resetGameModal }:myProps) => {
  
    return (
      <section className='winner-modal'>
        <div className='body-modal'>
          <button
            className='close-modal'
            onClick={resetGameModal}
          >
            x
          </button>
          <h3 className='text-modal'>
            ¡The player {winner} has won the game Othello!
          </h3>
          <footer>
            <button
              className='buttons'
              onClick={resetGameModal}
            >
              OK
            </button>
          </footer>
        </div>
      </section>
    )
}