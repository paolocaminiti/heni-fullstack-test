const app = (require('./index')).default
const supertest = require('supertest')
const request = supertest(app)
const axios = require('axios')
jest.mock('axios')

afterAll(() => {
  app.close()
})

const mockValidResponseData = {
  info: {
    pages: 10,
    page: 1,
  },
  records: [{ title: 'abc', dated: '1000', primaryimageurl: 'http://example.com' }]
}

const mockInvalidResponseData = {}

const expectedPrintsResultFields = ['isLastPage', 'prints']
const expectedPrintsRecordFields = ['title', 'dated', 'url']

it('Should retrieve prints from Harvardart', async () => {
  axios.get = jest.fn().mockResolvedValue({ status: 200, data: mockValidResponseData })

  const res = await request.get('/prints')
  
  expect(res.status).toBe(200)
  expect(Object.keys(res.body)).toEqual(expect.arrayContaining(expectedPrintsResultFields))
  expect(Object.keys(res.body.prints[0])).toEqual(expect.arrayContaining(expectedPrintsRecordFields))
})

it('Should retrieve paginated prints from Harvardart', async () => {
  axios.get = jest.fn().mockResolvedValue({ status: 200, data: mockValidResponseData })

  const res = await request.get('/prints?page=10')
  
  expect(res.status).toBe(200)
  expect(Object.keys(res.body)).toEqual(expect.arrayContaining(expectedPrintsResultFields))
  expect(Object.keys(res.body.prints[0])).toEqual(expect.arrayContaining(expectedPrintsRecordFields))
})

it('Should 400 with bad page param', async () => {
  axios.get = jest.fn().mockResolvedValue({ status: 200, data: mockValidResponseData })
  const res = await request.get('/prints?page=bad')
  
  expect(res.status).toBe(400)
})

it('Should 406 with out of range page param', async () => {
  axios.get = jest.fn().mockResolvedValue({ status: 200, data: mockInvalidResponseData })
  const res = await request.get('/prints?page=9999999999')
  
  expect(res.status).toBe(406)
})

it('Should 503 with invalid api key', async () => {
  axios.get = jest.fn().mockRejectedValue({ status: 401, isAxiosError: true })
  const res = await request.get('/prints')
  
  expect(res.status).toBe(503)
})
