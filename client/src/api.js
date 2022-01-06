const printsAPIEntrypoint = process.env.REACT_APP_PRINTS_API_ENTRYPOINT

async function fetchPrints (page) {
  return await (await fetch(`${printsAPIEntrypoint}/prints?page=${page}`)).json()
}

export {
  fetchPrints
}
