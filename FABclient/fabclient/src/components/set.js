import React from 'react'

import '../pages/css/tools.css'
import './css/set.css'

const Set = ({name, img}) => {
  return (
    <div className='flexbox column set'>
        <h3>{name}</h3>
        <img src={img} height="100px" width="200px"/>
    </div>
  )
}

export default Set