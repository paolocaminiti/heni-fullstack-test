import { useEffect, useRef } from 'react'

export default function Flame () {
  const flameRef = useRef()

  useEffect(() => {
    const { current } = flameRef
    window.onmousemove = e => {
      const { x, y } = e
      current.style.top = `${y - 90}px`
      current.style.left = `${x - 25}px`
    }
  }, [flameRef])
  
  return (
    <img ref={flameRef} className="flame" src="./flame.png" width="50" />
  )
}
