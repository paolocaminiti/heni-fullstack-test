import axios, { AxiosError } from 'axios'
import { GenericErrorStatus } from './genericErrorStatus'

// API REFERENCE: https://github.com/harvardartmuseums/api-docs/blob/master/sections/object.md

const printsQuery = {
  fields: 'title,dated,primaryimageurl',
  page: 1,
  size: 10,
  sort: 'rank',
  sortorder: 'desc',
  classification: 'Prints',
  verificationlevel: 4,
}

interface PrintsResult {
  isLastPage: boolean,
  prints: PrintsRecord[],
}

interface PrintsRecord {
  title: string,
  dated: string,
  url: string,
}

interface HarvardartAPIResponseData {
  info: {
    page: number,
    pages: number,
  },
  records: PrintsRecord[],
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
      const { data } = await axios.get<HarvardartAPIResponseData>(
        `${this.apiEntrypoint}/object`, {
        params: {
          ...printsQuery,
          page,
          size,
          apikey: this.apiKey,
        }
      })
      const { info, records } = data
      if (!Array.isArray(records)) {
        throw {
          status: 406,
          message: 'Not Acceptable: query not supported'
        }
      }
      const prints = records.map(asPrintsRecord)
      const isLastPage = info.page >= info.pages
      return {
        isLastPage,
        prints,
      }
    } catch (e) {
      let { status, message } = e as GenericErrorStatus
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
