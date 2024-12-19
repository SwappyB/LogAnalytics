import http from 'http'

import app from './app'
import dbConnect from './database/connect'
import { config } from './configs'
import logger from './utils/logger'
import cron from 'node-cron'

import { workerInstantiator as LogWriterInstantiator } from './worker/log-writer'
import { LogArchiver } from './worker/log-archiver'

const { NODE_ENV, SERVER_PORT } = config.env

let server = http.createServer(app)

async function startServer(server: http.Server): Promise<void> {
  server.listen(SERVER_PORT || 3000, () => {
    logger.info(`Server is now running on ${SERVER_PORT} in ${NODE_ENV || 'development'} mode`)
  })
}

;(async () => {
  try {
    await dbConnect()
    await startServer(server)
    LogWriterInstantiator()
    cron.schedule('0 0 * * *', LogArchiver)
  } catch (error) {
    throw Error(`>>>>> Server Connection Error: ${error}`)
  }
})()
