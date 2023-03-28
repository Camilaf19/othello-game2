interface myProps {
  blackTokens: number
  whiteTokens: number
}

export const PlayerStats = ({
  blackTokens,
  whiteTokens,
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
    </>
  )
}
