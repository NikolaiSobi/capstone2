import React from 'react'

const GridCard = ({img, cardData, callback}) => {
  
  const handleClick = (cardData) => {
    callback(cardData)
  }

  return (
    <div><img onClick={() => handleClick(cardData)} src={img} height='450px'/></div>
  )
}

export default GridCard