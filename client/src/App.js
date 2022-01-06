import { useEffect, useState } from 'react'
import './App.css'
import { World, Item } from 'react-dom-box2d'

const PRINTS_API_ENTRYPOINT = 'http://localhost:3001/prints'

function Next ({ onClick }) {
  return (
    <button onClick={onClick}>load more</button>
  )
}

function Print ({ title, dated, url }) {
  return (
    <img key={url} src={url} width="256"/>
  )
}

function Gallery () {
  const [page, setPage] = useState(1)
  const [isLastPage, setIsLastPage] = useState(false)
  const [records, setRecords] = useState(null)

  useEffect(() => {
    async function fetchPrints (page) {
      const { records: nextRecords, isLastPage } = await (
        await fetch(`${PRINTS_API_ENTRYPOINT}?page=${page}`)
      ).json()
      console.log(nextRecords)
      setIsLastPage(isLastPage)
      setRecords([...(records || []), ...nextRecords])
    }
    fetchPrints(page)
  }, [page])

  return (
    <div>
      <div>
        Gallery page {page}
        {!isLastPage && <Next onClick={() => setPage(page + 1)} />}
      </div>
      {records && <World
        height={800}
        width={800}
        className="world"
      >
        {records.map(({ url }) => (
          <Item
            key={url}
            restitution={0.2}
            left={500}
            top={0}
            height={100}
            width={100}
            shape="circle"
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
