interface myProps {
  blackTokens: number
  whiteTokens: number
  handleRestartGame: () => void
}

export const PlayerStats = ({
  blackTokens,
  whiteTokens,
  handleRestartGame,
}: myProps) => {
  return (
    <>
      <section className='tokens-container'>
        <article className='name-tokens'>
          <p className='number-tokens'>{blackTokens}</p>
          <span>Black</span>
        </article>
        <article className='name-tokens'>
          <p className='number-tokens'>{whiteTokens}</p>
          <span>White</span>
        </article>
      </section>
      <button
        className='button-start'
        onClick={() => handleRestartGame()}
      >
        Start game
      </button>
    </>
  )
}
