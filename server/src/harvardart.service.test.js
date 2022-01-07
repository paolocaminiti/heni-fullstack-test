const HarvardartService = (require('./harvardart.service')).default
const axios = require('axios')
jest.mock('axios')

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

it('Should return PrintsResult with an array of PrintsRecord', async () => {
  axios.get = jest.fn().mockResolvedValue({ status: 200, data: mockValidResponseData })

  const harvardartService = new HarvardartService('http://example.com', 'key')
  const res = await harvardartService.getPrints(1)
  
  expect(Object.keys(res)).toEqual(expect.arrayContaining(expectedPrintsResultFields))
  expect(Object.keys(res.prints[0])).toEqual(expect.arrayContaining(expectedPrintsRecordFields))
})

it('Should throw 401 with bad api key', async () => {
  axios.get = jest.fn().mockResolvedValue({ status: 401, data: mockValidResponseData })

  const harvardartService = new HarvardartService('http://example.com', 'bad key')
  
  try {
    await harvardartService.getPrints(1)
  } catch (e) {
    expect(e.status).toBe(401)
  }
})

it('Should throw 406 with unsupported page param', async () => {
  axios.get = jest.fn().mockResolvedValue({ status: 200, data: mockInvalidResponseData })

  const harvardartService = new HarvardartService('http://example.com', 'key')
  
  try {
    await harvardartService.getPrints(99999999999)
  } catch (e) {
    expect(e.status).toBe(406)
  }
})
