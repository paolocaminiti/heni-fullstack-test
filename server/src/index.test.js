const app = require('./index')
const supertest = require('supertest')
const request = supertest(app)
const axios = require('axios')
jest.mock('axios')

afterAll(done => {
  app.close()
  done()
})

const mockValidResponseData = {
  info: {
    pages: 10,
    page: 1,
  },
  records: [{ title: 'abc', dated: '1000', primaryimageurl: 'http://example.com' }]
}

const mockInvalidResponseData = {}

it('Should retrieve prints from Harvardart', async () => {
  axios.get = jest.fn().mockResolvedValue({ status: 200, data: mockValidResponseData })

  const expectedFields = ['isLastPage', 'prints']
  const expectedPrintFields = ['title', 'dated', 'url']
  const res = await request.get('/prints')
  
  expect(res.status).toBe(200)
  expect(Object.keys(res.body)).toEqual(expect.arrayContaining(expectedFields))
  expect(Object.keys(res.body.prints[0])).toEqual(expect.arrayContaining(expectedPrintFields))
})

it('Should retrieve paginated prints from Harvardart', async () => {
  axios.get = jest.fn().mockResolvedValue({ status: 200, data: mockValidResponseData })

  const expectedFields = ['isLastPage', 'prints']
  const expectedPrintFields = ['title', 'dated', 'url']
  const res = await request.get('/prints?page=10')
  
  expect(res.status).toBe(200)
  expect(Object.keys(res.body)).toEqual(expect.arrayContaining(expectedFields))
  expect(res.body.prints).toBeInstanceOf(Array)
  expect(Object.keys(res.body.prints[0])).toEqual(expect.arrayContaining(expectedPrintFields))
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
