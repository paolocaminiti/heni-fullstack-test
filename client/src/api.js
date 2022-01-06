const PRINTS_API_ENTRYPOINT = 'http://localhost:3001/prints'

async function fetchPrints (page) {
  return await (await fetch(`${PRINTS_API_ENTRYPOINT}?page=${page}`)).json()
}

export {
  fetchPrints
}
