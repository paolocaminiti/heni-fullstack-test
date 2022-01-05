import 'dotenv/config'
import Express, { Application, Request, Response } from 'express'
import cors from 'cors'
import HarvardartService from './harvardart.service'
import { GenericError } from './genericError'

const port: string = process.env.PORT as string
const harvardartApiEntrypoint: string = process.env.HARVARDART_API_ENTRYPOINT as string
const harvardartApiKey: string = process.env.HARVARDART_API_KEY as string

const app: Application = Express()
const harvardartService = new HarvardartService(
  harvardartApiEntrypoint,
  harvardartApiKey
)

app.use(cors())

app.get('/prints', async (req: Request, res: Response) => {
  try {
    const { page } = req.query
    const pageNumber: number = parseInt(page as string)
    if (page && isNaN(pageNumber)) {
      throw { status: 400, message: 'Bad Request: expected integer at param "page"' }
    }
    const prints = await harvardartService.getPrints(pageNumber)
    res.send(prints)
  } catch (e) {
    let { status, message } = e as GenericError
    if (status) {
      if (status !== 400 && status < 500) {
        status = 503
      }
    } else {
      status = 500
    }
    console.error('GET /prints error', status, message)
    if (message) {
      res.status(status).send(message)
    } else {
      res.sendStatus(status)
    }
  }
})

app.listen(port, () => console.log('listening on port', port))
