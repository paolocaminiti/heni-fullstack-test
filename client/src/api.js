const printsAPIEntrypoint = process.env.REACT_APP_PRINTS_API_ENTRYPOINT

async function fetchPrints (page) {
  try {
    const res = await fetch(`${printsAPIEntrypoint}/prints?page=${page}`)
    if (res.ok) {
      return res.json()
    } else {
      throw { status: res.status }
    }
  } catch (e) {
    console.error('fetchPrints', e)
    throw { status: 503 }
  }
}

export {
  fetchPrints
}
