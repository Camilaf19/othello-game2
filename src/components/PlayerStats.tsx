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
        <article className='count-tokens'>
          <p>{blackTokens}</p>
          <span>Black</span>
        </article>
        <article className='count-tokens'>
          <p>{whiteTokens}</p>
          <span>White</span>
        </article>
      </section>
      <button
        className='button-start'
        onClick={() => handleRestartGame()}
      >
        Start / reset game
      </button>
    </>
  )
}
