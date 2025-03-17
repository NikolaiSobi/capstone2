import React from 'react'
import { useState, useEffect } from 'react'
import { socket } from '../socket'
import Set from '../components/set'

import './css/cards.css'
import './css/tools.css'
import GridCard from '../components/gridcard'

export default function Cards() {

    const [sets, setSets] = useState([])
    const [cards, setCards] = useState([])
    const [cardPane, setCardPane] = useState({})
    const [decks, setDecks] = useState([])

    const getSets = async () => {
        const data = await fetch('https://yurisobiochserver.com/FleshAndBlood/sets')
        const parsedData = await data.json()

        setSets(parsedData)
    }

    const getCards = async (setId) => {
        const data = await fetch('https://yurisobiochserver.com/FleshAndBlood/cards/set/' + setId)
        const parsedData = await data.json()

        setCards(parsedData)
    }

    useEffect(() => {
        getSets()

        if(localStorage.getItem('playerId')) {
            socket.emit('getAllDecksFromUser', localStorage.getItem('playerId'))
        }
    }, [])

    const addCardToDeck = (cardPane) => {
        const player = localStorage.getItem('playerId')
        const deck = document.getElementById('decks').value
        const cardId = cardPane.unique_id

        socket.emit('addCardToDeck', {cardId: cardId, player: player, deckName: deck, img: cardPane.printings[0].image_url})
    }

    const openCardPane = (data) => {
        setCardPane(data)
    }

    const createNewDeck = data => {
        const userId = localStorage.getItem('playerId')
        const newDeckName = document.getElementById('deck-name').value
        const cardId = data.unique_id

        console.log({user: userId, deckName: newDeckName, cardId: cardId})

        socket.emit('createNewDeck', {user: userId, deckName: newDeckName, cardId: cardId, img: data.printings[0].image_url})
    }

    socket.on('deckCreated', (data) => {
        console.log(data)
        socket.emit('getAllDecksFromUser', localStorage.getItem('playerId'))
    })
    
    socket.on('deckNamesGenerated', (data) => {
        
        setDecks(data)
    })

    const returnUniqueDecks = (data) => {
        const uniqueDeckNames = []

        for(const deckCard of data) {
            if(isUniqueName(uniqueDeckNames, deckCard)) {
                uniqueDeckNames.push(deckCard)
            }
        }

        return uniqueDeckNames
    }

    const isUniqueName = (objArray, obj) => {
        for(const uniqueObj of objArray) {
            if(obj.Name === uniqueObj.Name) {
                return false
            }
        }

        return true
    }

    const removeCardFromDeck = (cardId) => {
        const deck = document.getElementById('decks').value
        const player = localStorage.getItem('playerId')

        socket.emit('deleteCardFromDeck', {cardId: cardId.unique_id, player: player, deckName: deck})
    }


    //Only get sets with pictures
    const filterSets = () => {
        const imgSets = sets.filter(set => set.printings[0].set_logo !== null)

        return imgSets
    }

  return (
    <div className='page'>
        {Object.keys(cardPane).length > 0 ? 
                <div className='card-panel'>
                    <h1>{cardPane.name}</h1>
                    <br></br>
                    <img src={`${cardPane.printings[0].image_url}`} width='70%'/>
                    <br></br>
                    <br></br>
                    <label>Add Card to a New Deck</label>
                    <br></br>
                    <input id='deck-name' placeholder='Deck Name' type='text' />
                    <button onClick={() => createNewDeck(cardPane)}>Add</button>
                    <br></br>
                    <br></br>
                    <label>Add Card to an Existing Deck</label>
                    <br></br>
                    <select name="decks" id="decks">
                        {returnUniqueDecks(decks).map((deck, index) => {
                            return <option id={deck.id} key={index} >{deck.Name}</option>
                        })}
                    </select>
                    <button onClick={() => addCardToDeck(cardPane)}>Add</button>
                    <br></br>
                    <button onClick={() => removeCardFromDeck(cardPane)}>Remove from Deck</button>
                    <div onClick={() => setCardPane({})} className='x-button'>X</div>
                </div>
                :
                <></>
        }
        {
            cards.length <= 0 ? <></> : <div className='back-button flexbox centerContent' onClick={() => setCards([])}>Back to sets</div>
        }
        <div className='set-grid'>
            {cards.length <= 0 ? 
                filterSets().map((set, key) => 
                    <div onClick={() => getCards(set.id)}>
                        <Set key={key} name={set.name} img={set.printings[0].set_logo}/>
                    </div>)
                :
                cards.map((card, key) => <GridCard callback={openCardPane}  key={key} img={card.printings[0].image_url} cardData={card}/>)
            }
        </div>
    </div>
  )
}
