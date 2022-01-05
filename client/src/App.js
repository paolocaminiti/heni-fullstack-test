import { useEffect, useState } from 'react'
import './App.css'

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

  useEffect(async () => {
    const { records, isLastPage } = await (await fetch(`${PRINTS_API_ENTRYPOINT}?page=${page}`)).json()
    setIsLastPage(isLastPage)
    setRecords(records)
  }, [page])

  return (
    <div>
      <div>
        Gallery page {page}
        {!isLastPage && <Next onClick={() => setPage(page + 1)} />}
      </div>
      {records && records.map(Print)}
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
