import { fail } from '../utils/httpResponses.js'

export const notFound = (req, res) => fail(res, 404, 'Not found')

