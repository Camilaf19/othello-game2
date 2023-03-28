interface myProps {
  isChanged: boolean
  className: string
}

export const TokenDisplay = ({ isChanged, className: classname }: myProps) => {
  const classNameSelected = isChanged ? 'token-selected' : 'token-container'
  return (
    <>
      <section className={classNameSelected}>
        <div className={classname}></div>
      </section>
    </>
  )
}
