import 'dotenv/config'
import Express, { Application, Request, Response } from 'express'

const port: string = process.env.PORT as string

const app: Application = Express()

app.get('/prints', async (req: Request, res: Response) => {
  const { page } = req.query
  const pageNumber: number = parseInt(page as string)
  if (page && isNaN(pageNumber)) {
    throw { status: 403, message: 'expected number at param "page"' }
  }
  res.sendStatus(200)
})

app.listen(port, () => console.log('listening on port', port))
