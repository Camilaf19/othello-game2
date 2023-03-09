interface myProps {
  isSelected: boolean
  className: string
}

export const TokenDisplay = ({ isSelected, className: classname }: myProps) => {
  const classNameSelected = isSelected ? 'token-selected' : 'token-container'
  return (
    <>
      <section className={classNameSelected}>
        <div className={classname}></div>
      </section>
    </>
  )
}
