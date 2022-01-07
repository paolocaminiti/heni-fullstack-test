import { useCallback, useEffect, useState } from 'react'
import { MESSAGE_WELLCOME, MESSAGE_ENDGAME, MESSAGE_503} from './constants'
import { fetchPrints } from './api'
import { getDimensions } from './utils'
import { playFireSFX } from './Audio'
import OSD from './OSD'
import Simulation from './Simulation'

export default function Mechanics () {
  const [page, setPage] = useState(1)
  const [dimensions, setDimensions] = useState(getDimensions())
  const [isLastPage, setIsLastPage] = useState(false)
  const [prints, setPrints] = useState([])
  const [title, setTitle] = useState(MESSAGE_WELLCOME)

  useEffect(() => { window.onresize = () => setDimensions(getDimensions()) }, [])

  useEffect(() => {
    async function getPrints () {
      try {
        const { prints: nextPrints, isLastPage } = await fetchPrints(page)
        setIsLastPage(isLastPage)
        setPrints([...prints, ...nextPrints])
      } catch (e) {
        if (e.status === 503) {
          setTitle(MESSAGE_503)
        }
      }
    }
    getPrints()
  }, [page])

  const destroyPrintHandler = useCallback(url => {
    playFireSFX()
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

  return (
    <>
      <OSD title={title} page={page} />
      <Simulation
        prints={prints}
        dimensions={dimensions}
        destroyPrintHandler={destroyPrintHandler}
      />
    </>
  )
}
