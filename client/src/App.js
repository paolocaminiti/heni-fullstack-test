import { useCallback, useEffect, useState, useRef } from 'react'
import './App.css'
import { World, Item } from 'react-dom-box2d'

const PRINTS_API_ENTRYPOINT = 'http://localhost:3001/prints'

async function fetchPrints (page) {
  return await (await fetch(`${PRINTS_API_ENTRYPOINT}?page=${page}`)).json()
}

function getDimensions () {
  return { x: window.innerWidth, y: window.innerHeight }
}

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

const PRINT_SIDE_PX = 256

function Gallery () {
  const [page, setPage] = useState(1)
  const [dimensions, setDimensions] = useState(getDimensions())
  const [isLastPage, setIsLastPage] = useState(false)
  const [prints, setPrints] = useState([])
  const flameRef = useRef()

  useEffect(() => {
    async function getPrints () {
      const { prints: nextPrints, isLastPage } = await fetchPrints(page)
      setIsLastPage(isLastPage)
      setPrints([...prints, ...nextPrints])
    }
    getPrints()
  }, [page])

  const destroyPrint = useCallback(url => {
    const nextPrints = prints.filter(i => i.url !== url)
    setPrints(nextPrints)
    if (nextPrints.length === 0) {
      if (isLastPage) {
        alert('You Won! Cultural heritage has been erased from the world!')
      } else {
        setPage(page + 1)
      }
    }
  }, [prints])

  useEffect(() => {
    const { current } = flameRef
    window.onmousemove = e => {
      const { x, y } = e
      current.style.top = `${y - 90}px`
      current.style.left = `${x - 25}px`
    }
  }, [flameRef])

  useEffect(() => {
    window.onresize = () => void setDimensions(getDimensions())
  })

  return (
    <div>
      <img ref={flameRef} className="flame" src="https://www.freeiconspng.com/uploads/flame-png-flame-28.png" width="50" />
      <div className="osd">
        <div>Destroy all Prints!</div>
        <div>Level: {page}</div>
      </div>
      {prints && <World
        height={dimensions.y}
        width={dimensions.x}
        className="world"
      >
        {prints.map(({ url }) => (
          <Item
            key={url}
            restitution={0.5}
            left={getRandomInteger(dimensions.x / 5, dimensions.x / 5 * 3)}
            top={PRINT_SIDE_PX}
            height={PRINT_SIDE_PX}
            width={PRINT_SIDE_PX}
            shape="box"
          >
            <img src={url} onClick={e => destroyPrint(url)} />
          </Item>
        ))}
      </World>}
    </div>
  )
}

function App() {
  return (
    <div className="App">
      <Gallery />
    </div>
  )
}

export default App
