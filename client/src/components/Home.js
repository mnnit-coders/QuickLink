import React from 'react'
import '../css/home.css'
import Sendbox  from './Sendbox'
import Recievebox from './Recievebox'

function Home() {
  return (
    <>
        <div className="home-container">
            
            <div className="home-box">
                <Sendbox></Sendbox>
                <Recievebox/>
            </div>
        </div>
    </>
  )
}

export default Home