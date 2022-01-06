import { useCallback, useEffect, useState, useRef } from 'react'
import './App.css'
import { World, Item } from 'react-dom-box2d'

const PRINTS_API_ENTRYPOINT = 'http://localhost:3001/prints'
const PRINT_SIDE_PX = 256
const MESSAGE_WELLCOME = 'Destroy all Prints!'
const MESSAGE_ENDGAME = 'You Won! Cultural heritage has been erased from the world!'

async function fetchPrints (page) {
  return await (await fetch(`${PRINTS_API_ENTRYPOINT}?page=${page}`)).json()
}

function getDimensions () {
  return { x: window.innerWidth, y: window.innerHeight }
}

function getSpawnPoint(dimensions) {
  const min = dimensions.x / 5
  const max = dimensions.x / 5 * 4
  return {
    x: PRINT_SIDE_PX,
    y: Math.floor(Math.random() * (max - min + 1) ) + min,
  }
}


function Gallery () {
  const [page, setPage] = useState(1)
  const [dimensions, setDimensions] = useState(getDimensions())
  const [isLastPage, setIsLastPage] = useState(false)
  const [prints, setPrints] = useState([])
  const [title, setTitle] = useState(MESSAGE_WELLCOME)
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
    const sfx = window.firesfx.cloneNode(true)
    sfx.play()
    const target = prints.find(i => i.url === url)
    const nextTitle = `${target.title} from ${target.dated} destroyed!`
    setTitle(nextTitle)
    const nextPrints = prints.filter(i => i.url !== url)
    setPrints(nextPrints)
    if (nextPrints.length === 0) {
      if (isLastPage) {
        setTitle(MESSAGE_ENDGAME)
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
      <audio id="firesfx" preload="auto">
        <source src="./fire.mp3" type="audio/mpeg" />
      </audio>
      <img ref={flameRef} className="flame" src="./flame.png" width="50" />
      <div className="osd">
        <div>{title}</div>
        <div className="level">Level {page}</div>
      </div>
      {prints && <World
        height={dimensions.y}
        width={dimensions.x}
        className="world"
      >
        {prints.map(({ url }) => {
          const { x, y } = getSpawnPoint(dimensions)
          return (
            <Item
              key={url}
              restitution={0.5}
              top={x}
              left={y}
              height={PRINT_SIDE_PX}
              width={PRINT_SIDE_PX}
              shape="box"
            >
              <img src={url} onClick={e => destroyPrint(url)} />
            </Item>
          )
        })}
      </World>}
    </div>
  )
}

function App() {
  return (
    <Gallery />
  )
}

export default App
