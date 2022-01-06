import { useCallback, useEffect, useState } from 'react'
import { World, Item } from 'react-dom-box2d'
import { PRINT_SIDE_PX, MESSAGE_WELLCOME, MESSAGE_ENDGAME} from './constants'
import { fetchPrints } from './api'
import { getDimensions, getSpawnPoint } from './utils'
import OSD from './OSD'

export default function Gallery () {
  const [page, setPage] = useState(1)
  const [dimensions, setDimensions] = useState(getDimensions())
  const [isLastPage, setIsLastPage] = useState(false)
  const [prints, setPrints] = useState([])
  const [title, setTitle] = useState(MESSAGE_WELLCOME)

  useEffect(() => {
    async function getPrints () {
      const { prints: nextPrints, isLastPage } = await fetchPrints(page)
      setIsLastPage(isLastPage)
      setPrints([...prints, ...nextPrints])
    }
    getPrints()
  }, [page])

  useEffect(() => {
    window.onresize = () => void setDimensions(getDimensions())
  })

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

  return (
    <div>
      <OSD title={title} page={page} />
      <World
        height={dimensions.y}
        width={dimensions.x}
        className="world"
      >
        {prints.map(({ url }) => {
          const { x, y } = getSpawnPoint(dimensions, PRINT_SIDE_PX)
          return (
            <Item
              key={url}
              restitution={0.5}
              top={y}
              left={x}
              height={PRINT_SIDE_PX}
              width={PRINT_SIDE_PX}
              shape="box"
            >
              <img src={url} onClick={e => destroyPrint(url)} />
            </Item>
          )
        })}
      </World>
    </div>
  )
}
