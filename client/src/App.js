import { useCallback, useEffect, useState, useRef } from 'react'
import './App.css'
import { World, Item } from 'react-dom-box2d'

const PRINTS_API_ENTRYPOINT = 'http://localhost:3001/prints'

async function fetchPrints (page) {
  return await (await fetch(`${PRINTS_API_ENTRYPOINT}?page=${page}`)).json()
}

function Gallery () {
  const [page, setPage] = useState(1)
  const [isLastPage, setIsLastPage] = useState(false)
  const [prints, setPrints] = useState([])
  const flameRef = useRef()

  useEffect(() => {
    async function runfetch () {
      const { prints: nextPrints, isLastPage } = await fetchPrints(page)
      setIsLastPage(isLastPage)
      setPrints([...prints, ...nextPrints])
    }
    runfetch()
  }, [page])

  const destroyPrint = useCallback(url => {
    const nextPrints = prints.filter(i => i.url !== url)
    setPrints(nextPrints)
    if (nextPrints.length === 0) {
      setPage(page + 1)
    }
  }, [prints])

  useEffect(() => {
    console.log(flameRef)
    const { current } = flameRef
    window.addEventListener('mousemove', e => {
      const { x, y } = e
      current.style.position = 'absolute'
      current.style.top = `${y - 90}px`
      current.style.left = `${x - 25}px`
    })
  }, [flameRef])

  return (
    <div>
      <img ref={flameRef} className="ani-flicker" src="https://www.freeiconspng.com/uploads/flame-png-flame-28.png" width="50" />
      <div>
        Destroy all Prints to see more! Level: {page}
      </div>
      {prints && <World
        height={800}
        width={800}
        className="world"
      >
        {prints.map(({ url }) => (
          <Item
            dnd
            key={url}
            restitution={0.2}
            left={128}
            top={128}
            height={200}
            width={200}
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
