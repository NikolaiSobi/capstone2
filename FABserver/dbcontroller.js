import db from './db.js'

const loginUser = async (name, password, callback) => {
    let query = `SELECT * FROM "Player" WHERE "userName" = '${name}' AND "password" = '${password}'`

    db.query(query, function (err, res) {
        if(err) {
            console.log(err)
        }
        callback(res.rows)
    })
}

const createUser = (name, password, callback) => {
    db.query(`INSERT INTO "Player"("userName", password) VALUES('${name}', '${password}')`, function (err, res) {
        if(err) {
            console.log(err)
        }
        callback(res.rows)
    })
}

const updateUser = (id, name, password) => {
    let query = `UPDATE "Player"
    SET "userName" = '${name}', password = '${password}'
    WHERE "id" = ${id}
    `

    db.query(query, function (err, res) {
        if(err) {
            console.log(err)
        }
        console.log(res.rows)
        return res.rows
    })
}

const findUser = (name) => {
    let query = `SELECT * FROM "Player" WHERE "userName" = '${name}'`

    db.query(query, function (err, res) {
        if(err) {
            console.log(err)
        }
        console.log(res.rows)
        return res.rows
    })
}

const deleteUser = (name, password, id) => {
    let query = `DELETE FROM "Player" WHERE "name" = '${name}', password = '${password}', "id" = ${id}`

    db.query(query, function (err, res) {
        if(err) {
            console.log(err)
        }
        console.log(res.rows)
        return res.rows
    })
}

const addFriend = (id, id2) => {
    let query = `IF NOT EXISTS(SELECT * FROM "Friends" WHERE "FriendOne" = ${id})
    BEGIN
    INSERT INTO "Friends"("FriendOne", "FriendTwo")
    VALUES(${id}, ${id2})
    END
    `
    db.query(query, function (err, res) {
        if(err) {
            console.log(err)
        }
        console.log(res.rows)
        return res.rows
    })
}

const findPlayer = (string, callback) => {
    let query = `
    SELECT "userName", "Id", COUNT("FilteredDecks"."Player") AS "NumberOfDecks"
    FROM "Player"
    LEFT JOIN (
        SELECT "Name", "Player", "Img"
        FROM "Deck"
        WHERE "TopCard" = true
    ) AS "FilteredDecks" ON "Player"."Id" = "FilteredDecks"."Player"
    WHERE "userName" LIKE '%${string}%'
    GROUP BY "userName", "Id"
    `;

    db.query(query, function (err, res) {
        if(err) {
            console.log(err)
        }

        callback(res.rows)
    })
}

const removeFriend = (id, id2) => {
    let query = `
    DELETE FROM "Friends" WHERE ("FriendOne" = ${id}, "FriendTwo" = ${id2}) OR ("FriendOne" = ${id2}, "FriendTwo" = ${id})
    `
    
    db.query(query, function (err, res) {
        if(err) {
            console.log(err)
        }
        console.log(res.rows)
        return res.rows
    })
}

const createDeck = (user, deck, card, facecard, img, callback) => {
    console.log(user, deck, card, facecard, img)
    db.query(`INSERT INTO "Deck"("Name", "Player", "Card", "TopCard", "Img") VALUES('${deck}', '${user}', '${card}', ${facecard}, '${img}')`), function (err, res) {
        if(err) {
            console.log(err)
        }
        console.log(res.rows)
        callback(res.rows)
    }
}

const getAllDecksFromUser = (user, callback) => {
    db.query(`SELECT * FROM "Deck" WHERE "Player" = ${user} ORDER BY "TopCard" DESC`, function (err, res) {
        if(err) {
            console.log(err)
        } else {
            callback(res.rows)
        }
    })
}

const addCardToDeck = (cardID, user, deckName, facecard, img) => {
    let query = `INSERT INTO "Deck"("Name", "Player", "Card", "TopCard", "Img")
    VALUES('${deckName}', ${user}, '${cardID}', ${facecard}, '${img}')
    `
    db.query(query, function (err, res) {
        if(err) {
            console.log(err)
        }
        console.log(res.rows)
        return res.rows
    })
}

const changeTopCard = (cardIdOne, cardIdTwo) => {
    let query = `UPDATE "Deck" SET "TopCard" = false WHERE "DeckID" = ${cardIdOne}`

    db.query(query, function (err, res) {
        if(err) {
            console.log(err)
        }
    })

    query = `UPDATE "Deck" SET "TopCard" = true WHERE "DeckID" = ${cardIdTwo}`

    db.query(query, function (err, res) {
        if(err) {
            console.log(err)
        }
    })


}

const deleteCardFromDeck = (cardID, player, deckName) => {
    let query = `DELETE FROM "Deck" WHERE "Player" = '${player}' AND "Name" = '${deckName}' AND "Card" = '${cardID}'`

    db.query(query, function (err, res) {
        if(err) {
            console.log(err)
        }
        console.log(res.rows)
        return res.rows
    })
}

const deleteSingleCardInstance = (deckId, player) => {
    let query = `DELETE FROM "Deck" WHERE "DeckID" = ${deckId} AND "Player" = '${player}'`

    db.query(query, function (err, res) {
        if(err) {
            console.log(err)
        }
        console.log(res.rows)
        return res.rows
    })
}

const deleteDeck = (deckName, player) => {
    let query = `DELETE FROM "Deck" WHERE "Player" = '${player}' AND "Name" = '${deckName}'`

    db.query(query, function (err, res) {
        if(err) {
            console.log(err)
        }
        console.log(res.rows)
        return res.rows
    })
}


export default {loginUser, createUser, updateUser, findUser, deleteUser, addFriend, findPlayer, removeFriend, createDeck, getAllDecksFromUser, addCardToDeck, changeTopCard, deleteCardFromDeck, deleteSingleCardInstance, deleteDeck}
