import React, { useState } from 'react'
import { socket } from '../socket'
import Decks from './decks'

import './css/friends.css'
import '../pages/css/tools.css'

const Friends = () => {
  const [players, setPlayers] = useState([])
  const [checkingUser, setCheckingUser] = useState(0)
  
  const handleSearch = () => {
    let string = document.getElementById('player-search').value

    socket.emit('searchPlayer', string)
  }

  socket.on('playersFound', data => setPlayers(data))
  
  return (
    <div className='flexbox centerContent search-page expand'>
      
      {!checkingUser ?
          <div className='search-box'>
          <h1 className='bar'>Search for Players</h1>
          <div className='bar'>
            <input className='bar' id='player-search'/>
            <button onClick={handleSearch}>Go</button>
          </div>
          <br></br>
          <div>
            {players.length ? 
              <div className='players-table boarderless flexbox'>
              <div className='title'><h3>Username:</h3></div>
              <div className='flexbox centerContent'><h3># of Decks Created</h3></div>  
              </div>
              :
              <></>
            }
            {players.map((player, index) => {
              return <div className='players-table flexbox' key={index}>
                        <div className='name'><h3>{player.userName}</h3></div>
                        <div className='number flexbox centerContent' onClick={() => setCheckingUser(player.Id)}><h3>{player.NumberOfDecks}</h3></div>
              </div>})}
          </div>
        </div>
        :
        <div className='decks'>
          <button onClick={() => setCheckingUser(0)}>Back</button>
          <br></br>
          <Decks player={checkingUser} hideButtons={true} />
        </div>
          
    }
    </div>

  )
}

export default Friends