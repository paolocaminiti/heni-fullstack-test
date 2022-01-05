import axios, { AxiosError } from 'axios'

const printsQuery = {
  fields: 'title,dated,primaryimageurl',
  page: 1,
  size: 10,
  sort: 'rank',
  sortorder: 'desc',
  classification: 'Prints',
  verificationlevel: 4,
}

interface PrintsRecord {
  title: string,
  dated: string,
  url: string,
}

interface PrintsResult {
  isLastPage: boolean,
  records: Array<PrintsRecord>,
}

interface HarvardartServiceError {
  status: number
}

function asPrintsRecord (data: any): PrintsRecord {
  const { title, dated, primaryimageurl } = data
  return {
    title,
    dated,
    url: primaryimageurl
  }
}

class HarvardartService {
  private apiEntrypoint: string
  private apiKey: string

  constructor (apiEntrypoint: string, apiKey: string) {
    this.apiEntrypoint = apiEntrypoint
    this.apiKey = apiKey
  }

  async getPrints (page: number, size?: number): Promise<PrintsResult> {
    try {
      const { data } = await axios.get(`${this.apiEntrypoint}/object`, {
        params: {
          ...printsQuery,
          page,
          size,
          apikey: this.apiKey,
        }
      })
      if (!Array.isArray(data.records)) {
        throw { status: 400 }
      }
      const records = data.records.map(asPrintsRecord)
      const isLastPage = data.info.page >= data.info.pages
      return {
        isLastPage,
        records,
      }
    } catch (e) {
      let status
      const { isAxiosError } = e as AxiosError
      if (isAxiosError) {
        status = (e as AxiosError).response?.status || 0
      } else {
        status = (e as HarvardartServiceError).status || 500
      }
      console.error('HarvardartService.getPrints error', status)
      throw { status }
    }
  }
}

export default HarvardartService
export {
  HarvardartServiceError
}
