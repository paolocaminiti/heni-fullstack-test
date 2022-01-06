import { useEffect, useState } from 'react'
import './App.css'
import { World, Item } from 'react-dom-box2d'

const PRINTS_API_ENTRYPOINT = 'http://localhost:3001/prints'

function Next ({ onClick }) {
  return (
    <button onClick={onClick}>load more</button>
  )
}

async function fetchPrints (page) {
  return await (await fetch(`${PRINTS_API_ENTRYPOINT}?page=${page}`)).json()
}

function Gallery () {
  const [page, setPage] = useState(1)
  const [isLastPage, setIsLastPage] = useState(false)
  const [prints, setPrints] = useState([])

  useEffect(() => {
    async function runfetch () {
      const { prints: nextPrints, isLastPage } = await fetchPrints(page)
      setIsLastPage(isLastPage)
      setPrints([...prints, ...nextPrints])
    }
    runfetch()
  }, [page])

  return (
    <div>
      <div>
        Gallery page {page}
        {!isLastPage && <Next onClick={() => setPage(page + 1)} />}
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
            height={100}
            width={100}
            shape="box"
          >
            <img src={url} />
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
