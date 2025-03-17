import express from 'express'
import { Server } from 'socket.io'
import db from './dbcontroller.js'

const PORT = process.env.PORT || 3500

const app = express()

const expressServer = app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})

const io = new Server(expressServer, {
    cors: {
        origin: process.env.NODE_ENV === "production" ? false : ["http://localhost:3000", "http://127.0.0.1:3000"]
    }
})

io.on('connection', socket => {


    console.log(`User ${socket.id} is connected`)
    socket.on('connecion', (data) => {
        io.emit('message',`${data} has connected`)
    })

    socket.on('message', data => {
        console.log(data)
        io.emit('message', 'message recieved')
    })

    socket.on("cardMovement", (data) => {
        socket.broadcast.emit('cardMovement', data)
    })

    socket.on('login', ({userName, password}) => {
        db.loginUser(userName, password, function (data) {
            if(data.length) {
                console.log('good login')
                const {userName, password, Id} = data[0];
                console.log(socket.id)
                socket.emit('login-successfull', {userName, password, Id})
            } else {
                socket.emit('error-login', "No user found with the username and password provided")
            }
        })
    })

    socket.on('create-account', ({userName, password}) => {
        db.createUser(userName, password, (data) => {
            console.log(data)
        })
    })

    socket.on('searchPlayer', name => {
        db.findPlayer(name, (data) => socket.emit('playersFound', data))
    })

    socket.on('createNewDeck', (data) => {
        try {
            db.createDeck(data.user, data.deckName, data.cardId, true, data.img, function (ddata) {
                console.log(ddata)
                socket.emit('deckCreated', 'hi')
            })
            
            socket.emit('deckCreated', data.deckName)
        } catch (err) {
            console.log('something went wrong :' + err)
        }
    })

    socket.on('getAllDecksFromUser', (userId) => {
        try {
            db.getAllDecksFromUser(userId, (data) => {

                socket.emit('deckNamesGenerated', data)
            })
        } catch (err) {
            console.log(err)
        }
    })

    socket.on('addCardToDeck', ({cardId, player, deckName, img}) => {

        db.addCardToDeck(cardId, player, deckName, false, img)

        socket.emit('cardAdded')
    })

    socket.on('changeTopCard', ({cardOne, cardTwo}) => {

        db.changeTopCard(cardOne, cardTwo)
    })

    socket.on('deleteCardFromDeck', ({cardId, player, deckName}) => {

        db.deleteCardFromDeck(cardId, player, deckName)
    })

    socket.on('deleteSingleCard', ({deckId, player}) => {

        db.deleteSingleCardInstance(deckId, player)
    })

})
 