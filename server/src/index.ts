import 'dotenv/config'
import Express, { Application, Request, Response } from 'express'
import HarvardartService, { HarvardartServiceError } from './harvardart.service'

const port: string = process.env.PORT as string
const harvardartApiEntrypoint: string = process.env.HARVARDART_API_ENTRYPOINT as string
const harvardartApiKey: string = process.env.HARVARDART_API_KEY as string

const app: Application = Express()
const harvardartService = new HarvardartService(
  harvardartApiEntrypoint,
  harvardartApiKey
)

app.get('/prints', async (req: Request, res: Response) => {
  try {
    const { page } = req.query
    const pageNumber: number = parseInt(page as string)
    if (page && isNaN(pageNumber)) {
      throw { status: 400 }
    }
    const prints = await harvardartService.getPrints(pageNumber)
    res.send(prints)
  } catch (e) {
    let status = (e as HarvardartServiceError).status || 500
    if (status) {
      if (status !== 400 && status < 500) {
        status = 503
      }
    }
    console.error('GET /prints error', status)
    res.sendStatus(status)
  }
})

app.listen(port, () => console.log('listening on port', port))
