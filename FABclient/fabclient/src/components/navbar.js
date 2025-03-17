import React from 'react'
import { Link } from 'react-router-dom'

import './css/navbar.css'

const Navbar = ({hideFunction}) => {
  return (
    <>
    <div className='logo'></div>
    <div className='navbar'>
        <Link className='link' to='/'>Home</Link>
        <Link className='link' to='/Friends'>Players</Link>
        <Link className='link' to='/Cards'>Cards</Link>
        <Link className='link' to='/decks'>Decks</Link>
        <button className='login' onClick={() => hideFunction()}>Login</button>
    </div>
    <div className='line'></div>
    </>
  )
}

export default Navbar