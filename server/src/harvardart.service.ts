import axios, { AxiosError } from 'axios'
import { GenericError } from './genericError'

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
        throw {
          status: 400,
          message: 'Bad Request: query not supported'
        }
      }
      const records = data.records.map(asPrintsRecord)
      const isLastPage = data.info.page >= data.info.pages
      return {
        isLastPage,
        records,
      }
    } catch (e) {
      let { status, message } = e as GenericError
      if (!status) {
        const { isAxiosError } = e as AxiosError
        if (isAxiosError) {
          status = (e as AxiosError).response?.status || 0
        } else {
          status = 500
        }
      }
      console.error('HarvardartService.getPrints error', status, message)
      throw { status, message }
    }
  }
}

export default HarvardartService
