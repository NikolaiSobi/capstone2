import React from 'react'
import { useState, useEffect } from 'react'
import { socket } from '../socket'
import GridCard from '../components/gridcard'

import './css/cards.css'

export default function Decks(props) {
    const [decks, setDecks] = useState([])
    const [cards, setCards] = useState([])
    const [player, setPlayer] = useState(0)

    useEffect(() => {
        console.log(props.player)
        if(props.player) {

            setPlayer(props.player)
            socket.emit('getAllDecksFromUser', props.player)
        } else {

            const p = localStorage.getItem('playerId')
            setPlayer(p)
            socket.emit('getAllDecksFromUser', p)
        }

    }, [])

    socket.on('deckNamesGenerated', (data) => {
            
        setDecks(data)
        if(cards && cards.length > 0) {
            console.log('did the thing')
            setCards(data.filter(card => card.Name === cards[0].Name))
        }
    })

    const returnUniqueDecks = (data) => {
        const uniqueDeckNames = []

        for(const deckCard of data) {
            if(!deckCard.TopCard) continue;

            uniqueDeckNames.push(deckCard)
        }

        return uniqueDeckNames
    }

    socket.on('cardAdded', () => {
        socket.emit('getAllDecksFromUser', player)
    })

    const handleAdd = (card) => {

        socket.emit('addCardToDeck', {cardId: card.Card, player: player, deckName: card.Name, img: card.Img})
    }

    const handleRemove = (card) => {
        if(card.TopCard && cards.length > 1) {
            const cardOne = card.DeckID

            let cardTwo
            for(const c of cards) {
                if(c.DeckID != card.DeckID) {
                    cardTwo = c.DeckID;
                    break;
                }
            }   

            socket.emit('changeTopCard', {cardOne: cardOne, cardTwo: cardTwo})
        }

        socket.emit('deleteSingleCard', {deckId: card.DeckID, player: player})

        setCards(cards.filter(c => c.DeckID !== card.DeckID))
    }

  return (
    <>
    {cards.length ? 
        <>
        <button onClick={() => setCards([])}>Back</button>
        <div className='card-grid deck-format'>
            {cards.map((card, index) => {
                return <div>
                    <GridCard key={index} img={card.Img} cardData={card} callback={() => console.log('clicked')}/>
                        {!props.hideButtons ?
                        <div>
                            <button onClick={() => handleAdd(card)}>+</button>
                            <button onClick={() => handleRemove(card)}>-</button>
                        </div>
                        :
                        <></>
                        }
                </div>
            })}
        </div>
        </>
        :
        <div className='card-grid deck-format'>{returnUniqueDecks(decks).map((deck, index) => {
            return <div key={index} onClick={() => setCards(decks.filter(card => card.Name === deck.Name))}> 
                <h2>{deck.Name}</h2>
                <img src={deck.Img} height="500px"/>
            </div>
        })}</div>
    }

    </>
  )
}
