import '@/components/ColorBlock.scss'

function ColorBlock({isVertical}: {isVertical:boolean}) {
  return (
    <>
      <div className={`${isVertical ? 'flex-col' : ''} flex sf-color-block`}>
        <div className={`${isVertical ? 'block-v' : 'block-h'} blue`}></div>
        <div className={`${isVertical ? 'block-v' : 'block-h'} yellow`}></div>
        <div className={`${isVertical ? 'block-v' : 'block-h'} oragne`}></div>
        <div className={`${isVertical ? 'block-v' : 'block-h'} red`}></div>
      </div>
    </>
  )
}

export default ColorBlock
