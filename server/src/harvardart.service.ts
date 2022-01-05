import axios, { AxiosError } from 'axios'

const printsQuery = {
  fields: 'title,dated,description,primaryimageurl',
  page: 1,
  size: 10,
  sort: 'rank',
  sortorder: 'desc',
  classification: 'Prints',
  verificationlevel: 4,
}

class HarvardartService {
  private apiEntrypoint: string
  private apiKey: string

  constructor (apiEntrypoint: string, apiKey: string) {
    this.apiEntrypoint = apiEntrypoint
    this.apiKey = apiKey
  }

  async getPrints (page: number, size?: number) {
    try {
      const response = await axios.get(`${this.apiEntrypoint}/object`, {
        params: {
          ...printsQuery,
          page,
          size,
          apikey: this.apiKey,
        }
      })
      console.log('HarvardartService.getPrints', response)
      return response.data
    } catch (e) {
      const { response } = (e as AxiosError)
      if (response) {
        const { status } = response
        console.error('HarvardartService.getPrints', status)
      } else {
        console.error('HarvardartService.getPrints', e)
      }
    }
  }
}

export default HarvardartService
