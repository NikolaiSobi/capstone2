import React, { useState } from 'react'

import './css/login.css'
import './css/tools.css'
import { socket } from '../socket'

export default function Login({hideFunction}) {

    const [newAccount, setNewAccount] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const handleLogin = () => {
        const userName = document.getElementById('user-name');
        const password = document.getElementById('password');

        socket.emit('login', {userName: userName.value, password: password.value})

        eraseFields()
    }

    const handleCreateAccount = () => {
        const userName = document.getElementById('new-user-name');
        const password = document.getElementById('new-password');
        const email = document.getElementById('new-email');
        const emailCon = document.getElementById('new-email-confirm')

        if(email.value !== emailCon.value) return;

        socket.emit('create-account', {userName: userName.value, password: password.value})

        eraseFields()
    }

    const eraseFields = () => {
        const data = [document.getElementById('user-name'), document.getElementById('password'), document.getElementById('new-user-name'),
                document.getElementById('new-password'), document.getElementById('new-email'), document.getElementById('new-email-confirm')]

        for(const element of data) {
            if(element) {
                element.value = ''
            }
        }
    }

    const handleExit = () => {
        setNewAccount(false)
        eraseFields()
        hideFunction()
    }

    socket.on('login-successfull', ({userName, password, Id}) => {

        localStorage.setItem('userName', userName)
        localStorage.setItem('password', password)
        localStorage.setItem('playerId', Id)

        setErrorMessage('')

        hideFunction()
    })

    socket.on('error-login', (message) => {
        setErrorMessage(message)
    })

  return (
    <div className='login-page flexbox centerContent'>
        <div className='login-panel'>
            <h1 className='x-button' onClick={handleExit}>X</h1>
                <div className='form-holder flexbox'>
                    <h5>{errorMessage}</h5>
                    {newAccount ? 
                        <>
                        <br></br>
                        <label>Enter a Username</label>
                        <input id='new-user-name'></input>
                        <br></br>
                        <label>Enter a Password</label>
                        <input id='new-password'></input>
                        <br></br>
                        <label>Email</label>
                        <input id='new-email'></input>
                        <br></br>
                        <label>Confirm Email</label>
                        <input id='new-email-confirm'></input>
                        <br></br>
                        <br></br>
                        <button className='touch login-button' onClick={handleCreateAccount}>Create Account</button>
                        </>
                        :
                        <>
                        <br></br>
                        <label>Username</label>
                        <br></br>
                        <input id='user-name'></input>
                        <br></br>
                        <br></br>
                        <label>Password</label>
                        <br></br>
                        <input type='password' id='password'></input>
                        <br></br>
                        <br></br>
                        <button className='touch login-button' onClick={handleLogin}>Sign In</button>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <h3>Not a member?</h3>
                        <button onClick={() => setNewAccount(true)} className='touch create-button'>Create Account</button>
                        </>
                    }
                </div>
        </div>
    </div>
  )
}
