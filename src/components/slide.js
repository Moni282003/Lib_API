import React from 'react'
import { Link } from 'react-router-dom'

export default function slide() {

  
  return (
    <div className='Main'>
      <button className='LeftButton ${color}'><Link className='underline' to="/register">SignUp</Link></button>
      <button className='RightButton'><Link className='underline' to="/login">SignIN</Link></button>
    </div>
  )
}
