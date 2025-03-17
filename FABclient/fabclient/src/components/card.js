import React, { useState } from 'react'

import '../pages/css/tools.css'
import './css/card.css'

const Card = ({image}) => {
    const [hiddenZoom, setHiddenZoom] = useState(true)
    const [zoomLeftRight, setZoomLeftRight] = useState("")
    const [zoomUpDown, setZoomUpDown] = useState("")

    const handleClick = (e) => {
      console.log(e.clientX)
      if(e.clientX > (window.screen.availWidth / 2)) {
        setZoomLeftRight("zoom-position-left")
      } else {
        setZoomLeftRight("zoom-position-right")
      }
      if(e.clientY > (window.screen.availHeight / 2)) {
        setZoomUpDown("zoom-position-up")
      } else {
        setZoomUpDown("zoom-position-down")
      }

      setHiddenZoom(!hiddenZoom)
    }

    image = image ? image : 'https://storage.googleapis.com/fabmaster/cardfaces/2020-CRU/CRU076.png';
  return (
    <div className='card grabbable' onClick={(e) => {handleClick(e)}}>
        {hiddenZoom ? <></> :
            <div className={`zoom zoom-position ${zoomLeftRight} ${zoomUpDown}`} onClick={(e) => {setHiddenZoom(true)}}>
            <div className={hiddenZoom}>
                <img src='https://storage.googleapis.com/fabmaster/cardfaces/2020-CRU/CRU076.png' className='zoom'/>
            </div>
        </div>
        }
        
        <img src='https://storage.googleapis.com/fabmaster/cardfaces/2020-CRU/CRU076.png' className='card'/>
    </div>
  )
}

export default Card