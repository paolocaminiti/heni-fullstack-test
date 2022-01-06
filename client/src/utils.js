export function getDimensions () {
  return { x: window.innerWidth, y: window.innerHeight }
}

export function getSpawnPoint(dimensions, objectSize) {
  const min = dimensions.x / 5
  const max = dimensions.x / 5 * 3
  return {
    x: Math.floor(Math.random() * (max - min + 1) ) + min,
    y: objectSize,
  }
}
