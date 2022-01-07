import { World, Item } from 'react-dom-box2d'
import { PRINT_SIDE_PX } from './constants'
import { getSpawnPoint, getResizedImageURL } from './utils'

export default function Simulation ({ prints, dimensions, destroyPrintHandler }) {
  return (
    <World
      key={`${dimensions.x}${dimensions.y}`}
      height={dimensions.y}
      width={dimensions.x}
      className="world"
    >
      {prints.map(({ url }) => {
        const { x, y } = getSpawnPoint(dimensions, PRINT_SIDE_PX)
        const src = getResizedImageURL(url, PRINT_SIDE_PX)
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
            <img src={src} onClick={e => destroyPrintHandler(url)} />
          </Item>
        )
      })}
    </World>
  )
}
