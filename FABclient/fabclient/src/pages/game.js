import React, { use, useEffect } from 'react'
import { useState } from 'react'
import { socket } from '../socket'

import Card from '../components/card'

import './css/tools.css'
import './css/game.css'
import '../components/css/card.css'

const Game = () => {

  const [mouseDown, setMouseDown] = useState(false)
  const [movingId, setMovingId] = useState("")
  const [socketMessage, setSocketMessage] = useState("")


  useEffect(() => {
    socket.connect()
  }, [])


  socket.on('cardMovement', (data) => {
    let x = data.x
    let y = data.y
    const flippedValues = flipPosition(x, y);
    const h1 = document.getElementById(data.cardId)
    h1.style.left = flippedValues.x + "px"
    h1.style.marginTop = flippedValues.y + "px"

  })

  const handleClick = (id) => {
      setMouseDown(true)
      setMovingId(id)

  } 

  const handleMouseDown = (e) => {
    if(mouseDown) {
      const x = e.clientX 
      const y = e.clientY 
      const h1 = document.getElementById(movingId)
      const position = h1.getBoundingClientRect()
      h1.style.left = x + 'px'
      h1.style.marginTop = y + 'px'

      console.log(`x: ${x}, y: ${y}`)

      socket.emit('cardMovement', {x: x, y: y, cardId: movingId})
    }
  }

  const handleMouseUp = (e) => {
    setMouseDown(false)
  }

  //to test the board
  const generateCards = () => {
    const cards = []
    for(let i = 0; i < 22; i++) {
      cards.push(<div id={'test' + i} key={i} className='card' onMouseDown={() => handleClick(`test${i}`)}><Card /></div>)
    }

    return cards
  }

  //toHelpFlipCardsForOtherPlayer
  const flipPosition = (x, y) => {
    const halfX = window.screen.width / 2;
    const halfY = window.screen.height / 2;

    let differenceX = Math.abs(x - halfX);
    let differenceY = Math.abs(y - halfY);

    if(x > halfX) {
      x = halfX - differenceX;
    } else {
      x = halfX + differenceX
    }

    if(y > halfY) {
      y = halfY - differenceY;
    } else {
      y = halfY + differenceY
    }

    return {x: x - 150, y: y - 270}
  }

  return (
    <div className='gameboard test' onMouseMove={handleMouseDown} onMouseUp={handleMouseUp}>

        {generateCards()}
        <h1>{socketMessage}</h1>
    </div>
  )
}

export default Game